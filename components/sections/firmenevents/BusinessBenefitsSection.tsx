'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function BusinessBenefitsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const benefits = [
    {
      icon: '🍽️',
      title: 'Catering auf Anfrage',
      description: 'Von kleinen Snacks bis zum kompletten Buffet - wir organisieren alles nach Ihren Wünschen.',
    },
    {
      icon: '👔',
      title: 'Persönliche Betreuung',
      description: 'Dedizierter Event-Manager und professionelle Instruktoren für Ihr Team.',
    },
    {
      icon: '🏢',
      title: 'Stilechter Aufenthaltsraum',
      description: 'Moderne Lounge für Besprechungen, Präsentationen oder entspannte Pausen.',
    },
    {
      icon: '🚗',
      title: 'Direkte Parkplätze',
      description: 'Kostenfreie Parkplätze direkt am Gebäude für alle Teilnehmer.',
    },
    {
      icon: '🎯',
      title: 'Maßgeschneiderte Pakete',
      description: 'Individuelle Konzepte passend zu Ihren Zielen und Ihrem Budget.',
    },
    {
      icon: '🤝',
      title: 'Teambuilding-Effekt',
      description: 'Fördern Sie Zusammenarbeit und Kommunikation in einzigartiger Atmosphäre.',
    },
  ]

  return (
    <section className="py-20 bg-gray-50" ref={ref}>
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-avant-garde font-bold mb-4">
            Warum Flighthour für <span className="text-flighthour-yellow">Ihr Event</span>?
          </h2>
          <p className="text-xl text-gray-600">
            Alles was Sie für ein erfolgreiches Firmenevent brauchen
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={isInView ? { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: {
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.25, 0.1, 0.25, 1]
                }
              } : {}}
              whileHover={{ 
                y: -15,
                transition: { 
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }
              }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
            >
              <motion.div 
                whileHover={{ 
                  scale: 1.3, 
                  rotate: [0, -15, 15, -15, 0],
                  transition: { duration: 0.5 }
                }} 
                className="text-6xl mb-4 inline-block"
              >
                {benefit.icon}
              </motion.div>
              <h3 className="text-xl font-avant-garde font-bold mb-3 group-hover:text-flighthour-yellow transition-colors">
                {benefit.title}
              </h3>
              <p className="text-gray-600">{benefit.description}</p>
              <motion.div
                className="h-1 bg-flighthour-yellow rounded-full mt-4 mx-auto"
                initial={{ width: 0 }}
                whileHover={{ width: "60%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}