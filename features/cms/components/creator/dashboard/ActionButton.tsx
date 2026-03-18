import React from 'react'
import { Button } from '@/components/ui/button'

interface ActionButtonProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  variant: 'default' | 'outline'
  colorScheme?: 'merah' | 'kuning' | 'hijau' | 'beige'
  onClick?: () => void
  className?: string
}

const variantStyles = {
  default: {
    merah: 'bg-merah-500 hover:bg-merah-600 text-white',
    kuning: 'bg-kuning-500 hover:bg-kuning-600 text-white',
    hijau: 'bg-hijau-500 hover:bg-hijau-600 text-white',
    beige: 'bg-beige-500 hover:bg-beige-600 text-white'
  },
  outline: {
    merah: 'border-merah-300 text-merah-700 hover:bg-merah-50 hover:border-merah-500',
    kuning: 'border-kuning-300 text-kuning-700 hover:bg-kuning-50 hover:border-kuning-500',
    hijau: 'border-hijau-300 text-hijau-700 hover:bg-hijau-50 hover:border-hijau-500',
    beige: 'border-beige-300 text-beige-700 hover:bg-beige-50 hover:border-beige-500'
  }
}

export function ActionButton({
  icon: Icon,
  label,
  variant,
  colorScheme = 'merah',
  onClick,
  className = ''
}: ActionButtonProps) {
  const baseStyles = "h-20 flex flex-col items-center justify-center hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
  const variantClasses = variantStyles[variant][colorScheme]

  return (
    <Button
      variant={variant}
      onClick={onClick}
      className={`${baseStyles} ${variantClasses} ${className}`}
    >
      <Icon className="w-6 h-6 mb-2" />
      {label}
    </Button>
  )
}