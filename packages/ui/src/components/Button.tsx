'use client'

import React from 'react'
import { motion, MotionProps } from 'framer-motion'
import { clsx } from 'clsx'
import { LucideIcon } from 'lucide-react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    MotionProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth = false,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-[10px] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary:
        'bg-eventhour-yellow text-eventhour-black hover:scale-105 hover:shadow-lg active:scale-100',
      secondary:
        'bg-eventhour-black text-white hover:scale-105 hover:shadow-lg active:scale-100',
      outline:
        'border-2 border-eventhour-black text-eventhour-black hover:bg-eventhour-black hover:text-white active:scale-95',
      ghost: 'text-eventhour-black hover:bg-gray-100 active:scale-95',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[52px]',
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.05 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Lädt...
          </>
        ) : (
          <>
            {LeftIcon && <LeftIcon className="w-5 h-5 mr-2" />}
            {children}
            {RightIcon && <RightIcon className="w-5 h-5 ml-2" />}
          </>
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'