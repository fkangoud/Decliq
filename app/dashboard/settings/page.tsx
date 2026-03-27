'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

export default function SettingsPage() {
  const supabase = createClient()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setEmail(user.email || '')
      const { data } = await supabase.from('users').select('full_name').eq('id', user.id).single()
      if (data) setFullName(data.full_name || '')
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('users').update({ full_name: fullName }).eq('id', user.id)
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *{box-sizing:border-box}
        .s-input{width:100%;border:1.5px solid #e2e8f0;border-radius:10px;padding:10px 14px;font-size:14px;font-family:'DM Sans',system-ui;outline:none;transition:border 0.15s;background:white;color:#0f172a}
        .s-input:focus{border-color:#1d4ed8;box-shadow:0 0 0 3px rgba(29,78,216,0.08)}
        .s-input::placeholder{color:#94a3b8}
        .s-input:disabled{background:#f8fafc;color:#94a3b8;cursor:not-allowed}
        .s-btn{padding:10px 22px;border-radius:9px;font-size:14px;font-weight:600;cursor:pointer;font-family:'DM Sans',system-ui;transition:all 0.15s;display:inline-flex;align-items:center;gap:7px;border:none}
        .s-btn-primary{background:#1d4ed8;color:white}
        .s-btn-primary:hover{background:#1e40af}
        .s-btn-primary:disabled{opacity:0.6;cursor:not-allowed}
        .s-btn-danger{background:white;color:#dc2626;border:1.5px solid #fecaca}
        .s-btn-danger:hover{background:#fef2f2}
        .s-card{background:white;border:1px solid #e2e8f0;border-radius:14px;padding:28px;margin-bottom:20px}
        .s-card-title{font-size:15px;font-weight:700;color:#0f172a;margin-bottom:4px}
        .s-card-sub{font-size:13px;color:#64748b;margin-bottom:22px}
        .s-label{font-size:13px;font-weight:600;color:#374151;display:block;margin-bottom:6px}
        .s-hint{font-size:12px;color:#94a3b8;margin-top:5px}
        .s-field{margin-bottom:16px}
        .s-topbar{background:white;border-bottom:1px solid #e2e8f0;padding:0 32px;height:58px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
        .s-topbar-title{font-size:15px;font-weight:700;color:#0f172a}
        .s-content{padding:28px 32px;max-width:640px}
        @media(max-width:768px){
          .s-topbar{padding:0 16px}
          .s-content{padding:20px 16px}
          .s-card{padding:20px}
        }
      `}</style>

      <div className="s-topbar">
        <span className="s-topbar-title">Paramètres</span>
      </div>

      <div className="s-content">

        {/* Infos personnelles */}
        <div className="s-card">
          <div className="s-card-title">Informations personnelles</div>
          <div className="s-card-sub">Mettez à jour votre profil</div>
          <form onSubmit={handleSave}>
            <div className="s-field">
              <label className="s-label">Nom complet</label>
              <input className="s-input" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Votre nom" />
            </div>
            <div className="s-field">
              <label className="s-label">Email</label>
              <input className="s-input" type="email" value={email} disabled />
              <p className="s-hint">L'email ne peut pas être modifié ici.</p>
            </div>
            <button className="s-btn s-btn-primary" type="submit" disabled={loading}>
              {loading ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{animation:'spin 1s linear infinite'}}><circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><path d="M7 1.5A5.5 5.5 0 0112.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
              ) : saved ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : null}
              {saved ? 'Sauvegardé !' : 'Sauvegarder'}
            </button>
          </form>
        </div>

        {/* Sécurité */}
        <div className="s-card">
          <div className="s-card-title">Sécurité</div>
          <div className="s-card-sub">Gérez l'accès à votre compte</div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 0',borderBottom:'1px solid #f1f5f9'}}>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:'#0f172a'}}>Mot de passe</div>
              <div style={{fontSize:13,color:'#64748b',marginTop:2}}>Modifié via l'email de réinitialisation</div>
            </div>
            <button className="s-btn" style={{background:'#f1f5f9',color:'#374151',border:'1px solid #e2e8f0',fontSize:13}} onClick={() => alert('Un email de réinitialisation va vous être envoyé.')}>
              Changer
            </button>
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',paddingTop:14}}>
            <div>
              <div style={{fontSize:14,fontWeight:600,color:'#0f172a'}}>Sessions actives</div>
              <div style={{fontSize:13,color:'#64748b',marginTop:2}}>Se déconnecter de tous les appareils</div>
            </div>
            <button className="s-btn s-btn-danger" onClick={handleSignOut} style={{fontSize:13}}>
              Déconnecter
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="s-card" style={{border:'1px solid #fecaca'}}>
          <div className="s-card-title" style={{color:'#dc2626'}}>Zone dangereuse</div>
          <div className="s-card-sub">Ces actions sont définitives et irréversibles.</div>
          <button className="s-btn s-btn-danger" onClick={() => { if(confirm('Supprimer votre compte ? Toutes vos données seront effacées.')) handleSignOut() }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5 3.5V2.5h4v1M5.5 6v4M8.5 6v4M3 3.5l.7 8h6.6l.7-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Supprimer mon compte
          </button>
        </div>

      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
