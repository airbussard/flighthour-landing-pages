'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CookieManager, CookiePreferences, cookieDetails } from '@/lib/cookieManager'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    functional: false,
    marketing: false,
  })

  const cookieManager = CookieManager.getInstance()

  useEffect(() => {
    // Check if user has already consented
    if (!cookieManager.hasConsent()) {
      setIsVisible(true)
    }

    // Load existing preferences
    const savedPrefs = cookieManager.getPreferences()
    setPreferences(savedPrefs)
  }, [cookieManager])

  const handleAcceptAll = () => {
    cookieManager.acceptAll()
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    cookieManager.rejectAll()
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    cookieManager.savePreferences(preferences)
    setIsVisible(false)
    setShowDetails(false)
  }

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return // Necessary cookies cannot be disabled
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Function to reopen consent from footer
  useEffect(() => {
    const handleReopenConsent = () => {
      setIsVisible(true)
    }
    window.addEventListener('reopenCookieConsent', handleReopenConsent)
    return () => {
      window.removeEventListener('reopenCookieConsent', handleReopenConsent)
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={() => setShowDetails(false)}
          />

          {/* Cookie Banner */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] p-4 md:p-6"
          >
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {!showDetails ? (
                  // Simple Consent View
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                      <div className="flex-1">
                        <h3 className="text-xl md:text-2xl font-avant-garde font-bold mb-2">
                          Wir verwenden Cookies 🍪
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base">
                          Um Ihnen das beste Erlebnis zu bieten, verwenden wir Cookies und ähnliche
                          Technologien. Mit Ihrer Zustimmung nutzen wir diese für Analytics und
                          Marketing. Sie können Ihre Einstellungen jederzeit ändern.
                        </p>
                        <button
                          onClick={() => setShowDetails(true)}
                          className="text-flighthour-yellow hover:underline text-sm mt-2"
                        >
                          Cookie-Einstellungen anpassen
                        </button>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <button
                          onClick={handleRejectAll}
                          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-button font-semibold hover:bg-gray-50 transition-colors text-sm md:text-base"
                        >
                          Nur notwendige
                        </button>
                        <button
                          onClick={handleAcceptAll}
                          className="px-6 py-3 bg-flighthour-yellow text-flighthour-black rounded-button font-semibold hover:bg-opacity-90 transition-colors text-sm md:text-base"
                        >
                          Alle akzeptieren
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Detailed Consent View
                  <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
                    <h3 className="text-xl md:text-2xl font-avant-garde font-bold mb-6">
                      Cookie-Einstellungen
                    </h3>

                    {/* Cookie Categories */}
                    <div className="space-y-6">
                      {/* Necessary Cookies */}
                      <div className="border-b border-gray-200 pb-6">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">Notwendige Cookies</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Diese Cookies sind für die Grundfunktionen der Website erforderlich
                            </p>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={true}
                              disabled
                              className="sr-only"
                            />
                            <div className="w-12 h-6 bg-gray-300 rounded-full cursor-not-allowed">
                              <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-6 translate-y-0.5"></div>
                            </div>
                          </div>
                        </div>
                        <ul className="space-y-2">
                          {cookieDetails
                            .filter((cookie) => cookie.category === 'necessary')
                            .map((cookie, idx) => (
                              <li key={idx} className="text-sm text-gray-600">
                                <span className="font-medium">{cookie.name}:</span>{' '}
                                {cookie.description} ({cookie.duration})
                              </li>
                            ))}
                        </ul>
                      </div>

                      {/* Functional Cookies */}
                      <div className="border-b border-gray-200 pb-6">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">Funktionale Cookies</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Verbessern die Benutzerfreundlichkeit und Personalisierung
                            </p>
                          </div>
                          <button
                            onClick={() => togglePreference('functional')}
                            className="relative"
                          >
                            <div
                              className={`w-12 h-6 rounded-full transition-colors ${
                                preferences.functional ? 'bg-flighthour-yellow' : 'bg-gray-300'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                                  preferences.functional
                                    ? 'translate-x-6'
                                    : 'translate-x-0.5'
                                } translate-y-0.5`}
                              ></div>
                            </div>
                          </button>
                        </div>
                        <ul className="space-y-2">
                          {cookieDetails
                            .filter((cookie) => cookie.category === 'functional')
                            .map((cookie, idx) => (
                              <li key={idx} className="text-sm text-gray-600">
                                <span className="font-medium">{cookie.name}:</span>{' '}
                                {cookie.description} ({cookie.duration})
                              </li>
                            ))}
                        </ul>
                      </div>

                      {/* Marketing Cookies */}
                      <div className="pb-6">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">Marketing Cookies</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Werden verwendet, um Werbung relevanter zu gestalten
                            </p>
                          </div>
                          <button
                            onClick={() => togglePreference('marketing')}
                            className="relative"
                          >
                            <div
                              className={`w-12 h-6 rounded-full transition-colors ${
                                preferences.marketing ? 'bg-flighthour-yellow' : 'bg-gray-300'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                                  preferences.marketing
                                    ? 'translate-x-6'
                                    : 'translate-x-0.5'
                                } translate-y-0.5`}
                              ></div>
                            </div>
                          </button>
                        </div>
                        <ul className="space-y-2">
                          {cookieDetails
                            .filter((cookie) => cookie.category === 'marketing')
                            .map((cookie, idx) => (
                              <li key={idx} className="text-sm text-gray-600">
                                <span className="font-medium">{cookie.name}:</span>{' '}
                                {cookie.description} ({cookie.duration})
                              </li>
                            ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                      <button
                        onClick={() => setShowDetails(false)}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-button font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Zurück
                      </button>
                      <button
                        onClick={handleSavePreferences}
                        className="px-6 py-3 bg-flighthour-yellow text-flighthour-black rounded-button font-semibold hover:bg-opacity-90 transition-colors"
                      >
                        Einstellungen speichern
                      </button>
                    </div>

                    {/* Privacy Policy Link */}
                    <p className="text-xs text-gray-500 mt-6">
                      Weitere Informationen finden Sie in unserer{' '}
                      <a
                        href="https://flighthour.de/pages/datenschutz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-flighthour-yellow hover:underline"
                      >
                        Datenschutzerklärung
                      </a>
                      .
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}