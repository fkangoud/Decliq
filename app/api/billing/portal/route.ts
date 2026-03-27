import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { createBillingPortalSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

    const { data: profile } = await supabase.from('users').select('stripe_customer_id').eq('id', user.id).single()
    if (!profile?.stripe_customer_id) return NextResponse.json({ error: 'Pas de client Stripe' }, { status: 400 })

    const session = await createBillingPortalSession(
      profile.stripe_customer_id,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`
    )
    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
