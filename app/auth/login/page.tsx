import { Suspense } from 'react'
import LoginForm from './login-form'

export default function LoginPage() {
  return (
    // Le fallback est ce qui s'affiche pendant une fraction de seconde
    // tu peux y mettre un spinner ou un squelette blanc
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Chargement...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}