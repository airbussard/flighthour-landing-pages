'use client'

import { useState, useEffect } from 'react'
import {
  Button,
  Container,
  Section,
  Grid,
  Card,
  AnimatedSection,
  AnimatedList,
  CounterAnimation,
} from '@eventhour/ui'
import { Gift, Shield, Clock, ArrowRight, Star, TrendingUp, MapPin } from 'lucide-react'
import Link from 'next/link'

interface Experience {
  id: string
  title: string
  slug: string
  location: string
  price: number
  priceFormatted: string
  image: string
  imageAlt: string
  rating: number
  reviews: number
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  count: number
}

export default function HomePage() {
  const [popularExperiences, setPopularExperiences] = useState<Experience[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch popular experiences
    const fetchPopularExperiences = async () => {
      try {
        const response = await fetch('/api/experiences/popular?limit=4')
        const data = await response.json()
        setPopularExperiences(data.experiences || [])
      } catch (error) {
        console.error('Failed to fetch popular experiences:', error)
      }
    }

    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        const data = await response.json()
        setCategories(data.categories || [])
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularExperiences()
    fetchCategories()
  }, [])

  return (
    <>
      {/* Hero Section */}
      <Section className="relative bg-gradient-to-br from-eventhour-yellow via-yellow-400 to-yellow-300 overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <Container className="relative py-20 lg:py-32">
          <AnimatedSection animation="fadeIn">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl lg:text-7xl font-black text-eventhour-black mb-6">
                <span className="block">Schenke</span>
                <span className="text-gray-800">unvergessliche Momente</span>
              </h1>
              <p className="text-xl lg:text-2xl text-gray-800 mb-8">
                Über 1000 Erlebnisse in ganz Deutschland. Das perfekte Geschenk für jeden Anlass.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/suche">
                  <Button variant="secondary" size="lg" rightIcon={ArrowRight}>
                    Erlebnisse entdecken
                  </Button>
                </Link>
                <Link href="/wertgutschein">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
                  >
                    Wertgutschein kaufen
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section className="py-12 bg-gray-50">
        <Container>
          <Grid cols={4} gap="lg">
            <AnimatedSection animation="slideUp" delay={0}>
              <div className="text-center">
                <h3 className="text-4xl font-bold text-eventhour-yellow mb-2">
                  <CounterAnimation to={1000} suffix="+" />
                </h3>
                <p className="text-gray-600">Erlebnisse</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slideUp" delay={0.1}>
              <div className="text-center">
                <h3 className="text-4xl font-bold text-eventhour-yellow mb-2">
                  <CounterAnimation to={500} suffix="+" />
                </h3>
                <p className="text-gray-600">Partner</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slideUp" delay={0.2}>
              <div className="text-center">
                <h3 className="text-4xl font-bold text-eventhour-yellow mb-2">
                  <CounterAnimation to={50000} suffix="+" />
                </h3>
                <p className="text-gray-600">Glückliche Kunden</p>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="slideUp" delay={0.3}>
              <div className="text-center">
                <h3 className="text-4xl font-bold text-eventhour-yellow mb-2">
                  <CounterAnimation to={4.8} suffix="" />
                  <Star className="inline w-6 h-6 ml-1 fill-eventhour-yellow text-eventhour-yellow" />
                </h3>
                <p className="text-gray-600">Bewertung</p>
              </div>
            </AnimatedSection>
          </Grid>
        </Container>
      </Section>

      {/* Categories Section */}
      <Section className="py-20">
        <Container>
          <AnimatedSection animation="fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Entdecke unsere Kategorien</h2>
              <p className="text-xl text-gray-600">
                Finde das perfekte Erlebnis für jeden Geschmack
              </p>
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl p-6 h-32"></div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatedList animation="slideUp">
              <Grid cols={6} gap="md">
                {categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    href={`/suche?category=${category.slug}`}
                    className="group"
                  >
                    <Card className="text-center p-6 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="text-4xl mb-3">{category.icon}</div>
                      <h3 className="font-semibold text-sm mb-1 group-hover:text-eventhour-yellow transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-500">{category.count} Erlebnisse</p>
                    </Card>
                  </Link>
                ))}
              </Grid>
            </AnimatedList>
          )}
        </Container>
      </Section>

      {/* Popular Experiences Section */}
      <Section className="py-20 bg-gray-50">
        <Container>
          <AnimatedSection animation="fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Beliebte Erlebnisse</h2>
              <p className="text-xl text-gray-600">
                Die Favoriten unserer Kunden
              </p>
            </div>
          </AnimatedSection>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-xl h-80"></div>
                </div>
              ))}
            </div>
          ) : (
            <AnimatedList animation="slideUp">
              <Grid cols={4} gap="lg">
                {popularExperiences.map((experience) => (
                  <Link
                    key={experience.id}
                    href={`/erlebnis/${experience.slug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                        {experience.image && (
                          <img
                            src={experience.image}
                            alt={experience.imageAlt}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.src = '/images/experiences/default.jpg'
                            }}
                          />
                        )}
                        <div className="absolute bottom-4 left-4 z-20">
                          <div className="flex items-center gap-1 text-white mb-1">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{experience.location}</span>
                          </div>
                          <p className="text-2xl font-bold text-white">
                            {experience.priceFormatted}
                          </p>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg mb-2 group-hover:text-eventhour-yellow transition-colors">
                          {experience.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(experience.rating)
                                    ? 'fill-eventhour-yellow text-eventhour-yellow'
                                    : 'fill-gray-200 text-gray-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {experience.rating.toFixed(1)} ({experience.reviews})
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </Grid>
            </AnimatedList>
          )}

          <AnimatedSection animation="fadeIn" delay={0.5}>
            <div className="text-center mt-12">
              <Link href="/suche">
                <Button variant="outline" rightIcon={ArrowRight}>
                  Alle Erlebnisse entdecken
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </Container>
      </Section>

      {/* How it Works Section */}
      <Section className="py-20">
        <Container>
          <AnimatedSection animation="fadeIn">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">So einfach geht&apos;s</h2>
              <p className="text-xl text-gray-600">
                In nur drei Schritten zum perfekten Geschenk
              </p>
            </div>
          </AnimatedSection>

          <AnimatedList animation="slideUp">
            <Grid cols={3} gap="lg">
              <Card className="text-center p-8">
                <div className="w-16 h-16 bg-eventhour-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">1. Erlebnis wählen</h3>
                <p className="text-gray-600">
                  Stöbern Sie durch unser vielfältiges Angebot und finden Sie das passende Erlebnis
                </p>
              </Card>

              <Card className="text-center p-8">
                <div className="w-16 h-16 bg-eventhour-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">2. Sicher bezahlen</h3>
                <p className="text-gray-600">
                  Bezahlen Sie bequem und sicher mit Ihrer bevorzugten Zahlungsmethode
                </p>
              </Card>

              <Card className="text-center p-8">
                <div className="w-16 h-16 bg-eventhour-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl mb-3">3. Gutschein erhalten</h3>
                <p className="text-gray-600">
                  Erhalten Sie den Gutschein sofort per E-Mail oder als hochwertige Geschenkbox
                </p>
              </Card>
            </Grid>
          </AnimatedList>
        </Container>
      </Section>

      {/* Trust Section */}
      <Section className="py-20 bg-eventhour-yellow">
        <Container>
          <AnimatedSection animation="fadeIn">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4 text-eventhour-black">
                Bereit für unvergessliche Momente?
              </h2>
              <p className="text-xl text-gray-800 mb-8">
                Finden Sie jetzt das perfekte Erlebnis-Geschenk
              </p>
              <Link href="/suche">
                <Button variant="secondary" size="lg" rightIcon={ArrowRight}>
                  Jetzt Erlebnisse entdecken
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </Container>
      </Section>
    </>
  )
}