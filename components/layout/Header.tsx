'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white shadow-md"
    >
      <div className="container-section py-3 md:py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-1 md:space-x-2">
            <span className="text-xl md:text-2xl font-avant-garde font-bold">
              <span className="text-flighthour-black">FLIGHT</span>
              <span className="text-flighthour-yellow">HOUR</span>
            </span>
            <span className="text-xs md:text-sm text-gray-600">Geschenke</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="#pakete"
              className="text-gray-700 hover:text-flighthour-yellow transition-colors"
            >
              Geschenkpakete
            </Link>
            <Link
              href="#faq"
              className="text-gray-700 hover:text-flighthour-yellow transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="https://flighthour.de/kontakt"
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
                href="#pakete"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-flighthour-yellow transition-colors"
              >
                Geschenkpakete
              </Link>
              <Link
                href="#faq"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 px-4 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-flighthour-yellow transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="https://flighthour.de/kontakt"
                target="_blank"
                rel="noopener noreferrer"
                className="block btn-primary text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Jetzt schenken
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
