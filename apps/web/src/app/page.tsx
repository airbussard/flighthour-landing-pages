'use client'

import { 
  Button, 
  Container, 
  Section, 
  Grid, 
  Card, 
  AnimatedSection,
  AnimatedList,
  CounterAnimation 
} from '@eventhour/ui'
import { Gift, Shield, Clock, ArrowRight, Star, TrendingUp, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const popularExperiences = [
    {
      id: 1,
      title: 'Tandem Fallschirmsprung',
      location: 'Berlin',
      price: '249€',
      image: '/images/experiences/skydiving.jpg',
      rating: 4.9,
      reviews: 127,
    },
    {
      id: 2,
      title: 'Wellness-Wochenende Deluxe',
      location: 'Brandenburg',
      price: '599€',
      image: '/images/experiences/spa.jpg',
      rating: 4.8,
      reviews: 89,
    },
    {
      id: 3,
      title: 'Sushi-Kochkurs',
      location: 'Berlin',
      price: '89€',
      image: '/images/experiences/sushi.jpg',
      rating: 5.0,
      reviews: 203,
    },
    {
      id: 4,
      title: 'Stand-Up Paddling Kurs',
      location: 'Wannsee',
      price: '49€',
      image: '/images/experiences/sup.jpg',
      rating: 4.7,
      reviews: 156,
    },
  ]

  const categories = [
    { name: 'Abenteuer & Action', icon: '🪂', count: 234 },
    { name: 'Wellness & Entspannung', icon: '🧘', count: 156 },
    { name: 'Kulinarik & Genuss', icon: '🍷', count: 189 },
    { name: 'Sport & Fitness', icon: '⚽', count: 267 },
    { name: 'Kultur & Kreatives', icon: '🎨', count: 123 },
    { name: 'Reisen & Kurztrips', icon: '✈️', count: 98 },
  ]

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
                Über 1000 Erlebnisse in ganz Deutschland. 
                Das perfekte Geschenk für jeden Anlass.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/erlebnisse">
                  <Button variant="secondary" size="lg" rightIcon={ArrowRight}>
                    Erlebnisse entdecken
                  </Button>
                </Link>
                <Link href="/wertgutschein">
                  <Button variant="outline" size="lg" className="bg-white border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white">
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
              <p className="text-xl text-gray-600">Finde das perfekte Erlebnis für jeden Geschmack</p>
            </div>
          </AnimatedSection>
          
          <AnimatedList animation="slideUp" staggerDelay={0.1}>
            <Grid cols={3} gap="lg">
              {categories.map((category) => (
                <Link key={category.name} href={`/kategorien/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}>
                  <Card hoverable className="text-center cursor-pointer group">
                    <div className="text-5xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-eventhour-yellow transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">{category.count} Erlebnisse</p>
                  </Card>
                </Link>
              ))}
            </Grid>
          </AnimatedList>
        </Container>
      </Section>

      {/* Popular Experiences */}
      <Section className="py-20 bg-gray-50">
        <Container>
          <AnimatedSection animation="fadeIn">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-2">Beliebte Erlebnisse</h2>
                <p className="text-xl text-gray-600">Die Favoriten unserer Kunden</p>
              </div>
              <Link href="/erlebnisse?sort=popular">
                <Button variant="outline" rightIcon={ArrowRight}>
                  Alle anzeigen
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          <AnimatedList animation="slideUp" staggerDelay={0.15}>
            <Grid cols={4} gap="lg">
              {popularExperiences.map((experience) => (
                <Link key={experience.id} href={`/erlebnisse/${experience.id}`}>
                  <Card hoverable padding="none" className="overflow-hidden group cursor-pointer">
                    <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
                      <div className="absolute top-4 right-4 bg-eventhour-yellow text-eventhour-black px-3 py-1 rounded-full font-semibold z-20">
                        {experience.price}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-eventhour-yellow transition-colors">
                        {experience.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        {experience.location}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-eventhour-yellow text-eventhour-yellow" />
                          <span className="ml-1 text-sm font-medium">{experience.rating}</span>
                          <span className="ml-1 text-sm text-gray-500">({experience.reviews})</span>
                        </div>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </Grid>
          </AnimatedList>
        </Container>
      </Section>

      {/* Features Section */}
      <Section className="py-20">
        <Container>
          <AnimatedSection animation="fadeIn">
            <h2 className="text-center text-4xl font-bold mb-12">Warum Eventhour?</h2>
          </AnimatedSection>
          <AnimatedList animation="slideUp" staggerDelay={0.2}>
            <Grid cols={3} gap="lg">
              <Card className="text-center">
                <div className="w-16 h-16 bg-eventhour-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Große Auswahl</h3>
                <p className="text-gray-600">Über 1000 Erlebnisse in ganz Deutschland für jeden Geschmack</p>
              </Card>
              <Card className="text-center">
                <div className="w-16 h-16 bg-eventhour-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Einfach & Sicher</h3>
                <p className="text-gray-600">Sichere Zahlung und sofortige digitale Gutschein-Lieferung</p>
              </Card>
              <Card className="text-center">
                <div className="w-16 h-16 bg-eventhour-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3 Jahre Gültigkeit</h3>
                <p className="text-gray-600">Flexible Einlösung und kostenlose Umbuchung möglich</p>
              </Card>
            </Grid>
          </AnimatedList>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <Container>
          <AnimatedSection animation="scale">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold mb-6">Bereit für dein nächstes Abenteuer?</h2>
              <p className="text-xl mb-8 text-gray-300">
                Starte jetzt und entdecke Erlebnisse, die in Erinnerung bleiben. 
                Perfekt als Geschenk oder für dich selbst.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/erlebnisse">
                  <Button variant="primary" size="lg">
                    Jetzt Erlebnisse entdecken
                  </Button>
                </Link>
                <Link href="/kontakt">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                    Beratung anfordern
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </Section>
    </>
  )
}