'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function BookingProcessSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const steps = [
    {
      number: '01',
      title: 'Anfrage',
      description: 'Kontaktieren Sie uns mit Ihren Wünschen und Vorstellungen.',
      icon: '✉️',
    },
    {
      number: '02',
      title: 'Beratung',
      description: 'Persönliches Gespräch zur Planung Ihres perfekten Events.',
      icon: '💬',
    },
    {
      number: '03',
      title: 'Planung',
      description: 'Detaillierte Ausarbeitung und Anpassung an Ihre Bedürfnisse.',
      icon: '📋',
    },
    {
      number: '04',
      title: 'Event',
      description: 'Professionelle Durchführung Ihres unvergesslichen Teamevents.',
      icon: '🎉',
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
            So einfach <span className="text-flighthour-yellow">funktioniert&apos;s</span>
          </h2>
          <p className="text-xl text-gray-600">
            Von der Anfrage bis zum erfolgreichen Event in 4 Schritten
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2">
            <motion.div
              className="h-full bg-flighthour-yellow"
              initial={{ width: 0 }}
              animate={isInView ? { width: '100%' } : {}}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2,
                  type: "spring",
                  stiffness: 100
                }}
                className="text-center relative"
              >
                {/* Step Circle */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-24 h-24 bg-white rounded-full shadow-lg mx-auto mb-4 flex items-center justify-center relative z-10 cursor-pointer group"
                >
                  <div className="absolute inset-0 bg-flighthour-yellow rounded-full opacity-0 group-hover:opacity-10 transition-opacity" />
                  <span className="text-3xl">{step.icon}</span>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-flighthour-yellow rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.number}
                  </div>
                </motion.div>

                {/* Step Content */}
                <h3 className="text-xl font-avant-garde font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>

                {/* Mobile Connection Line */}
                {index < steps.length - 1 && (
                  <div className="md:hidden w-1 h-16 bg-gray-300 mx-auto mt-4">
                    <motion.div
                      className="w-full bg-flighthour-yellow"
                      initial={{ height: 0 }}
                      animate={isInView ? { height: '100%' } : {}}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-gray-600 mb-6">
            Unser erfahrenes Event-Team begleitet Sie bei jedem Schritt
          </p>
          <a
            href="https://flighthour.de/pages/kontakt"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block"
          >
            Jetzt unverbindlich anfragen
          </a>
        </motion.div>
      </div>
    </section>
  )
}