'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Cookie, Shield, BarChart3, Megaphone, Check } from 'lucide-react'
import { useConsentStore, COOKIE_CATEGORIES, CookieCategory } from '@eventhour/consent'
import { Button } from './Button'

const categoryIcons = {
  necessary: Shield,
  functional: Cookie,
  analytics: BarChart3,
  marketing: Megaphone,
}

export const CookieSettings: React.FC = () => {
  const { 
    showSettings, 
    hideConsentSettings, 
    consent,
    updateConsent,
    acceptAll,
    acceptNecessary
  } = useConsentStore()

  const [localConsent, setLocalConsent] = useState({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    if (consent) {
      setLocalConsent({
        necessary: true, // Always true
        functional: consent.functional,
        analytics: consent.analytics,
        marketing: consent.marketing,
      })
    }
  }, [consent])

  const handleToggle = (category: CookieCategory) => {
    if (category === 'necessary') return // Can't toggle necessary cookies
    
    setLocalConsent(prev => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const handleSave = () => {
    updateConsent(localConsent)
    hideConsentSettings()
  }

  const handleAcceptAll = () => {
    acceptAll()
    hideConsentSettings()
  }

  const handleAcceptNecessary = () => {
    acceptNecessary()
    hideConsentSettings()
  }

  return (
    <AnimatePresence>
      {showSettings && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={hideConsentSettings}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-eventhour-yellow/10 rounded-lg">
                    <Cookie className="h-6 w-6 text-eventhour-yellow" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Cookie-Einstellungen</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Verwalten Sie Ihre Cookie-Präferenzen
                    </p>
                  </div>
                </div>
                <button
                  onClick={hideConsentSettings}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-6">
                {Object.entries(COOKIE_CATEGORIES).map(([key, category]) => {
                  const Icon = categoryIcons[key as CookieCategory]
                  const isNecessary = key === 'necessary'
                  const isEnabled = localConsent[key as CookieCategory]

                  return (
                    <div
                      key={key}
                      className={`border rounded-xl p-5 transition-colors ${
                        isEnabled ? 'border-eventhour-yellow bg-eventhour-yellow/5' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            isEnabled ? 'bg-eventhour-yellow/20' : 'bg-gray-100'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              isEnabled ? 'text-eventhour-yellow' : 'text-gray-500'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              {category.name}
                              {isNecessary && (
                                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                                  Immer aktiv
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {category.description}
                            </p>
                          </div>
                        </div>

                        {/* Toggle Switch */}
                        {!isNecessary && (
                          <button
                            onClick={() => handleToggle(key as CookieCategory)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              isEnabled ? 'bg-eventhour-yellow' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isEnabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Cookie Details */}
                      <div className="mt-4 space-y-2">
                        <button
                          className="text-sm text-eventhour-yellow hover:underline"
                          onClick={() => {
                            const details = document.getElementById(`details-${key}`)
                            if (details) {
                              details.classList.toggle('hidden')
                            }
                          }}
                        >
                          Details anzeigen
                        </button>
                        <div id={`details-${key}`} className="hidden mt-3 space-y-2">
                          {category.cookies.map((cookie, index) => (
                            <div
                              key={index}
                              className="bg-white border border-gray-100 rounded-lg p-3 text-sm"
                            >
                              <div className="font-medium mb-1">{cookie.name}</div>
                              <div className="text-gray-600 space-y-1">
                                <div>
                                  <span className="font-medium">Zweck:</span> {cookie.purpose}
                                </div>
                                <div>
                                  <span className="font-medium">Anbieter:</span> {cookie.provider}
                                </div>
                                <div>
                                  <span className="font-medium">Dauer:</span> {cookie.duration}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAcceptNecessary}
                  variant="secondary"
                  className="flex-1"
                >
                  Nur notwendige
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  variant="secondary"
                  className="flex-1"
                >
                  Alle akzeptieren
                </Button>
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-eventhour-yellow hover:bg-eventhour-yellow/90"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Auswahl speichern
                </Button>
              </div>
              <div className="mt-4 text-center">
                <a
                  href="/datenschutz"
                  className="text-sm text-gray-500 hover:text-eventhour-yellow"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Datenschutzerklärung
                </a>
                <span className="mx-2 text-gray-300">•</span>
                <a
                  href="/cookies"
                  className="text-sm text-gray-500 hover:text-eventhour-yellow"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cookie-Richtlinie
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}