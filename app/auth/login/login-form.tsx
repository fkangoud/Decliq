'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.session) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }
    window.location.href = redirect
  }

  async function handleGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}` },
    })
  }

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
        .google-btn{width:100%;background:white;color:#374151;border:1.5px solid #e2e8f0;padding:11px;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;font-family:'DM Sans',system-ui;transition:all 0.15s;display:flex;align-items:center;justify-content:center;gap:10px}
        .google-btn:hover{background:#f8fafc;border-color:#cbd5e1}
        .divider{display:flex;align-items:center;gap:12px;color:#cbd5e1;font-size:12px;margin:16px 0}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:#e2e8f0}
      `}</style>

      <div style={{width:'100%',maxWidth:400}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <Link href="/" style={{display:'inline-flex',alignItems:'center',gap:9,textDecoration:'none',marginBottom:24}}>
            <div style={{width:34,height:34,background:'#1d4ed8',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8L6 12L14 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{fontSize:20,fontWeight:700,color:'#0f172a',letterSpacing:'-0.02em'}}>Eldorai</span>
          </Link>
          <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:28,fontWeight:400,color:'#0f172a',marginBottom:6,letterSpacing:'-0.02em'}}>Bon retour</h1>
          <p style={{fontSize:14,color:'#64748b'}}>Connectez-vous à votre espace Eldorai</p>
        </div>

        <div style={{background:'white',border:'1px solid #e2e8f0',borderRadius:16,padding:'28px 28px'}}>
          <button className="google-btn" onClick={handleGoogle}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuer avec Google
          </button>

          <div className="divider">ou</div>

          <form onSubmit={handleLogin} style={{display:'flex',flexDirection:'column',gap:14}}>
            {error && <div style={{background:'#fef2f2',color:'#dc2626',fontSize:13,padding:'10px 14px',borderRadius:9,border:'1px solid #fecaca'}}>{error}</div>}
            <div>
              <label style={{fontSize:13,fontWeight:600,color:'#374151',display:'block',marginBottom:6}}>Email</label>
              <input className="auth-input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="vous@exemple.com" />
            </div>
            <div>
              <label style={{fontSize:13,fontWeight:600,color:'#374151',display:'block',marginBottom:6}}>Mot de passe</label>
              <input className="auth-input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading && <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{animation:'spin 1s linear infinite'}}><circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/><path d="M7 1.5A5.5 5.5 0 0112.5 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>}
              Se connecter
            </button>
          </form>
        </div>

        <p style={{textAlign:'center',fontSize:13,color:'#64748b',marginTop:20}}>
          Pas encore de compte ?{' '}
          <Link href="/auth/signup" style={{color:'#1d4ed8',fontWeight:600,textDecoration:'none'}}>Créer un compte</Link>
        </p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
