import { Check, Sparkles, FolderKanban, Star, Users, Award, BookOpen } from 'lucide-react'
import type { CourseMockData } from './CourseDetailMock'

// ─── 1. UNIFIED DESCRIPTION SECTION (OVERVIEW + OUTCOMES + INSTRUCTOR) ───
export function UnifiedDescriptionSection({
  description,
  outcomes,
  instructor,
}: {
  description: string | null
  outcomes: string[]
  instructor: CourseMockData['instructor']
}) {
  if (!description) return null
  return (
    <section className="space-y-8" id="course-description">
      {/* Unified Section coordinate header */}
      <div className="border-t border-text-primary/12 dark:border-white/12 pt-3 flex justify-between items-center text-[10px] tracking-[0.18em] uppercase text-text-faint font-sans select-none">
        <span className="font-serif italic font-medium">ii</span>
        <span>Deskripsi &amp; Instruktur</span>
      </div>

      {/* Course Overview */}
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-sans font-bold tracking-wider text-accent-coral uppercase">
            Tentang Kelas
          </span>
          <h2 className="font-sans text-xl sm:text-2xl font-bold text-text-primary">
            Perjalanan Belajar Anda dimulai di sini.
          </h2>
        </div>

        <div className="text-text-secondary text-[14px] leading-relaxed space-y-4 max-w-3xl font-sans">
          {description.split('\n').filter(p => p.trim() !== '').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {/* 2. Learning Outcomes (2 Columns grid: 50% left, 50% right) */}
      <div className="space-y-5 pt-6 border-t border-text-primary/8 dark:border-white/8">
        <div className="space-y-1">
          <span className="text-[10px] font-sans font-bold tracking-wider text-accent-coral uppercase">
            Learning Outcomes
          </span>
          <h3 className="font-sans text-lg font-bold text-text-primary">
            Kemampuan yang akan Anda kuasai
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {outcomes.map((outcome, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 bg-bg-bone/40 dark:bg-bg-bone/10 border border-text-primary/8 dark:border-white/8 rounded-xl"
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent-olive/12 dark:bg-accent-olive/20 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-accent-olive" />
              </div>
              <span className="font-sans text-xs sm:text-sm text-text-secondary leading-relaxed">
                {outcome}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Instructor Profile (Below outcomes, full width) */}
      <div className="space-y-5 pt-6 border-t border-text-primary/8 dark:border-white/8">
        <div className="space-y-1">
          <span className="text-[10px] font-sans font-bold tracking-wider text-accent-coral uppercase">
            Profil Pengajar
          </span>
          <h3 className="font-sans text-lg font-bold text-text-primary">
            Didampingi oleh ekspertis industri
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 p-6 bg-bg-bone/40 dark:bg-bg-bone/10 border border-text-primary/8 dark:border-white/8 rounded-xl">
          {/* Avatar block */}
          <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-[#e8e0c8] to-[#d4c8a8] dark:from-[#37353e] dark:to-[#2d2a33] border border-text-primary/8 dark:border-white/8 flex items-center justify-center font-sans text-2xl font-extrabold text-text-primary shadow-sm select-none">
            {instructor.avatar}
          </div>

          {/* Bio block */}
          <div className="flex-grow space-y-3">
            <div className="space-y-0.5">
              <h4 className="font-sans text-lg font-bold text-text-primary leading-tight">
                {instructor.name}
              </h4>
              <span className="text-xs font-sans text-accent-coral font-medium">
                {instructor.title}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
              {instructor.bio}
            </p>

            <p className="text-xs text-text-muted font-sans font-medium">
              Pengalaman: {instructor.experience}
            </p>

            {/* Instructor metrics */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-text-primary/8 dark:border-white/8">
              <div className="space-y-0.5">
                <span className="text-[9px] font-sans font-bold tracking-wider text-text-faint uppercase block">
                  Total Pelajar
                </span>
                <span className="font-sans text-sm font-extrabold text-text-primary flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-text-faint" />
                  {instructor.studentsCount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="space-y-0.5 border-l border-text-primary/8 dark:border-white/8 pl-4">
                <span className="text-[9px] font-sans font-bold tracking-wider text-text-faint uppercase block">
                  Ulasan Kelas
                </span>
                <span className="font-sans text-sm font-extrabold text-text-primary flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-accent-mustard fill-accent-mustard" />
                  {instructor.rating.toFixed(1)}
                </span>
              </div>
              <div className="space-y-0.5 border-l border-text-primary/8 dark:border-white/8 pl-4">
                <span className="text-[9px] font-sans font-bold tracking-wider text-text-faint uppercase block">
                  Total Kelas
                </span>
                <span className="font-sans text-sm font-extrabold text-text-primary flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-text-faint" />
                  {instructor.coursesCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 3. AI CO-TEACHER SECTION ───
export function AICoTeacherSection({ data }: { data: CourseMockData['aiCoTeacher'] }) {
  return (
    <section className="space-y-4" id="ai-coteacher">
      <div className="border-t border-text-primary/12 dark:border-white/12 pt-3 flex justify-between items-center text-[10px] tracking-[0.18em] uppercase text-text-faint font-sans">
        <span className="font-serif italic font-medium">v</span>
        <span>AI Mentor Interaktif</span>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-sans font-bold tracking-wider text-accent-coral uppercase">
          Maguru AI Co-Teacher
        </span>
        <h2 className="font-sans text-xl sm:text-2xl font-bold text-text-primary">
          Bimbingan cerdas setiap saat.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 md:p-8 bg-bg-bone/40 dark:bg-bg-bone/10 border border-text-primary/8 dark:border-white/8 rounded-2xl">
        <div className="space-y-5">
          <div>
            <h3 className="font-sans text-base font-bold text-text-primary flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-accent-coral" />
              Tutor Pribadi 24 Jam
            </h3>
            <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed font-sans">
              AI Co-Teacher kami terintegrasi di dalam setiap materi pelajaran dan workspace coding Anda. Bukan sekadar chatbot, melainkan mentor pedagogis.
            </p>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-text-secondary font-sans">
            {data.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-coral flex-shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Simulated Chat Interface */}
        <div className="flex flex-col gap-3 p-4 bg-bg-canvas/50 dark:bg-bg-canvas/20 border border-text-primary/8 dark:border-white/8 rounded-xl max-h-[220px] overflow-y-auto">
          {/* User message */}
          <div className="bg-bg-surface-accent/20 dark:bg-bg-surface-accent/10 border border-text-primary/6 dark:border-white/6 text-text-secondary text-xs p-3 rounded-xl max-w-[85%] self-end font-sans">
            <span className="font-bold text-[10px] text-text-muted block mb-1">Anda (Pelajar)</span>
            {data.question}
          </div>

          {/* AI Response */}
          <div className="bg-bg-surface border border-text-primary/8 dark:border-white/8 border-l-2 border-l-accent-coral text-text-primary text-xs p-3 rounded-xl max-w-[85%] self-start font-sans">
            <span className="font-bold text-[10px] text-accent-coral block mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Maguru AI Mentor
            </span>
            {data.answer}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 4. COURSE PROJECT SECTION ───
export function ProjectSection({ data }: { data: CourseMockData['courseProject'] }) {
  return (
    <section className="space-y-4" id="project">
      <div className="border-t border-text-primary/12 dark:border-white/12 pt-3 flex justify-between items-center text-[10px] tracking-[0.18em] uppercase text-text-faint font-sans">
        <span className="font-serif italic font-medium">vi</span>
        <span>Proyek Portofolio</span>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-sans font-bold tracking-wider text-accent-coral uppercase">
          Course Project
        </span>
        <h2 className="font-sans text-xl sm:text-2xl font-bold text-text-primary">
          Bangun portofolio riil Anda.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 bg-bg-bone/40 dark:bg-bg-bone/10 border border-text-primary/8 dark:border-white/8 rounded-2xl">
        {/* Deliverables Info */}
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-1">
            <h3 className="font-sans text-base font-bold text-text-primary flex items-center gap-2">
              <FolderKanban className="w-4.5 h-4.5 text-accent-coral" />
              {data.title}
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
              {data.description}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-sans font-bold tracking-wider text-text-faint uppercase block">
              Deliverables Proyek:
            </span>
            <ul className="grid grid-cols-1 gap-2">
              {data.deliverables.map((del, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-text-secondary font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-olive mt-1.5 flex-shrink-0" />
                  <span>{del}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Visual / Portfolio Impact Card */}
        <div className="md:col-span-5 p-5 bg-bg-surface-accent/25 dark:bg-bg-surface-accent/10 border border-text-primary/8 dark:border-white/8 rounded-xl space-y-3">
          <span className="text-[9px] font-sans font-bold tracking-wider text-accent-coral uppercase block">
            Nilai Portofolio
          </span>
          <p className="text-xs text-text-secondary leading-relaxed font-sans">
            {data.portfolioValue}
          </p>
          <div className="border-t border-text-primary/8 dark:border-white/8 pt-2.5 flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-text-muted">
            <Award className="w-3.5 h-3.5 text-accent-mustard" />
            <span>Ready for hiring & recruiters</span>
          </div>
        </div>
      </div>
    </section>
  )
}



// ─── 6. REVIEWS SECTION ───
export function ReviewsSection({ reviews }: { reviews: CourseMockData['reviews'] }) {
  return (
    <section className="space-y-4" id="reviews">
      <div className="border-t border-text-primary/12 dark:border-white/12 pt-3 flex justify-between items-center text-[10px] tracking-[0.18em] uppercase text-text-faint font-sans">
        <span className="font-serif italic font-medium">viii</span>
        <span>Ulasan Pelajar</span>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-sans font-bold tracking-wider text-accent-coral uppercase">
          Testimonials
        </span>
        <h2 className="font-sans text-xl sm:text-2xl font-bold text-text-primary">
          Apa kata mereka tentang kelas ini.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 bg-bg-bone/30 dark:bg-bg-bone/10 border border-text-primary/8 dark:border-white/8 rounded-xl space-y-3.5"
          >
            {/* Header info */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-text-primary/8 dark:bg-white/8 font-sans text-xs font-bold text-text-primary flex items-center justify-center">
                  {rev.name.charAt(0)}
                </div>
                <div className="space-y-0.5">
                  <span className="font-sans text-xs font-bold text-text-primary block leading-tight">
                    {rev.name}
                  </span>
                  <span className="text-[9px] font-mono text-text-faint block">
                    {rev.date}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 text-accent-mustard">
                <Star className="w-3.5 h-3.5 fill-accent-mustard" />
                <span className="font-sans text-xs font-bold text-text-primary">{rev.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Testimonial body */}
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-sans">
              &ldquo;{rev.comment}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
