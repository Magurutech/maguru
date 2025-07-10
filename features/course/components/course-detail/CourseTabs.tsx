'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CourseOverview } from './tabs/CourseOverview'
import { CourseLessons } from './tabs/CourseLessons'
import { CourseReviews } from './tabs/CourseReviews'
import { Course } from './CourseDetailPage'

interface CourseTabsProps {
  course: Course
}

export function CourseTabs({ course }: CourseTabsProps) {
  return (
    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl overflow-hidden shadow-xl">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm border-b border-white/20 rounded-none h-14">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[#FF4D4D] data-[state=active]:text-white data-[state=active]:shadow-lg text-[#7B5B2C] font-semibold transition-all duration-200 rounded-xl mx-2 my-2"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="lessons"
            className="data-[state=active]:bg-[#FF4D4D] data-[state=active]:text-white data-[state=active]:shadow-lg text-[#7B5B2C] font-semibold transition-all duration-200 rounded-xl mx-2 my-2"
          >
            Lessons
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="data-[state=active]:bg-[#FF4D4D] data-[state=active]:text-white data-[state=active]:shadow-lg text-[#7B5B2C] font-semibold transition-all duration-200 rounded-xl mx-2 my-2"
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        <div className="p-6">
          <TabsContent value="overview" className="mt-0">
            <CourseOverview course={course} />
          </TabsContent>

          <TabsContent value="lessons" className="mt-0">
            <CourseLessons course={course} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-0">
            <CourseReviews course={course} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
