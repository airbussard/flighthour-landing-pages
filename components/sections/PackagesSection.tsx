'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

export default function PackagesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const packages = [
    {
      name: 'Starter',
      duration: '30 Minuten',
      price: '99,50€',
      features: [
        'Briefing',
        'Einführung ins Cockpit',
        'Start und Landung',
        'Freie Flugzeugwahl',
        'Erfahrener Instruktor',
      ],
      highlighted: false,
      ctaLink: 'https://flighthour.de/products/flugsimulator-geschenkgutscheine',
    },
    {
      name: 'Premium',
      duration: '60 Minuten',
      price: '179€',
      features: [
        'Ausführliches Briefing',
        'Echter Pilot erklärt',
        'Einführung ins Cockpit',
        'Mehrere Starts & Landungen',
        'Wetterszenarien wählbar',
        'Foto- & Videoaufnahmen',
      ],
      highlighted: true,
      ctaLink: 'https://flighthour.de/products/flugsimulator-geschenkgutscheine',
    },
    {
      name: "Captain's Experience",
      duration: '120 Minuten',
      price: '299€',
      features: [
        'Ausführliches Briefing',
        'Echter Pilot erklärt',
        'VIP-Erlebnis',
        'Komplette Flugroute',
        'Nachtflug möglich',
        'Foto- & Videoaufnahmen',
      ],
      highlighted: false,
      ctaLink: 'https://flighthour.de/products/flugsimulator-geschenkgutscheine',
    },
  ]

  return (
    <section id="pakete" className="py-20 bg-gray-50" ref={ref}>
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-avant-garde font-bold mb-4">
            Wähle das perfekte <span className="text-flighthour-yellow">Geschenkpaket</span>
          </h2>
          <p className="text-xl text-gray-600">
            Vom Schnupperkurs bis zum VIP-Erlebnis - für jeden Anlass das richtige Paket
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${
                pkg.highlighted ? 'ring-4 ring-flighthour-yellow transform scale-105' : ''
              }`}
            >
              {pkg.highlighted && (
                <div className="absolute top-0 right-0 bg-flighthour-yellow text-flighthour-black px-4 py-1 rounded-bl-lg font-semibold">
                  Beliebteste Wahl
                </div>
              )}

              <div className="p-8 h-full flex flex-col">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-avant-garde font-bold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600">{pkg.duration}</p>
                  <div className="mt-4">
                    <span className="text-5xl font-bold">{pkg.price}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-flighthour-yellow mr-2 mt-0.5"
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

                <a
                  href={pkg.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center py-3 px-6 rounded-button font-semibold transition-all ${
                    pkg.highlighted
                      ? 'bg-flighthour-yellow text-flighthour-black hover:bg-opacity-90'
                      : 'bg-flighthour-black text-white hover:bg-gray-800'
                  }`}
                >
                  Jetzt verschenken
                </a>
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
            Alle Geschenkgutscheine sind 3 Jahre gültig und flexibel einlösbar.
          </p>
          <Link
            href="https://flighthour.de/pages/kontakt"
            target="_blank"
            rel="noopener noreferrer"
            className="text-flighthour-yellow hover:underline"
          >
            Individuelle Pakete auf Anfrage →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
