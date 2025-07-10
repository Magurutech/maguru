'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle, CreditCard, Shield } from 'lucide-react'
import Image from 'next/image'
import { Course } from './CourseDetailPage'

interface EnrollmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course
  onConfirm: () => void
}

export function EnrollmentDialog({ open, onOpenChange, course, onConfirm }: EnrollmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-lg border border-white/40">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-beige-900 bg-gradient-to-r from-beige-900 to-primary bg-clip-text">
            Enroll in Course
          </DialogTitle>
          <DialogDescription className="text-beige-800">
            You are about to enroll in this amazing course. Here&apos;s what you&apos;ll get:
          </DialogDescription>
        </DialogHeader>

        {/* Course Preview */}
        <div className="flex gap-4 p-4 bg-white/30 rounded-lg border border-white/40">
          <Image
            src={course.thumbnail || '/placeholder.svg'}
            alt={course.title}
            width={80}
            height={60}
            className="rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-beige-900 mb-1">{course.title}</h4>
            <p className="text-sm text-beige-800 mb-2">by {course.instructor.name}</p>
            <div className="flex items-center gap-4 text-sm text-beige-800">
              <span>${course.price}</span>
              <span>⭐ {course.rating}</span>
              <span>{course.totalHours} hours</span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-accent" />
            <span className="text-beige-800">Lifetime access to course content</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-accent" />
            <span className="text-beige-800">Certificate of completion</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-accent" />
            <span className="text-beige-800">
              {course.downloadableResources} downloadable resources
            </span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-accent" />
            <span className="text-beige-800">Access on mobile and desktop</span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
          <Shield className="h-5 w-5 text-accent" />
          <div className="text-sm">
            <p className="font-semibold text-beige-900">Secure Payment</p>
            <p className="text-beige-800">Your payment information is encrypted and secure</p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-white/30 border-white/40 hover:bg-white/50 text-beige-900"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-primary hover:bg-primary-600 text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all duration-200"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Enroll Now - ${course.price}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
