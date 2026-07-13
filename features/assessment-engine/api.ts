import type {
  AssessmentQuestion,
  AssessmentResult,
} from './schemas'

export interface PastResult {
  id: string
  courseId: string
  sectionId: string | null
  score: number
  type: 'PRE_TEST' | 'SECTION_QUIZ'
  durationSeconds: number | null
  completedAt: string
}

/**
 * Fetch questions for an assessment.
 * Throws on non-ok statuses (e.g. 401 UNAUTHORIZED, 409 already completed).
 */
export async function fetchQuestions(
  courseId: string,
  sectionId?: string | null,
): Promise<{ questions: AssessmentQuestion[] }> {
  const query = new URLSearchParams({ courseId })
  if (sectionId) {
    query.set('sectionId', sectionId)
  }

  const res = await fetch(`/api/assessment/questions?${query.toString()}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (res.status === 409) throw new Error('ALREADY_COMPLETED')
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error ?? 'Gagal memuat pertanyaan kuis')
  }

  return res.json()
}

/**
 * Submit answers for an assessment.
 * Wraps overall/topic grading and returns the scores + skipped lessons.
 */
export async function submitAssessment(payload: {
  courseId: string
  sectionId?: string | null
  answers: Record<string, string>
  durationSeconds?: number | null
}): Promise<AssessmentResult> {
  const res = await fetch('/api/assessment/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (res.status === 409) throw new Error('ALREADY_COMPLETED')

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error ?? 'Gagal mengirimkan jawaban kuis')
  }

  return res.json()
}

/**
 * Fetch past results for assessments.
 */
export async function fetchResults(
  courseId?: string | null,
  sectionId?: string | null,
): Promise<{ results: PastResult[] }> {
  const query = new URLSearchParams()
  if (courseId) query.set('courseId', courseId)
  if (sectionId) query.set('sectionId', sectionId)

  const res = await fetch(`/api/assessment/results?${query.toString()}`)
  if (res.status === 401) throw new Error('UNAUTHORIZED')

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error ?? 'Gagal memuat hasil kuis')
  }

  return res.json()
}
