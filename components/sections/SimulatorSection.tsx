'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function SimulatorSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-20 bg-flighthour-black text-white" ref={ref}>
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-avant-garde font-bold mb-4">
            Erlebe den originalen <span className="text-flighthour-yellow">Airbus A320</span>{' '}
            Simulator
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Unser professioneller Full-Motion Flugsimulator ist eine originalgetreue Nachbildung des
            Airbus A320 Cockpits - das meistgeflogene Verkehrsflugzeug Europas.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl md:text-2xl font-avant-garde font-bold mb-4 md:mb-6 text-flighthour-yellow">
              Perfekte Lage in Oberhausen
            </h3>
            <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-flighthour-yellow mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Direkt am Centro Oberhausen - Deutschlands größtem Einkaufszentrum</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-flighthour-yellow mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Kostenlose Parkplätze direkt vor der Tür</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-flighthour-yellow mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Perfekte Anbindung an A2, A3 und A42</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-6 h-6 text-flighthour-yellow mr-3 mt-0.5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 14.586l6.293-6.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Restaurants und Cafés in unmittelbarer Nähe</span>
              </li>
            </ul>
            <p className="text-sm md:text-base text-gray-300">
              Mache aus dem Geschenk einen perfekten Tagesausflug - Flugsimulator-Erlebnis
              kombiniert mit Shopping und Dining am Centro!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6">
              <h4 className="text-lg md:text-xl font-avant-garde font-bold mb-3 text-flighthour-yellow">
                Technische Details
              </h4>
              <ul className="space-y-2 text-sm md:text-base text-gray-300">
                <li>• Original Airbus A320 Cockpit-Nachbau</li>
                <li>• Full-Motion System mit 6 Bewegungsachsen</li>
                <li>• 180° Sichtfeld mit HD-Projektoren</li>
                <li>• Echte Flugzeug-Instrumente und -Steuerung</li>
                <li>• Professionelle Flugsimulations-Software</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6">
              <h4 className="text-lg md:text-xl font-avant-garde font-bold mb-3 text-flighthour-yellow">
                Das Erlebnis
              </h4>
              <p className="text-sm md:text-base text-gray-300">
                Erlebe hautnah, was Piloten täglich leisten. Von der Vorbereitung über Start und
                Landung bis zu besonderen Herausforderungen - alles unter Anleitung erfahrener
                Instruktoren.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
