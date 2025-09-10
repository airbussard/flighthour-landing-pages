'use client'

import { useEffect, useState } from 'react'
import { Card, Button } from '@eventhour/ui'
import { AuthService } from '@eventhour/auth'
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface ProfileData {
  name: string
  email: string
  phone: string
  birthday: string
  defaultPostalCode: string
  newsletter: boolean
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    defaultPostalCode: '',
    newsletter: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const user = await AuthService.getCurrentUser()
      if (user) {
        setProfile(prev => ({
          ...prev,
          name: user.name || '',
          email: user.email
        }))
      }

      const response = await fetch('/api/customers/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(prev => ({
          ...prev,
          ...data
        }))
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/customers/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      } else {
        throw new Error('Profil konnte nicht gespeichert werden')
      }
    } catch (error) {
      console.error('Save error:', error)
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/6 mb-2"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Persönliche Daten</h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-700">
              Ihre Daten wurden erfolgreich gespeichert.
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vollständiger Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  placeholder="Max Mustermann"
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
                  value={profile.email}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  disabled
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Die E-Mail-Adresse kann nicht geändert werden.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefonnummer
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  placeholder="+49 123 456789"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geburtsdatum
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={profile.birthday}
                  onChange={(e) => setProfile({ ...profile, birthday: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Standard-Postleitzahl
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={profile.defaultPostalCode}
                  onChange={(e) => setProfile({ ...profile, defaultPostalCode: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  placeholder="12345"
                  maxLength={5}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Wird für Standort-basierte Suchen verwendet.
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={profile.newsletter}
                onChange={(e) => setProfile({ ...profile, newsletter: e.target.checked })}
                className="h-4 w-4 text-eventhour-yellow focus:ring-eventhour-yellow border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">
                Ich möchte den Newsletter mit Angeboten und Neuigkeiten erhalten
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              leftIcon={Save}
              disabled={saving}
            >
              {saving ? 'Wird gespeichert...' : 'Änderungen speichern'}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Datenschutz</h2>
        <p className="text-gray-600 mb-4">
          Ihre persönlichen Daten werden gemäß unserer Datenschutzerklärung behandelt und niemals an Dritte weitergegeben.
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            • Ihre Daten werden verschlüsselt übertragen
          </p>
          <p className="text-sm text-gray-600">
            • Sie können jederzeit die Löschung Ihrer Daten beantragen
          </p>
          <p className="text-sm text-gray-600">
            • Newsletter-Abmeldung ist jederzeit möglich
          </p>
        </div>
      </Card>
    </div>
  )
}