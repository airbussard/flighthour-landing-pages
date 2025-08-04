'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import CounterAnimation from '@/components/ui/CounterAnimation'

export default function CorporateCTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-20 bg-flighthour-yellow" ref={ref}>
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-avant-garde font-bold mb-6"
          >
            Planen Sie Ihr <span className="text-white">unvergessliches</span> Firmenevent
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl mb-8 text-flighthour-black/80"
          >
            Stärken Sie den Teamgeist und schaffen Sie gemeinsame Erinnerungen, 
            die Ihre Mitarbeiter noch lange motivieren werden.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <a
              href="https://flighthour.de/pages/kontakt"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-flighthour-black text-white font-semibold py-4 px-8 rounded-button text-lg hover:bg-gray-800 transition-all hover:shadow-lg active:scale-95"
            >
              Kostenlose Beratung
            </a>
            <a
              href="tel:+4920888888888"
              className="bg-white text-flighthour-black font-semibold py-4 px-8 rounded-button text-lg hover:bg-gray-100 transition-all hover:shadow-lg active:scale-95"
            >
              📞 Direkt anrufen
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid md:grid-cols-4 gap-8"
          >
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <div className="text-3xl font-bold">
                <CounterAnimation end={500} duration={2} suffix="+" />
              </div>
              <div className="text-sm">Erfolgreiche Events</div>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="text-3xl font-bold">
                <CounterAnimation end={98} duration={2} suffix="%" />
              </div>
              <div className="text-sm">Weiterempfehlung</div>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <div className="text-3xl font-bold">
                <CounterAnimation end={50} duration={1.5} suffix="+" />
              </div>
              <div className="text-sm">Max. Teilnehmer</div>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="text-3xl font-bold">
                <CounterAnimation end={100} duration={2} suffix="%" />
              </div>
              <div className="text-sm">Flexibilität</div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-12 pt-8 border-t border-flighthour-black/20"
          >
            <p className="text-sm text-flighthour-black/70">
              Wir sind Ihr Partner für außergewöhnliche Firmenevents in Oberhausen.
              <br />
              Direkt am Centro mit perfekter Anbindung aus dem gesamten Ruhrgebiet.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}