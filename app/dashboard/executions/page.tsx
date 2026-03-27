'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'à l\'instant'
  if (m < 60) return `il y a ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `il y a ${h}h`
  const d = Math.floor(h / 24)
  return `il y a ${d}j`
}

export default function ExecutionsPage() {
  const router = useRouter()
  const supabase = createClient()
  const [executions, setExecutions] = useState<any[]>([])
  const [workflows, setWorkflows] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'running'>('all')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const [{ data: ex }, { data: wf }] = await Promise.all([
        supabase.from('executions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(100),
        supabase.from('workflows').select('id, name').eq('user_id', user.id),
      ])

      setExecutions(ex || [])
      const wfMap: Record<string, string> = {}
      ;(wf || []).forEach((w: any) => { wfMap[w.id] = w.name })
      setWorkflows(wfMap)
      setLoading(false)
    }
    load()
  }, [])

  const filtered = filter === 'all' ? executions : executions.filter(e => e.status === filter)

  const stats = {
    total: executions.length,
    success: executions.filter(e => e.status === 'success').length,
    failed: executions.filter(e => e.status === 'failed').length,
    running: executions.filter(e => e.status === 'running').length,
  }

  const successRate = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0

  if (loading) return <div style={{padding:32,fontSize:14,color:'#94a3b8',fontFamily:"'DM Sans',system-ui"}}>Chargement...</div>

  return (
    <div style={{fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *{box-sizing:border-box}
        .e-topbar{background:white;border-bottom:1px solid #e2e8f0;padding:0 32px;height:58px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
        .e-content{padding:28px 32px;max-width:1000px}
        .e-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
        .e-stat{background:white;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px}
        .e-stat-val{font-size:26px;font-weight:700;color:#0f172a;letter-spacing:-0.03em;line-height:1;margin-bottom:3px}
        .e-stat-label{font-size:12px;color:#64748b;font-weight:600}
        .filters{display:flex;gap:6px;margin-bottom:18px;flex-wrap:wrap}
        .filter-btn{padding:6px 14px;border-radius:100px;font-size:13px;font-weight:600;cursor:pointer;border:1.5px solid #e2e8f0;background:white;color:#64748b;font-family:'DM Sans',system-ui;transition:all 0.12s}
        .filter-btn:hover{border-color:#cbd5e1;color:#0f172a}
        .filter-btn.active{background:#1d4ed8;color:white;border-color:#1d4ed8}
        .e-table{background:white;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden}
        .e-thead{display:grid;grid-template-columns:1fr 160px 100px 90px;gap:12px;padding:12px 20px;border-bottom:1px solid #f1f5f9;background:#f8fafc}
        .e-th{font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#94a3b8}
        .e-row{display:grid;grid-template-columns:1fr 160px 100px 90px;gap:12px;padding:14px 20px;border-bottom:1px solid #f8fafc;align-items:center;transition:background 0.1s}
        .e-row:hover{background:#fafbff}
        .e-row:last-child{border-bottom:none}
        .e-wf-name{font-size:13.5px;font-weight:600;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .e-time{font-size:12.5px;color:#64748b}
        .e-dur{font-size:12.5px;color:#64748b;font-family:monospace}
        .status-dot{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;padding:4px 10px;border-radius:100px}
        .status-success{background:#dcfce7;color:#15803d}
        .status-failed{background:#fee2e2;color:#dc2626}
        .status-running{background:#fef9c3;color:#ca8a04}
        .empty-state{padding:64px 20px;text-align:center}
        @media(max-width:768px){
          .e-topbar{padding:0 16px}
          .e-content{padding:20px 16px}
          .e-stats{grid-template-columns:repeat(2,1fr)}
          .e-thead{display:none}
          .e-row{grid-template-columns:1fr auto;grid-template-rows:auto auto}
          .e-dur{display:none}
        }
      `}</style>

      <div className="e-topbar">
        <span style={{fontSize:15,fontWeight:700,color:'#0f172a'}}>Exécutions</span>
        <span style={{fontSize:13,color:'#64748b'}}>{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="e-content">

        {/* Stats */}
        <div className="e-stats">
          <div className="e-stat">
            <div className="e-stat-val">{stats.total}</div>
            <div className="e-stat-label">Total</div>
          </div>
          <div className="e-stat">
            <div className="e-stat-val" style={{color:'#16a34a'}}>{stats.success}</div>
            <div className="e-stat-label">Succès</div>
          </div>
          <div className="e-stat">
            <div className="e-stat-val" style={{color:'#dc2626'}}>{stats.failed}</div>
            <div className="e-stat-label">Échecs</div>
          </div>
          <div className="e-stat">
            <div className="e-stat-val" style={{color:'#1d4ed8'}}>{successRate}%</div>
            <div className="e-stat-label">Taux de succès</div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          {(['all','success','failed','running'] as const).map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'Toutes' : f === 'success' ? 'Succès' : f === 'failed' ? 'Échecs' : 'En cours'}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="e-table">
          <div className="e-thead">
            <span className="e-th">Workflow</span>
            <span className="e-th">Date</span>
            <span className="e-th">Durée</span>
            <span className="e-th">Statut</span>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div style={{fontSize:36,marginBottom:12}}>◷</div>
              <div style={{fontSize:15,fontWeight:600,color:'#0f172a',marginBottom:6}}>Aucune exécution</div>
              <div style={{fontSize:13,color:'#94a3b8'}}>
                {filter === 'all' ? 'Vos workflows n\'ont pas encore été exécutés.' : `Aucune exécution avec le statut "${filter}".`}
              </div>
            </div>
          ) : (
            filtered.map(ex => (
              <div key={ex.id} className="e-row">
                <div>
                  <div className="e-wf-name">{workflows[ex.workflow_id] || 'Workflow supprimé'}</div>
                  {ex.error_message && <div style={{fontSize:11,color:'#dc2626',marginTop:2}}>{ex.error_message}</div>}
                </div>
                <span className="e-time">{timeAgo(ex.created_at)}</span>
                <span className="e-dur">{ex.duration_ms ? `${ex.duration_ms}ms` : '—'}</span>
                <span className={`status-dot status-${ex.status}`}>
                  {ex.status === 'success' ? 'Succès' : ex.status === 'failed' ? 'Échec' : 'En cours'}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
