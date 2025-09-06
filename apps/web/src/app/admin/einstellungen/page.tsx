'use client'

import { useState, useEffect } from 'react'
import { Save, Percent, Euro, Calendar, Bell, Shield, AlertTriangle } from 'lucide-react'
import { Button } from '@eventhour/ui'

interface SystemSettings {
  platformFee: number
  minPayoutAmount: number
  voucherValidityDays: number
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailNotifications: boolean
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    platformFee: 30,
    minPayoutAmount: 50,
    voucherValidityDays: 365,
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    setSaved(false)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Systemeinstellungen</h1>
        <p className="text-gray-600">Verwalten Sie globale Plattform-Einstellungen</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Financial Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Euro className="h-5 w-5 text-green-500" />
            Finanzielle Einstellungen
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plattformgebühr (%)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.platformFee}
                  onChange={(e) => setSettings({ ...settings, platformFee: parseInt(e.target.value) })}
                  min="0"
                  max="100"
                  className="w-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                />
                <Percent className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Gebühr die von Partner-Auszahlungen abgezogen wird
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimaler Auszahlungsbetrag (€)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.minPayoutAmount}
                  onChange={(e) => setSettings({ ...settings, minPayoutAmount: parseInt(e.target.value) })}
                  min="0"
                  className="w-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                />
                <Euro className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Mindestbetrag für Partner-Auszahlungen
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Voucher Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            Gutschein-Einstellungen
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gutschein-Gültigkeit (Tage)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={settings.voucherValidityDays}
                onChange={(e) => setSettings({ ...settings, voucherValidityDays: parseInt(e.target.value) })}
                min="1"
                className="w-32 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
              />
              <span className="text-sm text-gray-500">
                Tage bis Gutscheine ablaufen
              </span>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            System-Einstellungen
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Wartungsmodus</h3>
                <p className="text-sm text-gray-500">
                  Plattform für Wartungsarbeiten sperren
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eventhour-yellow/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-eventhour-yellow"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Registrierungen erlauben</h3>
                <p className="text-sm text-gray-500">
                  Neue Benutzer- und Partner-Registrierungen
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.registrationEnabled}
                  onChange={(e) => setSettings({ ...settings, registrationEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eventhour-yellow/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-eventhour-yellow"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">E-Mail Benachrichtigungen</h3>
                <p className="text-sm text-gray-500">
                  System-E-Mails aktivieren
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eventhour-yellow/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-eventhour-yellow"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Warning */}
        {settings.maintenanceMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900">Wartungsmodus aktiviert</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Die Plattform ist derzeit für normale Benutzer nicht zugänglich. 
                  Nur Administratoren können auf das System zugreifen.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <div>
            {saved && (
              <p className="text-green-600 text-sm">
                ✓ Einstellungen wurden gespeichert
              </p>
            )}
          </div>
          <Button
            onClick={handleSave}
            isLoading={loading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Einstellungen speichern
          </Button>
        </div>
      </div>
    </div>
  )
}