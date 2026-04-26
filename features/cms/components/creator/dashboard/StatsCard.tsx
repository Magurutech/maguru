import React from 'react'

interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  value: string | number
  subtitle?: string
  iconColor: 'hijau' | 'kuning' | 'merah' | 'beige'
  className?: string
}

const colorMap = {
  hijau: {
    bg: 'bg-hijau-100',
    text: 'text-hijau-600'
  },
  kuning: {
    bg: 'bg-kuning-100',
    text: 'text-kuning-600'
  },
  merah: {
    bg: 'bg-merah-100',
    text: 'text-merah-600'
  },
  beige: {
    bg: 'bg-beige-100',
    text: 'text-beige-600'
  }
}

export function StatsCard({
  icon: Icon,
  title,
  value,
  subtitle,
  iconColor,
  className = ''
}: StatsCardProps) {
  const colors = colorMap[iconColor]

  return (
    <div className={`bg-white rounded-lg shadow-neu border border-beige-200 p-6 hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-10 h-10 ${colors.bg} rounded-lg`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-beige-600">{title}</p>
          <p className="text-2xl font-bold text-beige-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-beige-500">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}