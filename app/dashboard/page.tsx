'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [workflows, setWorkflows] = useState<any[]>([])
  const [executions, setExecutions] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      const [{ data: wf }, { data: ex }, { data: prof }] = await Promise.all([
        supabase.from('workflows').select('id, name, status, run_count, last_run_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('executions').select('id, status').eq('user_id', user.id).gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('users').select('full_name, plan').eq('id', user.id).single(),
      ])
      setWorkflows(wf || [])
      setExecutions(ex || [])
      setProfile(prof)
      setLoading(false)
    }
    load()
  }, [])

  const totalRuns = executions.length
  const successRate = totalRuns > 0 ? Math.round((executions.filter(e => e.status === 'success').length / totalRuns) * 100) : 0
  const activeWf = workflows.filter(w => w.status === 'active').length
  const timeSaved = Math.round((totalRuns * 5) / 60)

  const stats = [
    { label: 'Workflows actifs', value: activeWf, sub: 'sur ' + workflows.length + ' total', color: '#1d4ed8', bg: '#eff6ff' },
    { label: 'Exécutions ce mois', value: totalRuns.toLocaleString('fr'), sub: 'derniers 30 jours', color: '#059669', bg: '#ecfdf5' },
    { label: 'Taux de succès', value: totalRuns > 0 ? successRate + '%' : '—', sub: 'automatisations réussies', color: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Heures économisées', value: timeSaved + 'h', sub: 'ce mois-ci', color: '#d97706', bg: '#fffbeb' },
  ]

  if (loading) return (
    <div style={{padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300}}>
      <div style={{fontSize: 14, color: '#94a3b8'}}>Chargement...</div>
    </div>
  )

  return (
    <>
      <style>{`
        .db-topbar { background: white; border-bottom: 1px solid #e2e8f0; padding: 0 32px; height: 58px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 10; }
        .db-greeting { font-size: 15px; font-weight: 600; color: #0f172a; }
        .db-content { padding: 28px 32px; max-width: 1100px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
        .stat-card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 22px; }
        .stat-icon-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .stat-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
        .stat-value { font-size: 28px; font-weight: 700; color: #0f172a; letter-spacing: -0.03em; line-height: 1; margin-bottom: 4px; }
        .stat-label { font-size: 13px; font-weight: 600; color: #64748b; }
        .stat-sub { font-size: 12px; color: #94a3b8; margin-top: 2px; }

        .row { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
        .card { background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        .card-header { padding: 18px 22px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
        .card-title { font-size: 14px; font-weight: 700; color: #0f172a; }
        .card-link { font-size: 13px; color: #1d4ed8; text-decoration: none; font-weight: 600; }
        .card-link:hover { text-decoration: underline; }

        .wf-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 22px; border-bottom: 1px solid #f8fafc; transition: background 0.1s; }
        .wf-row:hover { background: #fafbff; }
        .wf-row:last-child { border-bottom: none; }
        .wf-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; margin-right: 10px; }
        .wf-name { font-size: 13.5px; font-weight: 600; color: #0f172a; }
        .wf-runs { font-size: 12px; color: #94a3b8; margin-top: 1px; }
        .status-pill { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; letter-spacing: 0.03em; }

        .quick-action { display: flex; align-items: center; gap: 12px; padding: 14px 20px; border-radius: 10px; text-decoration: none; transition: all 0.12s; border: 1px solid #e2e8f0; margin-bottom: 10px; }
        .quick-action:hover { border-color: #bfdbfe; background: #eff6ff; }
        .qa-icon { width: 36px; height: 36px; background: #eff6ff; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .qa-label { font-size: 13.5px; font-weight: 600; color: #0f172a; }
        .qa-sub { font-size: 12px; color: #94a3b8; margin-top: 1px; }

        .upgrade-banner { background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%); border-radius: 12px; padding: 24px 28px; display: flex; align-items: center; justify-content: space-between; margin-top: 20px; }
        .upgrade-text h3 { font-size: 15px; font-weight: 700; color: white; margin-bottom: 4px; }
        .upgrade-text p { font-size: 13px; color: #bfdbfe; }
        .upgrade-btn { background: white; color: #1d4ed8; font-size: 13px; font-weight: 700; padding: 10px 20px; border-radius: 8px; text-decoration: none; white-space: nowrap; transition: all 0.12s; }
        .upgrade-btn:hover { background: #eff6ff; }
      `}</style>

      <div className="db-topbar">
        <div className="db-greeting">
          Bonjour, {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0]} 👋
        </div>
        <Link href="/dashboard/workflows/new" style={{background: '#1d4ed8', color: 'white', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6}}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5V12.5M1.5 7H12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          Nouveau workflow
        </Link>
      </div>

      <div className="db-content">
        {/* Stats */}
        <div className="stats-grid">
          {stats.map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon-row">
                <div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
                <div className="stat-icon" style={{background: s.bg}}>
                  <div style={{width: 16, height: 16, borderRadius: 4, background: s.color, opacity: 0.8}} />
                </div>
              </div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Main row */}
        <div className="row">
          {/* Workflows */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Workflows récents</span>
              <Link href="/dashboard/workflows" className="card-link">Voir tout →</Link>
            </div>
            {workflows.length === 0 ? (
              <div style={{padding: '48px 22px', textAlign: 'center'}}>
                <div style={{fontSize: 32, marginBottom: 12}}>⚡</div>
                <div style={{fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 6}}>Aucun workflow</div>
                <div style={{fontSize: 13, color: '#94a3b8', marginBottom: 20}}>Créez votre première automatisation</div>
                <Link href="/dashboard/workflows/new" style={{background: '#1d4ed8', color: 'white', padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none'}}>
                  Créer un workflow
                </Link>
              </div>
            ) : (
              workflows.map(wf => (
                <Link key={wf.id} href={`/dashboard/workflows/${wf.id}`} style={{textDecoration: 'none', display: 'block'}}>
                  <div className="wf-row">
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <div className="wf-dot" style={{background: wf.status === 'active' ? '#22c55e' : wf.status === 'error' ? '#ef4444' : '#94a3b8'}} />
                      <div>
                        <div className="wf-name">{wf.name}</div>
                        <div className="wf-runs">{wf.run_count?.toLocaleString('fr') || 0} exécutions</div>
                      </div>
                    </div>
                    <span className="status-pill" style={{
                      background: wf.status === 'active' ? '#dcfce7' : wf.status === 'error' ? '#fee2e2' : '#f1f5f9',
                      color: wf.status === 'active' ? '#15803d' : wf.status === 'error' ? '#dc2626' : '#64748b'
                    }}>
                      {wf.status === 'active' ? 'Actif' : wf.status === 'error' ? 'Erreur' : 'En pause'}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Quick actions */}
          <div>
            <div className="card" style={{padding: 20}}>
              <div style={{fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 14}}>Actions rapides</div>
              <Link href="/dashboard/workflows/new" className="quick-action">
                <div className="qa-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2V14M2 8H14" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <div className="qa-label">Nouveau workflow</div>
                  <div className="qa-sub">Créer une automatisation</div>
                </div>
              </Link>
              <Link href="/dashboard/billing" className="quick-action">
                <div className="qa-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="#1d4ed8" strokeWidth="1.4"/><path d="M1.5 7h13" stroke="#1d4ed8" strokeWidth="1.4"/></svg>
                </div>
                <div>
                  <div className="qa-label">Mon abonnement</div>
                  <div className="qa-sub">Gérer mon plan</div>
                </div>
              </Link>
              <Link href="/dashboard/settings" className="quick-action">
                <div className="qa-icon">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="#1d4ed8" strokeWidth="1.4"/><path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1" stroke="#1d4ed8" strokeWidth="1.4" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <div className="qa-label">Paramètres</div>
                  <div className="qa-sub">Profil et préférences</div>
                </div>
              </Link>
            </div>

            {profile?.plan === 'free' && (
              <div className="upgrade-banner">
                <div className="upgrade-text">
                  <h3>Passez au plan Pro</h3>
                  <p>50 workflows · 10 000 exec/mois</p>
                </div>
                <Link href="/dashboard/billing" className="upgrade-btn">
                  Upgrader →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
