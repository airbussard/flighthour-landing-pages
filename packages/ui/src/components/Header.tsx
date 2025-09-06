'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  Heart,
  LogOut,
  Settings,
} from 'lucide-react'
import { Logo } from './Logo'
import { Button } from './Button'
import { CartButton } from './cart/CartButton'
import { clsx } from 'clsx'

export interface HeaderProps {
  user?: {
    name: string
    email: string
  } | null
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const categories = [
    { name: 'Abenteuer & Action', href: '/kategorien/abenteuer-action' },
    { name: 'Wellness & Entspannung', href: '/kategorien/wellness-entspannung' },
    { name: 'Kulinarik & Genuss', href: '/kategorien/kulinarik-genuss' },
    { name: 'Sport & Fitness', href: '/kategorien/sport-fitness' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-eventhour-yellow py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-eventhour-black">
            🎁 Kostenloser Versand ab 50€ | 3 Jahre Gültigkeit
          </p>
        </div>
      </div>

      {/* Main Header */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/erlebnisse"
              className="text-gray-700 hover:text-eventhour-yellow transition-colors font-medium"
            >
              Alle Erlebnisse
            </Link>

            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-eventhour-yellow transition-colors font-medium">
                Kategorien
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {categories.map((category) => (
                  <Link
                    key={category.href}
                    href={category.href}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-eventhour-yellow/10 hover:text-eventhour-black transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/wertgutschein"
              className="text-gray-700 hover:text-eventhour-yellow transition-colors font-medium"
            >
              Wertgutschein
            </Link>

            <Link
              href="/ueber-uns"
              className="text-gray-700 hover:text-eventhour-yellow transition-colors font-medium"
            >
              Über uns
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-700 hover:text-eventhour-yellow transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Favorites */}
            <Link
              href="/favoriten"
              className="p-2 text-gray-700 hover:text-eventhour-yellow transition-colors"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <CartButton />

            {/* User Menu */}
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 text-gray-700 hover:text-eventhour-yellow transition-colors"
                  >
                    <User className="h-5 w-5" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200"
                      >
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            href="/account"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Settings className="inline h-4 w-4 mr-2" />
                            Mein Konto
                          </Link>
                          <Link
                            href="/account/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Meine Bestellungen
                          </Link>
                          <Link
                            href="/account/vouchers"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Meine Gutscheine
                          </Link>
                          <hr className="my-2" />
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <LogOut className="inline h-4 w-4 mr-2" />
                            Abmelden
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link href="/login">
                  <Button size="sm" variant="primary">
                    Anmelden
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-eventhour-yellow transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="py-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nach Erlebnissen suchen..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-eventhour-yellow text-eventhour-black rounded-lg hover:bg-yellow-500 transition-colors">
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl z-50 lg:hidden"
          >
            <div className="p-6">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 p-2"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="mt-8 space-y-4">
                <Link
                  href="/erlebnisse"
                  className="block py-2 text-lg font-medium text-gray-700 hover:text-eventhour-yellow"
                >
                  Alle Erlebnisse
                </Link>

                <div>
                  <p className="py-2 text-lg font-medium text-gray-700">Kategorien</p>
                  <div className="ml-4 space-y-2">
                    {categories.map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        className="block py-1 text-gray-600 hover:text-eventhour-yellow"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href="/wertgutschein"
                  className="block py-2 text-lg font-medium text-gray-700 hover:text-eventhour-yellow"
                >
                  Wertgutschein
                </Link>

                <Link
                  href="/ueber-uns"
                  className="block py-2 text-lg font-medium text-gray-700 hover:text-eventhour-yellow"
                >
                  Über uns
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
