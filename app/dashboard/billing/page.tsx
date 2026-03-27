'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Check, Zap, Loader2 } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    features: ['3 workflows', '100 exécutions/mois', '2 intégrations'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29,
    priceEnv: 'pro',
    features: ['50 workflows', '10 000 exécutions/mois', '20 intégrations', 'Support prioritaire'],
  },
  {
    id: 'team',
    name: 'Équipe',
    price: 99,
    priceEnv: 'team',
    features: ['Workflows illimités', '100 000 exécutions/mois', 'Intégrations illimitées', 'Support dédié'],
  },
]

export default function BillingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('users').select('plan, stripe_customer_id').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleUpgrade(planId: string) {
    setUpgrading(planId)
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
    else { alert('Erreur lors de la redirection vers le paiement.'); setUpgrading(null) }
  }

  async function handlePortal() {
    const res = await fetch('/api/billing/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  if (loading) return <div className="p-8 text-sm text-slate-400">Chargement...</div>

  const currentPlan = profile?.plan || 'free'

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Abonnement</h1>
        <p className="text-slate-500 mt-1">
          Plan actuel : <span className="font-medium text-slate-900 capitalize">{currentPlan}</span>
        </p>
      </div>

      {profile?.stripe_customer_id && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-900">Gérer mon abonnement</p>
            <p className="text-xs text-slate-500 mt-0.5">Modifier le plan, voir les factures, mettre à jour le paiement</p>
          </div>
          <button onClick={handlePortal} className="text-sm border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
            Portail de facturation →
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan
          return (
            <div key={plan.id} className={`bg-white rounded-xl border p-6 flex flex-col ${isCurrent ? 'border-blue-400 ring-1 ring-blue-400' : 'border-slate-200'}`}>
              {isCurrent && <div className="text-xs font-medium text-blue-600 mb-3">Plan actuel</div>}
              <h3 className="font-semibold text-slate-900">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-1 mb-4">
                <span className="text-3xl font-bold text-slate-900">{plan.price}€</span>
                {plan.price > 0 && <span className="text-sm text-slate-400">/mois</span>}
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <button disabled className="w-full py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-400 cursor-not-allowed">
                  Plan actuel
                </button>
              ) : plan.id === 'free' ? (
                <button disabled className="w-full py-2.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-400 cursor-not-allowed">
                  Downgrade non disponible
                </button>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={upgrading !== null}
                  className="w-full py-2.5 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {upgrading === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Upgrader
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <strong>Mode test Stripe actif.</strong> Utilisez la carte <span className="font-mono">4242 4242 4242 4242</span>, date 12/26, CVV 123 pour tester sans vrai paiement.
      </div>
    </div>
  )
}
