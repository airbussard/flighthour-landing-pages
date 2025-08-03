'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function TargetGroupSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const groups = [
    {
      title: 'Für junge Abenteurer',
      age: '8-18 Jahre',
      description:
        'Wecke die Begeisterung fürs Fliegen! Ein spannendes Erlebnis, das Technik greifbar macht.',
      features: ['Altersgerechte Einführung', 'Spielerisches Lernen', 'Unvergessliche Momente'],
      image: '[800x600]',
    },
    {
      title: 'Für Junggebliebene',
      age: '50+ Jahre',
      description:
        'Erfülle dir einen Lebenstraum! Erlebe die Faszination des Fliegens ohne Risiko.',
      features: ['Entspanntes Tempo', 'Professionelle Betreuung', 'Traumerfüllung'],
      image: '[800x600]',
    },
  ]

  return (
    <section id="zielgruppen" className="py-20 bg-gray-50" ref={ref}>
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-avant-garde font-bold mb-4">
            Das perfekte Geschenk für <span className="text-flighthour-yellow">jeden</span>
          </h2>
          <p className="text-xl text-gray-600">
            Von 8 bis 88 Jahren - Flighthour begeistert alle Altersgruppen
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {groups.map((group, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-center px-4">{group.image}</p>
              </div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-avant-garde font-bold">{group.title}</h3>
                  <span className="bg-flighthour-yellow text-flighthour-black px-3 py-1 rounded-full text-sm font-semibold">
                    {group.age}
                  </span>
                </div>
                <p className="text-gray-600 mb-6">{group.description}</p>
                <ul className="space-y-2">
                  {group.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-flighthour-yellow mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
