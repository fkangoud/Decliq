import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase'

// Routes qui nécessitent une authentification
const PROTECTED_ROUTES = ['/dashboard']

// Routes réservées aux non-connectés
const AUTH_ROUTES = ['/auth/login', '/auth/signup']

export async function middleware(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request)
  const { data: { session } } = await supabase.auth.getSession()

  const path = request.nextUrl.pathname
  const isProtected = PROTECTED_ROUTES.some(r => path.startsWith(r))
  const isAuthRoute = AUTH_ROUTES.some(r => path.startsWith(r))

  // Non connecté sur une route protégée → login
  if (isProtected && !session) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(redirectUrl)
  }

  // Connecté sur une page auth → dashboard
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
