import { createServerComponentClient } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { formatDateTime } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, XCircle, Clock, Zap } from 'lucide-react'
import WorkflowControls from '@/components/dashboard/WorkflowControls'

const TRIGGER_LABELS: Record<string, string> = {
  new_email: 'Nouvel email reçu',
  new_stripe_payment: 'Nouveau paiement Stripe',
  new_form_submission: 'Soumission de formulaire',
  scheduled: 'Planifié',
  webhook: 'Webhook entrant',
}

const ACTION_LABELS: Record<string, string> = {
  send_email: 'Envoyer un email',
  add_to_sheet: 'Ajouter à Google Sheets',
  create_notion_page: 'Créer une page Notion',
  send_slack_message: 'Envoyer un message Slack',
  http_request: 'Requête HTTP',
}

export default async function WorkflowDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: workflow } = await supabase
    .from('workflows')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user!.id)
    .single()

  if (!workflow) notFound()

  const { data: executions } = await supabase
    .from('executions')
    .select('*')
    .eq('workflow_id', workflow.id)
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/dashboard/workflows" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Tous les workflows
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{workflow.name}</h1>
          {workflow.description && (
            <p className="text-slate-500 mt-1 text-sm">{workflow.description}</p>
          )}
          <div className="flex items-center gap-3 mt-3">
            <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
              workflow.status === 'active' ? 'bg-green-50 text-green-700' :
              workflow.status === 'error' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-600'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                workflow.status === 'active' ? 'bg-green-500' :
                workflow.status === 'error' ? 'bg-red-500' : 'bg-slate-400'
              }`} />
              {workflow.status === 'active' ? 'Actif' : workflow.status === 'error' ? 'Erreur' : 'En pause'}
            </span>
            <span className="text-xs text-slate-400">{workflow.run_count} exécutions au total</span>
          </div>
        </div>
        <WorkflowControls workflowId={workflow.id} currentStatus={workflow.status} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Trigger */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Déclencheur</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-900">
              {TRIGGER_LABELS[workflow.trigger] || workflow.trigger}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Actions ({workflow.actions?.length || 0})</h2>
          <div className="space-y-2">
            {(workflow.actions || []).map((action: { id: string; type: string; order: number }, i: number) => (
              <div key={action.id} className="flex items-center gap-2 text-sm text-slate-700">
                <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-500 shrink-0">
                  {i + 1}
                </span>
                {ACTION_LABELS[action.type] || action.type}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Executions history */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-medium text-slate-900">Historique des exécutions</h2>
        </div>

        {!executions || executions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Clock className="w-8 h-8 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Aucune exécution pour l'instant.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {executions.map((exec) => (
              <div key={exec.id} className="flex items-center justify-between px-6 py-3.5">
                <div className="flex items-center gap-3">
                  {exec.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  ) : exec.status === 'failed' ? (
                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500 shrink-0 animate-spin" />
                  )}
                  <div>
                    <span className="text-sm text-slate-700">
                      {exec.status === 'success' ? 'Succès' : exec.status === 'failed' ? 'Échec' : 'En cours'}
                    </span>
                    {exec.error_message && (
                      <p className="text-xs text-red-500 mt-0.5">{exec.error_message}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  {exec.duration_ms && <span>{exec.duration_ms}ms</span>}
                  <span>{formatDateTime(exec.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
