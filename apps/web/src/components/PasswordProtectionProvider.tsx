'use client'

import React, { useState, useEffect } from 'react'
import { PasswordProtection } from './PasswordProtection'

interface PasswordProtectionProviderProps {
  children: React.ReactNode
}

export function PasswordProtectionProvider({ children }: PasswordProtectionProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user has already entered the password
    const hasAuth = localStorage.getItem('eventhour-auth') === 'true'
    setIsAuthenticated(hasAuth)
  }, [])

  const handleAuthSuccess = () => {
    setIsAuthenticated(true)
  }

  // Show nothing while checking auth status (prevents flash)
  if (isAuthenticated === null) {
    return null
  }

  // Show password protection if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        {/* Render children in background (blurred) */}
        <div className="min-h-screen">
          {children}
        </div>
        <PasswordProtection onSuccess={handleAuthSuccess} />
      </>
    )
  }

  // Show normal app if authenticated
  return <>{children}</>
}