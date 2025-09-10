'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Container, Section, Input, Button, Logo } from '@eventhour/ui'
import { useAuth } from '@eventhour/auth'
import { Building2, Info } from 'lucide-react'

export default function PartnerLoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()

  // Check for session expiry message on mount
  useEffect(() => {
    const expired = localStorage.getItem('session_expired')
    const message = localStorage.getItem('session_expired_message')
    
    if (expired === 'true' && message) {
      setSessionExpiredMessage(message)
      // Clear the flags
      localStorage.removeItem('session_expired')
      localStorage.removeItem('session_expired_message')
    }
  }, [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn(formData.email, formData.password, formData.rememberMe)
      
      // Check if user is a partner
      const response = await fetch('/api/partner/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: result.user.id }),
      })

      const data = await response.json()

      if (!data.isPartner) {
        setError('Kein Partner-Account gefunden. Bitte registrieren Sie sich zuerst.')
        return
      }

      router.push('/partnerportal')
    } catch (err) {
      setError('E-Mail oder Passwort falsch')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eventhour-yellow/10 to-white flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo size="lg" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Partner Portal</h1>
              <p className="text-gray-600">Verwalten Sie Ihre Erlebnisse</p>
            </div>

            {/* Session Expired Message */}
            {sessionExpiredMessage && (
              <div className="mb-6 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">{sessionExpiredMessage}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="E-Mail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="partner@beispiel.de"
              />

              <Input
                label="Passwort"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
              />

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  className="h-4 w-4 text-eventhour-yellow focus:ring-eventhour-yellow border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                  Dauerhaft eingeloggt bleiben
                </label>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                isLoading={loading}
                className="w-full"
              >
                Anmelden
              </Button>
            </form>

            {/* Links */}
            <div className="mt-6 space-y-2 text-center">
              <Link
                href="/partnerportal/passwort-vergessen"
                className="text-sm text-gray-600 hover:text-eventhour-yellow transition-colors"
              >
                Passwort vergessen?
              </Link>
              <div className="text-sm text-gray-600">
                Noch kein Partner?{' '}
                <Link
                  href="/partnerportal/registrierung"
                  className="text-eventhour-yellow font-semibold hover:underline"
                >
                  Jetzt registrieren
                </Link>
              </div>
            </div>

            {/* Partner Benefits */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Building2 className="h-5 w-5 text-eventhour-yellow" />
                <span>Werden Sie Teil des Eventhour-Netzwerks</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}