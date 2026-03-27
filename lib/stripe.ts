import Stripe from 'stripe'
import { Plan } from '@/types'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

// ================================
// PLANS
// ================================
export const STRIPE_PLANS: Record<string, { plan: Plan; name: string; price: number }> = {
  [process.env.STRIPE_PRICE_PRO_MONTHLY!]: { plan: 'pro', name: 'Pro', price: 29 },
  [process.env.STRIPE_PRICE_TEAM_MONTHLY!]: { plan: 'team', name: 'Équipe', price: 99 },
}

// ================================
// CRÉER UN CLIENT STRIPE
// ================================
export async function createStripeCustomer(email: string, userId: string) {
  return stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  })
}

// ================================
// SESSION DE PAIEMENT CHECKOUT
// ================================
export async function createCheckoutSession({
  customerId,
  priceId,
  userId,
  successUrl,
  cancelUrl,
}: {
  customerId: string
  priceId: string
  userId: string
  successUrl: string
  cancelUrl: string
}) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { user_id: userId },
    subscription_data: {
      metadata: { user_id: userId },
    },
    allow_promotion_codes: true,
  })
}

// ================================
// PORTAIL CLIENT (gérer abonnement)
// ================================
export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

// ================================
// VÉRIFIER WEBHOOK STRIPE
// ================================
export function constructWebhookEvent(body: string, signature: string) {
  return stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
}
