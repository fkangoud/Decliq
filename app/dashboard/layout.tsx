'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const NAV = [
  { href: '/dashboard', label: "Vue d'ensemble", icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>
  )},
  { href: '/dashboard/workflows', label: 'Workflows', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h3M2 8h8M2 12h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="13" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="13" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="10" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>
  )},
  { href: '/dashboard/executions', label: 'Exécutions', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4"/><path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
  )},
  { href: '/dashboard/billing', label: 'Abonnement', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1.5 6.5h13" stroke="currentColor" strokeWidth="1.4"/></svg>
  )},
  { href: '/dashboard/settings', label: 'Paramètres', icon: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M3.4 12.6l.7-.7M11.9 4.1l.7-.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
  )},
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user)
      const { data } = await supabase.from('users').select('full_name, plan').eq('id', user.id).single()
      setProfile(data)
    }
    load()
  }, [])

  const initials = (profile?.full_name || user?.email || 'U')
    .split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const planColor: Record<string, string> = {
    free: '#64748b',
    pro: '#1d4ed8',
    team: '#7c3aed',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', system-ui, sans-serif; background: #f1f5f9; }
        .dash-wrap { display: flex; height: 100vh; overflow: hidden; }
        .sidebar { width: 220px; background: #0f172a; display: flex; flex-direction: column; flex-shrink: 0; }
        .sidebar-logo { padding: 20px 16px; border-bottom: 1px solid #1e293b; display: flex; align-items: center; gap: 10px; }
        .sidebar-logo-mark { width: 30px; height: 30px; background: #1d4ed8; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .sidebar-logo-text { font-size: 17px; font-weight: 700; color: white; letter-spacing: -0.02em; }
        .sidebar-nav { flex: 1; padding: 12px 8px; display: flex; flex-direction: column; gap: 2px; }
        .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; font-size: 13.5px; font-weight: 500; color: #94a3b8; text-decoration: none; transition: all 0.12s; cursor: pointer; border: none; background: none; width: 100%; text-align: left; }
        .nav-item:hover { color: white; background: #1e293b; }
        .nav-item.active { color: white; background: #1e3a6e; }
        .nav-item.active svg { color: #60a5fa; }
        .sidebar-bottom { padding: 12px 8px; border-top: 1px solid #1e293b; }
        .user-card { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; }
        .user-avatar { width: 30px; height: 30px; border-radius: 8px; background: #1e3a6e; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: #60a5fa; flex-shrink: 0; }
        .user-info { flex: 1; min-width: 0; }
        .user-name { font-size: 13px; font-weight: 600; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-plan { font-size: 11px; font-weight: 600; margin-top: 1px; text-transform: uppercase; letter-spacing: 0.04em; }
        .signout-btn { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; color: #64748b; cursor: pointer; border: none; background: none; width: 100%; text-align: left; margin-top: 2px; transition: all 0.12s; }
        .signout-btn:hover { color: #ef4444; background: #1e293b; }
        .main { flex: 1; overflow-y: auto; }
        .topbar { background: white; border-bottom: 1px solid #e2e8f0; padding: 0 32px; height: 56px; display: flex; align-items: center; justify-content: between; position: sticky; top: 0; z-index: 10; }
        .topbar-title { font-size: 15px; font-weight: 600; color: #0f172a; flex: 1; }
      `}</style>

      <div className="dash-wrap">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-mark">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8L6 12L14 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="sidebar-logo-text">Décliq</span>
          </div>

          <nav className="sidebar-nav">
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${pathname === item.href ? 'active' : ''}`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="user-card">
              <div className="user-avatar">{initials}</div>
              <div className="user-info">
                <div className="user-name">{profile?.full_name || user?.email?.split('@')[0]}</div>
                <div className="user-plan" style={{ color: planColor[profile?.plan || 'free'] }}>
                  {profile?.plan || 'free'}
                </div>
              </div>
            </div>
            <button className="signout-btn" onClick={handleSignOut}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 12H2.5C1.95 12 1.5 11.55 1.5 11V3C1.5 2.45 1.95 2 2.5 2H5M9.5 9.5L12.5 7M12.5 7L9.5 4.5M12.5 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Déconnexion
            </button>
          </div>
        </aside>

        <main className="main">
          {children}
        </main>
      </div>
    </>
  )
}
