import { CheckCircle, Target, Users, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CourseDetail } from '@/features/course/types'

interface CourseOverviewProps {
  course: CourseDetail
}

export function CourseOverview({ course }: CourseOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Course Description */}
      <div>
        <h3 className="text-2xl font-bold text-beige-900 mb-4 bg-gradient-to-r from-beige-900 to-primary bg-clip-text">
          About This Course
        </h3>
        <p className="text-beige-800 leading-relaxed text-lg">{course.description}</p>
      </div>

      {/* Learning Outcomes */}
      <Card className="bg-white/30 border-white/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-beige-900">
            <Target className="h-6 w-6 text-primary" />
            What You&apos;ll Learn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.learningOutcomes.map((outcome: string, index: number) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-beige-800">{outcome}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card className="bg-white/30 border-white/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-beige-900">
            <BookOpen className="h-6 w-6 text-primary" />
            Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {course.requirements.map((requirement: string, index: number) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                <span className="text-beige-800">{requirement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Target Audience */}
      <Card className="bg-white/30 border-white/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-beige-900">
            <Users className="h-6 w-6 text-primary" />
            Who This Course Is For
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-beige-800">
            <p>• Beginners interested in Eastern philosophy and wisdom traditions</p>
            <p>• Students of comparative religion and philosophy</p>
            <p>• Professionals seeking mindfulness and ethical guidance</p>
            <p>• Anyone curious about ancient wisdom and its modern applications</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
