'use client'

import { Check } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'

/**
 * CourseNavigation Component
 * 
 * Sidebar navigation showing sections and lessons with progress indicators.
 * Uses shadcn/ui Sidebar component for consistent UI.
 * 
 * Requirements: 5.1, 5.2, 6.4
 * Task: 9.1
 * 
 * @param sections - Array of sections with lessons
 * @param currentLessonId - ID of currently active lesson
 * @param onLessonClick - Callback when lesson is clicked
 */

interface CourseNavigationProps {
  sections: Array<{
    id: string
    title: string
    lessons: Array<{
      id: string
      title: string
      completed: boolean
    }>
  }>
  currentLessonId: string
  onLessonClick: (lessonId: string) => void
}

export function CourseNavigation({ 
  sections, 
  currentLessonId, 
  onLessonClick 
}: CourseNavigationProps) {
  return (
    <Sidebar>
      <SidebarContent>
        {sections.map((section) => (
          <Collapsible 
            key={section.id} 
            defaultOpen 
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="w-full">
                  <span className="flex-1 text-left">{section.title}</span>
                  <ChevronDown 
                    className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" 
                    aria-hidden="true"
                  />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.lessons.map((lesson) => {
                      const isActive = currentLessonId === lesson.id
                      
                      return (
                        <SidebarMenuItem key={lesson.id}>
                          <SidebarMenuButton
                            onClick={() => onLessonClick(lesson.id)}
                            isActive={isActive}
                            className="lesson-menu-item"
                            aria-current={isActive ? 'page' : undefined}
                          >
                            {lesson.completed && (
                              <Check 
                                className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" 
                                aria-label="Completed"
                              />
                            )}
                            <span className="flex-1">{lesson.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
