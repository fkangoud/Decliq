'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { formatNumber, estimateTimeSaved } from '@/lib/utils'
import { Zap, TrendingUp, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
        supabase.from('executions').select('id, status, created_at').eq('user_id', user.id).gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('users').select('full_name, plan').eq('id', user.id).single(),
      ])

      setWorkflows(wf || [])
      setExecutions(ex || [])
      setProfile(prof)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="text-slate-400 text-sm">Chargement...</div>
      </div>
    )
  }

  const totalRuns = executions.length
  const successfulRuns = executions.filter(e => e.status === 'success').length
  const activeWorkflows = workflows.filter(w => w.status === 'active').length
  const timeSaved = estimateTimeSaved(totalRuns)

  const STATS = [
    { label: 'Workflows actifs', value: activeWorkflows, icon: Zap, color: 'blue' },
    { label: 'Exécutions (30j)', value: formatNumber(totalRuns), icon: TrendingUp, color: 'purple' },
    { label: 'Taux de succès', value: totalRuns > 0 ? `${Math.round((successfulRuns / totalRuns) * 100)}%` : '—', icon: CheckCircle, color: 'green' },
    { label: 'Heures économisées', value: `${timeSaved}h`, icon: Clock, color: 'amber' },
  ]

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Bonjour, {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Voici ce qui se passe sur votre compte ce mois-ci.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colorMap[stat.color]}`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-medium text-slate-900">Workflows récents</h2>
          <Link href="/dashboard/workflows" className="text-sm text-blue-600 hover:underline">Voir tout</Link>
        </div>

        {workflows.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Zap className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 text-sm mb-4">Vous n'avez pas encore de workflow.</p>
            <Link href="/dashboard/workflows/new" className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">
              Créer mon premier workflow
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {workflows.map((wf) => (
              <Link key={wf.id} href={`/dashboard/workflows/${wf.id}`} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${wf.status === 'active' ? 'bg-green-500' : wf.status === 'error' ? 'bg-red-500' : 'bg-slate-300'}`} />
                  <span className="text-sm font-medium text-slate-900">{wf.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${wf.status === 'active' ? 'bg-green-50 text-green-700' : wf.status === 'error' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                  {wf.status === 'active' ? 'Actif' : wf.status === 'error' ? 'Erreur' : 'En pause'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {profile?.plan === 'free' && (
        <div className="mt-6 bg-slate-900 rounded-xl p-6 flex items-center justify-between">
          <div>
            <p className="font-medium text-white">Passez au plan Pro</p>
            <p className="text-slate-400 text-sm mt-0.5">50 workflows · 10 000 exécutions/mois</p>
          </div>
          <Link href="/dashboard/billing" className="bg-white text-slate-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap">
            Upgrader — 29€/mois
          </Link>
        </div>
      )}
    </div>
  )
}
