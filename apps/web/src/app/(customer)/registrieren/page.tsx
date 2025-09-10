'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthService } from '@eventhour/auth'
import { Button, Card, Container, Section } from '@eventhour/ui'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const passwordRequirements = [
    { regex: /.{8,}/, text: 'Mindestens 8 Zeichen' },
    { regex: /[A-Z]/, text: 'Ein Großbuchstabe' },
    { regex: /[a-z]/, text: 'Ein Kleinbuchstabe' },
    { regex: /[0-9]/, text: 'Eine Zahl' }
  ]

  const validatePassword = (password: string) => {
    return passwordRequirements.every(req => req.regex.test(password))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Die Passwörter stimmen nicht überein')
      return
    }

    // Validate password strength
    if (!validatePassword(formData.password)) {
      setError('Das Passwort erfüllt nicht alle Anforderungen')
      return
    }

    // Check terms acceptance
    if (!formData.acceptTerms) {
      setError('Bitte akzeptieren Sie die AGB und Datenschutzerklärung')
      return
    }

    setLoading(true)

    try {
      await AuthService.signUp(formData.email, formData.password, formData.name)
      setSuccess(true)
      
      // Auto-login after registration
      setTimeout(async () => {
        try {
          await AuthService.signIn(formData.email, formData.password)
          router.push('/konto')
        } catch {
          router.push('/login')
        }
      }, 2000)
    } catch (err: any) {
      console.error('Registration error:', err)
      if (err.message?.includes('already registered')) {
        setError('Diese E-Mail-Adresse ist bereits registriert')
      } else {
        setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.')
      }
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
              <h2 className="text-2xl font-bold mb-2">Registrierung erfolgreich!</h2>
              <p className="text-gray-600 mb-4">
                Willkommen bei EventHour! Sie werden automatisch angemeldet...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-eventhour-yellow mx-auto"></div>
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
              <h1 className="text-3xl font-bold mb-2">Konto erstellen</h1>
              <p className="text-gray-600">
                Registrieren Sie sich für Ihr EventHour-Konto
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vollständiger Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                    placeholder="Max Mustermann"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-Mail-Adresse
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className={`text-xs flex items-center gap-1 ${
                        formData.password && req.regex.test(formData.password)
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }`}
                    >
                      <CheckCircle className="h-3 w-3" />
                      <span>{req.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passwort bestätigen
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                    className="h-4 w-4 text-eventhour-yellow focus:ring-eventhour-yellow border-gray-300 rounded mt-0.5"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Ich akzeptiere die{' '}
                    <Link href="/agb" className="text-eventhour-yellow hover:underline">
                      AGB
                    </Link>{' '}
                    und{' '}
                    <Link href="/datenschutz" className="text-eventhour-yellow hover:underline">
                      Datenschutzerklärung
                    </Link>
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                    className="h-4 w-4 text-eventhour-yellow focus:ring-eventhour-yellow border-gray-300 rounded mt-0.5"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Ich möchte den Newsletter mit Angeboten und Neuigkeiten erhalten
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Registrierung läuft...' : 'Registrieren'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Bereits registriert?{' '}
                <Link
                  href="/login"
                  className="text-eventhour-yellow hover:underline font-medium"
                >
                  Jetzt anmelden
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </Container>
    </Section>
  )
}