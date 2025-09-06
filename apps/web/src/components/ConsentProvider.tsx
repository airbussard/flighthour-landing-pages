'use client'

import { useEffect } from 'react'
import { CookieBanner, CookieSettings } from '@eventhour/ui'
import { consentManager, useConsentStore } from '@eventhour/consent'

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const showConsentSettings = useConsentStore((state) => state.showConsentSettings)

  useEffect(() => {
    // Initialize consent manager
    consentManager.initialize()

    // Listen for custom event to show cookie settings
    const handleShowSettings = () => {
      showConsentSettings()
    }

    window.addEventListener('showCookieSettings', handleShowSettings)
    
    return () => {
      window.removeEventListener('showCookieSettings', handleShowSettings)
    }
  }, [showConsentSettings])

  return (
    <>
      {children}
      <CookieBanner />
      <CookieSettings />
    </>
  )
}