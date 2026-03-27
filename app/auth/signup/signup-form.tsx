'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function SignupForm() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'free'
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return }
    setLoading(true); setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, plan }, emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setError(error.message === 'User already registered' ? 'Un compte existe déjà avec cet email.' : 'Une erreur est survenue. Veuillez réessayer.')
      setLoading(false); return
    }
    setSuccess(true); setLoading(false)
  }

  if (success) return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',padding:20,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap')`}</style>
      <div style={{textAlign:'center',maxWidth:380}}>
        <div style={{width:60,height:60,background:'#dcfce7',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14L10.5 19.5L23 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:'#0f172a',marginBottom:10}}>Vérifiez vos emails</h1>
        <p style={{fontSize:14,color:'#64748b',lineHeight:1.7}}>Un email de confirmation a été envoyé à <strong style={{color:'#0f172a'}}>{email}</strong>. Cliquez sur le lien pour activer votre compte.</p>
        <Link href="/auth/login" style={{display:'inline-block',marginTop:24,background:'#1d4ed8',color:'white',padding:'10px 24px',borderRadius:9,fontSize:14,fontWeight:600,textDecoration:'none'}}>Se connecter →</Link>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');
        *{box-sizing:border-box}
        .auth-input{width:100%;border:1.5px solid #e2e8f0;border-radius:10px;padding:11px 14px;font-size:14px;font-family:'DM Sans',system-ui;outline:none;transition:border 0.15s;background:white;color:#0f172a}
        .auth-input:focus{border-color:#1d4ed8;box-shadow:0 0 0 3px rgba(29,78,216,0.08)}
        .auth-input::placeholder{color:#94a3b8}
        .auth-btn{width:100%;background:#1d4ed8;color:white;border:none;padding:12px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;font-family:'DM Sans',system-ui;transition:all 0.15s;display:flex;align-items:center;justify-content:center;gap:8px}
        .auth-btn:hover{background:#1e40af}
        .auth-btn:disabled{opacity:0.6;cursor:not-allowed}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      <div style={{width:'100%',maxWidth:400}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:9,textDecoration:'none',marginBottom:24}}>
            <div style={{width:34,height:34,background:'#1d4ed8',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8L6 12L14 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{fontSize:20,fontWeight:700,color:'#0f172a',letterSpacing:'-0.02em'}}>Eldorai</span>
          </Link>
          <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:28,fontWeight:400,color:'#0f172a',marginBottom:6,letterSpacing:'-0.02em'}}>Créer un compte</h1>
          <p style={{fontSize:14,color:'#64748b'}}>{plan === 'pro' ? 'Plan Pro · 14 jours gratuits' : 'Gratuit pour toujours · Sans CB'}</p>
        </div>

        <div style={{background:'white',border:'1px solid #e2e8f0',borderRadius:16,padding:'28px 28px'}}>
          <form onSubmit={handleSignup} style={{display:'flex',flexDirection:'column',gap:14}}>
            {error && <div style={{background:'#fef2f2',color:'#dc2626',fontSize:13,padding:'10px 14px',borderRadius:9,border:'1px solid #fecaca'}}>{error}</div>}
            <div>
              <label style={{fontSize:13,fontWeight:600,color:'#374151',display:'block',marginBottom:6}}>Nom complet</label>
              <input className="auth-input" type="text" value={fullName} onChange={e=>setFullName(e.target.value)} required placeholder="Marie Dupont" />
            </div>
            <div>
              <label style={{fontSize:13,fontWeight:600,color:'#374151',display:'block',marginBottom:6}}>Email</label>
              <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="vous@exemple.com" />
            </div>
            <div>
              <label style={{fontSize:13,fontWeight:600,color:'#374151',display:'block',marginBottom:6}}>Mot de passe</label>
              <input className="auth-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="8 caractères minimum" />
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading && <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{animation:'spin 1s linear infinite'}}><circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><path d="M7 1.5A5.5 5.5 0 0112.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
              Créer mon compte
            </button>
            <p style={{fontSize:11,color:'#94a3b8',textAlign:'center'}}>
              En créant un compte vous acceptez nos <Link href="/terms" style={{color:'#64748b'}}>conditions d'utilisation</Link>
            </p>
          </form>
        </div>

        <p style={{textAlign:'center',fontSize:13,color:'#64748b',marginTop:20}}>
          Déjà un compte ?{' '}
          <Link href="/auth/login" style={{color:'#1d4ed8',fontWeight:600,textDecoration:'none'}}>Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
