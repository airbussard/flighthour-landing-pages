'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function BenefitsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const benefits = [
    {
      icon: '🎁',
      title: 'Einzigartig & Unvergesslich',
      description: 'Ein Geschenk, das garantiert in Erinnerung bleibt - keine 0815 Geschenkkarte!',
    },
    {
      icon: '✈️',
      title: '100% Sicher',
      description:
        'Professioneller Flugsimulator mit erfahrenen Instruktoren - Abenteuer ohne Risiko.',
    },
    {
      icon: '🎯',
      title: 'Für Jeden Geeignet',
      description: 'Keine Vorkenntnisse nötig - unsere Instruktoren passen sich jedem Niveau an.',
    },
    {
      icon: '📅',
      title: 'Flexibel Buchbar',
      description:
        'Geschenkgutscheine ohne festes Datum - der Beschenkte wählt seinen Wunschtermin.',
    },
    {
      icon: '🌟',
      title: 'Premium Erlebnis',
      description:
        'Hochmoderne Technik und erstklassiger Service für ein unvergessliches Erlebnis.',
    },
    {
      icon: '📸',
      title: 'Erinnerungen Inklusive',
      description: 'Fotos und Videos vom Flugerlebnis - damit die Erinnerung für immer bleibt.',
    },
  ]

  return (
    <section className="py-20" ref={ref}>
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-avant-garde font-bold mb-4">
            Warum Flighthour das <span className="text-flighthour-yellow">beste</span> Geschenk ist
          </h2>
          <p className="text-xl text-gray-600">6 Gründe, warum dieses Geschenk jeden begeistert</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="text-6xl mb-4">
                {benefit.icon}
              </motion.div>
              <h3 className="text-xl font-avant-garde font-bold mb-2 group-hover:text-flighthour-yellow transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
