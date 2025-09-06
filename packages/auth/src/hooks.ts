'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from './supabase'
import { AuthService, AuthUser } from './auth-service'
import { Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabaseClient()

    // If supabase is not available (during build), just set loading to false
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        AuthService.getCurrentUser().then(setUser)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session) {
        const user = await AuthService.getCurrentUser()
        setUser(user)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    session,
    loading,
    signIn: AuthService.signIn,
    signUp: AuthService.signUp,
    signOut: AuthService.signOut,
  }
}

export function useRequireAuth(redirectTo = '/auth/signin') {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user && typeof window !== 'undefined') {
      window.location.href = redirectTo
    }
  }, [user, loading, redirectTo])

  return { user, loading }
}

export function useRequireRole(allowedRoles: string[], redirectTo = '/') {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user && !allowedRoles.includes(user.role) && typeof window !== 'undefined') {
      window.location.href = redirectTo
    }
  }, [user, loading, allowedRoles, redirectTo])

  return { user, loading }
}
