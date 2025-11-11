'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, List } from 'lucide-react'

interface CourseTabsProps {
  course: any
  progress?: any
  className?: string
  onTabChange?: (activeTab: string) => void
}

export function CourseTabs({
  course,
  progress,
  className = '',
  onTabChange
}: CourseTabsProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    onTabChange?.(value)
  }

  return (
    <div className={`w-full ${className}`}>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <BookOpen className="w-4 h-4" />
            Ringkasan
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <List className="w-4 h-4" />
            Kurikulum
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="prose prose-gray max-w-none">
              {course.overviewContent ? (
                <div className="space-y-4">
                  {/* Render overview content - ini akan di-handle oleh OverviewRenderer */}
                  <div
                    dangerouslySetInnerHTML={{ __html: course.overviewContent }}
                    className="text-beige-700 leading-relaxed"
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-beige-300 mx-auto mb-4" />
                  <p className="text-beige-600">
                    Ringkasan kursus belum tersedia
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-0">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Timeline preview - ini akan di-handle oleh TimelinePreview */}
            <div className="space-y-6">
              {course.sections?.length > 0 ? (
                course.sections.map((section: any, index: number) => (
                  <div key={section.id} className="border-l-4 border-beige-300 pl-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-beige-900">
                        {section.title}
                      </h3>
                      <span className="text-sm text-beige-600 bg-beige-100 px-2 py-1 rounded">
                        {section.items.length} materi
                      </span>
                    </div>

                    {section.description && (
                      <p className="text-beige-700 mb-3">{section.description}</p>
                    )}

                    <div className="space-y-2">
                      {section.items.slice(0, 3).map((item: any) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 text-sm p-2 rounded hover:bg-beige-50 transition-colors"
                        >
                          <div className="w-2 h-2 rounded-full bg-beige-400"></div>
                          <span className="text-beige-700">{item.title}</span>
                          {item.duration && (
                            <span className="text-beige-500 ml-auto">{item.duration}</span>
                          )}
                        </div>
                      ))}
                      {section.items.length > 3 && (
                        <div className="text-beige-500 text-sm italic">
                          +{section.items.length - 3} materi lagi...
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <List className="w-12 h-12 text-beige-300 mx-auto mb-4" />
                  <p className="text-beige-600">
                    Kurikulum kursus belum tersedia
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}