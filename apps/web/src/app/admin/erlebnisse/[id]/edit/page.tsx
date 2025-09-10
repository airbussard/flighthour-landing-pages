'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@eventhour/ui'
import ImageUpload from './ImageUpload'

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
  images?: Array<{
    id: string
    filename: string
    altText?: string
    sortOrder?: number
  }>
}

interface Category {
  id: string
  name: string
}

interface Partner {
  id: string
  companyName: string
}

export default function ExperienceEditPage() {
  const params = useParams()
  const router = useRouter()
  const experienceId = params?.id as string
  const isNew = experienceId === 'new'

  const [experience, setExperience] = useState<Partial<Experience>>({})
  const [categories, setCategories] = useState<Category[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load categories and partners
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/admin/partners').then(res => res.json())
    ]).then(([catData, partnerData]) => {
      setCategories(catData.categories || [])
      setPartners(partnerData.data || [])
    })

    // Load experience if editing
    if (!isNew) {
      fetch(`/api/admin/experiences?id=${experienceId}`)
        .then(res => res.json())
        .then(data => {
          if (data.data && data.data[0]) {
            setExperience(data.data[0])
          }
        })
        .finally(() => setLoading(false))
    } else {
      // Initialize new experience
      setExperience({
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
  }, [experienceId, isNew])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!experience.title) newErrors.title = 'Titel ist erforderlich'
    if (!experience.slug) newErrors.slug = 'Slug ist erforderlich'
    if (!experience.description) newErrors.description = 'Beschreibung ist erforderlich'
    if (!experience.shortDescription) newErrors.shortDescription = 'Kurzbeschreibung ist erforderlich'
    if (!experience.locationName) newErrors.locationName = 'Standortname ist erforderlich'
    if (!experience.city) newErrors.city = 'Stadt ist erforderlich'
    if (!experience.postalCode) newErrors.postalCode = 'PLZ ist erforderlich'
    if (!experience.duration || experience.duration <= 0) newErrors.duration = 'Dauer muss größer als 0 sein'
    if (!experience.retailPrice || experience.retailPrice <= 0) newErrors.retailPrice = 'Verkaufspreis muss größer als 0 sein'
    if (!experience.purchasePrice || experience.purchasePrice < 0) newErrors.purchasePrice = 'Einkaufspreis darf nicht negativ sein'
    if (experience.purchasePrice! > experience.retailPrice!) {
      newErrors.purchasePrice = 'Einkaufspreis darf nicht höher als Verkaufspreis sein'
    }
    if (!experience.partnerId) newErrors.partnerId = 'Partner ist erforderlich'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setSaving(true)
    try {
      const url = isNew 
        ? '/api/admin/experiences'
        : `/api/admin/experiences/${experienceId}`
      
      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experience),
      })

      if (response.ok) {
        router.push('/admin/erlebnisse')
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Fehler beim Speichern')
      }
    } catch (error: any) {
      alert(error.message || 'Fehler beim Speichern')
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
      setExperience({ ...experience, [field]: Math.round(euros * 100) })
    }
  }

  const handleImagesChange = (images: any[]) => {
    setExperience({ ...experience, images })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eventhour-yellow mx-auto mb-4"></div>
          <p>Lade Erlebnis...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/erlebnisse" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4" />
          Zurück zur Übersicht
        </Link>
        <h1 className="text-3xl font-bold">
          {isNew ? 'Neues Erlebnis erstellen' : 'Erlebnis bearbeiten'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Bilder */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Bilder</h2>
          <ImageUpload
            experienceId={experienceId}
            images={experience.images || []}
            onImagesChange={handleImagesChange}
          />
          {isNew && (
            <p className="text-sm text-gray-500 mt-2">
              Bilder können nach dem Erstellen des Erlebnisses hochgeladen werden.
            </p>
          )}
        </div>

        {/* Grunddaten */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Grunddaten</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titel *
              </label>
              <input
                type="text"
                value={experience.title || ''}
                onChange={(e) => setExperience({ ...experience, title: e.target.value })}
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
                value={experience.slug || ''}
                onChange={(e) => setExperience({ ...experience, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow ${
                  errors.slug ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kurzbeschreibung *
              </label>
              <input
                type="text"
                value={experience.shortDescription || ''}
                onChange={(e) => setExperience({ ...experience, shortDescription: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow ${
                  errors.shortDescription ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{errors.shortDescription}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vollständige Beschreibung *
              </label>
              <textarea
                value={experience.description || ''}
                onChange={(e) => setExperience({ ...experience, description: e.target.value })}
                rows={6}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>

        {/* Preisgestaltung */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Preisgestaltung</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verkaufspreis (€) *
              </label>
              <input
                type="number"
                step="0.01"
                value={(experience.retailPrice || 0) / 100}
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
                value={(experience.purchasePrice || 0) / 100}
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
                {formatPrice((experience.retailPrice || 0) - (experience.purchasePrice || 0))}
              </div>
            </div>
          </div>
        </div>

        {/* Kategorisierung */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Kategorisierung</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Partner *
              </label>
              <select
                value={experience.partnerId || ''}
                onChange={(e) => setExperience({ ...experience, partnerId: e.target.value })}
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
                value={experience.categoryId || ''}
                onChange={(e) => setExperience({ ...experience, categoryId: e.target.value })}
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Suchbegriffe (kommagetrennt)
              </label>
              <input
                type="text"
                value={experience.searchKeywords || ''}
                onChange={(e) => setExperience({ ...experience, searchKeywords: e.target.value })}
                placeholder="z.B. abenteuer, outdoor, familie"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
              />
            </div>
          </div>
        </div>

        {/* Standort */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Standort</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Standortname *
              </label>
              <input
                type="text"
                value={experience.locationName || ''}
                onChange={(e) => setExperience({ ...experience, locationName: e.target.value })}
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
                value={experience.street || ''}
                onChange={(e) => setExperience({ ...experience, street: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PLZ *
              </label>
              <input
                type="text"
                value={experience.postalCode || ''}
                onChange={(e) => setExperience({ ...experience, postalCode: e.target.value })}
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
                value={experience.city || ''}
                onChange={(e) => setExperience({ ...experience, city: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dauer (Minuten) *
              </label>
              <input
                type="number"
                value={experience.duration || ''}
                onChange={(e) => setExperience({ ...experience, duration: parseInt(e.target.value) || 0 })}
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
                value={experience.maxParticipants || ''}
                onChange={(e) => setExperience({ ...experience, maxParticipants: parseInt(e.target.value) || null })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={experience.isActive || false}
                  onChange={(e) => setExperience({ ...experience, isActive: e.target.checked })}
                  className="rounded text-eventhour-yellow focus:ring-eventhour-yellow"
                />
                <span className="text-sm font-medium text-gray-700">
                  Erlebnis ist aktiv
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Link href="/admin/erlebnisse">
            <Button variant="outline">
              Abbrechen
            </Button>
          </Link>
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
  )
}