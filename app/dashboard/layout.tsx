'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const NAV = [
  { href: '/dashboard', label: "Vue d'ensemble", emoji: '⊞' },
  { href: '/dashboard/workflows', label: 'Workflows', emoji: '⚡' },
  { href: '/dashboard/executions', label: 'Exécutions', emoji: '◷' },
  { href: '/dashboard/billing', label: 'Abonnement', emoji: '💳' },
  { href: '/dashboard/settings', label: 'Paramètres', emoji: '⚙' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

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

  const planColor: Record<string, string> = { free: '#64748b', pro: '#1d4ed8', team: '#7c3aed' }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',system-ui,sans-serif;background:#f1f5f9}

        .dash-wrap{display:flex;height:100vh;overflow:hidden}

        /* SIDEBAR desktop */
        .sidebar{width:220px;background:#0f172a;display:flex;flex-direction:column;flex-shrink:0;transition:transform 0.25s}
        .sidebar-logo{padding:18px 16px;border-bottom:1px solid #1e293b;display:flex;align-items:center;gap:9px}
        .sidebar-logo-mark{width:30px;height:30px;background:#1d4ed8;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .sidebar-logo-text{font-size:17px;font-weight:700;color:white;letter-spacing:-0.02em}
        .sidebar-nav{flex:1;padding:10px 8px;display:flex;flex-direction:column;gap:2px}
        .nav-item{display:flex;align-items:center;gap:9px;padding:9px 12px;border-radius:8px;font-size:13.5px;font-weight:500;color:#94a3b8;text-decoration:none;transition:all 0.12s;cursor:pointer;border:none;background:none;width:100%;text-align:left}
        .nav-item:hover{color:white;background:#1e293b}
        .nav-item.active{color:white;background:#1e3a6e}
        .nav-item-emoji{font-size:14px;width:18px;text-align:center}
        .sidebar-bottom{padding:10px 8px;border-top:1px solid #1e293b}
        .user-card{display:flex;align-items:center;gap:9px;padding:10px 12px;border-radius:8px}
        .user-avatar{width:28px;height:28px;border-radius:7px;background:#1e3a6e;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#60a5fa;flex-shrink:0}
        .user-info{flex:1;min-width:0}
        .user-name{font-size:13px;font-weight:600;color:white;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .user-plan{font-size:10px;font-weight:700;margin-top:1px;text-transform:uppercase;letter-spacing:0.05em}
        .signout-btn{display:flex;align-items:center;gap:9px;padding:8px 12px;border-radius:8px;font-size:13px;font-weight:500;color:#64748b;cursor:pointer;border:none;background:none;width:100%;margin-top:2px;transition:all 0.12s}
        .signout-btn:hover{color:#ef4444;background:#1e293b}

        /* MAIN */
        .main{flex:1;overflow-y:auto;display:flex;flex-direction:column}

        /* MOBILE TOP NAV */
        .mobile-topnav{display:none;background:#0f172a;padding:0 16px;height:54px;align-items:center;justify-content:space-between;flex-shrink:0;position:sticky;top:0;z-index:50}
        .mobile-logo{display:flex;align-items:center;gap:8px;font-size:16px;font-weight:700;color:white;text-decoration:none;letter-spacing:-0.02em}
        .hamburger{background:none;border:none;color:white;cursor:pointer;padding:6px;border-radius:6px;display:flex;align-items:center;justify-content:center}
        .hamburger:hover{background:#1e293b}

        /* MOBILE DRAWER */
        .mobile-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:60;opacity:0;transition:opacity 0.2s}
        .mobile-overlay.open{opacity:1}
        .mobile-drawer{position:fixed;left:0;top:0;bottom:0;width:260px;background:#0f172a;z-index:70;transform:translateX(-100%);transition:transform 0.25s;display:flex;flex-direction:column}
        .mobile-drawer.open{transform:translateX(0)}
        .drawer-close{background:none;border:none;color:#64748b;cursor:pointer;padding:6px;border-radius:6px;align-self:flex-end;margin:12px 12px 0 0}
        .drawer-close:hover{color:white}

        /* MOBILE BOTTOM NAV */
        .mobile-bottomnav{display:none;background:#0f172a;border-top:1px solid #1e293b;padding:6px 0 8px;flex-shrink:0;position:sticky;bottom:0}
        .mobile-bottomnav-inner{display:flex;justify-content:space-around}
        .mobile-nav-btn{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 12px;border-radius:8px;text-decoration:none;color:#64748b;font-size:10px;font-weight:600;letter-spacing:0.02em;transition:all 0.12s;border:none;background:none;cursor:pointer}
        .mobile-nav-btn.active{color:#60a5fa}
        .mobile-nav-btn-icon{font-size:18px}

        @media(max-width:768px){
          .sidebar{display:none}
          .mobile-topnav{display:flex}
          .mobile-overlay{display:block;pointer-events:none}
          .mobile-overlay.open{pointer-events:all}
          .mobile-bottomnav{display:block}
          .dash-wrap{flex-direction:column}
          .main{height:calc(100vh - 54px - 62px);overflow-y:auto}
        }
      `}</style>

      <div className="dash-wrap">

        {/* SIDEBAR desktop */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-mark">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8L6 12L14 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="sidebar-logo-text">Eldorai</span>
          </div>
          <nav className="sidebar-nav">
            {NAV.map(item => (
              <Link key={item.href} href={item.href} className={`nav-item ${pathname === item.href ? 'active' : ''}`}>
                <span className="nav-item-emoji">{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="user-card">
              <div className="user-avatar">{initials}</div>
              <div className="user-info">
                <div className="user-name">{profile?.full_name || user?.email?.split('@')[0]}</div>
                <div className="user-plan" style={{ color: planColor[profile?.plan || 'free'] }}>{profile?.plan || 'free'}</div>
              </div>
            </div>
            <button className="signout-btn" onClick={handleSignOut}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 12H2.5C1.95 12 1.5 11.55 1.5 11V3C1.5 2.45 1.95 2 2.5 2H5M9.5 9.5L12.5 7M12.5 7L9.5 4.5M12.5 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Déconnexion
            </button>
          </div>
        </aside>

        {/* MOBILE TOP NAV */}
        <div className="mobile-topnav">
          <Link href="/dashboard" className="mobile-logo">
            <div className="sidebar-logo-mark" style={{width:28,height:28,borderRadius:7}}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8L6 12L14 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            Eldorai
          </Link>
          <button className="hamburger" onClick={() => setMenuOpen(true)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 6h14M3 10h14M3 14h14" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* MOBILE DRAWER */}
        <div className={`mobile-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
        <div className={`mobile-drawer ${menuOpen ? 'open' : ''}`}>
          <button className="drawer-close" onClick={() => setMenuOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
          <div style={{padding:'0 8px 12px'}}>
            {NAV.map(item => (
              <Link key={item.href} href={item.href} className={`nav-item ${pathname === item.href ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                <span className="nav-item-emoji">{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </div>
          <div style={{marginTop:'auto',padding:'12px 8px',borderTop:'1px solid #1e293b'}}>
            <div className="user-card">
              <div className="user-avatar">{initials}</div>
              <div className="user-info">
                <div className="user-name">{profile?.full_name || user?.email?.split('@')[0]}</div>
                <div className="user-plan" style={{ color: planColor[profile?.plan || 'free'] }}>{profile?.plan || 'free'}</div>
              </div>
            </div>
            <button className="signout-btn" onClick={handleSignOut}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 12H2.5C1.95 12 1.5 11.55 1.5 11V3C1.5 2.45 1.95 2 2.5 2H5M9.5 9.5L12.5 7M12.5 7L9.5 4.5M12.5 7H5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Déconnexion
            </button>
          </div>
        </div>

        {/* MAIN */}
        <main className="main">{children}</main>

        {/* MOBILE BOTTOM NAV */}
        <div className="mobile-bottomnav">
          <div className="mobile-bottomnav-inner">
            {NAV.slice(0, 5).map(item => (
              <Link key={item.href} href={item.href} className={`mobile-nav-btn ${pathname === item.href ? 'active' : ''}`}>
                <span className="mobile-nav-btn-icon">{item.emoji}</span>
                {item.label.split(' ')[0]}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
