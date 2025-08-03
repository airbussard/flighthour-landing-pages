import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-flighthour-black text-white py-12 mt-20">
      <div className="container-section">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-avant-garde font-bold mb-4">
              <span className="text-white">FLIGHT</span>
              <span className="text-flighthour-yellow">HOUR</span>
            </h3>
            <p className="text-gray-300 text-sm">
              Das unvergessliche Flugerlebnis im professionellen Flugsimulator.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Geschenkideen</h4>
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
            <h4 className="font-semibold mb-4">Flighthour</h4>
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
            <h4 className="font-semibold mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a
                  href="https://flighthour.de/impressum"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-flighthour-yellow transition-colors"
                >
                  Impressum
                </a>
              </li>
              <li>
                <a
                  href="https://flighthour.de/agb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-flighthour-yellow transition-colors"
                >
                  AGB
                </a>
              </li>
              <li>
                <a
                  href="https://flighthour.de/datenschutz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-flighthour-yellow transition-colors"
                >
                  Datenschutz
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
