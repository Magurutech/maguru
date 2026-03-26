'use client'

import { useState } from 'react'

export type ActiveView =
  | { type: 'overview' }
  | { type: 'lesson'; sectionId: string; lessonId: string }
  | { type: 'section'; sectionId: string }

export function useManageView() {
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'overview' })
  return { activeView, setActiveView }
}
