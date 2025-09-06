'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, Settings, X } from 'lucide-react'
import { useConsentStore } from '@eventhour/consent'
import { Button } from './Button'

export const CookieBanner: React.FC = () => {
  const { 
    showBanner, 
    acceptAll, 
    acceptNecessary, 
    showConsentSettings,
    hideBanner,
    loadConsent
  } = useConsentStore()

  // Load consent on mount
  useEffect(() => {
    loadConsent()
  }, [loadConsent])

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-8">
              <div className="flex flex-col lg:flex-row gap-6 lg:items-center">
                {/* Icon and Content */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-eventhour-yellow/10 rounded-xl flex-shrink-0">
                      <Cookie className="h-6 w-6 text-eventhour-yellow" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        Wir verwenden Cookies 🍪
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Wir nutzen Cookies und ähnliche Technologien, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. 
                        Mit Ihrer Zustimmung verwenden wir Cookies für Funktionalität, Analyse und Marketing. 
                        Sie können Ihre Einstellungen jederzeit in unseren{' '}
                        <button
                          onClick={showConsentSettings}
                          className="text-eventhour-yellow hover:underline font-medium"
                        >
                          Cookie-Einstellungen
                        </button>{' '}
                        ändern.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
                  <Button
                    onClick={acceptNecessary}
                    variant="secondary"
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    Nur notwendige
                  </Button>
                  <Button
                    onClick={showConsentSettings}
                    variant="secondary"
                    size="sm"
                    className="whitespace-nowrap flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Einstellungen
                  </Button>
                  <Button
                    onClick={acceptAll}
                    size="sm"
                    className="whitespace-nowrap bg-eventhour-yellow hover:bg-eventhour-yellow/90"
                  >
                    Alle akzeptieren
                  </Button>
                </div>

                {/* Close button */}
                <button
                  onClick={hideBanner}
                  className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                  aria-label="Banner schließen"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {/* Legal Links */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <a 
                    href="/datenschutz" 
                    className="hover:text-eventhour-yellow transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Datenschutzerklärung
                  </a>
                  <a 
                    href="/cookies" 
                    className="hover:text-eventhour-yellow transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cookie-Richtlinie
                  </a>
                  <a 
                    href="/impressum" 
                    className="hover:text-eventhour-yellow transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Impressum
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}