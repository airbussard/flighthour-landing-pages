import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'
import { 
  CookieConsent, 
  ConsentPreferences,
  CONSENT_VERSION,
  CONSENT_COOKIE_NAME,
  CONSENT_COOKIE_DAYS
} from './consent-types'

interface ConsentStore {
  // State
  consent: CookieConsent | null
  showBanner: boolean
  showSettings: boolean
  hasInteracted: boolean
  
  // Actions
  acceptAll: () => void
  acceptNecessary: () => void
  updateConsent: (consent: Partial<CookieConsent>) => void
  saveConsent: (consent: CookieConsent) => void
  loadConsent: () => void
  showConsentSettings: () => void
  hideConsentSettings: () => void
  hideBanner: () => void
  revokeConsent: () => void
  hasConsent: (category: 'functional' | 'analytics' | 'marketing') => boolean
}

export const useConsentStore = create<ConsentStore>()(
  persist(
    (set, get) => ({
      // Initial state
      consent: null,
      showBanner: false,
      showSettings: false,
      hasInteracted: false,

      // Accept all cookies
      acceptAll: () => {
        const consent: CookieConsent = {
          necessary: true,
          functional: true,
          analytics: true,
          marketing: true,
          timestamp: new Date().toISOString(),
          version: CONSENT_VERSION,
        }
        
        get().saveConsent(consent)
        set({ 
          consent, 
          showBanner: false, 
          hasInteracted: true 
        })
      },

      // Accept only necessary cookies
      acceptNecessary: () => {
        const consent: CookieConsent = {
          necessary: true,
          functional: false,
          analytics: false,
          marketing: false,
          timestamp: new Date().toISOString(),
          version: CONSENT_VERSION,
        }
        
        get().saveConsent(consent)
        set({ 
          consent, 
          showBanner: false, 
          hasInteracted: true 
        })
      },

      // Update consent preferences
      updateConsent: (updates) => {
        const currentConsent = get().consent
        if (!currentConsent) return

        const consent: CookieConsent = {
          ...currentConsent,
          ...updates,
          necessary: true, // Always true
          timestamp: new Date().toISOString(),
          version: CONSENT_VERSION,
        }

        get().saveConsent(consent)
        set({ consent })
      },

      // Save consent to cookie
      saveConsent: (consent) => {
        // Save to cookie
        Cookies.set(CONSENT_COOKIE_NAME, JSON.stringify(consent), {
          expires: CONSENT_COOKIE_DAYS,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
        })

        // Send to server for logging (optional)
        if (typeof window !== 'undefined') {
          fetch('/api/consent/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ consent }),
          }).catch(console.error)
        }

        // Trigger Google Analytics consent mode update
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('consent', 'update', {
            analytics_storage: consent.analytics ? 'granted' : 'denied',
            ad_storage: consent.marketing ? 'granted' : 'denied',
            functionality_storage: consent.functional ? 'granted' : 'denied',
          })
        }
      },

      // Load consent from cookie
      loadConsent: () => {
        const cookieValue = Cookies.get(CONSENT_COOKIE_NAME)
        
        if (cookieValue) {
          try {
            const consent = JSON.parse(cookieValue) as CookieConsent
            
            // Check if consent version matches
            if (consent.version === CONSENT_VERSION) {
              set({ 
                consent, 
                showBanner: false, 
                hasInteracted: true 
              })
              return
            }
          } catch (error) {
            console.error('Failed to parse consent cookie:', error)
          }
        }

        // No valid consent found, show banner
        set({ 
          showBanner: true, 
          hasInteracted: false 
        })
      },

      // Show consent settings modal
      showConsentSettings: () => {
        set({ showSettings: true })
      },

      // Hide consent settings modal
      hideConsentSettings: () => {
        set({ showSettings: false })
      },

      // Hide banner
      hideBanner: () => {
        set({ showBanner: false })
      },

      // Revoke all consent
      revokeConsent: () => {
        Cookies.remove(CONSENT_COOKIE_NAME)
        set({ 
          consent: null, 
          showBanner: true, 
          hasInteracted: false 
        })

        // Send revocation to server
        if (typeof window !== 'undefined') {
          fetch('/api/consent/revoke', {
            method: 'POST',
          }).catch(console.error)
        }

        // Update Google Analytics consent mode
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('consent', 'update', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            functionality_storage: 'denied',
          })
        }
      },

      // Check if category has consent
      hasConsent: (category) => {
        const consent = get().consent
        if (!consent) return false
        return consent[category]
      },
    }),
    {
      name: 'eventhour-consent-store',
      skipHydration: true,
    }
  )
)