import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { Button } from '@eventhour/ui'

interface Experience {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  locationName: string
  street?: string
  city: string
  postalCode: string
  country?: string
  latitude?: number
  longitude?: number
  duration: number
  maxParticipants: number | null
  retailPrice: number
  purchasePrice: number
  categoryId?: string
  partnerId?: string
  searchKeywords?: string
  isActive: boolean
  taxRate?: number
  createdAt?: string
  partner?: {
    companyName: string
    id: string
  }
  category?: {
    name: string
    id: string
  }
  _count?: {
    vouchers: number
  }
}

interface Category {
  id: string
  name: string
}

interface Partner {
  id: string
  companyName: string
}

interface ExperienceEditModalProps {
  experience: Experience | null
  isOpen: boolean
  onClose: () => void
  onSave: (experience: Partial<Experience>) => Promise<void>
  categories: Category[]
  partners: Partner[]
}

export default function ExperienceEditModal({
  experience,
  isOpen,
  onClose,
  onSave,
  categories,
  partners,
}: ExperienceEditModalProps) {
  const [formData, setFormData] = useState<Partial<Experience>>({})
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (experience) {
      setFormData(experience)
    } else {
      // Neue Erfahrung
      setFormData({
        title: '',
        slug: '',
        description: '',
        shortDescription: '',
        locationName: '',
        street: '',
        city: '',
        postalCode: '',
        country: 'DE',
        duration: 60,
        maxParticipants: null,
        retailPrice: 0,
        purchasePrice: 0,
        categoryId: '',
        partnerId: '',
        searchKeywords: '',
        isActive: true,
      })
    }
    setErrors({})
  }, [experience])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title) newErrors.title = 'Titel ist erforderlich'
    if (!formData.slug) newErrors.slug = 'Slug ist erforderlich'
    if (!formData.description) newErrors.description = 'Beschreibung ist erforderlich'
    if (!formData.shortDescription) newErrors.shortDescription = 'Kurzbeschreibung ist erforderlich'
    if (!formData.locationName) newErrors.locationName = 'Standortname ist erforderlich'
    if (!formData.city) newErrors.city = 'Stadt ist erforderlich'
    if (!formData.postalCode) newErrors.postalCode = 'PLZ ist erforderlich'
    if (!formData.duration || formData.duration <= 0) newErrors.duration = 'Dauer muss größer als 0 sein'
    if (!formData.retailPrice || formData.retailPrice <= 0) newErrors.retailPrice = 'Verkaufspreis muss größer als 0 sein'
    if (!formData.purchasePrice || formData.purchasePrice < 0) newErrors.purchasePrice = 'Einkaufspreis darf nicht negativ sein'
    if (formData.purchasePrice! > formData.retailPrice!) {
      newErrors.purchasePrice = 'Einkaufspreis darf nicht höher als Verkaufspreis sein'
    }
    if (!formData.partnerId) newErrors.partnerId = 'Partner ist erforderlich'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setSaving(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Fehler beim Speichern:', error)
    } finally {
      setSaving(false)
    }
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100)
  }

  const handlePriceChange = (field: 'retailPrice' | 'purchasePrice', value: string) => {
    const euros = parseFloat(value.replace(',', '.'))
    if (!isNaN(euros)) {
      setFormData({ ...formData, [field]: Math.round(euros * 100) })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {experience ? 'Erlebnis bearbeiten' : 'Neues Erlebnis erstellen'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Grunddaten */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Grunddaten</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titel *
                  </label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL) *
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow ${
                      errors.slug ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kurzbeschreibung *
                  </label>
                  <input
                    type="text"
                    value={formData.shortDescription || ''}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow ${
                      errors.shortDescription ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription}</p>}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vollständige Beschreibung *
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>
              </div>
            </div>

            {/* Preisgestaltung */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Preisgestaltung</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verkaufspreis (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={(formData.retailPrice || 0) / 100}
                    onChange={(e) => handlePriceChange('retailPrice', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow ${
                      errors.retailPrice ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.retailPrice && <p className="text-red-500 text-xs mt-1">{errors.retailPrice}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Einkaufspreis (€) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={(formData.purchasePrice || 0) / 100}
                    onChange={(e) => handlePriceChange('purchasePrice', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow ${
                      errors.purchasePrice ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.purchasePrice && <p className="text-red-500 text-xs mt-1">{errors.purchasePrice}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Provision
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-green-600 font-medium">
                    {formatPrice((formData.retailPrice || 0) - (formData.purchasePrice || 0))}
                  </div>
                </div>
              </div>
            </div>

            {/* Kategorisierung */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Kategorisierung</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partner *
                  </label>
                  <select
                    value={formData.partnerId || ''}
                    onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow ${
                      errors.partnerId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Bitte wählen</option>
                    {partners.map((partner) => (
                      <option key={partner.id} value={partner.id}>
                        {partner.companyName}
                      </option>
                    ))}
                  </select>
                  {errors.partnerId && <p className="text-red-500 text-xs mt-1">{errors.partnerId}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategorie
                  </label>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  >
                    <option value="">Keine Kategorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Suchbegriffe (kommagetrennt)
                  </label>
                  <input
                    type="text"
                    value={formData.searchKeywords || ''}
                    onChange={(e) => setFormData({ ...formData, searchKeywords: e.target.value })}
                    placeholder="z.B. abenteuer, outdoor, familie"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  />
                </div>
              </div>
            </div>

            {/* Standort */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Standort</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Standortname *
                  </label>
                  <input
                    type="text"
                    value={formData.locationName || ''}
                    onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow ${
                      errors.locationName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.locationName && <p className="text-red-500 text-xs mt-1">{errors.locationName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Straße
                  </label>
                  <input
                    type="text"
                    value={formData.street || ''}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PLZ *
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode || ''}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stadt *
                  </label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Breitengrad
                  </label>
                  <input
                    type="number"
                    step="0.00000001"
                    value={formData.latitude || ''}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Längengrad
                  </label>
                  <input
                    type="number"
                    step="0.00000001"
                    value={formData.longitude || ''}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  />
                </div>
              </div>
            </div>

            {/* Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dauer (Minuten) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow ${
                      errors.duration ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max. Teilnehmerzahl
                  </label>
                  <input
                    type="number"
                    value={formData.maxParticipants || ''}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  />
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive || false}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded text-eventhour-yellow focus:ring-eventhour-yellow"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Erlebnis ist aktiv
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saving}
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                leftIcon={saving ? Loader2 : Save}
              >
                {saving ? 'Speichern...' : 'Speichern'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}