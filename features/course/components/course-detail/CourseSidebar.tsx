import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Calendar, Globe, Award, Download, Clock, BookOpen, Video, FileText } from 'lucide-react'
import Image from 'next/image'
import type { CourseDetail } from '@/features/course/types'

interface CourseSidebarProps {
  course: CourseDetail
}

export function CourseSidebar({ course }: CourseSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Course Progress (if enrolled) */}
      {course.enrolled && (
        <Card className="bg-white/30 border-white/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-beige-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-beige-800">Course Completion</span>
                  <span className="text-beige-900 font-semibold">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div className="text-sm text-beige-800">
                <p>13 of 20 lessons completed</p>
                <p>Next: Confucian Ethics in Practice</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Stats */}
      <Card className="bg-white/30 border-white/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-beige-900">Course Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/20 rounded-lg">
              <Video className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-beige-900">{course.videosCount}</div>
              <div className="text-xs text-beige-800">Videos</div>
            </div>
            <div className="text-center p-3 bg-white/20 rounded-lg">
              <FileText className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-beige-900">{course.articlesCount}</div>
              <div className="text-xs text-beige-800">Articles</div>
            </div>
            <div className="text-center p-3 bg-white/20 rounded-lg">
              <Download className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-beige-900">
                {course.downloadableResources}
              </div>
              <div className="text-xs text-beige-800">Resources</div>
            </div>
            <div className="text-center p-3 bg-white/20 rounded-lg">
              <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-beige-900">{course.totalHours}</div>
              <div className="text-xs text-beige-800">Hours</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Metadata */}
      <Card className="bg-white/30 border-white/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-beige-900">Course Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm text-beige-800">
              Last updated: {new Date(course.lastUpdated).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-sm text-beige-800">Language: {course.language}</span>
          </div>
          <div className="flex items-center gap-3">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm text-beige-800">
              {course.certificate ? 'Certificate of completion' : 'No certificate'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="h-4 w-4 text-primary" />
            <Badge className="bg-secondary text-white text-xs">{course.level}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Instructor Profile */}
      <Card className="bg-white/30 border-white/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-beige-900">Instructor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Image
              src={course.instructor.avatar || '/placeholder.svg'}
              alt={course.instructor.name}
              width={60}
              height={60}
              className="rounded-full border-2 border-white/30"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-beige-900 mb-1">{course.instructor.name}</h4>
              <div className="text-sm text-beige-800 mb-2">
                ⭐ {course.instructor.rating} • {course.instructor.students.toLocaleString()}{' '}
                students
              </div>
              <p className="text-sm text-beige-800 leading-relaxed">{course.instructor.bio}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Courses */}
      <Card className="bg-white/30 border-white/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-beige-900">Related Courses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex gap-3 p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors cursor-pointer"
            >
              <Image
                src="/vercel.svg"
                alt="Related course"
                width={80}
                height={60}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h5 className="font-semibold text-beige-900 text-sm mb-1">
                  Buddhist Meditation Practices
                </h5>
                <p className="text-xs text-beige-800 mb-2">Master Li Wei</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">$199</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-2 h-2 bg-secondary rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
