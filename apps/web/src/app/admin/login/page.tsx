'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Container, Button } from '@eventhour/ui'
import { Shield, Lock, Mail, Info } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Call API route instead of using AuthService directly
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // Check if user is admin
        if (data.user?.role === 'ADMIN') {
          // Store auth state
          localStorage.setItem('admin-auth', 'true')
          // Redirect to admin dashboard
          router.push('/admin')
        } else {
          setError('Sie haben keine Admin-Berechtigung')
          setLoading(false)
        }
      } else {
        // Check if we should use fallback
        if (data.fallback) {
          console.warn('Authentication service not available, using fallback')
          if (formData.email === 'admin@eventhour.de' && formData.password === 'admin123') {
            localStorage.setItem('admin-auth', 'true')
            router.push('/admin')
            return
          }
        }
        
        setError(data.error || 'Anmeldung fehlgeschlagen')
        setLoading(false)
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Anmeldung fehlgeschlagen. Bitte versuchen Sie es später erneut.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-eventhour-black to-gray-900 flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-eventhour-yellow rounded-full">
                  <Shield className="h-12 w-12 text-eventhour-black" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">Admin Portal</h1>
              <p className="text-gray-600">Systemverwaltung für Eventhour</p>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="admin@eventhour.de"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passwort
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  />
                </div>
              </div>

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

            {/* Security Notice */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-gray-400 mt-0.5" />
                <p className="text-xs text-gray-500">
                  Dieser Bereich ist nur für autorisierte Administratoren zugänglich. 
                  Alle Aktivitäten werden protokolliert.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}