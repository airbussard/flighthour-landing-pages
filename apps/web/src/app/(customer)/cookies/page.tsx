'use client'

import { Container, Section } from '@eventhour/ui'
import { Cookie, Shield, BarChart3, Megaphone, Settings } from 'lucide-react'
import { COOKIE_CATEGORIES } from '@eventhour/consent'

const categoryIcons = {
  necessary: Shield,
  functional: Cookie,
  analytics: BarChart3,
  marketing: Megaphone,
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <Section className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-eventhour-yellow/10 rounded-xl">
                <Cookie className="h-8 w-8 text-eventhour-yellow" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Cookie-Richtlinie</h1>
                <p className="text-gray-600 mt-1">Informationen über unsere Cookie-Nutzung</p>
              </div>
            </div>
            
            {/* Cookie Settings Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const event = new CustomEvent('showCookieSettings')
                  window.dispatchEvent(event)
                }
              }}
              className="mt-4 px-4 py-2 bg-eventhour-yellow text-eventhour-black rounded-lg hover:bg-eventhour-yellow/90 transition-colors flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Cookie-Einstellungen anpassen
            </button>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
            {/* Einleitung */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Was sind Cookies?</h2>
              <p className="text-gray-700 mb-4">
                Cookies sind kleine Textdateien, die auf Ihrem Computer oder mobilen Gerät gespeichert werden, 
                wenn Sie unsere Website besuchen. Sie helfen uns, Ihre Präferenzen zu speichern, die Website-Leistung 
                zu verbessern und Ihnen relevante Inhalte anzuzeigen.
              </p>
              <div className="bg-eventhour-yellow/5 border-l-4 border-eventhour-yellow p-4 rounded">
                <p className="font-semibold mb-2">Ihre Kontrolle über Cookies:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Sie können Cookies jederzeit akzeptieren oder ablehnen</li>
                  <li>Sie können Ihre Einstellungen für jede Cookie-Kategorie anpassen</li>
                  <li>Notwendige Cookies können nicht deaktiviert werden</li>
                  <li>Ihre Einstellungen werden für 365 Tage gespeichert</li>
                </ul>
              </div>
            </section>

            {/* Cookie-Kategorien */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Cookie-Kategorien im Detail</h2>
              <div className="space-y-6">
                {Object.entries(COOKIE_CATEGORIES).map(([key, category]) => {
                  const Icon = categoryIcons[key as keyof typeof categoryIcons]
                  const isNecessary = key === 'necessary'
                  
                  return (
                    <div key={key} className="border rounded-xl p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <Icon className="h-6 w-6 text-eventhour-yellow" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            {category.name}
                            {isNecessary && (
                              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                Immer aktiv
                              </span>
                            )}
                          </h3>
                          <p className="text-gray-700 mt-2">{category.description}</p>
                        </div>
                      </div>

                      {/* Cookie-Liste */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700">Verwendete Cookies:</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 pr-4">Cookie-Name</th>
                                <th className="text-left py-2 pr-4">Anbieter</th>
                                <th className="text-left py-2 pr-4">Zweck</th>
                                <th className="text-left py-2">Dauer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {category.cookies.map((cookie, index) => (
                                <tr key={index} className="border-b">
                                  <td className="py-2 pr-4 font-mono text-xs">{cookie.name}</td>
                                  <td className="py-2 pr-4">{cookie.provider}</td>
                                  <td className="py-2 pr-4">{cookie.purpose}</td>
                                  <td className="py-2">{cookie.duration}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Cookie-Verwaltung */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Wie Sie Cookies verwalten können</h2>
              
              <h3 className="text-xl font-semibold mb-3">Über unsere Website</h3>
              <p className="text-gray-700 mb-4">
                Sie können Ihre Cookie-Einstellungen jederzeit über den Button &quot;Cookie-Einstellungen&quot; am 
                Ende jeder Seite oder über das Cookie-Banner beim ersten Besuch anpassen.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">Über Ihren Browser</h3>
              <p className="text-gray-700 mb-4">
                Die meisten Webbrowser erlauben eine gewisse Kontrolle über Cookies durch die Browser-Einstellungen:
              </p>
              
              <div className="space-y-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Chrome</p>
                  <p className="text-sm text-gray-600">
                    Einstellungen → Datenschutz und Sicherheit → Cookies und andere Website-Daten
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Firefox</p>
                  <p className="text-sm text-gray-600">
                    Einstellungen → Datenschutz & Sicherheit → Cookies und Website-Daten
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Safari</p>
                  <p className="text-sm text-gray-600">
                    Einstellungen → Datenschutz → Cookies und Website-Daten verwalten
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Edge</p>
                  <p className="text-sm text-gray-600">
                    Einstellungen → Datenschutz, Suche und Dienste → Cookies und Websiteberechtigungen
                  </p>
                </div>
              </div>
            </section>

            {/* Drittanbieter-Cookies */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Drittanbieter-Cookies</h2>
              <p className="text-gray-700 mb-4">
                Einige unserer Partner können Cookies auf Ihrem Gerät setzen. Diese Partner wurden sorgfältig 
                ausgewählt und verpflichtet, unsere Datenschutzstandards einzuhalten:
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-eventhour-yellow pl-4">
                  <h3 className="font-semibold mb-2">Google Analytics</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Wird für die Analyse der Website-Nutzung verwendet (nur mit Ihrer Einwilligung).
                  </p>
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-eventhour-yellow hover:underline text-sm"
                  >
                    Google Datenschutzerklärung →
                  </a>
                </div>
                
                <div className="border-l-4 border-eventhour-yellow pl-4">
                  <h3 className="font-semibold mb-2">Facebook Pixel</h3>
                  <p className="text-gray-700 text-sm mb-2">
                    Wird für Remarketing und Werbezwecke verwendet (nur mit Ihrer Einwilligung).
                  </p>
                  <a 
                    href="https://www.facebook.com/policy.php" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-eventhour-yellow hover:underline text-sm"
                  >
                    Facebook Datenschutzerklärung →
                  </a>
                </div>
              </div>
            </section>

            {/* Auswirkungen der Cookie-Ablehnung */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Was passiert, wenn Sie Cookies ablehnen?</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Sie können unsere Website auch ohne Cookies nutzen, allerdings mit einigen Einschränkungen:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span><strong>Notwendige Cookies:</strong> Grundfunktionen bleiben erhalten</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">⚠</span>
                    <span><strong>Funktionale Cookies:</strong> Warenkorb und Spracheinstellungen könnten verloren gehen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">⚠</span>
                    <span><strong>Analyse-Cookies:</strong> Wir können die Website nicht optimal verbessern</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">⚠</span>
                    <span><strong>Marketing-Cookies:</strong> Sie sehen möglicherweise weniger relevante Werbung</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Kontakt */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Fragen zu Cookies?</h2>
              <p className="text-gray-700 mb-4">
                Wenn Sie Fragen zu unserer Cookie-Richtlinie haben oder Ihre Rechte ausüben möchten, 
                kontaktieren Sie uns bitte:
              </p>
              <div className="bg-eventhour-yellow/5 border border-eventhour-yellow/20 rounded-lg p-6">
                <p className="font-semibold mb-3">Datenschutzbeauftragter</p>
                <p className="text-gray-700">
                  E-Mail: <a href="mailto:datenschutz@eventhour.de" className="text-eventhour-yellow hover:underline">
                    datenschutz@eventhour.de
                  </a><br />
                  Telefon: +49 (0) 123 456789
                </p>
              </div>
            </section>

            {/* Änderungen */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Änderungen dieser Cookie-Richtlinie</h2>
              <p className="text-gray-700">
                Wir können diese Cookie-Richtlinie von Zeit zu Zeit aktualisieren, um Änderungen in unseren 
                Praktiken oder aus anderen betrieblichen, rechtlichen oder regulatorischen Gründen widerzuspiegeln. 
                Bitte besuchen Sie diese Seite regelmäßig, um über unsere Verwendung von Cookies informiert zu bleiben.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Letzte Aktualisierung: Januar 2025 • Version 1.0
              </p>
            </section>
          </div>
        </Section>
      </Container>
    </div>
  )
}