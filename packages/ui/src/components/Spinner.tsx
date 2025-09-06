'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'secondary' | 'white' | 'black'
  className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'primary', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const colors = {
    primary: 'border-eventhour-yellow',
    secondary: 'border-eventhour-black',
    white: 'border-white',
    black: 'border-black',
  }

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <motion.div
        className={clsx('rounded-full border-4 border-t-transparent', sizes[size], colors[color])}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  )
}

export interface LoadingOverlayProps {
  isLoading: boolean
  text?: string
  fullScreen?: boolean
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  text = 'Lädt...',
  fullScreen = false,
}) => {
  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={clsx(
        'flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-50',
        fullScreen ? 'fixed inset-0' : 'absolute inset-0 rounded-2xl'
      )}
    >
      <Spinner size="lg" />
      {text && <p className="mt-4 text-gray-600 font-medium">{text}</p>}
    </motion.div>
  )
}
