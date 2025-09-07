'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Button } from '@eventhour/ui'
import { Shield, Lock, Mail } from 'lucide-react'
import { AuthService } from '@eventhour/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Use Supabase authentication
      const result = await AuthService.signIn(formData.email, formData.password)
      
      // Check if user is admin
      if (result.user.role === 'ADMIN') {
        // Success - redirect to admin dashboard
        router.push('/admin')
      } else {
        setError('Sie haben keine Admin-Berechtigung')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('Login error:', err)
      
      // Handle specific error messages
      if (err.message?.includes('Invalid login credentials')) {
        setError('E-Mail oder Passwort falsch')
      } else if (err.message?.includes('User not found')) {
        setError('Benutzer nicht gefunden')
      } else if (err.message?.includes('Authentication service not available')) {
        // Fallback for development if Supabase is not configured
        console.warn('Supabase not configured, using fallback auth')
        if (formData.email === 'admin@eventhour.de' && formData.password === 'admin123') {
          localStorage.setItem('admin-auth', 'true')
          router.push('/admin')
        } else {
          setError('E-Mail oder Passwort falsch')
        }
      } else {
        setError('Anmeldung fehlgeschlagen. Bitte versuchen Sie es später erneut.')
      }
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