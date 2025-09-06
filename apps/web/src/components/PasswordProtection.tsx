'use client'

import React, { useState, FormEvent } from 'react'
import { Lock, AlertCircle } from 'lucide-react'

interface PasswordProtectionProps {
  onSuccess: () => void
}

export function PasswordProtection({ onSuccess }: PasswordProtectionProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(false)

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    if (password === 'flighthourwins') {
      localStorage.setItem('eventhour-auth', 'true')
      onSuccess()
    } else {
      setError(true)
      setPassword('')
    }
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Blurred background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-black/40"></div>
      
      {/* Password form */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-eventhour-yellow rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-eventhour-black" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center mb-2">
            Zugang erforderlich
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Diese Seite befindet sich noch im Aufbau. Bitte geben Sie das Passwort ein.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                Passwort
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Passwort eingeben"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  error 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-eventhour-yellow focus:border-eventhour-yellow'
                }`}
                autoFocus
                disabled={isLoading}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Falsches Passwort. Bitte versuchen Sie es erneut.</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-eventhour-yellow hover:bg-yellow-500 disabled:bg-gray-300 text-eventhour-black font-semibold py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Überprüfe...
                </span>
              ) : (
                'Zugang erhalten'
              )}
            </button>
          </form>

          {/* Footer text */}
          <p className="text-xs text-gray-500 text-center mt-6">
            Eventhour © {new Date().getFullYear()} - System im Aufbau
          </p>
        </div>
      </div>
    </div>
  )
}