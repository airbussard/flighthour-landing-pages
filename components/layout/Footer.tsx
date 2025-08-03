import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-flighthour-black text-white py-8 md:py-12">
      <div className="container-section">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <h3 className="text-lg md:text-xl font-avant-garde font-bold mb-3 md:mb-4">
              <span className="text-white">FLIGHT</span>
              <span className="text-flighthour-yellow">HOUR</span>
            </h3>
            <p className="text-gray-300 text-sm">
              Das unvergessliche Flugerlebnis im professionellen Flugsimulator.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Geschenkideen</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="#pakete" className="hover:text-flighthour-yellow transition-colors">
                  Geschenkpakete
                </Link>
              </li>
              <li>
                <Link
                  href="#zielgruppen"
                  className="hover:text-flighthour-yellow transition-colors"
                >
                  Für Jung und Alt
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonials"
                  className="hover:text-flighthour-yellow transition-colors"
                >
                  Erfahrungen
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Flighthour</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a
                  href="https://flighthour.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-flighthour-yellow transition-colors"
                >
                  Hauptseite
                </a>
              </li>
              <li>
                <a
                  href="https://flighthour.de/flugsimulator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-flighthour-yellow transition-colors"
                >
                  Flugsimulator
                </a>
              </li>
              <li>
                <a
                  href="https://flighthour.de/kontakt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-flighthour-yellow transition-colors"
                >
                  Kontakt
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Rechtliches</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a
                  href="https://flighthour.de/pages/impressum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-flighthour-yellow transition-colors"
                >
                  Impressum
                </a>
              </li>
              <li>
                <a
                  href="https://flighthour.de/pages/agb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-flighthour-yellow transition-colors"
                >
                  AGB
                </a>
              </li>
              <li>
                <a
                  href="https://flighthour.de/pages/datenschutz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-flighthour-yellow transition-colors"
                >
                  Datenschutzerklärung
                </a>
              </li>
              <li>
                <a
                  href="https://flighthour.de/pages/cookies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-flighthour-yellow transition-colors"
                >
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© {currentYear} Flighthour. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  )
}
