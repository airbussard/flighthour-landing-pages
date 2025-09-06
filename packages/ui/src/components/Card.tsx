'use client'

import React from 'react'
import { HTMLMotionProps, motion } from 'framer-motion'
import { clsx } from 'clsx'

export interface CardProps extends HTMLMotionProps<"div"> {
  variant?: 'elevated' | 'flat' | 'outlined'
  hoverable?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'none'
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      variant = 'elevated',
      hoverable = false,
      padding = 'md',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'bg-white rounded-2xl'

    const variants = {
      elevated: 'shadow-lg',
      flat: 'border border-gray-200',
      outlined: 'border-2 border-eventhour-black',
    }

    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    const hoverStyles = hoverable
      ? 'transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer'
      : ''

    return (
      <motion.div
        ref={ref}
        className={clsx(
          baseStyles,
          variants[variant],
          paddings[padding],
          hoverStyles,
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={hoverable ? { y: -8 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={clsx('pb-4', className)} {...props}>
      {children}
    </div>
  )
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={clsx('', className)} {...props}>
      {children}
    </div>
  )
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={clsx('pt-4 border-t border-gray-200', className)} {...props}>
      {children}
    </div>
  )
}