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
import { Gift, Shield, Clock, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <Section variant="yellow" padding="xl">
        <Container>
          <AnimatedSection animation="fadeIn">
            <div className="text-center">
              <h1 className="text-eventhour-black mb-6">
                Willkommen bei Eventhour
              </h1>
              <p className="text-xl md:text-2xl text-eventhour-black/80 mb-8 max-w-3xl mx-auto">
                Entdecke unvergessliche Erlebnisse und finde das perfekte Geschenk für jeden Anlass
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" rightIcon={ArrowRight}>
                  Erlebnisse entdecken
                </Button>
                <Button variant="outline" size="lg" className="bg-white">
                  Wertgutschein kaufen
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section variant="default" padding="md">
        <Container>
          <Grid cols={3} gap="lg">
            <AnimatedSection animation="slideUp" delay={0}>
              <div className="text-center">
                <h3 className="text-4xl font-bold text-eventhour-yellow mb-2">
                  <CounterAnimation to={1000} suffix="+" />
                </h3>
                <p className="text-gray-600">Erlebnisse</p>
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
            <AnimatedSection animation="slideUp" delay={0.4}>
              <div className="text-center">
                <h3 className="text-4xl font-bold text-eventhour-yellow mb-2">
                  <CounterAnimation to={100} suffix="%" />
                </h3>
                <p className="text-gray-600">Zufriedenheit</p>
              </div>
            </AnimatedSection>
          </Grid>
        </Container>
      </Section>

      {/* Features Section */}
      <Section variant="gray" padding="lg">
        <Container>
          <AnimatedSection animation="fadeIn">
            <h2 className="text-center mb-12">Warum Eventhour?</h2>
          </AnimatedSection>
          <AnimatedList animation="slideUp" staggerDelay={0.2}>
            <Grid cols={3} gap="lg">
              <Card hoverable className="text-center">
                <div className="w-16 h-16 bg-eventhour-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-2">Große Auswahl</h3>
                <p className="text-gray-600">Über 1000 Erlebnisse in ganz Deutschland</p>
              </Card>
              <Card hoverable className="text-center">
                <div className="w-16 h-16 bg-eventhour-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-2">Einfach & Sicher</h3>
                <p className="text-gray-600">Sichere Zahlung und sofortige Gutschein-Lieferung</p>
              </Card>
              <Card hoverable className="text-center">
                <div className="w-16 h-16 bg-eventhour-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-2">Flexibel</h3>
                <p className="text-gray-600">3 Jahre Gültigkeit und kostenlose Umbuchung</p>
              </Card>
            </Grid>
          </AnimatedList>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section variant="black" padding="lg">
        <Container>
          <AnimatedSection animation="scale">
            <div className="text-center">
              <h2 className="mb-6">Bereit für dein nächstes Abenteuer?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Starte jetzt und entdecke Erlebnisse, die in Erinnerung bleiben
              </p>
              <Button variant="primary" size="lg">
                Jetzt starten
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </Section>
    </main>
  )
}