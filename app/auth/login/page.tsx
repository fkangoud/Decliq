import { Suspense } from 'react'
import LoginForm from './login-form'

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{color:'#94a3b8',fontSize:14}}>Chargement...</div></div>}>
      <LoginForm />
    </Suspense>
  )
}
