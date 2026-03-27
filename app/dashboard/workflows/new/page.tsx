'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

const TRIGGERS = [
  { id: 'new_email', label: 'Nouvel email reçu', desc: 'Se déclenche à chaque email entrant', icon: '📧' },
  { id: 'new_stripe_payment', label: 'Nouveau paiement Stripe', desc: 'À chaque paiement réussi', icon: '💳' },
  { id: 'new_form_submission', label: 'Soumission de formulaire', desc: 'Tally, Typeform, etc.', icon: '📋' },
  { id: 'scheduled', label: 'Planifié', desc: 'Toutes les heures, tous les jours…', icon: '⏰' },
  { id: 'webhook', label: 'Webhook entrant', desc: 'Appel HTTP depuis n\'importe quelle app', icon: '🔗' },
]

const ACTIONS = [
  { id: 'send_email', label: 'Envoyer un email', desc: 'Via Gmail ou Resend', icon: '✉️' },
  { id: 'add_to_sheet', label: 'Ajouter à Google Sheets', desc: 'Nouvelle ligne automatique', icon: '📊' },
  { id: 'create_notion_page', label: 'Créer une page Notion', desc: 'Dans n\'importe quelle base', icon: '📝' },
  { id: 'send_slack_message', label: 'Envoyer un message Slack', desc: 'Dans un canal ou DM', icon: '💬' },
  { id: 'http_request', label: 'Requête HTTP', desc: 'Appeler n\'importe quelle API', icon: '🌐' },
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
    setSelectedActions(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id])
  }

  async function handleCreate() {
    if (!trigger || selectedActions.length === 0) return
    setLoading(true)
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }
    const actions = selectedActions.map((type, i) => ({ id: crypto.randomUUID(), type, config: {}, order: i }))
    const { data, error } = await supabase.from('workflows').insert({
      user_id: user.id, name: name || 'Nouveau workflow', description,
      trigger, trigger_config: {}, actions, status: 'active', run_count: 0,
    }).select().single()
    if (error) { setError('Impossible de créer le workflow.'); setLoading(false); return }
    router.push(`/dashboard/workflows/${data.id}`)
  }

  const steps = ['Nommer', 'Déclencheur', 'Actions']

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *{box-sizing:border-box}
        .nw-topbar{background:white;border-bottom:1px solid #e2e8f0;padding:0 32px;height:58px;display:flex;align-items:center;gap:16px;position:sticky;top:0;z-index:10}
        .nw-back{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:#64748b;text-decoration:none;transition:color 0.12s}
        .nw-back:hover{color:#0f172a}
        .nw-topbar-title{font-size:15px;font-weight:700;color:#0f172a}
        .nw-content{padding:32px;max-width:640px}

        .steps{display:flex;align-items:center;gap:0;margin-bottom:32px}
        .step-item{display:flex;align-items:center;gap:8px;flex:1}
        .step-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;transition:all 0.2s;flex-shrink:0}
        .step-num.done{background:#1d4ed8;color:white}
        .step-num.active{background:#1d4ed8;color:white;box-shadow:0 0 0 4px rgba(29,78,216,0.15)}
        .step-num.pending{background:#f1f5f9;color:#94a3b8}
        .step-label{font-size:13px;font-weight:600;color:#64748b}
        .step-label.active{color:#0f172a}
        .step-line{flex:1;height:1px;background:#e2e8f0;margin:0 12px}
        .step-line.done{background:#1d4ed8}

        .nw-card{background:white;border:1px solid #e2e8f0;border-radius:14px;padding:28px;margin-bottom:20px}
        .nw-input{width:100%;border:1.5px solid #e2e8f0;border-radius:10px;padding:11px 14px;font-size:14px;font-family:'DM Sans',system-ui;outline:none;transition:border 0.15s;background:white;color:#0f172a;resize:none}
        .nw-input:focus{border-color:#1d4ed8;box-shadow:0 0 0 3px rgba(29,78,216,0.08)}
        .nw-input::placeholder{color:#94a3b8}
        .nw-label{font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:6px}

        .option-list{display:flex;flex-direction:column;gap:8px;margin-top:4px}
        .option-item{display:flex;align-items:center;gap:14px;padding:14px 16px;border:1.5px solid #e2e8f0;border-radius:11px;cursor:pointer;transition:all 0.15s;background:white}
        .option-item:hover{border-color:#93c5fd;background:#f8fbff}
        .option-item.selected{border-color:#1d4ed8;background:#eff6ff}
        .option-icon{font-size:22px;width:40px;height:40px;background:#f1f5f9;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.15s}
        .option-item.selected .option-icon{background:#dbeafe}
        .option-label{font-size:14px;font-weight:600;color:#0f172a}
        .option-desc{font-size:12.5px;color:#64748b;margin-top:1px}
        .option-check{width:20px;height:20px;border-radius:50%;border:2px solid #e2e8f0;margin-left:auto;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all 0.15s}
        .option-item.selected .option-check{background:#1d4ed8;border-color:#1d4ed8}

        .nw-actions{display:flex;justify-content:space-between;align-items:center;margin-top:20px}
        .nw-btn{padding:10px 22px;border-radius:9px;font-size:14px;font-weight:600;cursor:pointer;font-family:'DM Sans',system-ui;transition:all 0.15s;display:inline-flex;align-items:center;gap:7px;border:none}
        .nw-btn-primary{background:#1d4ed8;color:white}
        .nw-btn-primary:hover{background:#1e40af}
        .nw-btn-primary:disabled{opacity:0.5;cursor:not-allowed}
        .nw-btn-ghost{background:transparent;color:#64748b;border:1.5px solid #e2e8f0}
        .nw-btn-ghost:hover{background:#f8fafc;color:#0f172a}

        @media(max-width:768px){
          .nw-topbar{padding:0 16px}
          .nw-content{padding:20px 16px}
          .nw-card{padding:20px}
          .step-label{display:none}
        }
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div className="nw-topbar">
        <Link href="/dashboard/workflows" className="nw-back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Retour
        </Link>
        <div style={{width:1,height:20,background:'#e2e8f0'}}/>
        <span className="nw-topbar-title">Nouveau workflow</span>
      </div>

      <div className="nw-content">

        {/* Steps */}
        <div className="steps">
          {steps.map((s, i) => {
            const num = i + 1
            const isDone = step > num
            const isActive = step === num
            return (
              <div key={s} className="step-item" style={{flex: i < steps.length - 1 ? '1' : 'none'}}>
                <div className={`step-num ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
                  {isDone ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : num}
                </div>
                <span className={`step-label ${isActive ? 'active' : ''}`}>{s}</span>
                {i < steps.length - 1 && <div className={`step-line ${isDone ? 'done' : ''}`}/>}
              </div>
            )
          })}
        </div>

        {error && <div style={{background:'#fef2f2',color:'#dc2626',fontSize:13,padding:'10px 14px',borderRadius:9,border:'1px solid #fecaca',marginBottom:16}}>{error}</div>}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="nw-card">
            <div style={{marginBottom:18}}>
              <label className="nw-label">Nom du workflow *</label>
              <input className="nw-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex : Email de bienvenue nouveau client" />
            </div>
            <div>
              <label className="nw-label">Description <span style={{color:'#94a3b8',fontWeight:400}}>(optionnel)</span></label>
              <textarea className="nw-input" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Décrivez ce que fait ce workflow…" />
            </div>
            <div className="nw-actions">
              <span/>
              <button className="nw-btn nw-btn-primary" onClick={() => setStep(2)} disabled={!name.trim()}>
                Suivant →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="nw-card">
            <div style={{fontSize:13,color:'#64748b',marginBottom:16}}>Quel événement déclenche ce workflow ?</div>
            <div className="option-list">
              {TRIGGERS.map(t => (
                <div key={t.id} className={`option-item ${trigger === t.id ? 'selected' : ''}`} onClick={() => setTrigger(t.id)}>
                  <div className="option-icon">{t.icon}</div>
                  <div style={{flex:1}}>
                    <div className="option-label">{t.label}</div>
                    <div className="option-desc">{t.desc}</div>
                  </div>
                  <div className="option-check">
                    {trigger === t.id && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                </div>
              ))}
            </div>
            <div className="nw-actions">
              <button className="nw-btn nw-btn-ghost" onClick={() => setStep(1)}>← Retour</button>
              <button className="nw-btn nw-btn-primary" onClick={() => setStep(3)} disabled={!trigger}>Suivant →</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="nw-card">
            <div style={{fontSize:13,color:'#64748b',marginBottom:16}}>Quelles actions exécuter ? <span style={{color:'#94a3b8'}}>(plusieurs possibles)</span></div>
            <div className="option-list">
              {ACTIONS.map(a => {
                const sel = selectedActions.includes(a.id)
                return (
                  <div key={a.id} className={`option-item ${sel ? 'selected' : ''}`} onClick={() => toggleAction(a.id)}>
                    <div className="option-icon">{a.icon}</div>
                    <div style={{flex:1}}>
                      <div className="option-label">{a.label}</div>
                      <div className="option-desc">{a.desc}</div>
                    </div>
                    <div className="option-check" style={{borderRadius:4}}>
                      {sel && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="nw-actions">
              <button className="nw-btn nw-btn-ghost" onClick={() => setStep(2)}>← Retour</button>
              <button className="nw-btn nw-btn-primary" onClick={handleCreate} disabled={selectedActions.length === 0 || loading}>
                {loading && <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{animation:'spin 1s linear infinite'}}><circle cx="6.5" cy="6.5" r="5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><path d="M6.5 1.5A5 5 0 0111.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                Créer le workflow
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
