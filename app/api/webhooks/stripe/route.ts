import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent, STRIPE_PLANS } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase'
import { sendSubscriptionConfirmationEmail } from '@/lib/email'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = constructWebhookEvent(body, signature)
  } catch (err) {
    console.error('Webhook signature invalide:', err)
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    switch (event.type) {
      // Abonnement créé ou mis à jour
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const priceId = subscription.items.data[0]?.price.id
        const planInfo = STRIPE_PLANS[priceId]

        if (!planInfo) break

        const customerId = subscription.customer as string
        const { data: user } = await supabase
          .from('users')
          .select('id, email')
          .eq('stripe_customer_id', customerId)
          .single()

        if (user) {
          await supabase
            .from('users')
            .update({ plan: planInfo.plan })
            .eq('id', user.id)

          await supabase.from('subscriptions').upsert({
            user_id: user.id,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: customerId,
            plan: planInfo.plan,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })

          if (event.type === 'customer.subscription.created') {
            await sendSubscriptionConfirmationEmail(user.email, planInfo.name)
          }
        }
        break
      }

      // Abonnement annulé
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await supabase
          .from('users')
          .update({ plan: 'free' })
          .eq('stripe_customer_id', customerId)

        await supabase
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      // Paiement échoué
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.warn('Paiement échoué pour:', invoice.customer)
        // TODO: envoyer email de relance
        break
      }
    }
  } catch (err) {
    console.error('Erreur webhook:', err)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

// Désactiver le body parsing pour les webhooks Stripe
export const config = { api: { bodyParser: false } }
