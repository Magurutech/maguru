import { Star, ThumbsUp, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'
import type { CourseDetail } from '@/features/course/types'

interface CourseReviewsProps {
  course: CourseDetail
}

export function CourseReviews({ course }: CourseReviewsProps) {
  const ratingDistribution = [
    { stars: 5, count: 1847, percentage: 65 },
    { stars: 4, count: 712, percentage: 25 },
    { stars: 3, count: 213, percentage: 7 },
    { stars: 2, count: 57, percentage: 2 },
    { stars: 1, count: 28, percentage: 1 },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <Card className="bg-white/30 border-white/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-beige-900">Student Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold text-beige-900 mb-2">{course.rating}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < Math.floor(course.rating)
                        ? 'text-secondary fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-beige-800">{course.totalRatings.toLocaleString()} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm text-beige-800">{rating.stars}</span>
                    <Star className="h-4 w-4 text-secondary fill-current" />
                  </div>
                  <Progress value={rating.percentage} className="flex-1 h-2" />
                  <span className="text-sm text-beige-800 w-12">{rating.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-6">
        <h4 className="text-xl font-bold text-beige-900">Recent Reviews</h4>

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {course.reviews.map((review: any) => (
          <Card key={review.id} className="bg-white/30 border-white/40 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Image
                  src={review.avatar || '/placeholder.svg'}
                  alt={review.user}
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-white/30"
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h5 className="font-semibold text-beige-900">{review.user}</h5>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-secondary fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-beige-800">{formatDate(review.date)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-beige-800 mb-4 leading-relaxed">{review.comment}</p>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-beige-800 hover:text-primary hover:bg-primary/10"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Helpful ({review.helpful})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-beige-800 hover:text-primary hover:bg-primary/10"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <Button
          variant="outline"
          className="bg-white/30 border-white/40 hover:bg-white/50 text-beige-900 hover:text-primary"
        >
          Load More Reviews
        </Button>
      </div>
    </div>
  )
}
