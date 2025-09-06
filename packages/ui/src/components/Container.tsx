'use client'

import React from 'react'
import { clsx } from 'clsx'

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: boolean
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'lg',
  padding = true,
  ...props
}) => {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full',
  }

  return (
    <div
      className={clsx(sizes[size], 'mx-auto', padding && 'px-4 sm:px-6 lg:px-8', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'yellow' | 'black' | 'gray'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Section: React.FC<SectionProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'lg',
  ...props
}) => {
  const variants = {
    default: 'bg-white',
    yellow: 'bg-eventhour-yellow',
    black: 'bg-eventhour-black text-white',
    gray: 'bg-gray-50',
  }

  const paddings = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-20',
    xl: 'py-32',
  }

  return (
    <section className={clsx(variants[variant], paddings[padding], className)} {...props}>
      {children}
    </section>
  )
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 'sm' | 'md' | 'lg'
  responsive?: boolean
}

export const Grid: React.FC<GridProps> = ({
  children,
  className,
  cols = 3,
  gap = 'md',
  responsive = true,
  ...props
}) => {
  const columns = {
    1: 'grid-cols-1',
    2: responsive ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2',
    3: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
    4: responsive ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-4',
    5: responsive ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5' : 'grid-cols-5',
    6: responsive ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' : 'grid-cols-6',
  }

  const gaps = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  }

  return (
    <div className={clsx('grid', columns[cols], gaps[gap], className)} {...props}>
      {children}
    </div>
  )
}
