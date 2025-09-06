'use client'

import React from 'react'
import { Header, Footer } from '@eventhour/ui'
import { useAuth } from '@eventhour/auth'

export interface RootLayoutProps {
  children: React.ReactNode
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user ? { name: user.name || 'User', email: user.email } : null} cartCount={0} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
