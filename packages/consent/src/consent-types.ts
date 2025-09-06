export type CookieCategory = 'necessary' | 'functional' | 'analytics' | 'marketing'

export interface CookieConsent {
  necessary: boolean // Always true
  functional: boolean
  analytics: boolean
  marketing: boolean
  timestamp: string
  version: string
}

export interface CookieInfo {
  name: string
  category: CookieCategory
  description: string
  duration: string
  provider: string
  purpose: string
}

export interface ConsentPreferences {
  consent: CookieConsent
  customerId?: string
  ipAddress?: string
}

export const COOKIE_CATEGORIES = {
  necessary: {
    name: 'Notwendige Cookies',
    description: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
    cookies: [
      {
        name: 'eventhour-session',
        description: 'Session-Cookie für die Authentifizierung',
        duration: 'Session',
        provider: 'Eventhour',
        purpose: 'Benutzeranmeldung und Sicherheit',
      },
      {
        name: 'eventhour-consent',
        description: 'Speichert Ihre Cookie-Einstellungen',
        duration: '365 Tage',
        provider: 'Eventhour',
        purpose: 'Cookie-Einwilligung speichern',
      },
    ],
  },
  functional: {
    name: 'Funktionale Cookies',
    description: 'Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung.',
    cookies: [
      {
        name: 'eventhour-cart',
        description: 'Speichert Ihren Warenkorb',
        duration: '30 Tage',
        provider: 'Eventhour',
        purpose: 'Warenkorb-Funktionalität',
      },
      {
        name: 'eventhour-locale',
        description: 'Speichert Ihre Spracheinstellungen',
        duration: '365 Tage',
        provider: 'Eventhour',
        purpose: 'Sprachpräferenz',
      },
    ],
  },
  analytics: {
    name: 'Analyse-Cookies',
    description: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.',
    cookies: [
      {
        name: '_ga',
        description: 'Google Analytics Cookie',
        duration: '2 Jahre',
        provider: 'Google',
        purpose: 'Website-Nutzungsanalyse',
      },
      {
        name: '_gid',
        description: 'Google Analytics Cookie',
        duration: '24 Stunden',
        provider: 'Google',
        purpose: 'Besucheridentifikation',
      },
    ],
  },
  marketing: {
    name: 'Marketing-Cookies',
    description: 'Diese Cookies werden verwendet, um Werbung relevanter für Sie zu machen.',
    cookies: [
      {
        name: '_fbp',
        description: 'Facebook Pixel',
        duration: '90 Tage',
        provider: 'Facebook',
        purpose: 'Werbung und Retargeting',
      },
      {
        name: 'ads/ga-audiences',
        description: 'Google Ads Remarketing',
        duration: 'Session',
        provider: 'Google',
        purpose: 'Remarketing und Werbung',
      },
    ],
  },
}

export const CONSENT_VERSION = '1.0.0'
export const CONSENT_COOKIE_NAME = 'eventhour-consent'
export const CONSENT_COOKIE_DAYS = 365