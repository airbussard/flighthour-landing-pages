import { Container, Section } from '@eventhour/ui'
import { Shield, Mail, Phone, MapPin } from 'lucide-react'

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <Section className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-eventhour-yellow/10 rounded-xl">
                <Shield className="h-8 w-8 text-eventhour-yellow" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Datenschutzerklärung</h1>
                <p className="text-gray-600 mt-1">Stand: Januar 2025</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
            {/* Einleitung */}
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Datenschutz auf einen Blick</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Wir freuen uns über Ihr Interesse an unserem Unternehmen. Der Schutz Ihrer persönlichen Daten 
                  ist uns sehr wichtig. Nachstehend informieren wir Sie ausführlich über den Umgang mit Ihren Daten.
                </p>
                <div className="bg-eventhour-yellow/5 border-l-4 border-eventhour-yellow p-4 rounded">
                  <p className="font-semibold mb-2">Die wichtigsten Punkte:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Wir erheben nur Daten, die für die Erbringung unserer Dienste notwendig sind</li>
                    <li>Ihre Daten werden niemals ohne Ihre Einwilligung an Dritte verkauft</li>
                    <li>Sie haben jederzeit das Recht auf Auskunft, Berichtigung und Löschung</li>
                    <li>Wir verwenden modernste Sicherheitsstandards zum Schutz Ihrer Daten</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Verantwortlicher */}
            <section>
              <h2 className="text-2xl font-bold mb-4">2. Verantwortlicher</h2>
              <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                <p className="font-semibold">Eventhour GmbH</p>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p>Musterstraße 123</p>
                    <p>12345 Oberhausen</p>
                    <p>Deutschland</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <p>+49 (0) 123 456789</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <a href="mailto:datenschutz@eventhour.de" className="text-eventhour-yellow hover:underline">
                    datenschutz@eventhour.de
                  </a>
                </div>
              </div>
            </section>

            {/* Datenerfassung */}
            <section>
              <h2 className="text-2xl font-bold mb-4">3. Datenerfassung auf unserer Website</h2>
              
              <h3 className="text-xl font-semibold mb-3">3.1 Cookies</h3>
              <p className="text-gray-700 mb-4">
                Unsere Website verwendet Cookies. Dabei handelt es sich um kleine Textdateien, die Ihr Browser 
                automatisch erstellt und die auf Ihrem Endgerät gespeichert werden. Wir verwenden verschiedene 
                Arten von Cookies:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li><strong>Notwendige Cookies:</strong> Für den Betrieb der Website unerlässlich</li>
                <li><strong>Funktionale Cookies:</strong> Verbessern die Nutzererfahrung</li>
                <li><strong>Analyse-Cookies:</strong> Helfen uns, die Nutzung zu verstehen (nur mit Einwilligung)</li>
                <li><strong>Marketing-Cookies:</strong> Für personalisierte Werbung (nur mit Einwilligung)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Server-Log-Dateien</h3>
              <p className="text-gray-700 mb-4">
                Der Provider erhebt und speichert automatisch Informationen in Server-Log-Dateien:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>Browsertyp und Browserversion</li>
                <li>Verwendetes Betriebssystem</li>
                <li>Referrer URL</li>
                <li>Hostname des zugreifenden Rechners</li>
                <li>Uhrzeit der Serveranfrage</li>
                <li>IP-Adresse (anonymisiert)</li>
              </ul>
            </section>

            {/* Datenverarbeitung */}
            <section>
              <h2 className="text-2xl font-bold mb-4">4. Datenverarbeitung bei Buchungen</h2>
              <p className="text-gray-700 mb-4">
                Wenn Sie bei uns eine Erlebnisbuchung vornehmen, verarbeiten wir folgende Daten:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Kontaktdaten:</strong> Name, E-Mail-Adresse, Telefonnummer</li>
                <li><strong>Buchungsdaten:</strong> Gebuchte Erlebnisse, Termine, Teilnehmerzahl</li>
                <li><strong>Zahlungsdaten:</strong> Zahlungsart, Rechnungsadresse (keine Kreditkartendaten)</li>
                <li><strong>Kommunikationsdaten:</strong> Nachrichten und Anfragen</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Die Rechtsgrundlage für diese Verarbeitung ist Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).
              </p>
            </section>

            {/* Ihre Rechte */}
            <section>
              <h2 className="text-2xl font-bold mb-4">5. Ihre Rechte</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-eventhour-yellow pl-4">
                  <h3 className="font-semibold mb-2">Auskunftsrecht (Art. 15 DSGVO)</h3>
                  <p className="text-gray-700">
                    Sie haben das Recht, Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten zu verlangen.
                  </p>
                </div>
                <div className="border-l-4 border-eventhour-yellow pl-4">
                  <h3 className="font-semibold mb-2">Berichtigungsrecht (Art. 16 DSGVO)</h3>
                  <p className="text-gray-700">
                    Sie haben das Recht, unverzüglich die Berichtigung unrichtiger Daten zu verlangen.
                  </p>
                </div>
                <div className="border-l-4 border-eventhour-yellow pl-4">
                  <h3 className="font-semibold mb-2">Löschungsrecht (Art. 17 DSGVO)</h3>
                  <p className="text-gray-700">
                    Sie haben das Recht, die Löschung Ihrer Daten zu verlangen, sofern keine gesetzlichen 
                    Aufbewahrungspflichten entgegenstehen.
                  </p>
                </div>
                <div className="border-l-4 border-eventhour-yellow pl-4">
                  <h3 className="font-semibold mb-2">Widerspruchsrecht (Art. 21 DSGVO)</h3>
                  <p className="text-gray-700">
                    Sie haben das Recht, der Verarbeitung Ihrer Daten zu widersprechen.
                  </p>
                </div>
                <div className="border-l-4 border-eventhour-yellow pl-4">
                  <h3 className="font-semibold mb-2">Datenübertragbarkeit (Art. 20 DSGVO)</h3>
                  <p className="text-gray-700">
                    Sie haben das Recht, Ihre Daten in einem strukturierten, gängigen und maschinenlesbaren 
                    Format zu erhalten.
                  </p>
                </div>
              </div>
            </section>

            {/* Analyse-Tools */}
            <section>
              <h2 className="text-2xl font-bold mb-4">6. Analyse-Tools und Werbung</h2>
              
              <h3 className="text-xl font-semibold mb-3">6.1 Google Analytics</h3>
              <p className="text-gray-700 mb-4">
                Diese Website nutzt Google Analytics nur nach Ihrer ausdrücklichen Einwilligung. 
                Google Analytics verwendet Cookies, die eine Analyse der Benutzung der Website ermöglichen. 
                Die IP-Adresse wird dabei anonymisiert.
              </p>

              <h3 className="text-xl font-semibold mb-3">6.2 Facebook Pixel</h3>
              <p className="text-gray-700">
                Mit Ihrer Einwilligung verwenden wir das Facebook-Pixel zur Verbesserung unserer Werbemaßnahmen. 
                Sie können Ihre Einwilligung jederzeit in den Cookie-Einstellungen widerrufen.
              </p>
            </section>

            {/* Datensicherheit */}
            <section>
              <h2 className="text-2xl font-bold mb-4">7. Datensicherheit</h2>
              <p className="text-gray-700 mb-4">
                Wir verwenden innerhalb des Website-Besuchs das verbreitete SSL-Verfahren (Secure Socket Layer) 
                in Verbindung mit der jeweils höchsten Verschlüsselungsstufe, die von Ihrem Browser unterstützt wird.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">
                  <strong>🔒 Ihre Daten sind sicher!</strong> Wir verwenden modernste Verschlüsselungstechnologien 
                  und regelmäßige Sicherheitsupdates zum Schutz Ihrer persönlichen Informationen.
                </p>
              </div>
            </section>

            {/* Drittanbieter */}
            <section>
              <h2 className="text-2xl font-bold mb-4">8. Weitergabe an Dritte</h2>
              <p className="text-gray-700 mb-4">
                Eine Übermittlung Ihrer persönlichen Daten an Dritte findet nur statt, wenn:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Sie Ihre ausdrückliche Einwilligung erteilt haben</li>
                <li>Die Weitergabe zur Vertragserfüllung erforderlich ist (z.B. an Partner-Unternehmen)</li>
                <li>Eine gesetzliche Verpflichtung besteht</li>
                <li>Die Weitergabe zur Wahrung berechtigter Interessen zulässig ist</li>
              </ul>
            </section>

            {/* Kontakt */}
            <section>
              <h2 className="text-2xl font-bold mb-4">9. Kontakt zum Datenschutzbeauftragten</h2>
              <div className="bg-eventhour-yellow/5 border border-eventhour-yellow/20 rounded-lg p-6">
                <p className="font-semibold mb-3">Bei Fragen zum Datenschutz erreichen Sie uns unter:</p>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-eventhour-yellow" />
                    <a href="mailto:datenschutz@eventhour.de" className="text-eventhour-yellow hover:underline">
                      datenschutz@eventhour.de
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-eventhour-yellow" />
                    <span>+49 (0) 123 456789</span>
                  </p>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Sie haben auch das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung 
                  Ihrer personenbezogenen Daten durch uns zu beschweren.
                </p>
              </div>
            </section>

            {/* Änderungen */}
            <section>
              <h2 className="text-2xl font-bold mb-4">10. Änderungen dieser Datenschutzerklärung</h2>
              <p className="text-gray-700">
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen 
                rechtlichen Anforderungen entspricht. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
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