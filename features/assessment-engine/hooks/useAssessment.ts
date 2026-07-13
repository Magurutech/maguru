'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchQuestions, submitAssessment } from '../api'
import type { AssessmentQuestion, AssessmentResult } from '../schemas'

export function useAssessment(courseId: string, sectionId?: string | null) {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [result, setResult] = useState<AssessmentResult | null>(null)

  const loadQuestions = useCallback(async () => {
    if (!courseId) return
    try {
      setLoading(true)
      setError(null)
      const data = await fetchQuestions(courseId, sectionId)
      setQuestions(data.questions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat soal kuis')
    } finally {
      setLoading(false)
    }
  }, [courseId, sectionId])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  const submit = useCallback(async (answers: Record<string, string>, durationSeconds?: number | null) => {
    try {
      setSubmitting(true)
      setSubmitError(null)
      const outcome = await submitAssessment({
        courseId,
        sectionId,
        answers,
        durationSeconds,
      })
      setResult(outcome)
      return outcome
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Gagal mengirimkan jawaban'
      setSubmitError(errMsg)
      throw new Error(errMsg)
    } finally {
      setSubmitting(false)
    }
  }, [courseId, sectionId])

  return {
    questions,
    loading,
    error,
    submitting,
    submitError,
    result,
    submit,
    retry: loadQuestions,
  }
}
