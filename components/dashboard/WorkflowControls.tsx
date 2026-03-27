'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Pause, Play, Trash2, Loader2 } from 'lucide-react'

type Props = {
  workflowId: string
  currentStatus: string
}

export default function WorkflowControls({ workflowId, currentStatus }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState<'toggle' | 'delete' | null>(null)

  async function toggleStatus() {
    setLoading('toggle')
    const newStatus = currentStatus === 'active' ? 'paused' : 'active'
    await supabase.from('workflows').update({ status: newStatus }).eq('id', workflowId)
    router.refresh()
    setLoading(null)
  }

  async function deleteWorkflow() {
    if (!confirm('Supprimer ce workflow ? Cette action est irréversible.')) return
    setLoading('delete')
    await supabase.from('workflows').delete().eq('id', workflowId)
    router.push('/dashboard/workflows')
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleStatus}
        disabled={loading !== null}
        className="flex items-center gap-2 border border-slate-200 text-slate-700 text-sm px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
      >
        {loading === 'toggle' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : currentStatus === 'active' ? (
          <><Pause className="w-4 h-4" /> Mettre en pause</>
        ) : (
          <><Play className="w-4 h-4" /> Activer</>
        )}
      </button>
      <button
        onClick={deleteWorkflow}
        disabled={loading !== null}
        className="flex items-center gap-1.5 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {loading === 'delete' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  )
}
