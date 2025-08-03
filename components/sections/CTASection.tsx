'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-20 bg-flighthour-yellow" ref={ref}>
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-avant-garde font-bold mb-6"
          >
            Bereit, jemandem eine <span className="text-white">unvergessliche Freude</span> zu
            machen?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl mb-8 text-flighthour-black/80"
          >
            Verschenke jetzt ein Flighthour-Erlebnis und sorge für strahlende Augen am Geburtstag!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="https://flighthour.de/geschenkgutschein"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-flighthour-black text-white font-semibold py-4 px-8 rounded-button text-lg hover:bg-gray-800 transition-all hover:shadow-lg active:scale-95"
            >
              Gutschein kaufen
            </a>
            <a
              href="https://flighthour.de/kontakt"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-flighthour-black font-semibold py-4 px-8 rounded-button text-lg hover:bg-gray-100 transition-all hover:shadow-lg active:scale-95"
            >
              Beratung anfordern
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 flex items-center justify-center space-x-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold">2 Jahre</div>
              <div className="text-sm">Gültigkeit</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm">Flexibel</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">5★</div>
              <div className="text-sm">Bewertung</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
