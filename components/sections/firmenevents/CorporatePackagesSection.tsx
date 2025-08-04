'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

export default function CorporatePackagesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const packages = [
    {
      name: 'Team Challenge',
      duration: '2-4 Stunden',
      participants: '5-10 Personen',
      features: [
        'Flugsimulator-Experience',
        'Teamwettbewerbe',
        'Kleine Verpflegung',
        'Urkunden für alle Teilnehmer',
        'Dedizierter Instruktor',
      ],
      highlighted: false,
    },
    {
      name: 'Executive Experience',
      duration: 'Halbtag',
      participants: '10-20 Personen',
      features: [
        'Exklusiver Simulator-Zugang',
        'Professionelles Catering',
        'Nutzung des Aufenthaltsraums',
        'Team-Challenges & Awards',
        'Event-Fotograf inklusive',
        'Persönlicher Event-Manager',
      ],
      highlighted: true,
    },
    {
      name: 'Company Event',
      duration: 'Ganztag',
      participants: '20+ Personen',
      features: [
        'Vollständige Location-Nutzung',
        'Premium Catering & Bar',
        'Keynote-Speaker möglich',
        'Individuelle Programmgestaltung',
        'Professionelle Event-Dokumentation',
        'Shuttle-Service buchbar',
      ],
      highlighted: false,
    },
  ]

  return (
    <section id="pakete" className="py-20" ref={ref}>
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-avant-garde font-bold mb-4">
            Unsere <span className="text-flighthour-yellow">Event-Pakete</span>
          </h2>
          <p className="text-xl text-gray-600">
            Von kleinen Teams bis zu großen Firmenevents - wir haben das passende Konzept
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={isInView ? { 
                opacity: 1, 
                y: 0, 
                rotateX: 0,
                transition: {
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: [0.25, 0.1, 0.25, 1]
                }
              } : {}}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { 
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }
              }}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group ${
                pkg.highlighted ? 'ring-4 ring-flighthour-yellow transform scale-105' : ''
              }`}
              style={{ 
                transformStyle: 'preserve-3d',
                perspective: '1000px'
              }}
            >
              {pkg.highlighted && (
                <motion.div 
                  className="absolute top-0 right-0 bg-flighthour-yellow text-flighthour-black px-4 py-1 rounded-bl-lg font-semibold z-10"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.2, type: "spring" }}
                >
                  Beliebteste Wahl
                </motion.div>
              )}
              
              {/* Glow effect for highlighted package */}
              {pkg.highlighted && (
                <motion.div 
                  className="absolute inset-0 bg-flighthour-yellow opacity-10 blur-3xl pointer-events-none"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}

              <div className="p-8 h-full flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-avant-garde font-bold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 font-semibold">{pkg.duration}</p>
                  <p className="text-flighthour-yellow text-lg mt-2">{pkg.participants}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-flighthour-yellow mr-2 mt-0.5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="https://flighthour.de/pages/kontakt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center py-3 px-6 rounded-button font-semibold transition-all relative z-10 ${
                    pkg.highlighted
                      ? 'bg-flighthour-yellow text-flighthour-black hover:bg-opacity-90'
                      : 'bg-flighthour-black text-white hover:bg-gray-800'
                  }`}
                >
                  Jetzt anfragen
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Alle Pakete sind individuell anpassbar und flexibel erweiterbar.
          </p>
          <Link
            href="https://flighthour.de/pages/kontakt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-flighthour-yellow hover:underline"
          >
            Individuelles Angebot anfordern →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}