'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { AuthService, AuthUser } from '@eventhour/auth'
import { Container, Section } from '@eventhour/ui'
import { 
  User, 
  Package, 
  Gift, 
  Lock, 
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react'

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser()
      if (!currentUser || currentUser.role !== 'CUSTOMER') {
        router.push('/login?returnUrl=/konto')
        return
      }
      setUser(currentUser)
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/login?returnUrl=/konto')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await AuthService.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navigation = [
    {
      name: 'Übersicht',
      href: '/konto',
      icon: Home,
      active: pathname === '/konto'
    },
    {
      name: 'Mein Profil',
      href: '/konto/profil',
      icon: User,
      active: pathname === '/konto/profil'
    },
    {
      name: 'Bestellungen',
      href: '/konto/bestellungen',
      icon: Package,
      active: pathname === '/konto/bestellungen'
    },
    {
      name: 'Gutscheine',
      href: '/konto/gutscheine',
      icon: Gift,
      active: pathname === '/konto/gutscheine'
    },
    {
      name: 'Passwort ändern',
      href: '/konto/passwort',
      icon: Lock,
      active: pathname === '/konto/passwort'
    }
  ]

  if (loading) {
    return (
      <Section className="py-20">
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eventhour-yellow"></div>
          </div>
        </Container>
      </Section>
    )
  }

  if (!user) {
    return null
  }

  return (
    <Section className="py-8 min-h-screen bg-gray-50">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mein Konto</h1>
          <p className="text-gray-600 mt-1">
            Willkommen zurück, {user.name || user.email}!
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <nav className="bg-white rounded-xl shadow-sm p-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      item.active
                        ? 'bg-eventhour-yellow text-eventhour-black font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              <hr className="my-2" />
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <LogOut className="h-5 w-5" />
                <span>Abmelden</span>
              </button>
            </nav>
          </aside>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden fixed bottom-4 right-4 z-50 p-3 bg-eventhour-yellow text-eventhour-black rounded-full shadow-lg"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
              <div 
                className="absolute right-0 top-0 h-full w-64 bg-white p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <nav className="space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          item.active
                            ? 'bg-eventhour-yellow text-eventhour-black font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                  
                  <hr className="my-2" />
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Abmelden</span>
                  </button>
                </nav>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </Container>
    </Section>
  )
}