'use client'

import { useCourseManagement } from '../hooks/useCourseManagement'
import { useState } from 'react'

export function CourseHeader() {
  // Component state untuk UI interactions
  const [isHovered, setIsHovered] = useState(false)
  
  // Feature state dari hook
  const { courses, isLoading } = useCourseManagement()

  return (
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-magical-sunset rounded-2xl blur-xl opacity-30"></div>
      <div 
        className={`relative glass-panel rounded-2xl p-8 border border-beige-300 transition-all duration-300 ${
          isHovered ? 'hover-lift scale-[1.02]' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-beige-900 mb-2 font-serif">
              🏛️ Kelola Kursus Anda
            </h1>
            <p className="text-beige-700 text-lg">
              {isLoading 
                ? 'Memuat data kursus...' 
                : `Ciptakan petualangan belajar yang menakjubkan untuk murid-murid Anda (${courses.length} kursus)`
              }
            </p>
          </div>
          <div className={`text-6xl opacity-20 transition-transform duration-300 ${
            isHovered ? 'whimsical-bounce scale-110' : 'whimsical-bounce'
          }`}>
            🌸
          </div>
        </div>
      </div>
    </div>
  )
} 