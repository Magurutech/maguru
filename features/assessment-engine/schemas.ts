import { z } from 'zod'

export const QuizOptionsSchema = z.object({
  a: z.string().min(1, 'Option A cannot be empty'),
  b: z.string().min(1, 'Option B cannot be empty'),
  c: z.string().min(1, 'Option C cannot be empty'),
  d: z.string().min(1, 'Option D cannot be empty'),
})

export const StudentAnswersSchema = z.record(
  z.string(), // questionId
  z.enum(['a', 'b', 'c', 'd']),
)

export const SubmitAssessmentSchema = z.object({
  courseId: z.string().min(1, 'courseId required'),
  sectionId: z.string().optional().nullable(),
  answers: StudentAnswersSchema,
  durationSeconds: z.number().int().nonnegative('Duration must be non-negative').optional().nullable(),
})

export type QuizOptions = z.infer<typeof QuizOptionsSchema>
export type StudentAnswers = z.infer<typeof StudentAnswersSchema>
export type SubmitAssessmentInput = z.infer<typeof SubmitAssessmentSchema>

export interface AssessmentQuestion {
  id: string
  question: string
  options: QuizOptions
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface AssessmentResult {
  overallScore: number
  topicScores: Record<string, number>
  skippedLessonIds: string[]
  unlockedNextSection?: boolean
}
