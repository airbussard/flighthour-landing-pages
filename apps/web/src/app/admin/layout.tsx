'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Package, 
  ShoppingCart, 
  Settings,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react'
import { useAuth } from '@eventhour/auth'
import { Logo } from '@eventhour/ui'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login'
  
  // Check localStorage fallback
  const [hasLocalAuth, setHasLocalAuth] = useState(false)
  
  useEffect(() => {
    // Check localStorage for fallback auth
    const localAuth = localStorage.getItem('admin-auth')
    setHasLocalAuth(localAuth === 'true')
  }, [pathname])

  // Redirect if not admin (but not on login page)
  useEffect(() => {
    if (!isLoginPage && !loading && user && user.role !== 'ADMIN') {
      router.push('/')
    }
  }, [user, router, isLoginPage, loading])

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Benutzer', href: '/admin/benutzer', icon: Users },
    { name: 'Partner', href: '/admin/partner', icon: Building2 },
    { name: 'Erlebnisse', href: '/admin/erlebnisse', icon: Package },
    { name: 'Bestellungen', href: '/admin/bestellungen', icon: ShoppingCart },
    { name: 'Einstellungen', href: '/admin/einstellungen', icon: Settings },
  ]

  const handleSignOut = async () => {
    // Clear localStorage fallback
    localStorage.removeItem('admin-auth')
    
    // Sign out from Supabase if available
    if (user) {
      await signOut()
    }
    
    router.push('/admin/login')
  }

  // If on login page, just render children without layout
  if (isLoginPage) {
    return <>{children}</>
  }

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eventhour-yellow mx-auto mb-4"></div>
          <p className="text-gray-600">Lade Admin-Bereich...</p>
        </div>
      </div>
    )
  }

  // For other pages, require admin auth (check both Supabase and localStorage fallback)
  const isAuthenticated = (user && user.role === 'ADMIN') || hasLocalAuth
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Zugriff verweigert</h1>
          <p className="text-gray-600 mb-4">Sie haben keine Berechtigung für diesen Bereich.</p>
          <a 
            href="/admin/login" 
            className="text-eventhour-yellow hover:underline"
          >
            Zur Anmeldung
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-eventhour-black text-white transform transition-transform z-50
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8 text-eventhour-yellow" />
                <div>
                  <h2 className="text-xl font-bold">Admin</h2>
                  <p className="text-xs text-gray-400">Control Panel</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-gray-800 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-eventhour-yellow text-eventhour-black font-semibold' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400">{user?.email || 'admin@eventhour.de'}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Abmelden</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
            <Logo />
          </div>
        </div>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}