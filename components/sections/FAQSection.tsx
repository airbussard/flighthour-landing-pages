'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'

export default function FAQSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'Wie funktioniert der Geschenkgutschein?',
      answer: 'Nach der Bestellung erhältst du einen personalisierten Geschenkgutschein als PDF. Dieser kann ausgedruckt oder digital verschenkt werden. Der Beschenkte kann dann flexibel einen Termin seiner Wahl buchen.'
    },
    {
      question: 'Wie lange ist der Gutschein gültig?',
      answer: 'Alle Geschenkgutscheine sind 2 Jahre ab Kaufdatum gültig. Eine Verlängerung ist auf Anfrage möglich.'
    },
    {
      question: 'Ab welchem Alter kann man den Flugsimulator nutzen?',
      answer: 'Kinder ab 8 Jahren können den Flugsimulator nutzen. Nach oben gibt es keine Altersgrenze - wir hatten schon begeisterte 88-jährige Piloten!'
    },
    {
      question: 'Sind Vorkenntnisse erforderlich?',
      answer: 'Nein, absolut nicht! Unsere erfahrenen Instruktoren passen sich jedem Niveau an und führen Schritt für Schritt durch das Erlebnis.'
    },
    {
      question: 'Kann ich das Paket nachträglich upgraden?',
      answer: 'Ja, ein Upgrade ist jederzeit möglich. Der Beschenkte zahlt bei der Buchung einfach die Differenz zum gewünschten Paket.'
    },
    {
      question: 'Was passiert bei Flugangst?',
      answer: 'Kein Problem! Der Flugsimulator ist komplett sicher und am Boden. Viele Menschen mit Flugangst nutzen ihn sogar, um ihre Ängste zu überwinden. Die Tür bleibt immer offen.'
    }
  ]

  return (
    <section id="faq" className="py-20 bg-gray-50" ref={ref}>
      <div className="container-section max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-avant-garde font-bold mb-4">
            Häufige <span className="text-flighthour-yellow">Fragen</span>
          </h2>
          <p className="text-xl text-gray-600">
            Alles was du über Geschenkgutscheine wissen musst
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                <motion.svg
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-5 h-5 text-flighthour-yellow flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">
            Noch Fragen? Wir helfen gerne weiter!
          </p>
          <a
            href="https://flighthour.de/kontakt"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Kontakt aufnehmen
          </a>
        </motion.div>
      </div>
    </section>
  )
}