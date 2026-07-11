'use client'

import { memo, useState } from 'react'
import {
  Check,
  ChevronDown,
  ChevronRight,
  BookOpen,
  PanelLeftClose,
  PanelLeftOpen,
  Lock,
  Star,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar'

interface CourseNavigationProps {
  sections: Array<{
    id: string
    title: string
    isLocked?: boolean
    lessons: Array<{
      id: string
      title: string
      completed: boolean
    }>
  }>
  currentLessonId: string
  onLessonClick: (lessonId: string) => void
}

function CourseNavigationContent({
  sections,
  currentLessonId,
  onLessonClick,
}: CourseNavigationProps) {
  const { state, setOpen } = useSidebar()
  const sidebarOpen = state === 'expanded'
  const params = useParams()

  const slug = (params?.slug as string) || ''
  const courseTitle =
    slug === 'ui-ux-design-fundamentals'
      ? 'UI/UX Design Fundamentals'
      : slug
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ') || 'UI/UX Design Fundamentals'

  // Calculate total and completed lessons from sections prop
  let totalLessons = 0
  let completedLessons = 0
  sections.forEach((s) => {
    totalLessons += s.lessons.length
    completedLessons += s.lessons.filter((l) => l.completed).length
  })
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(sections.filter((s) => !s.isLocked).map((s) => s.id)),
  )

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }

  return (
    <>
      <Sidebar
        collapsible="icon"
        className=""
      >

      <SidebarHeader className="p-0">
        <div className={`px-6 pt-4 flex justify-center items-center ${!sidebarOpen && 'px-2'}`}>
          <Image
            src="/logo/maguru-logo.png"
            alt="Maguru Logo"
            width={180}
            height={56}
            className={`${sidebarOpen ? 'h-13 md:h-14' : 'h-8'} w-auto object-contain mix-blend-multiply dark:invert select-none`}
            priority
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-0 py-0 no-scrollbar">
        {/* Collapsed view items */}
        {!sidebarOpen ? (
          <div className="flex flex-col items-center gap-6 pt-4 pb-4">
            <div className="w-8 border-t border-[#b89a57]/15 my-2" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-manrope font-extrabold text-accent-coral">
                {progressPercent}%
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Current Course Section */}
            <div className="mx-4 my-4 p-4 border-t border-b border-[#b89a57]/15">
              <span className="text-[9px] font-manrope font-extrabold uppercase tracking-widest text-text-faint">
                CURRENT COURSE
              </span>
              <h4 className="text-xs font-serif font-extrabold text-text-primary mt-1 leading-snug">
                {courseTitle}
              </h4>
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] font-manrope font-bold text-text-muted">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#efe7d2] dark:bg-[#19181d] rounded-full mt-1.5 overflow-hidden border border-[#b89a57]/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
                  <div
                    className="h-full bg-accent-coral transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Course Content Section */}
            <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
              <span className="text-[10px] font-manrope font-extrabold uppercase tracking-widest text-accent-coral block mb-3 pl-1">
                COURSE CONTENT
              </span>

              {sections.length === 0 && (
                <p className="text-xs text-text-faint px-3 py-6 text-center">
                  Belum ada materi tersedia.
                </p>
              )}

              {sections.map((section) => {
                const isLocked = !!section.isLocked
                const isSectionActive = section.lessons.some((l) => l.id === currentLessonId)
                const isOpen = !isLocked && (openSections.has(section.id) || isSectionActive)
                const completedCount = section.lessons.filter((l) => l.completed).length

                return (
                  <Collapsible
                    key={section.id}
                    open={isOpen}
                    onOpenChange={() => !isLocked && toggleSection(section.id)}
                    data-testid={`nav-section-${section.id}`}
                    className="mb-2"
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        className={`
                          w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-200 mb-1 cursor-pointer
                          ${
                            isLocked
                              ? 'opacity-40 cursor-not-allowed text-text-muted'
                              : isSectionActive
                                ? 'paper-skeuo shadow-sm text-text-primary font-extrabold border border-[#b89a57]/10'
                                : 'hover:bg-bg-surface-accent/60 text-text-primary font-semibold'
                          }
                        `}
                        disabled={isLocked}
                        aria-expanded={isOpen}
                      >
                        {isLocked ? (
                          <Lock className="h-3.5 w-3.5 shrink-0 text-text-faint" />
                        ) : (
                          <BookOpen
                            className={`h-3.5 w-3.5 shrink-0 ${isSectionActive ? 'text-accent-coral' : 'text-text-muted'}`}
                          />
                        )}
                        <span className="flex-1 text-[11px] truncate leading-none">
                          {section.title}
                        </span>
                        <span className="text-[10px] font-manrope font-bold text-text-muted shrink-0 mr-1">
                          {completedCount}/{section.lessons.length}
                        </span>
                        {!isLocked &&
                          (isOpen ? (
                            <ChevronDown className="h-3.5 w-3.5 text-text-faint shrink-0" />
                          ) : (
                            <ChevronRight className="h-3.5 w-3.5 text-text-faint shrink-0" />
                          ))}
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      {!isLocked && (
                        <ul className="ml-3 my-1 border-l border-[#b89a57]/10 pl-2 space-y-1">
                          {section.lessons.map((lesson) => {
                            const isActive = currentLessonId === lesson.id

                            return (
                              <li key={lesson.id}>
                                <button
                                  onClick={() => onLessonClick(lesson.id)}
                                  aria-current={isActive ? 'page' : undefined}
                                  data-testid={`nav-lesson-${lesson.id}`}
                                  className={`
                                    w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold
                                    transition-all duration-150 cursor-pointer text-left
                                    ${
                                      isActive
                                        ? 'bg-[#efe7d2] dark:bg-[#19181d] text-accent-coral border border-[#b89a57]/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]'
                                        : 'text-text-secondary hover:bg-bg-surface-accent/40 hover:text-text-primary'
                                    }
                                  `}
                                >
                                  {lesson.completed ? (
                                    <Check
                                      className={`h-3 w-3 shrink-0 ${isActive ? 'text-accent-coral' : 'text-success'}`}
                                      aria-label="Selesai"
                                      data-testid={`lesson-completed-${lesson.id}`}
                                    />
                                  ) : (
                                    <span
                                      className={`h-3 w-3 shrink-0 rounded-full border ${isActive ? 'border-accent-coral bg-accent-coral/15' : 'border-[#b89a57]/25'}`}
                                    />
                                  )}
                                  <span className="flex-1 truncate leading-none">
                                    {lesson.title}
                                  </span>
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                )
              })}
            </div>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="p-0">
        {/* Go Premium Floating Card */}
        {sidebarOpen ? (
          <div className="p-4">
            <div className="paper-skeuo rounded-2xl p-4 flex flex-col border border-[#b89a57]/10 relative overflow-hidden bg-gradient-to-br from-white/20 to-transparent">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-accent-coral fill-accent-coral/20 shrink-0" />
                <span className="text-[10px] font-manrope font-extrabold uppercase tracking-widest text-text-primary">
                  Go Premium
                </span>
              </div>
              <p className="text-[10px] text-text-muted mt-1.5 leading-normal">
                Unlock advanced courses, projects, and AI features.
              </p>
              <button className="mt-3 w-full py-2 rounded-xl text-[10px] font-extrabold text-white coral-skeuo btn-interactive shadow-sm">
                Upgrade Now
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center pb-6">
            {/* Go Premium Star favicon */}
            <div className="p-2 rounded-xl bg-accent-coral/10 text-accent-coral cursor-pointer hover:scale-105 transition-all">
              <Star className="h-4 w-4 fill-accent-coral/20" />
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>

    {/* Toggle button — always visible and fixed to the side */}
    <button
      onClick={() => setOpen(!sidebarOpen)}
      className="fixed top-8 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-[#b89a57]/20 bg-[#efe7d2] dark:bg-[#19181d] shadow-sm hover:scale-105 active:scale-95 text-text-muted transition-all duration-200 ease-linear cursor-pointer"
      style={{
        left: sidebarOpen ? 'calc(var(--sidebar-width) - 10px)' : 'calc(var(--sidebar-width-icon) - 10px)'
      }}
      aria-label={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
      title={sidebarOpen ? 'Tutup sidebar' : 'Buka sidebar'}
    >
      {sidebarOpen ? (
        <PanelLeftClose className="h-3.5 w-3.5 text-text-muted" />
      ) : (
        <PanelLeftOpen className="h-3.5 w-3.5 text-text-muted" />
      )}
    </button>
  </>
)
}

export const CourseNavigation = memo(function CourseNavigation(props: CourseNavigationProps) {
  return (
    <CourseNavigationContent {...props} />
  )
})
