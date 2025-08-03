'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSeminareOpen, setIsSeminareOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSeminareOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white shadow-md"
    >
      <div className="container-section py-3 md:py-4">
        <nav className="flex items-center justify-between">
          <Link
            href="https://flighthour.de"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 md:space-x-2"
          >
            <span className="text-xl md:text-2xl font-avant-garde font-bold">
              <span className="text-flighthour-black">FLIGHT</span>
              <span className="text-flighthour-yellow">HOUR</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="https://flighthour.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-flighthour-yellow transition-colors"
            >
              Home
            </Link>
            <Link
              href="https://flighthour.de/products/flugsimulator-geschenkgutscheine"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-flighthour-yellow transition-colors"
            >
              Geschenkgutschein
            </Link>
            <Link
              href="https://flighthour.de/collections/flugsimulator-termin-buchen"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-flighthour-yellow transition-colors"
            >
              Termin
            </Link>

            {/* Seminare Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsSeminareOpen(!isSeminareOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-flighthour-yellow transition-colors"
              >
                <span>Seminare</span>
                <svg
                  className={`w-4 h-4 transition-transform ${isSeminareOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <AnimatePresence>
                {isSeminareOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
                  >
                    <Link
                      href="https://flighthour.de/pages/screening-vorbereitung-airbus-a320"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-flighthour-yellow transition-colors"
                      onClick={() => setIsSeminareOpen(false)}
                    >
                      Screening Vorbereitung
                    </Link>
                    <Link
                      href="https://flighthour.de/pages/flugangst-seminar-entspannter-reisen-lernen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-flighthour-yellow transition-colors border-t border-gray-100"
                      onClick={() => setIsSeminareOpen(false)}
                    >
                      Flugangst
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="https://flighthour.de/pages/faq"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-flighthour-yellow transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="https://flighthour.de/pages/kontakt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-flighthour-yellow transition-colors"
            >
              Kontakt
            </Link>
            <Link
              href="https://flighthour.de/products/flugsimulator-geschenkgutscheine"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Jetzt schenken
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu öffnen"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <motion.span
                animate={{
                  rotate: isMenuOpen ? 45 : 0,
                  y: isMenuOpen ? 10 : 0,
                }}
                className="block h-0.5 w-full bg-flighthour-black rounded-full origin-left transition-all"
              />
              <motion.span
                animate={{
                  opacity: isMenuOpen ? 0 : 1,
                  x: isMenuOpen ? -20 : 0,
                }}
                className="block h-0.5 w-full bg-flighthour-black rounded-full transition-all"
              />
              <motion.span
                animate={{
                  rotate: isMenuOpen ? -45 : 0,
                  y: isMenuOpen ? -10 : 0,
                }}
                className="block h-0.5 w-full bg-flighthour-black rounded-full origin-left transition-all"
              />
            </div>
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="container-section py-4 space-y-4">
              <Link
                href="https://flighthour.de"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-flighthour-yellow transition-colors"
              >
                Home
              </Link>
              <Link
                href="https://flighthour.de/products/flugsimulator-geschenkgutscheine"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-flighthour-yellow transition-colors"
              >
                Geschenkgutschein
              </Link>
              <Link
                href="https://flighthour.de/collections/flugsimulator-termin-buchen"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-flighthour-yellow transition-colors"
              >
                Termin
              </Link>

              {/* Mobile Seminare Section */}
              <div className="space-y-2">
                <div className="px-4 py-2 font-semibold text-gray-700">Seminare</div>
                <Link
                  href="https://flighthour.de/pages/screening-vorbereitung-airbus-a320"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 px-8 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-flighthour-yellow transition-colors"
                >
                  Screening Vorbereitung
                </Link>
                <Link
                  href="https://flighthour.de/pages/flugangst-seminar-entspannter-reisen-lernen"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 px-8 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-flighthour-yellow transition-colors"
                >
                  Flugangst
                </Link>
              </div>

              <Link
                href="https://flighthour.de/pages/faq"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-flighthour-yellow transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="https://flighthour.de/pages/kontakt"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-flighthour-yellow transition-colors"
              >
                Kontakt
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
