'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  ShoppingCart,
  Calendar,
  CheckCircle,
  Info
} from 'lucide-react'
import { Button, Container, Section, Card } from '@eventhour/ui'

interface ExperienceDetail {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  locationName: string
  street?: string
  city: string
  postalCode: string
  country: string
  latitude?: number
  longitude?: number
  duration: number
  maxParticipants?: number
  retailPrice: number
  taxRate: number
  isActive: boolean
  category?: {
    id: string
    name: string
    slug: string
  }
  partner?: {
    id: string
    companyName: string
  }
  images?: Array<{
    filename: string
    altText: string
  }>
}

export default function ExperienceDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [experience, setExperience] = useState<ExperienceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchExperience = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/experiences/${slug}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Dieses Erlebnis wurde nicht gefunden.')
          } else {
            setError('Es ist ein Fehler aufgetreten.')
          }
          return
        }

        const data = await response.json()
        setExperience(data.experience)
      } catch (err) {
        console.error('Error fetching experience:', err)
        setError('Es ist ein Fehler aufgetreten.')
      } finally {
        setLoading(false)
      }
    }

    fetchExperience()
  }, [slug])

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0 && mins > 0) {
      return `${hours} Std. ${mins} Min.`
    } else if (hours > 0) {
      return `${hours} Stunde${hours > 1 ? 'n' : ''}`
    } else {
      return `${mins} Minuten`
    }
  }

  if (loading) {
    return (
      <Section className="py-20">
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eventhour-yellow mx-auto mb-4"></div>
              <p className="text-gray-600">Lade Erlebnis...</p>
            </div>
          </div>
        </Container>
      </Section>
    )
  }

  if (error || !experience) {
    return (
      <Section className="py-20">
        <Container>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Erlebnis nicht gefunden</h1>
            <p className="text-gray-600 mb-8">{error || 'Das gesuchte Erlebnis existiert nicht.'}</p>
            <Link href="/suche">
              <Button variant="primary">
                Zur Erlebnissuche
              </Button>
            </Link>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <>
      {/* Breadcrumb */}
      <Section className="py-4 bg-gray-50">
        <Container>
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-eventhour-yellow">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/suche" className="text-gray-600 hover:text-eventhour-yellow">
              Erlebnisse
            </Link>
            {experience.category && (
              <>
                <span className="text-gray-400">/</span>
                <Link 
                  href={`/suche?category=${experience.category.slug}`}
                  className="text-gray-600 hover:text-eventhour-yellow"
                >
                  {experience.category.name}
                </Link>
              </>
            )}
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{experience.title}</span>
          </nav>
        </Container>
      </Section>

      {/* Main Content */}
      <Section className="py-12">
        <Container>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Images and Description */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Image */}
              <div className="aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden">
                {experience.images && experience.images[0] ? (
                  <img
                    src={experience.images[0].filename}
                    alt={experience.images[0].altText || experience.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/experiences/default.jpg'
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <p className="text-gray-500">Kein Bild verfügbar</p>
                  </div>
                )}
              </div>

              {/* Title and Location */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">{experience.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-5 w-5" />
                    <span>{experience.city}</span>
                  </div>
                  {experience.category && (
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {experience.category.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Beschreibung</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{experience.description}</p>
                </div>
              </Card>

              {/* Details */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-eventhour-yellow mt-0.5" />
                    <div>
                      <p className="font-medium">Dauer</p>
                      <p className="text-gray-600">{formatDuration(experience.duration)}</p>
                    </div>
                  </div>
                  {experience.maxParticipants && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-eventhour-yellow mt-0.5" />
                      <div>
                        <p className="font-medium">Teilnehmer</p>
                        <p className="text-gray-600">Max. {experience.maxParticipants} Personen</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-eventhour-yellow mt-0.5" />
                    <div>
                      <p className="font-medium">Standort</p>
                      <p className="text-gray-600">
                        {experience.locationName}<br />
                        {experience.street && `${experience.street}, `}
                        {experience.postalCode} {experience.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-eventhour-yellow mt-0.5" />
                    <div>
                      <p className="font-medium">Anbieter</p>
                      <p className="text-gray-600">{experience.partner?.companyName || 'EventHour Partner'}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Included Services */}
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Im Preis enthalten</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Professionelle Betreuung</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Alle benötigten Materialien</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Einweisung und Sicherheitsbriefing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Erinnerungsfoto oder -video</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:sticky lg:top-4 space-y-4">
              <Card className="p-6">
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-1">Ab</p>
                  <p className="text-3xl font-bold text-eventhour-yellow">
                    {formatPrice(experience.retailPrice)}
                  </p>
                  <p className="text-sm text-gray-600">pro Person</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < 4 ? 'fill-eventhour-yellow text-eventhour-yellow' : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.5 (23 Bewertungen)</span>
                </div>

                {/* Booking Options */}
                <div className="space-y-3 mb-6">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    leftIcon={ShoppingCart}
                  >
                    In den Warenkorb
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    leftIcon={Calendar}
                  >
                    Als Gutschein verschenken
                  </Button>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ Sofort verfügbar</p>
                  <p>✓ 3 Jahre gültig</p>
                  <p>✓ Kostenlose Stornierung bis 48h vorher</p>
                </div>
              </Card>

              {/* Contact Card */}
              <Card className="p-4">
                <p className="font-medium mb-2">Fragen zum Erlebnis?</p>
                <p className="text-sm text-gray-600 mb-3">
                  Unser Kundenservice hilft Ihnen gerne weiter.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Kontakt aufnehmen
                </Button>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Similar Experiences */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <h2 className="text-2xl font-bold mb-6">Ähnliche Erlebnisse</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Placeholder for similar experiences */}
            <p className="text-gray-600 col-span-full">Weitere Erlebnisse werden geladen...</p>
          </div>
        </Container>
      </Section>
    </>
  )
}