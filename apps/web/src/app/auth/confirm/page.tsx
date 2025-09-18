'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@eventhour/database'
import { Container, Section, Card } from '@eventhour/ui'
import { CheckCircle, XCircle } from 'lucide-react'

export default function ConfirmEmailPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('E-Mail wird bestätigt...')

  useEffect(() => {
    const confirmEmail = async () => {
      // Get hash parameters
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token') 
      const type = hashParams.get('type')
      
      console.log('Auth confirmation - Type:', type, 'Token present:', !!accessToken)
      
      if (!accessToken) {
        // Check if we have query params instead (for code-based flow)
        const queryParams = new URLSearchParams(window.location.search)
        const error = queryParams.get('error')
        const errorDescription = queryParams.get('error_description')
        
        if (error) {
          console.error('Auth error:', error, errorDescription)
          setStatus('error')
          setMessage(errorDescription || 'Ein Fehler ist aufgetreten.')
          return
        }
        
        // No token found
        setStatus('error')
        setMessage('Kein Bestätigungstoken gefunden.')
        return
      }
      
      const supabase = getSupabaseClient()
      if (!supabase) {
        setStatus('error')
        setMessage('Authentifizierungsdienst nicht verfügbar.')
        return
      }
      
      try {
        if (type === 'signup' || type === 'email') {
          // Set the session with the tokens
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          })
          
          if (error) {
            console.error('Session error:', error)
            setStatus('error')
            setMessage('Fehler beim Bestätigen der E-Mail-Adresse.')
            return
          }
          
          // Sign out immediately after confirming (user needs to log in with credentials)
          await supabase.auth.signOut()
          
          setStatus('success')
          setMessage('E-Mail-Adresse erfolgreich bestätigt!')
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push('/login?confirmed=true')
          }, 2000)
          
        } else if (type === 'recovery') {
          // Password recovery flow
          setStatus('success')
          setMessage('Weiterleitung zur Passwort-Zurücksetzung...')
          router.push(`/passwort-zuruecksetzen?token=${accessToken}`)
          
        } else {
          // Unknown type
          console.warn('Unknown confirmation type:', type)
          setStatus('error')
          setMessage('Unbekannter Bestätigungstyp.')
        }
      } catch (err) {
        console.error('Confirmation error:', err)
        setStatus('error')
        setMessage('Ein unerwarteter Fehler ist aufgetreten.')
      }
    }
    
    confirmEmail()
  }, [router])

  return (
    <Section className="py-20">
      <Container>
        <div className="max-w-md mx-auto">
          <Card className="p-8 text-center">
            {status === 'loading' && (
              <>
                <div className="mb-4">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-eventhour-yellow mx-auto"></div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Bestätigung läuft...</h2>
                <p className="text-gray-600">{message}</p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <div className="mb-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Erfolgreich!</h2>
                <p className="text-gray-600">{message}</p>
                <p className="text-sm text-gray-500 mt-4">Sie werden automatisch weitergeleitet...</p>
              </>
            )}
            
            {status === 'error' && (
              <>
                <div className="mb-4">
                  <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Fehler</h2>
                <p className="text-gray-600 mb-4">{message}</p>
                <button
                  onClick={() => router.push('/login')}
                  className="text-eventhour-yellow hover:underline"
                >
                  Zurück zum Login
                </button>
              </>
            )}
          </Card>
        </div>
      </Container>
    </Section>
  )
}