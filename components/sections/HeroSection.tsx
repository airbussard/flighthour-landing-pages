'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Hintergrundbild-Platzhalter */}
      <div className="absolute inset-0 bg-gradient-to-br from-flighthour-yellow/20 to-flighthour-black/20 z-0">
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500 text-center">
            [Hero-Bild: Glückliches Geburtstagskind im Flugsimulator<br/>
            Emotionales Bild mit strahlendem Gesicht, 1920x1080]
          </p>
        </div>
      </div>

      <div className="container-section relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-avant-garde font-bold mb-6"
          >
            Das <span className="text-flighthour-yellow">unvergessliche</span><br/>
            Geburtstagsgeschenk
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-700 mb-8"
          >
            Schenke ein einzigartiges Flugerlebnis im professionellen Flugsimulator.
            <br />
            Für Jung und Alt - von 8 bis 88 Jahren!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="#pakete" className="btn-primary text-lg">
              Geschenkpakete entdecken
            </Link>
            <Link href="#video" className="btn-secondary text-lg">
              So funktioniert's
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll-Indikator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}