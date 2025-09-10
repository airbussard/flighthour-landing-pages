import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@eventhour/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email und Passwort sind erforderlich' },
        { status: 400 }
      )
    }

    // Use AuthService to sign in with rememberMe option
    const result = await AuthService.signIn(email, password, rememberMe || false)
    
    return NextResponse.json({
      success: true,
      user: result.user,
      // Don't send the full session to the client
      hasSession: !!result.session
    })
  } catch (error: any) {
    console.error('Login API error:', error)
    
    // Handle specific error messages
    if (error.message?.includes('Invalid login credentials')) {
      return NextResponse.json(
        { success: false, error: 'E-Mail oder Passwort falsch' },
        { status: 401 }
      )
    }
    
    if (error.message?.includes('User not found in database')) {
      return NextResponse.json(
        { success: false, error: 'Benutzer nicht in Datenbank gefunden' },
        { status: 404 }
      )
    }
    
    if (error.message?.includes('Authentication service not available')) {
      // Fallback response for when Supabase is not configured
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication service not available',
          fallback: true 
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Anmeldung fehlgeschlagen' },
      { status: 500 }
    )
  }
}