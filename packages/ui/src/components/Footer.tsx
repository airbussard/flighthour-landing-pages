'use client'

import React from 'react'
import Link from 'next/link'
import { Logo } from './Logo'
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck,
} from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Features Bar */}
      <div className="bg-eventhour-yellow py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center space-x-3">
              <Truck className="h-8 w-8 text-eventhour-black" />
              <div>
                <p className="font-bold text-eventhour-black">Kostenloser Versand</p>
                <p className="text-sm text-eventhour-black/80">Ab 50€ Bestellwert</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Shield className="h-8 w-8 text-eventhour-black" />
              <div>
                <p className="font-bold text-eventhour-black">Sichere Zahlung</p>
                <p className="text-sm text-eventhour-black/80">SSL-verschlüsselt</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CreditCard className="h-8 w-8 text-eventhour-black" />
              <div>
                <p className="font-bold text-eventhour-black">3 Jahre Gültigkeit</p>
                <p className="text-sm text-eventhour-black/80">Flexible Einlösung</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & About */}
          <div className="lg:col-span-2">
            <Logo size="lg" variant="light" />
            <p className="mt-4 text-gray-400">
              Eventhour ist dein Partner für unvergessliche Erlebnisse. Von Abenteuer bis Wellness -
              wir haben für jeden das passende Geschenk.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-eventhour-yellow transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-eventhour-yellow transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-eventhour-yellow transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-eventhour-yellow transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Erlebnisse</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/kategorien/abenteuer-action"
                  className="text-gray-400 hover:text-eventhour-yellow transition-colors"
                >
                  Abenteuer & Action
                </Link>
              </li>
              <li>
                <Link
                  href="/kategorien/wellness-entspannung"
                  className="text-gray-400 hover:text-eventhour-yellow transition-colors"
                >
                  Wellness & Entspannung
                </Link>
              </li>
              <li>
                <Link
                  href="/kategorien/kulinarik-genuss"
                  className="text-gray-400 hover:text-eventhour-yellow transition-colors"
                >
                  Kulinarik & Genuss
                </Link>
              </li>
              <li>
                <Link
                  href="/kategorien/sport-fitness"
                  className="text-gray-400 hover:text-eventhour-yellow transition-colors"
                >
                  Sport & Fitness
                </Link>
              </li>
              <li>
                <Link
                  href="/wertgutschein"
                  className="text-gray-400 hover:text-eventhour-yellow transition-colors"
                >
                  Wertgutschein
                </Link>
              </li>
            </ul>
          </div>

          {/* Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/hilfe"
                  className="text-gray-400 hover:text-eventhour-yellow transition-colors"
                >
                  Hilfe & FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/kontakt"
                  className="text-gray-400 hover:text-eventhour-yellow transition-colors"
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <Link
                  href="/gutschein-einloesen"
                  className="text-gray-400 hover:text-eventhour-yellow transition-colors"
                >
                  Gutschein einlösen
                </Link>
              </li>
              <li>
                <Link
                  href="/partner-werden"
                  className="text-gray-400 hover:text-eventhour-yellow transition-colors"
                >
                  Partner werden
                </Link>
              </li>
              <li>
                <Link
                  href="/corporate"
                  className="text-gray-400 hover:text-eventhour-yellow transition-colors"
                >
                  Firmenkunden
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-eventhour-yellow mt-0.5" />
                <div>
                  <p className="text-gray-400">+49 (0) 30 123 456 78</p>
                  <p className="text-sm text-gray-500">Mo-Fr: 9-18 Uhr</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-eventhour-yellow mt-0.5" />
                <a
                  href="mailto:info@eventhour.de"
                  className="text-gray-400 hover:text-eventhour-yellow transition-colors"
                >
                  info@eventhour.de
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-eventhour-yellow mt-0.5" />
                <div className="text-gray-400">
                  <p>Eventhour GmbH</p>
                  <p>Beispielstraße 123</p>
                  <p>10115 Berlin</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-6">
              Erhalte exklusive Angebote und Neuigkeiten direkt in dein Postfach
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Deine E-Mail-Adresse"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow focus:border-transparent text-white placeholder-gray-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-eventhour-yellow text-eventhour-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
              >
                Anmelden
              </button>
            </form>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <img
              src="/payment/visa.svg"
              alt="Visa"
              className="h-8 opacity-60 hover:opacity-100 transition-opacity"
            />
            <img
              src="/payment/mastercard.svg"
              alt="Mastercard"
              className="h-8 opacity-60 hover:opacity-100 transition-opacity"
            />
            <img
              src="/payment/paypal.svg"
              alt="PayPal"
              className="h-8 opacity-60 hover:opacity-100 transition-opacity"
            />
            <img
              src="/payment/klarna.svg"
              alt="Klarna"
              className="h-8 opacity-60 hover:opacity-100 transition-opacity"
            />
            <img
              src="/payment/sepa.svg"
              alt="SEPA"
              className="h-8 opacity-60 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Eventhour GmbH. Alle Rechte vorbehalten.
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 mt-4 md:mt-0">
              <Link
                href="/impressum"
                className="text-gray-400 hover:text-eventhour-yellow transition-colors text-sm"
              >
                Impressum
              </Link>
              <Link
                href="/datenschutz"
                className="text-gray-400 hover:text-eventhour-yellow transition-colors text-sm"
              >
                Datenschutz
              </Link>
              <Link
                href="/agb"
                className="text-gray-400 hover:text-eventhour-yellow transition-colors text-sm"
              >
                AGB
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-eventhour-yellow transition-colors text-sm"
              >
                Cookies
              </Link>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    const event = new CustomEvent('showCookieSettings')
                    window.dispatchEvent(event)
                  }
                }}
                className="text-gray-400 hover:text-eventhour-yellow transition-colors text-sm"
              >
                Cookie-Einstellungen
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
