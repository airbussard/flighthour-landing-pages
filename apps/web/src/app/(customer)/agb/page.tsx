import { Container, Section } from '@eventhour/ui'
import { FileText } from 'lucide-react'

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <Section className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-eventhour-yellow/10 rounded-xl">
                <FileText className="h-8 w-8 text-eventhour-yellow" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Allgemeine Geschäftsbedingungen</h1>
                <p className="text-gray-600 mt-1">Gültig ab: Januar 2025</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">§ 1 Geltungsbereich</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend &quot;AGB&quot;) gelten für alle über unsere 
                  Internetseite www.eventhour.de geschlossenen Verträge zwischen uns, der Eventhour GmbH, 
                  und unseren Kunden.
                </p>
                <p>
                  (2) Verbraucher im Sinne dieser AGB ist jede natürliche Person, die ein Rechtsgeschäft zu 
                  Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen 
                  beruflichen Tätigkeit zugerechnet werden können.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">§ 2 Vertragsschluss</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  (1) Die Darstellung der Erlebnisse in unserem Online-Shop stellt kein rechtlich bindendes 
                  Angebot, sondern eine Aufforderung zur Bestellung dar.
                </p>
                <p>
                  (2) Durch Anklicken des Buttons &quot;Zahlungspflichtig bestellen&quot; geben Sie eine verbindliche 
                  Bestellung der im Warenkorb enthaltenen Waren ab.
                </p>
                <p>
                  (3) Die Bestätigung des Eingangs der Bestellung erfolgt unmittelbar nach dem Absenden der 
                  Bestellung. Diese automatische Empfangsbestätigung dokumentiert lediglich, dass die Bestellung 
                  bei uns eingegangen ist und stellt keine Annahme des Antrags dar.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">§ 3 Widerrufsrecht</h2>
              <div className="bg-eventhour-yellow/5 border-l-4 border-eventhour-yellow p-4 rounded">
                <p className="font-semibold mb-3">Widerrufsbelehrung</p>
                <p className="text-gray-700 mb-3">
                  Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. 
                  Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses.
                </p>
                <p className="text-gray-700">
                  Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung 
                  (z.B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag 
                  zu widerrufen, informieren.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">§ 4 Preise und Zahlung</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  (1) Die angegebenen Preise sind Endpreise und enthalten die gesetzliche Mehrwertsteuer.
                </p>
                <p>
                  (2) Die Zahlung erfolgt wahlweise per:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Kreditkarte (Visa, Mastercard)</li>
                  <li>PayPal</li>
                  <li>Klarna</li>
                  <li>SEPA-Lastschrift</li>
                  <li>Sofortüberweisung</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">§ 5 Gutscheine</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  (1) Erlebnisgutscheine sind 3 Jahre ab Ausstellungsdatum gültig.
                </p>
                <p>
                  (2) Eine Barauszahlung von Gutscheinen ist ausgeschlossen.
                </p>
                <p>
                  (3) Gutscheine können nur vor Abschluss des Bestellvorgangs eingelöst werden.
                </p>
                <p>
                  (4) Pro Bestellung kann nur ein Gutschein eingelöst werden.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">§ 6 Lieferung</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  (1) Die Lieferung der Gutscheine erfolgt per E-Mail als PDF-Dokument.
                </p>
                <p>
                  (2) Optional kann eine hochwertige Geschenkbox per Post versendet werden.
                </p>
                <p>
                  (3) Die Lieferzeit beträgt bei digitaler Zustellung sofort nach Zahlungseingang, 
                  bei postalischem Versand 2-5 Werktage.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">§ 7 Haftung</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  (1) Wir haften unbeschränkt für Vorsatz und grobe Fahrlässigkeit.
                </p>
                <p>
                  (2) Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten ist unsere Haftung 
                  auf den vorhersehbaren, vertragstypischen Schaden begrenzt.
                </p>
                <p>
                  (3) Die vorstehenden Haftungsbeschränkungen gelten nicht bei Verletzung von Leben, Körper 
                  und Gesundheit.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">§ 8 Datenschutz</h2>
              <p className="text-gray-700">
                Die Erhebung und Verarbeitung Ihrer personenbezogenen Daten erfolgt unter Beachtung der 
                geltenden datenschutzrechtlichen Vorschriften, insbesondere der DSGVO. Nähere Informationen 
                erhalten Sie in unserer{' '}
                <a href="/datenschutz" className="text-eventhour-yellow hover:underline">
                  Datenschutzerklärung
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">§ 9 Streitbeilegung</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700 mb-3">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                </p>
                <a 
                  href="https://ec.europa.eu/consumers/odr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-eventhour-yellow hover:underline"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
                <p className="text-gray-700 mt-3">
                  Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">§ 10 Schlussbestimmungen</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
                </p>
                <p>
                  (2) Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder 
                  öffentlich-rechtliches Sondervermögen, ist ausschließlicher Gerichtsstand für alle 
                  Streitigkeiten aus diesem Vertrag unser Geschäftssitz.
                </p>
                <p>
                  (3) Sollten einzelne Bestimmungen dieses Vertrages unwirksam sein oder werden, so wird 
                  hierdurch die Gültigkeit der übrigen Bestimmungen nicht berührt.
                </p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Stand: Januar 2025 • Version 1.0
              </p>
            </div>
          </div>
        </Section>
      </Container>
    </div>
  )
}