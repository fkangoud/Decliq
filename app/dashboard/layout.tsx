'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Zap, LayoutDashboard, Workflow, Activity, CreditCard, Settings, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: '/dashboard/workflows', label: 'Workflows', icon: Workflow },
  { href: '/dashboard/executions', label: 'Exécutions', icon: Activity },
  { href: '/dashboard/billing', label: 'Abonnement', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Paramètres', icon: Settings },
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

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-slate-900">Décliq</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
                <item.icon className={`w-4 h-4 ${active ? 'text-slate-700' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-slate-100 space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-700 shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-900 truncate">{profile?.full_name || user?.email?.split('@')[0]}</p>
              <p className="text-xs text-slate-400 capitalize">{profile?.plan || 'free'}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
