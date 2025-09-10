'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, Container, Section } from '@eventhour/ui'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import ImageUpload from '../../[id]/edit/ImageUpload'

interface ExperienceImage {
  id?: string
  filename: string
  alt_text?: string
  display_order?: number
  isNew?: boolean
}

export default function NewExperienceEditPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [experienceId, setExperienceId] = useState<string | null>(null)
  const [images, setImages] = useState<ExperienceImage[]>([])
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    locationName: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'DE',
    latitude: null as number | null,
    longitude: null as number | null,
    duration: 60,
    maxParticipants: 1,
    retailPrice: 0,
    purchasePrice: 0,
    taxRate: 19,
    categoryId: '',
    partnerId: '',
    searchKeywords: '',
    isActive: false
  })

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    
    try {
      // Validate required fields
      if (!formData.title || !formData.slug || !formData.description || !formData.city) {
        throw new Error('Bitte füllen Sie alle Pflichtfelder aus')
      }

      // Create new experience
      const response = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          retailPrice: Math.round(formData.retailPrice * 100),
          purchasePrice: Math.round(formData.purchasePrice * 100)
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Fehler beim Speichern')
      }

      const result = await response.json()
      const newExperienceId = result.data?.id || result.id
      
      if (newExperienceId) {
        // Redirect to edit page for the new experience
        router.push(`/admin/erlebnisse/${newExperienceId}/edit`)
      } else {
        throw new Error('Erlebnis wurde erstellt, aber keine ID erhalten')
      }
    } catch (err) {
      console.error('Save error:', err)
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/erlebnisse" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zur Übersicht
          </Link>
          <h1 className="text-3xl font-bold">Neues Erlebnis erstellen</h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Grundinformationen</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titel *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        title: e.target.value,
                        slug: generateSlug(e.target.value)
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                    placeholder="z.B. Fallschirmsprung Tandem"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL-Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                    placeholder="fallschirmsprung-tandem"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kurzbeschreibung
                  </label>
                  <textarea
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                    placeholder="Kurze Beschreibung für Übersichten"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Beschreibung *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                    placeholder="Ausführliche Beschreibung des Erlebnisses"
                  />
                </div>
              </div>
            </Card>

            {/* Location */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Standort</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Standortname
                  </label>
                  <input
                    type="text"
                    value={formData.locationName}
                    onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                    placeholder="z.B. Flugplatz Marl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Straße
                  </label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                    placeholder="Musterstraße 123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PLZ
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                    placeholder="12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stadt *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                    placeholder="Berlin"
                  />
                </div>
              </div>
            </Card>

            {/* Note about images */}
            <Card className="p-6 bg-blue-50 border-blue-200">
              <p className="text-blue-800">
                <strong>Hinweis:</strong> Bilder können erst nach dem Erstellen des Erlebnisses hochgeladen werden.
                Speichern Sie das Erlebnis zuerst, um anschließend Bilder hinzuzufügen.
              </p>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Aktionen</h2>
              <div className="space-y-3">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  variant="primary"
                  className="w-full"
                  leftIcon={saving ? Loader2 : Save}
                >
                  {saving ? 'Wird gespeichert...' : 'Erlebnis erstellen'}
                </Button>
                <Link href="/admin/erlebnisse" className="block">
                  <Button variant="outline" className="w-full">
                    Abbrechen
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Details */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dauer (Minuten)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max. Teilnehmer
                  </label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  />
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Preise</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verkaufspreis (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Einkaufspreis (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  />
                </div>

                {formData.retailPrice > 0 && formData.purchasePrice > 0 && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Provision:</strong> €{(formData.retailPrice - formData.purchasePrice).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </Card>

            {/* Status */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Status</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 text-eventhour-yellow focus:ring-eventhour-yellow"
                />
                <span className="text-sm font-medium text-gray-700">
                  Erlebnis aktiv
                </span>
              </label>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}