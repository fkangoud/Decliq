import { Suspense } from 'react'
import SignupForm from './signup-form'

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#f8fafc',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{color:'#94a3b8',fontSize:14}}>Chargement...</div></div>}>
      <SignupForm />
    </Suspense>
  )
}
