'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Loader2, Zap, Mail, CreditCard, FileText, Clock, Globe } from 'lucide-react'
import Link from 'next/link'

const TRIGGERS = [
  { id: 'new_email', label: 'Nouvel email reçu', desc: 'Se déclenche à chaque email entrant', icon: Mail },
  { id: 'new_stripe_payment', label: 'Nouveau paiement Stripe', desc: 'À chaque paiement réussi', icon: CreditCard },
  { id: 'new_form_submission', label: 'Soumission de formulaire', desc: 'Tally, Typeform, etc.', icon: FileText },
  { id: 'scheduled', label: 'Planifié', desc: 'Toutes les heures, tous les jours…', icon: Clock },
  { id: 'webhook', label: 'Webhook entrant', desc: 'Appel HTTP depuis n\'importe quelle app', icon: Globe },
]

const ACTIONS = [
  { id: 'send_email', label: 'Envoyer un email', desc: 'Via Gmail ou Resend' },
  { id: 'add_to_sheet', label: 'Ajouter à Google Sheets', desc: 'Nouvelle ligne automatique' },
  { id: 'create_notion_page', label: 'Créer une page Notion', desc: 'Dans n\'importe quelle base' },
  { id: 'send_slack_message', label: 'Envoyer un message Slack', desc: 'Dans un canal ou DM' },
  { id: 'http_request', label: 'Requête HTTP', desc: 'Appeler n\'importe quelle API' },
]

export default function NewWorkflowPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [trigger, setTrigger] = useState<string | null>(null)
  const [selectedActions, setSelectedActions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleAction(id: string) {
    setSelectedActions(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  async function handleCreate() {
    if (!trigger || selectedActions.length === 0) return
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const actions = selectedActions.map((type, i) => ({
      id: crypto.randomUUID(),
      type,
      config: {},
      order: i,
    }))

    const { data, error } = await supabase
      .from('workflows')
      .insert({
        user_id: user.id,
        name: name || 'Nouveau workflow',
        description,
        trigger,
        trigger_config: {},
        actions,
        status: 'active',
        run_count: 0,
      })
      .select()
      .single()

    if (error) {
      setError('Impossible de créer le workflow. Veuillez réessayer.')
      setLoading(false)
      return
    }

    router.push(`/dashboard/workflows/${data.id}`)
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard/workflows" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Retour aux workflows
        </Link>
        <h1 className="text-2xl font-semibold text-slate-900">Nouveau workflow</h1>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                s <= step ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
              }`}>{s}</div>
              {s < 3 && <div className={`w-12 h-px ${s < step ? 'bg-slate-900' : 'bg-slate-200'}`} />}
            </div>
          ))}
          <span className="ml-2 text-sm text-slate-500">
            {step === 1 ? 'Nommer le workflow' : step === 2 ? 'Choisir le déclencheur' : 'Ajouter des actions'}
          </span>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-700 text-sm p-3 rounded-lg border border-red-100">{error}</div>
      )}

      {/* STEP 1 — Name */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Nom du workflow *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex : Email de bienvenue nouveau client"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Description (optionnel)</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Décrivez ce que fait ce workflow…"
              rows={3}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="bg-slate-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 — Trigger */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500 mb-4">Quel événement déclenche ce workflow ?</p>
          <div className="space-y-2">
            {TRIGGERS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTrigger(t.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                  trigger === t.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  trigger === t.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  <t.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{t.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-slate-700">← Retour</button>
            <button
              onClick={() => setStep(3)}
              disabled={!trigger}
              className="bg-slate-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Actions */}
      {step === 3 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <p className="text-sm text-slate-500 mb-4">Quelles actions exécuter ? (plusieurs possibles)</p>
          <div className="space-y-2">
            {ACTIONS.map((a) => {
              const selected = selectedActions.includes(a.id)
              return (
                <button
                  key={a.id}
                  onClick={() => toggleAction(a.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    selected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                  }`}>
                    {selected && <Zap className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{a.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{a.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(2)} className="text-sm text-slate-500 hover:text-slate-700">← Retour</button>
            <button
              onClick={handleCreate}
              disabled={selectedActions.length === 0 || loading}
              className="flex items-center gap-2 bg-slate-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Créer le workflow
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
