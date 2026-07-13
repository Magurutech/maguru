'use client'

import { useState } from 'react'

export type ActiveView =
  | { type: 'overview' }
  | { type: 'section'; sectionId: string }
  | { type: 'lesson'; sectionId: string; lessonId: string }
  | { type: 'lesson-editor'; sectionId: string; lessonId?: string }
  | { type: 'quiz-editor'; quizType: 'PRE_TEST' | 'SECTION_QUIZ'; sectionId?: string }

export function useManageView() {
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'overview' })
  return { activeView, setActiveView }
}
