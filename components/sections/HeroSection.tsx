'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="relative h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
      {/* YouTube Video Hintergrund */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-black/50 md:bg-black/40 z-10" />{' '}
        {/* Overlay für bessere Lesbarkeit */}
        <iframe
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[max(100%,177.77vh)] h-[max(100%,56.25vw)] min-w-full"
          src="https://www.youtube.com/embed/r1dTSEm4rjo?autoplay=1&mute=1&loop=1&playlist=r1dTSEm4rjo&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
          title="Flighthour Experience Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="container-section relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-avant-garde font-bold mb-4 md:mb-6 text-white drop-shadow-2xl"
          >
            Das <span className="text-flighthour-yellow drop-shadow-2xl">unvergessliche</span>
            <br className="hidden sm:block" />
            <span className="block sm:inline">Geburtstagsgeschenk</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-6 md:mb-8 drop-shadow-lg px-4 md:px-0"
          >
            Schenke ein einzigartiges Flugerlebnis im professionellen Flugsimulator.
            <br className="hidden md:block" />
            <span className="block md:inline">Für Jung und Alt - von 8 bis 90 Jahren!</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
          >
            <Link href="#pakete" className="btn-primary text-base sm:text-lg py-4 sm:py-3">
              Geschenkpakete entdecken
            </Link>
            <Link href="#video" className="btn-secondary text-base sm:text-lg py-4 sm:py-3">
              So funktioniert&apos;s
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll-Indikator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
