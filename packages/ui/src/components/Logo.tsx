'use client'

import React from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'

export interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  href?: string
  showText?: boolean
  variant?: 'default' | 'light'
}

export const Logo: React.FC<LogoProps> = ({
  className,
  size = 'md',
  href = '/',
  showText = true,
  variant = 'default',
}) => {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-5xl',
  }

  const hourColor = variant === 'light' ? 'text-gray-100' : 'text-gray-800'

  const logoContent = (
    <div
      className={clsx(
        'font-avant-garde font-black uppercase tracking-tight',
        sizes[size],
        className
      )}
    >
      <span className="text-eventhour-yellow">EVENT</span>
      <span className={hourColor}>HOUR</span>
      {showText && (
        <span className="block text-xs font-normal text-gray-600 mt-1 tracking-wider">
          Unvergessliche Erlebnisse
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block hover:scale-105 transition-transform duration-300">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

export const LogoIcon: React.FC<{ className?: string; size?: number }> = ({
  className,
  size = 40,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="100" height="100" rx="20" fill="#FBB928" />
      <text
        x="50"
        y="45"
        fontSize="36"
        fontWeight="900"
        textAnchor="middle"
        fill="#000001"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        E
      </text>
      <text
        x="50"
        y="75"
        fontSize="36"
        fontWeight="900"
        textAnchor="middle"
        fill="#000001"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        H
      </text>
    </svg>
  )
}
