import { Button } from '@/components/ui/button'
import React from 'react'
import { useCourseContext } from '../../contexts/courseContext'

const categories = ['All', 'Martial Arts', 'Culture', 'Arts', 'Spirituality', 'Crafts', 'Dance']

export function CategoryTabs() {
  const { selectedCategory, setSelectedCategory } = useCourseContext()

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory(category)}
          className={`transition-all duration-200 ${
            selectedCategory === category
              ? 'bg-primary text-white shadow-lg'
              : 'bg-white/50 border-white/50 hover:bg-white/70'
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  )
}
