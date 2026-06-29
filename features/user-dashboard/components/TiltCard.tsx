'use client'

/**
 * TiltCard Component
 *
 * Wrapper komponen untuk memberikan efek 3D Tilt interaktif pada hover
 * sesuai dengan panduan visual MAGURU Atelier Zero.
 */

import React, { useRef } from 'react'
import { cn } from '@/lib/utils'

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  maxRotation?: number // Maksimum derajat rotasi
  scaleOnHover?: boolean
}

export function TiltCard({
  children,
  className,
  maxRotation = 6,
  scaleOnHover = false,
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const r = card.getBoundingClientRect()
    const x = e.clientX - r.left - r.width / 2
    const y = e.clientY - r.top - r.height / 2
    
    // Hitung derajat rotasi X & Y
    const rotateX = -(y / (r.height / 2)) * maxRotation
    const rotateY = (x / (r.width / 2)) * maxRotation
    
    // Terapkan style
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)${scaleOnHover ? ' scale(1.01)' : ''}`
    card.style.boxShadow = '0 15px 30px -10px rgba(112, 106, 92, 0.15), 0 0 0 1px rgba(237, 111, 92, 0.15)'
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    
    // Reset ke kondisi awal
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)'
    card.style.boxShadow = ''
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: 'preserve-3d' }}
      className={cn(
        'transition-all duration-300 select-none ease-out',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
