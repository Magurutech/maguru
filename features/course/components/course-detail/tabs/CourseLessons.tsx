import { Play, FileText, Users, Clock, ChevronDown, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { CourseDetail } from '@/features/course/types'

interface CourseLessonsProps {
  course: CourseDetail
}

export function CourseLessons({ course }: CourseLessonsProps) {
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />
      case 'article':
        return <FileText className="h-4 w-4" />
      case 'interactive':
        return <Users className="h-4 w-4" />
      default:
        return <Play className="h-4 w-4" />
    }
  }

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-800'
      case 'article':
        return 'bg-green-100 text-green-800'
      case 'interactive':
        return 'bg-purple-100 text-purple-800'
      case 'practice':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-beige-900 bg-gradient-to-r from-beige-900 to-primary bg-clip-text">
          Course Curriculum
        </h3>
        <div className="text-sm text-beige-800">
          {course.curriculum.reduce(
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            (total: number, section: any) => total + section.lessons,
            0,
          )}{' '}
          lessons • {course.totalHours} hours
        </div>
      </div>

      <div className="space-y-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {course.curriculum.map((section: any, sectionIndex: number) => (
          <Card key={sectionIndex} className="bg-white/30 border-white/40 backdrop-blur-sm">
            <Collapsible defaultOpen={sectionIndex === 0}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-white/20 transition-colors rounded-t-lg">
                  <CardTitle className="flex items-center justify-between text-beige-900">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold">
                        Section {sectionIndex + 1}: {section.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-beige-800 flex items-center gap-4">
                        <span>{section.lessons} lessons</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {section.duration}
                        </span>
                      </div>
                      <ChevronDown className="h-5 w-5 transition-transform group-data-[state=open]:rotate-180" />
                    </div>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {section.lessons_detail?.map((lesson: any, lessonIndex: number) => (
                      <div
                        key={lessonIndex}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/20 hover:bg-white/30 transition-colors group"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/30">
                            {lesson.preview ? (
                              getLessonIcon(lesson.type)
                            ) : (
                              <Lock className="h-4 w-4 text-beige-800" />
                            )}
                          </div>

                          <div className="flex-1">
                            <h4 className="font-semibold text-beige-900 group-hover:text-primary transition-colors">
                              {lesson.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <Badge className={`text-xs ${getLessonTypeColor(lesson.type)}`}>
                                {lesson.type}
                              </Badge>
                              <span className="text-sm text-beige-800 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {lesson.duration}
                              </span>
                            </div>
                          </div>
                        </div>

                        {lesson.preview && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary-600 hover:bg-primary/10"
                          >
                            Preview
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  )
}
