import { getSupabaseClient } from './supabase'
import { prisma } from '@eventhour/database'
import type { User, UserRole } from '@eventhour/database'

export interface AuthUser {
  id: string
  email: string
  name?: string | null
  role: UserRole
}

export class AuthService {
  static async signUp(email: string, password: string, name?: string) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Authentication service not available')

    try {
      // Create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('User creation failed')

      // Create database user
      const dbUser = await prisma.user.create({
        data: {
          id: authData.user.id,
          email,
          name,
          role: 'CUSTOMER',
          customerProfile: {
            create: {},
          },
        },
      })

      return {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
        },
        session: authData.session,
      }
    } catch (error) {
      console.error('Sign up error:', error)
      throw error
    }
  }

  static async signIn(email: string, password: string) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Authentication service not available')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      if (!data.user) throw new Error('Sign in failed')

      // Get user details from database
      const dbUser = await prisma.user.findUnique({
        where: { id: data.user.id },
      })

      if (!dbUser) throw new Error('User not found in database')

      return {
        user: {
          id: dbUser.id,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
        },
        session: data.session,
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    }
  }

  static async signOut() {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Authentication service not available')

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = getSupabaseClient()
    if (!supabase) return null

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return null

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      })

      if (!dbUser) return null

      return {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  static async updatePassword(newPassword: string) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Authentication service not available')

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
  }

  static async resetPassword(email: string) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Authentication service not available')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    })
    if (error) throw error
  }

  static async verifyOtp(email: string, token: string) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Authentication service not available')

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })
    if (error) throw error
    return data
  }
}
