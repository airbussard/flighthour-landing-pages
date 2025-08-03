export interface CookiePreferences {
  necessary: boolean
  functional: boolean
  marketing: boolean
}

export interface CookieDetails {
  name: string
  description: string
  category: 'necessary' | 'functional' | 'marketing'
  duration: string
}

export const COOKIE_CONSENT_KEY = 'flighthour-cookie-consent'

export const cookieDetails: CookieDetails[] = [
  {
    name: 'Session Cookie',
    description: 'Speichert Ihre Sitzungsinformationen für die Dauer Ihres Besuchs.',
    category: 'necessary',
    duration: 'Sitzung',
  },
  {
    name: 'Cookie-Einstellungen',
    description: 'Speichert Ihre Cookie-Präferenzen.',
    category: 'necessary',
    duration: '1 Jahr',
  },
  {
    name: 'Spracheinstellungen',
    description: 'Speichert Ihre bevorzugte Sprache.',
    category: 'functional',
    duration: '1 Jahr',
  },
  {
    name: 'Google Analytics',
    description: 'Sammelt anonyme Statistiken zur Website-Nutzung.',
    category: 'marketing',
    duration: '2 Jahre',
  },
  {
    name: 'Facebook Pixel',
    description: 'Ermöglicht personalisierte Werbung auf Facebook.',
    category: 'marketing',
    duration: '90 Tage',
  },
]

export class CookieManager {
  private static instance: CookieManager
  private preferences: CookiePreferences = {
    necessary: true,
    functional: false,
    marketing: false,
  }
  private listeners: Array<(prefs: CookiePreferences) => void> = []

  private constructor() {
    this.loadPreferences()
  }

  static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager()
    }
    return CookieManager.instance
  }

  loadPreferences(): void {
    if (typeof window === 'undefined') return

    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored) {
      try {
        this.preferences = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse cookie preferences:', e)
      }
    }
  }

  savePreferences(preferences: CookiePreferences): void {
    if (typeof window === 'undefined') return

    this.preferences = preferences
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences))
    this.notifyListeners()
    this.applyPreferences()
  }

  getPreferences(): CookiePreferences {
    return { ...this.preferences }
  }

  hasConsent(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(COOKIE_CONSENT_KEY) !== null
  }

  acceptAll(): void {
    this.savePreferences({
      necessary: true,
      functional: true,
      marketing: true,
    })
  }

  rejectAll(): void {
    this.savePreferences({
      necessary: true,
      functional: false,
      marketing: false,
    })
  }

  addListener(listener: (prefs: CookiePreferences) => void): void {
    this.listeners.push(listener)
  }

  removeListener(listener: (prefs: CookiePreferences) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener)
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.preferences))
  }

  private applyPreferences(): void {
    // Google Analytics
    if (this.preferences.marketing && typeof window !== 'undefined') {
      // Enable GA if not already loaded
      if (!(window as any).gtag) {
        const script = document.createElement('script')
        script.src = 'https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID'
        script.async = true
        document.head.appendChild(script)

        ;(window as any).dataLayer = (window as any).dataLayer || []
        ;(window as any).gtag = function (...args: any[]) {
          ;(window as any).dataLayer.push(args)
        }
        ;(window as any).gtag('js', new Date())
        ;(window as any).gtag('config', 'YOUR_GA_ID', {
          anonymize_ip: true,
        })
      }
    } else if (!this.preferences.marketing && typeof window !== 'undefined') {
      // Disable GA
      if ((window as any).gtag) {
        ;(window as any).gtag('consent', 'update', {
          analytics_storage: 'denied',
        })
      }
    }

    // Facebook Pixel
    if (this.preferences.marketing && typeof window !== 'undefined') {
      // Enable FB Pixel if not already loaded
      if (!(window as any).fbq) {
        const script = document.createElement('script')
        script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', 'YOUR_FB_PIXEL_ID');
          fbq('track', 'PageView');
        `
        document.head.appendChild(script)
      }
    }
  }
}