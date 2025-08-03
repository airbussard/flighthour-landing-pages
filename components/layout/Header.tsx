'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white shadow-md"
    >
      <div className="container-section py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-avant-garde font-bold">
              <span className="text-flighthour-black">FLIGHT</span>
              <span className="text-flighthour-yellow">HOUR</span>
            </span>
            <span className="text-sm text-gray-600">Geschenke</span>
          </Link>
          
          <div className="flex items-center space-x-6">
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
        </nav>
      </div>
    </motion.header>
  )
}