import { createServerComponentClient } from '@/lib/supabase'
import { formatDateTime, formatNumber } from '@/lib/utils'
import Link from 'next/link'
import { Plus, Zap, Pause, AlertCircle } from 'lucide-react'

export default async function WorkflowsPage() {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: workflows } = await supabase
    .from('workflows')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const { data: profile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user!.id)
    .single()

  const TRIGGER_LABELS: Record<string, string> = {
    new_email: 'Nouvel email',
    new_stripe_payment: 'Nouveau paiement Stripe',
    new_form_submission: 'Nouveau formulaire',
    scheduled: 'Planifié',
    webhook: 'Webhook',
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Workflows</h1>
          <p className="text-slate-500 mt-1">{workflows?.length || 0} workflow{(workflows?.length || 0) !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/dashboard/workflows/new"
          className="flex items-center gap-2 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl hover:bg-slate-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau workflow
        </Link>
      </div>

      {!workflows || workflows.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 px-6 py-16 text-center">
          <Zap className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-slate-900 mb-2">Aucun workflow</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
            Créez votre premier workflow pour automatiser vos tâches répétitives.
          </p>
          <Link
            href="/dashboard/workflows/new"
            className="inline-flex items-center gap-2 bg-slate-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Créer un workflow
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-slate-100 text-xs font-medium text-slate-400 uppercase tracking-wider">
            <span>Nom</span>
            <span>Déclencheur</span>
            <span>Exécutions</span>
            <span>Statut</span>
          </div>
          <div className="divide-y divide-slate-100">
            {workflows.map((wf) => (
              <Link
                key={wf.id}
                href={`/dashboard/workflows/${wf.id}`}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{wf.name}</p>
                  {wf.last_run_at && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Dernière exécution {formatDateTime(wf.last_run_at)}
                    </p>
                  )}
                </div>
                <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                  {TRIGGER_LABELS[wf.trigger] || wf.trigger}
                </span>
                <span className="text-sm text-slate-600 text-right">
                  {formatNumber(wf.run_count)}
                </span>
                <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                  wf.status === 'active' ? 'bg-green-50 text-green-700' :
                  wf.status === 'error' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {wf.status === 'active' && <Zap className="w-3 h-3" />}
                  {wf.status === 'paused' && <Pause className="w-3 h-3" />}
                  {wf.status === 'error' && <AlertCircle className="w-3 h-3" />}
                  {wf.status === 'active' ? 'Actif' : wf.status === 'error' ? 'Erreur' : 'En pause'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
