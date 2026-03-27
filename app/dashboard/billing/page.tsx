'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const PLANS = [
  {
    id: 'free', name: 'Gratuit', price: '0', period: '',
    features: ['3 workflows actifs', '100 exécutions/mois', '2 intégrations', 'Support communautaire'],
  },
  {
    id: 'pro', name: 'Pro', price: '29', period: '/mois',
    features: ['50 workflows actifs', '10 000 exécutions/mois', '20 intégrations', 'Support prioritaire', 'Historique 90 jours'],
  },
  {
    id: 'team', name: 'Équipe', price: '99', period: '/mois',
    features: ['Workflows illimités', '100 000 exécutions/mois', 'Intégrations illimitées', 'Support dédié < 2h', 'SSO & gestion des rôles'],
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
    else { alert('Erreur lors de la redirection.'); setUpgrading(null) }
  }

  async function handlePortal() {
    const res = await fetch('/api/billing/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  if (loading) return <div style={{padding:32,fontSize:14,color:'#94a3b8',fontFamily:"'DM Sans',system-ui"}}>Chargement...</div>

  const currentPlan = profile?.plan || 'free'

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display&display=swap');
        *{box-sizing:border-box}
        .b-topbar{background:white;border-bottom:1px solid #e2e8f0;padding:0 32px;height:58px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
        .b-content{padding:28px 32px;max-width:900px}
        .b-current-bar{background:white;border:1px solid #e2e8f0;border-radius:14px;padding:20px 24px;display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px}
        .b-current-info h3{font-size:15px;font-weight:700;color:#0f172a;margin-bottom:3px}
        .b-current-info p{font-size:13px;color:#64748b}
        .b-portal-btn{background:#f1f5f9;color:#374151;border:1px solid #e2e8f0;padding:9px 18px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;font-family:'DM Sans',system-ui;transition:all 0.15s}
        .b-portal-btn:hover{background:#e2e8f0}
        .plans-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .plan-card{background:white;border:1px solid #e2e8f0;border-radius:14px;padding:26px;display:flex;flex-direction:column;position:relative}
        .plan-card.current{border-color:#1d4ed8;border-width:2px;box-shadow:0 4px 16px rgba(29,78,216,0.1)}
        .plan-tag{position:absolute;top:-11px;left:20px;background:#1d4ed8;color:white;font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:3px 12px;border-radius:100px}
        .plan-name{font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;margin-bottom:8px}
        .plan-price{font-family:'DM Serif Display',serif;font-size:40px;color:#0f172a;font-weight:400;letter-spacing:-0.02em;line-height:1;margin-bottom:3px}
        .plan-period{font-size:14px;color:#94a3b8;margin-bottom:6px}
        .plan-divider{height:1px;background:#f1f5f9;margin:16px 0}
        .plan-features{list-style:none;display:flex;flex-direction:column;gap:9px;flex:1;margin-bottom:20px}
        .plan-feature{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:#374151}
        .feat-check{width:16px;height:16px;border-radius:50%;background:#dbeafe;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
        .plan-btn{display:flex;align-items:center;justify-content:center;gap:7px;padding:11px;border-radius:9px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:'DM Sans',system-ui;transition:all 0.15s;border:none;width:100%}
        .plan-btn-primary{background:#1d4ed8;color:white}
        .plan-btn-primary:hover{background:#1e40af;box-shadow:0 4px 12px rgba(29,78,216,0.25)}
        .plan-btn-primary:disabled{opacity:0.6;cursor:not-allowed}
        .plan-btn-disabled{background:#f1f5f9;color:#94a3b8;cursor:not-allowed}
        @media(max-width:768px){
          .b-topbar{padding:0 16px}
          .b-content{padding:20px 16px}
          .plans-grid{grid-template-columns:1fr}
          .b-current-bar{flex-direction:column;align-items:flex-start}
        }
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div className="b-topbar">
        <span style={{fontSize:15,fontWeight:700,color:'#0f172a'}}>Abonnement</span>
        <span style={{fontSize:13,color:'#64748b'}}>Plan actuel : <span style={{fontWeight:700,color:'#1d4ed8',textTransform:'capitalize'}}>{currentPlan}</span></span>
      </div>

      <div className="b-content">

        {profile?.stripe_customer_id && (
          <div className="b-current-bar">
            <div className="b-current-info">
              <h3>Gérer mon abonnement</h3>
              <p>Modifier le plan, consulter les factures, mettre à jour le mode de paiement</p>
            </div>
            <button className="b-portal-btn" onClick={handlePortal}>Portail de facturation →</button>
          </div>
        )}

        <div className="plans-grid">
          {PLANS.map(plan => {
            const isCurrent = plan.id === currentPlan
            return (
              <div key={plan.id} className={`plan-card ${isCurrent ? 'current' : ''}`}>
                {isCurrent && <div className="plan-tag">Plan actuel</div>}
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">{plan.price}€</div>
                <div className="plan-period">{plan.period || 'pour toujours'}</div>
                <div className="plan-divider" />
                <ul className="plan-features">
                  {plan.features.map(f => (
                    <li key={f} className="plan-feature">
                      <div className="feat-check">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4L3 6L7 2" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <button className="plan-btn plan-btn-disabled" disabled>Plan actuel</button>
                ) : plan.id === 'free' ? (
                  <button className="plan-btn plan-btn-disabled" disabled>Non disponible</button>
                ) : (
                  <button
                    className="plan-btn plan-btn-primary"
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgrading !== null}
                  >
                    {upgrading === plan.id && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{animation:'spin 1s linear infinite'}}><circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><path d="M7 1.5A5.5 5.5 0 0112.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    )}
                    Upgrader vers {plan.name}
                  </button>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}
