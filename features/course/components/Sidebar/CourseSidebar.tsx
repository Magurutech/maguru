'use client'

import React from 'react'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { TimelineNavProps, CourseSection as CourseSectionType } from '../../types/course.types'
import { Menu } from 'lucide-react'
import { SidebarHeader } from './components/SidebarHeader'
import { SidebarFooter } from './components/SidebarFooter'
import { CourseSection } from './components/CourseSection'

/**
 * Enhanced Course Sidebar using shadcn/ui components
 * Maintains backward compatibility with TimelineNavProps interface
 */
export function CourseSidebar({
  sections,
  currentSectionId,
  currentItemId,
  completedItems,
  onItemSelect,
  className = ''
}: TimelineNavProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar
        variant="sidebar"
        collapsible="offcanvas"
        className={`bg-gradient-to-b from-beige-50 to-white border border-beige-200 shadow-lg ${className}`}
      >
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <SidebarContent className="bg-gradient-to-b from-beige-50 to-white">
            <SidebarHeader sections={sections} completedItems={completedItems} />

            <div className="flex-1 overflow-y-auto space-y-2 p-2 transition-all duration-300 ease-in-out">
              {sections.map((section: CourseSectionType, index: number) => (
                <div
                  key={section.id}
                  className="transform transition-all duration-500 ease-in-out hover:scale-[1.02] animate-in slide-in-from-left-2"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <CourseSection
                    section={section}
                    currentSectionId={currentSectionId || ''}
                    currentItemId={currentItemId || ''}
                    completedItems={completedItems}
                    onItemSelect={onItemSelect}
                  />
                </div>
              ))}
            </div>

            <SidebarFooter sections={sections} completedItems={completedItems} />
          </SidebarContent>
        </div>

        {/* Mobile Sidebar Trigger */}
        <div className="md:hidden fixed bottom-4 left-4 z-50">
          <SidebarTrigger
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-lg h-14 w-14 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl animate-pulse hover:animate-none border-2 border-red-300 inline-flex items-center justify-center"
            aria-label="Toggle Course Menu"
          >
            <Menu className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" />
          </SidebarTrigger>
        </div>
      </Sidebar>
    </SidebarProvider>
  )
}