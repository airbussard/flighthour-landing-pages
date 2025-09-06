import { useConsentStore } from './consent-store'

export class ConsentManager {
  private static instance: ConsentManager
  private initialized = false

  private constructor() {}

  static getInstance(): ConsentManager {
    if (!ConsentManager.instance) {
      ConsentManager.instance = new ConsentManager()
    }
    return ConsentManager.instance
  }

  /**
   * Initialize consent management
   * Should be called once on app load
   */
  initialize() {
    if (this.initialized || typeof window === 'undefined') return
    
    this.initialized = true
    
    // Load consent from cookie
    useConsentStore.getState().loadConsent()
    
    // Initialize Google Analytics in consent mode
    this.initializeGoogleAnalytics()
    
    // Set up consent mode defaults
    this.setConsentDefaults()
  }

  /**
   * Initialize Google Analytics with consent mode
   */
  private initializeGoogleAnalytics() {
    if (typeof window === 'undefined') return
    
    const consent = useConsentStore.getState().consent
    
    // Initialize gtag with consent defaults
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    (window as any).gtag = gtag
    
    gtag('consent', 'default', {
      analytics_storage: consent?.analytics ? 'granted' : 'denied',
      ad_storage: consent?.marketing ? 'granted' : 'denied',
      functionality_storage: consent?.functional ? 'granted' : 'denied',
      wait_for_update: 500,
    })
    
    // Only load GA script if analytics consent is given
    if (consent?.analytics && process.env.NEXT_PUBLIC_GA_ID) {
      this.loadGoogleAnalytics()
    }
  }

  /**
   * Load Google Analytics script
   */
  private loadGoogleAnalytics() {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_GA_ID) return
    
    // Check if already loaded
    if (document.getElementById('ga-script')) return
    
    const script = document.createElement('script')
    script.id = 'ga-script'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
    document.head.appendChild(script)
    
    script.onload = () => {
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        anonymize_ip: true,
      })
    }
  }

  /**
   * Load Facebook Pixel
   */
  private loadFacebookPixel() {
    if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_FB_PIXEL_ID) return
    
    // Check if already loaded
    if ((window as any).fbq) return
    
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
      fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
      fbq('track', 'PageView');
    `
    document.head.appendChild(script)
  }

  /**
   * Set consent defaults for various services
   */
  private setConsentDefaults() {
    const consent = useConsentStore.getState().consent
    
    // Load scripts based on consent
    if (consent?.analytics) {
      this.loadGoogleAnalytics()
    }
    
    if (consent?.marketing) {
      this.loadFacebookPixel()
    }
  }

  /**
   * Track an event (only if analytics consent is given)
   */
  trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (!useConsentStore.getState().hasConsent('analytics')) return
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, parameters)
    }
  }

  /**
   * Track a page view (only if analytics consent is given)
   */
  trackPageView(path: string) {
    if (!useConsentStore.getState().hasConsent('analytics')) return
    
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: path,
      })
    }
  }

  /**
   * Check if a specific cookie category has consent
   */
  hasConsent(category: 'functional' | 'analytics' | 'marketing'): boolean {
    return useConsentStore.getState().hasConsent(category)
  }

  /**
   * Get current consent state
   */
  getConsent() {
    return useConsentStore.getState().consent
  }

  /**
   * Show consent settings
   */
  showSettings() {
    useConsentStore.getState().showConsentSettings()
  }
}

// Export singleton instance
export const consentManager = ConsentManager.getInstance()

// Declare global types
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
    fbq: (...args: any[]) => void
  }
}