'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import {
  ChevronDown,
  PlayCircle,
  CheckCircle,
  Circle,
  FileText,
  Clock,
} from 'lucide-react'
import { CourseSection as CourseSectionType, type CourseItem } from '../../../types/course.types'

interface CourseSectionProps {
  section: CourseSectionType
  currentSectionId: string
  currentItemId: string
  completedItems: string[]
  onItemSelect: (sectionId: string, itemId: string) => void
}

/**
 * Course Section component - renders individual course sections with collapsible behavior
 */
export function CourseSection({
  section,
  currentSectionId,
  currentItemId,
  completedItems,
  onItemSelect
}: CourseSectionProps) {
  const [isOpen, setIsOpen] = React.useState(true)

  const sectionProgress = React.useMemo(() => {
    const completedInSection = section.items.filter((item: CourseItem) => completedItems.includes(item.id)).length
    return Math.round((completedInSection / section.items.length) * 100)
  }, [section.items, completedItems])

  const isCurrentSection = currentSectionId === section.id

  return (
    <SidebarGroup>
      <SidebarGroupLabel
        className={`px-3 py-2 cursor-pointer transition-all duration-300 ease-in-out rounded-lg ${
          isCurrentSection
            ? 'bg-gradient-to-r from-red-50 to-beige-50 border-l-4 border-l-red-500 shadow-sm'
            : 'hover:bg-gradient-to-r hover:from-beige-50 hover:to-white hover:shadow-sm'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <ChevronDown
              className={`w-4 h-4 text-beige-600 transition-transform duration-300 ${
                isOpen ? 'rotate-0' : '-rotate-90'
              }`}
            />
            <span className="font-medium text-beige-900 text-sm">{section.title}</span>
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

            <span className="text-xs text-beige-600">
              {section.items.length} materi
            </span>
          </div>
        </div>
      </SidebarGroupLabel>

      <SidebarGroupContent
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <SidebarMenu>
          {section.items.map((item: CourseItem) => (
            <CourseItem
              key={item.id}
              item={item}
              sectionId={section.id}
              currentSectionId={currentSectionId}
              currentItemId={currentItemId}
              completedItems={completedItems}
              onItemSelect={onItemSelect}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

/**
 * Course Item component - renders individual course items with status indicators
 */
interface CourseItemProps {
  item: CourseItem
  sectionId: string
  currentSectionId: string
  currentItemId: string
  completedItems: string[]
  onItemSelect: (sectionId: string, itemId: string) => void
}

function CourseItem({
  item,
  sectionId,
  currentSectionId,
  currentItemId,
  completedItems,
  onItemSelect
}: CourseItemProps) {
  const status = React.useMemo(() => {
    if (completedItems.includes(item.id)) return 'completed'
    if (currentSectionId === sectionId && currentItemId === item.id) return 'current'
    return 'locked'
  }, [completedItems, item.id, currentSectionId, currentItemId, sectionId])

  const isActive = currentSectionId === sectionId && currentItemId === item.id

  const getItemIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600 transition-all duration-300 group-hover:scale-110" />
      case 'current':
        return <PlayCircle className="w-4 h-4 text-red-600 animate-pulse transition-all duration-300 group-hover:scale-110" />
      default:
        return <Circle className="w-4 h-4 text-gray-400 transition-all duration-300 group-hover:scale-110" />
    }
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        onClick={() => onItemSelect(sectionId, item.id)}
        className={`w-full justify-start px-3 py-3 h-auto text-left group transition-all duration-300 ease-in-out rounded-md ${
          isActive
            ? 'bg-gradient-to-r from-red-100 to-red-50 border-l-4 border-l-red-500 shadow-sm'
            : status === 'completed'
            ? 'hover:bg-gradient-to-r hover:from-green-50 hover:to-green-25 hover:shadow-sm'
            : 'hover:bg-gradient-to-r hover:from-beige-50 hover:to-white hover:shadow-sm'
        }`}
      >
        <div className="flex items-start gap-3 w-full">
          <div className="mt-0.5">
            {getItemIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h5
                  className={`text-sm font-medium line-clamp-2 ${
                    isActive
                      ? 'text-merah-900'
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
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}