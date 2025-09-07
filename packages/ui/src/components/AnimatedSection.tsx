'use client'

import React, { useRef, useEffect, useState } from 'react'
import { clsx } from 'clsx'

export interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale'
  delay?: number
  duration?: number
  once?: boolean
  staggerChildren?: number
}

// Simple Intersection Observer hook
const useInView = (ref: React.RefObject<HTMLElement>, options?: { once?: boolean; amount?: number }) => {
  const [isInView, setIsInView] = useState(false)
  
  useEffect(() => {
    if (!ref.current) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (options?.once) {
            observer.disconnect()
          }
        } else if (!options?.once) {
          setIsInView(false)
        }
      },
      { threshold: options?.amount || 0.1 }
    )
    
    observer.observe(ref.current)
    
    return () => observer.disconnect()
  }, [ref, options?.once, options?.amount])
  
  return isInView
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.6,
  once = true,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.1 })

  const animationClasses = {
    fadeIn: isInView ? 'opacity-100' : 'opacity-0',
    slideUp: isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
    slideDown: isInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5',
    slideLeft: isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5',
    slideRight: isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5',
    scale: isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
  }

  return (
    <div
      ref={ref}
      className={clsx(
        'transition-all',
        animationClasses[animation],
        className
      )}
      style={{
        transitionDuration: `${duration * 1000}ms`,
        transitionDelay: `${delay * 1000}ms`,
      }}
    >
      {children}
    </div>
  )
}

export interface AnimatedListProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  animation?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale'
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  className,
  staggerDelay = 0.1,
  animation = 'slideUp',
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child, index) => (
        <AnimatedSection
          key={index}
          animation={animation}
          delay={isInView ? index * staggerDelay : 0}
          duration={0.5}
        >
          {child}
        </AnimatedSection>
      ))}
    </div>
  )
}

export interface CounterAnimationProps {
  from?: number
  to: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export const CounterAnimation: React.FC<CounterAnimationProps> = ({
  from = 0,
  to,
  duration = 2,
  suffix = '',
  prefix = '',
  className,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = React.useState(from)

  React.useEffect(() => {
    if (!isInView) return

    const startTime = Date.now()
    const endTime = startTime + duration * 1000

    const updateCount = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / (duration * 1000), 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(from + (to - from) * easeOutQuart)

      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(updateCount)
      }
    }

    requestAnimationFrame(updateCount)
  }, [isInView, from, to, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString('de-DE')}
      {suffix}
    </span>
  )
}
