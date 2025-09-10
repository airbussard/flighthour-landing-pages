'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AuthService } from '@eventhour/auth'
import { Button, Card, Container, Section } from '@eventhour/ui'
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'

export default function PasswordResetPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await AuthService.resetPassword(email)
      setSuccess(true)
    } catch (err: any) {
      console.error('Password reset error:', err)
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Section className="py-20">
        <Container>
          <div className="max-w-md mx-auto">
            <Card className="p-8 text-center">
              <div className="mb-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold mb-2">E-Mail versendet!</h2>
              <p className="text-gray-600 mb-6">
                Wir haben Ihnen eine E-Mail mit Anweisungen zum Zurücksetzen Ihres Passworts gesendet.
                Bitte überprüfen Sie auch Ihren Spam-Ordner.
              </p>
              <Link href="/login">
                <Button variant="primary" className="w-full">
                  Zurück zum Login
                </Button>
              </Link>
            </Card>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section className="py-20">
      <Container>
        <div className="max-w-md mx-auto">
          <Card className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Passwort vergessen?</h1>
              <p className="text-gray-600">
                Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
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

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Wird gesendet...' : 'Passwort zurücksetzen'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Zurück zum Login
              </Link>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  )
}