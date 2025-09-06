'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Container, Section, Input, Button, Logo } from '@eventhour/ui'
import { useAuth } from '@eventhour/auth'
import { Building2, Mail, Lock } from 'lucide-react'

export default function PartnerLoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
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
      const { user, error } = await signIn(formData.email, formData.password)
      
      if (error) {
        setError('E-Mail oder Passwort falsch')
        return
      }

      // Check if user is a partner
      const response = await fetch('/api/partner/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id }),
      })

      const data = await response.json()

      if (!data.isPartner) {
        setError('Kein Partner-Account gefunden. Bitte registrieren Sie sich zuerst.')
        return
      }

      router.push('/partnerportal')
    } catch (err) {
      setError('Ein Fehler ist aufgetreten')
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="E-Mail"
                type="email"
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="partner@beispiel.de"
              />

              <Input
                label="Passwort"
                type="password"
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
              />

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                loading={loading}
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