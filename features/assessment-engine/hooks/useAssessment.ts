'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  fetchQuestions,
  submitAssessment,
  AssessmentCooldownError,
  AssessmentAlreadyCompletedError,
} from '../api'
import type { AssessmentQuestion, AssessmentResult } from '../schemas'

export interface AttemptInfo {
  attempt: number
  maxAttempts: number
  previousScore?: number
  cooldownRemainingSeconds?: number
  isCooldown?: boolean
  isCompleted?: boolean
  passed?: boolean
}

export function useAssessment(courseId: string, sectionId?: string | null) {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attemptInfo, setAttemptInfo] = useState<AttemptInfo>({
    attempt: 1,
    maxAttempts: 2,
  })

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [result, setResult] = useState<AssessmentResult | null>(null)

  const loadQuestions = useCallback(
    async (allowRetake = false) => {
      if (!courseId) return
      try {
        setLoading(true)
        setError(null)
        const data = await fetchQuestions(courseId, sectionId, allowRetake)
        setQuestions(data.questions)
        setAttemptInfo({
          attempt: data.attempt || 1,
          maxAttempts: data.maxAttempts || 2,
          previousScore: data.previousScore,
          isCooldown: false,
        })
      } catch (err) {
        if (err instanceof AssessmentCooldownError) {
          setAttemptInfo({
            attempt: err.attempts,
            maxAttempts: err.maxAttempts,
            previousScore: err.score,
            cooldownRemainingSeconds: err.cooldownRemainingSeconds,
            isCooldown: true,
          })
          setError('COOLDOWN_ACTIVE')
        } else if (err instanceof AssessmentAlreadyCompletedError) {
          setAttemptInfo({
            attempt: 2,
            maxAttempts: 2,
            previousScore: err.score,
            isCompleted: true,
            passed: err.passed,
          })
          setError('ALREADY_COMPLETED')
        } else {
          setError(err instanceof Error ? err.message : 'Gagal memuat soal kuis')
        }
      } finally {
        setLoading(false)
      }
    },
    [courseId, sectionId],
  )

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  const submit = useCallback(
    async (answers: Record<string, string>, durationSeconds?: number | null) => {
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
        if (err instanceof AssessmentCooldownError) {
          setAttemptInfo({
            attempt: err.attempts,
            maxAttempts: err.maxAttempts,
            previousScore: err.score,
            cooldownRemainingSeconds: err.cooldownRemainingSeconds,
            isCooldown: true,
          })
          setError('COOLDOWN_ACTIVE')
        }
        const errMsg = err instanceof Error ? err.message : 'Gagal mengirimkan jawaban'
        setSubmitError(errMsg)
        throw new Error(errMsg)
      } finally {
        setSubmitting(false)
      }
    },
    [courseId, sectionId],
  )

  const retake = useCallback(async () => {
    await loadQuestions(true)
  }, [loadQuestions])

  return {
    questions,
    loading,
    error,
    attemptInfo,
    submitting,
    submitError,
    result,
    submit,
    retry: loadQuestions,
    retake,
  }
}
