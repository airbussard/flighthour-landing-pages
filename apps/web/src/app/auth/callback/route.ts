import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@eventhour/database'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'

  if (code) {
    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        // Exchange the code for a session
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (!error) {
          // Redirect to login with success message
          return NextResponse.redirect(new URL('/login?confirmed=true', requestUrl.origin))
        }
      } catch (err) {
        console.error('Auth callback error:', err)
      }
    }
  }

  // Handle hash-based tokens (for email confirmations)
  // These come as fragments, so we need client-side handling
  // Return an HTML page that processes the hash
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>E-Mail bestätigen...</title>
        <meta charset="utf-8" />
      </head>
      <body>
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;">
          <div style="text-align: center;">
            <h2>E-Mail wird bestätigt...</h2>
            <p>Einen Moment bitte...</p>
          </div>
        </div>
        <script>
          // Get the hash parameters
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const type = hashParams.get('type');
          
          if (accessToken && type === 'signup') {
            // Email confirmation successful
            window.location.href = '/login?confirmed=true';
          } else if (accessToken && type === 'recovery') {
            // Password recovery
            window.location.href = '/passwort-zuruecksetzen?token=' + accessToken;
          } else {
            // Something went wrong
            window.location.href = '/login?error=invalid_token';
          }
        </script>
      </body>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    }
  )
}