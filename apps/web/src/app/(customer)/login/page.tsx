'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AuthService } from '@eventhour/auth'
import { Button, Card, Container, Section } from '@eventhour/ui'
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    // Check for success or error messages in URL
    if (searchParams.get('confirmed') === 'true') {
      setSuccessMessage('E-Mail erfolgreich bestätigt! Sie können sich jetzt anmelden.')
    } else if (searchParams.get('error') === 'invalid_token') {
      setError('Der Bestätigungslink ist ungültig oder abgelaufen.')
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { user } = await AuthService.signIn(email, password, rememberMe)
      
      // Redirect based on user role
      if (user.role === 'ADMIN') {
        router.push('/admin')
      } else if (user.role === 'PARTNER') {
        router.push('/partnerportal')
      } else {
        // Customer - redirect to account or back to where they came from
        const returnUrl = new URLSearchParams(window.location.search).get('returnUrl')
        router.push(returnUrl || '/konto')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      if (err.message?.includes('Invalid login credentials')) {
        setError('E-Mail oder Passwort ist falsch')
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse. Prüfen Sie Ihren Posteingang.')
      } else if (err.message?.includes('Email link is invalid or has expired')) {
        setError('Ihre E-Mail-Adresse wurde noch nicht bestätigt. Bitte prüfen Sie Ihren Posteingang.')
      } else {
        setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Section className="py-20">
      <Container>
        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Anmelden</h1>
              <p className="text-gray-600">
                Willkommen zurück! Bitte melden Sie sich an.
              </p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-700">{successMessage}</div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-Mail-Adresse
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                    placeholder="ihre@email.de"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passwort
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-eventhour-yellow focus:ring-eventhour-yellow border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Angemeldet bleiben
                  </span>
                </label>
                <Link
                  href="/passwort-vergessen"
                  className="text-sm text-eventhour-yellow hover:underline"
                >
                  Passwort vergessen?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Anmeldung läuft...' : 'Anmelden'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Noch kein Konto?{' '}
                <Link
                  href="/registrieren"
                  className="text-eventhour-yellow hover:underline font-medium"
                >
                  Jetzt registrieren
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  )
}