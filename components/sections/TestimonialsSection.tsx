'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: 'Sarah M.',
      age: '28 Jahre',
      role: 'hat ihrem Vater geschenkt',
      text: 'Mein Papa war sprachlos! Mit 65 Jahren hat er sich seinen Traum vom Fliegen erfüllt. Die strahlenden Augen werde ich nie vergessen.',
      rating: 5,
      image: '[400x400]',
    },
    {
      name: 'Familie Weber',
      age: 'Eltern',
      role: 'für Sohn Tom (12)',
      text: 'Tom redet immer noch von seinem Geburtstag im Flugsimulator. Die Betreuung war super kinderfreundlich und professionell.',
      rating: 5,
      image: '[400x400]',
    },
    {
      name: 'Marcus K.',
      age: '45 Jahre',
      role: 'Geburtstagsgeschenk von Kollegen',
      text: 'Das beste Geschenk ever! Die Kollegen haben ins Schwarze getroffen. War ein unvergessliches Erlebnis.',
      rating: 5,
      image: '[400x400]',
    },
  ]

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isInView) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [isInView, testimonials.length])

  return (
    <section id="testimonials" className="py-20" ref={ref}>
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-avant-garde font-bold mb-4">
            Glückliche <span className="text-flighthour-yellow">Geburtstagskinder</span>
          </h2>
          <p className="text-xl text-gray-600">
            Das sagen unsere Kunden über ihre Geschenkerfahrung
          </p>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                  <p className="text-xs text-gray-500 text-center">{testimonial.image}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.age}</p>
                  <p className="text-sm text-flighthour-yellow">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-flighthour-yellow"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 italic">&ldquo;{testimonial.text}&rdquo;</p>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              className="absolute inset-0 bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
                  <p className="text-xs text-gray-500 text-center">{testimonials[currentIndex].image}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{testimonials[currentIndex].name}</h4>
                  <p className="text-sm text-gray-600">{testimonials[currentIndex].age}</p>
                  <p className="text-sm text-flighthour-yellow">{testimonials[currentIndex].role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-flighthour-yellow"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 italic">&ldquo;{testimonials[currentIndex].text}&rdquo;</p>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-flighthour-yellow w-8' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
