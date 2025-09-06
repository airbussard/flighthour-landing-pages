'use client'

import React from 'react'
import { clsx } from 'clsx'
import { LucideIcon } from 'lucide-react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center rounded-full font-medium'

  const variants = {
    default: 'bg-eventhour-yellow/10 text-eventhour-black',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  return (
    <span className={clsx(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {LeftIcon && <LeftIcon className="w-4 h-4 mr-1" />}
      {children}
      {RightIcon && <RightIcon className="w-4 h-4 ml-1" />}
    </span>
  )
}
