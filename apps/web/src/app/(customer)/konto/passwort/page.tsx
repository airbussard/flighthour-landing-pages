'use client'

import { useState } from 'react'
import { Card, Button } from '@eventhour/ui'
import { AuthService } from '@eventhour/auth'
import { 
  Lock, 
  Eye, 
  EyeOff,
  AlertCircle,
  CheckCircle,
  Shield
} from 'lucide-react'

export default function PasswordChangePage() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const passwordRequirements = [
    { regex: /.{8,}/, text: 'Mindestens 8 Zeichen' },
    { regex: /[A-Z]/, text: 'Ein Großbuchstabe' },
    { regex: /[a-z]/, text: 'Ein Kleinbuchstabe' },
    { regex: /[0-9]/, text: 'Eine Zahl' }
  ]

  const validatePassword = (password: string) => {
    return passwordRequirements.every(req => req.regex.test(password))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validate new password
    if (!validatePassword(formData.newPassword)) {
      setError('Das neue Passwort erfüllt nicht alle Anforderungen')
      return
    }

    // Check passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Die neuen Passwörter stimmen nicht überein')
      return
    }

    // Check new password is different from current
    if (formData.currentPassword === formData.newPassword) {
      setError('Das neue Passwort muss sich vom aktuellen unterscheiden')
      return
    }

    setLoading(true)

    try {
      // First verify current password by attempting to get current user
      const user = await AuthService.getCurrentUser()
      if (!user) {
        throw new Error('Nicht authentifiziert')
      }

      // Update password
      await AuthService.updatePassword(formData.newPassword)
      
      setSuccess(true)
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      setTimeout(() => setSuccess(false), 5000)
    } catch (err: any) {
      console.error('Password change error:', err)
      if (err.message?.includes('Invalid')) {
        setError('Das aktuelle Passwort ist falsch')
      } else {
        setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-6">Passwort ändern</h2>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-700">
              Ihr Passwort wurde erfolgreich geändert.
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Aktuelles Passwort
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Neues Passwort
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? (
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
                    formData.newPassword && req.regex.test(formData.newPassword)
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
              Neues Passwort bestätigen
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
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">
                Die Passwörter stimmen nicht überein
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              variant="primary"
              leftIcon={Shield}
              disabled={loading}
            >
              {loading ? 'Wird geändert...' : 'Passwort ändern'}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Sicherheitstipps</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-eventhour-yellow flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Verwenden Sie ein starkes Passwort</p>
              <p className="text-sm text-gray-600">
                Kombinieren Sie Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-eventhour-yellow flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Nutzen Sie einzigartige Passwörter</p>
              <p className="text-sm text-gray-600">
                Verwenden Sie für jeden Dienst ein anderes Passwort.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-eventhour-yellow flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Ändern Sie Ihr Passwort regelmäßig</p>
              <p className="text-sm text-gray-600">
                Wir empfehlen, Ihr Passwort alle 3-6 Monate zu ändern.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}