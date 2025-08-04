'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'

export default function EventSpaceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [selectedImage, setSelectedImage] = useState(0)

  const images = [
    {
      title: 'Stilechter Aufenthaltsraum',
      description: 'Moderne Lounge für Meetings und Präsentationen',
      placeholder: '[1200x800]',
    },
    {
      title: 'Premium Catering',
      description: 'Flexibles Catering nach Ihren Wünschen',
      placeholder: '[1200x800]',
    },
    {
      title: 'Direkte Parkplätze',
      description: 'Kostenfreie Parkplätze für alle Teilnehmer',
      placeholder: '[1200x800]',
    },
    {
      title: 'Simulator-Raum',
      description: 'Professioneller A320 Flugsimulator',
      placeholder: '[1200x800]',
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
            Ihre <span className="text-flighthour-yellow">Event-Location</span>
          </h2>
          <p className="text-xl text-gray-600">
            Moderne Räumlichkeiten für unvergessliche Firmenevents
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Image Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] lg:h-[500px] bg-gray-200 rounded-2xl overflow-hidden shadow-xl"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-2xl text-gray-500">{images[selectedImage].placeholder}</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h3 className="text-2xl font-avant-garde font-bold text-white mb-2">
                {images[selectedImage].title}
              </h3>
              <p className="text-white/90">{images[selectedImage].description}</p>
            </div>
          </motion.div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setSelectedImage(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative h-[180px] lg:h-[235px] bg-gray-200 rounded-xl overflow-hidden cursor-pointer shadow-lg transition-all ${
                  selectedImage === index ? 'ring-4 ring-flighthour-yellow' : ''
                }`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-gray-500">{image.placeholder}</p>
                </div>
                <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-all">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h4 className="text-white font-semibold text-sm lg:text-base">{image.title}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid md:grid-cols-4 gap-6"
        >
          {[
            { icon: '📐', text: '500m² Event-Fläche' },
            { icon: '🪑', text: 'Bis zu 50 Personen' },
            { icon: '📽️', text: 'Präsentationstechnik' },
            { icon: '🌐', text: 'Highspeed WLAN' },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="text-3xl mb-2">{feature.icon}</div>
              <p className="font-semibold text-gray-700">{feature.text}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}