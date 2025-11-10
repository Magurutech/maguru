'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { TimelineNavProps } from '../types/course.types'
import {
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Circle,
  PlayCircle,
  Lock,
  BookOpen,
  Clock,
  FileText
} from 'lucide-react'

export function TimelineNav({
  sections,
  currentSectionId,
  currentItemId,
  completedItems,
  onItemSelect,
  className = ''
}: TimelineNavProps) {
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(sections.map(s => s.id)) // Start with all sections open
  )

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections)
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId)
    } else {
      newOpenSections.add(sectionId)
    }
    setOpenSections(newOpenSections)
  }

  const getItemStatus = (sectionId: string, itemId: string) => {
    if (completedItems.includes(itemId)) return 'completed'
    if (currentSectionId === sectionId && currentItemId === itemId) return 'current'
    return 'locked'
  }

  const getItemIcon = (sectionId: string, itemId: string) => {
    const status = getItemStatus(sectionId, itemId)

    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'current':
        return <PlayCircle className="w-4 h-4 text-blue-600 animate-pulse" />
      default:
        return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const getSectionProgress = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section) return 0

    const completedInSection = section.items.filter(item => completedItems.includes(item.id)).length
    return Math.round((completedInSection / section.items.length) * 100)
  }

  const handleItemClick = (sectionId: string, itemId: string) => {
    onItemSelect(sectionId, itemId)
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-beige-200 ${className}`}>
      {/* Mobile Header */}
      <div className="lg:hidden p-4 border-b border-beige-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-beige-900">Daftar Materi</h3>
          <Badge variant="secondary" className="bg-beige-100 text-beige-700">
            {sections.reduce((total, section) => total + section.items.length, 0)} materi
          </Badge>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {sections.map((section, sectionIndex) => {
          const isSectionOpen = openSections.has(section.id)
          const sectionProgress = getSectionProgress(section.id)
          const isCurrentSection = currentSectionId === section.id

          return (
            <div key={section.id} className="border-b border-beige-200 last:border-b-0">
              {/* Section Header */}
              <Collapsible open={isSectionOpen} onOpenChange={() => toggleSection(section.id)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full justify-between px-4 py-3 h-auto hover:bg-beige-50 transition-colors ${
                      isCurrentSection ? 'bg-beige-50 border-l-4 border-l-secondary-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 text-left">
                      {isSectionOpen ? (
                        <ChevronDown className="w-4 h-4 text-beige-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-beige-600" />
                      )}
                      <div>
                        <h4 className="font-semibold text-beige-900 text-sm">
                          {section.title}
                        </h4>
                        <p className="text-xs text-beige-600">
                          {section.items.length} materi
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {sectionProgress > 0 && (
                        <Badge
                          variant="secondary"
                          className={`text-xs ${
                            sectionProgress === 100
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {sectionProgress}%
                        </Badge>
                      )}
                      {isCurrentSection && (
                        <Badge className="bg-blue-500 text-white border-blue-600 text-xs">
                          <PlayCircle className="w-3 h-3 mr-1" />
                          Current
                        </Badge>
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  {/* Section Items */}
                  <div className="px-4 pb-3 space-y-1">
                    {section.items.map((item, itemIndex) => {
                      const status = getItemStatus(section.id, item.id)
                      const isActive = currentSectionId === section.id && currentItemId === item.id

                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className={`w-full justify-start px-3 py-2 h-auto text-left group transition-all ${
                            isActive
                              ? 'bg-secondary-100 border-l-4 border-l-secondary-500'
                              : status === 'completed'
                              ? 'hover:bg-green-50'
                              : 'hover:bg-beige-50'
                          }`}
                          onClick={() => handleItemClick(section.id, item.id)}
                        >
                          <div className="flex items-start gap-3 w-full">
                            {/* Status Icon */}
                            <div className="mt-0.5">
                              {getItemIcon(section.id, item.id)}
                            </div>

                            {/* Item Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <h5
                                    className={`text-sm font-medium line-clamp-2 ${
                                      isActive
                                        ? 'text-secondary-900'
                                        : status === 'completed'
                                        ? 'text-green-900'
                                        : 'text-beige-900'
                                    }`}
                                  >
                                    {item.title}
                                  </h5>

                                  {item.description && (
                                    <p className="text-xs text-beige-600 line-clamp-2 mt-1">
                                      {item.description}
                                    </p>
                                  )}

                                  {/* Item Meta */}
                                  <div className="flex items-center gap-3 mt-2">
                                    <div className="flex items-center gap-1 text-xs text-beige-600">
                                      <FileText className="w-3 h-3" />
                                      <span>{item.contentType}</span>
                                    </div>

                                    {item.duration && (
                                      <div className="flex items-center gap-1 text-xs text-beige-600">
                                        <Clock className="w-3 h-3" />
                                        <span>{item.duration}</span>
                                      </div>
                                    )}

                                    {item.isOptional && (
                                      <Badge variant="outline" className="text-xs">
                                        Opsional
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )
        })}
      </div>

      {/* Mobile Bottom Padding */}
      <div className="lg:hidden h-4"></div>
    </div>
  )
}