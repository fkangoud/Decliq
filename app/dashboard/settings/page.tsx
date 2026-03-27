'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Loader2, Check } from 'lucide-react'

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
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold text-slate-900 mb-8">Paramètres</h1>

      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <h2 className="font-medium text-slate-900 mb-4">Informations personnelles</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Nom complet</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1">L'email ne peut pas être modifié ici.</p>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-slate-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
              {saved ? 'Sauvegardé !' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h2 className="font-medium text-slate-900 mb-1">Zone dangereuse</h2>
        <p className="text-sm text-slate-500 mb-4">Ces actions sont irréversibles.</p>
        <button
          onClick={handleSignOut}
          className="text-sm border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          Se déconnecter de tous les appareils
        </button>
      </div>
    </div>
  )
}
