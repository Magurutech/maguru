'use client'

import React from 'react'
import { AIChatbotSimulator } from './AIChatbotSimulator'
import { MicroAssessment } from './MicroAssessment'
import ClickSpark from '../../../components/reactbits/ClickSpark'

// ─────────────────────────────────────────────────────────────────────────────
// Reusable Child Components
// ─────────────────────────────────────────────────────────────────────────────

/** Eyebrow + Heading + Sub-paragraph block shared across sections */
/** SectionDivider showing Roman numerals, title/subtitle metadata, and page index */
interface SectionDividerProps {
  roman: string
  title: string
  subtitle: string
  page: string
}
function SectionDivider({ roman, title, subtitle, page }: SectionDividerProps) {
  return (
    <div className="border-t border-text-primary/16 dark:border-white/10 pt-4.5 mb-12 flex justify-between items-center font-sans text-[10.5px] tracking-[0.18em] uppercase text-text-faint select-none">
      <span className="font-serif italic text-[14px] text-accent-coral tracking-[0.05em] normal-case">
        {roman}
      </span>
      <span className="hidden sm:inline-flex items-center gap-6">
        <span>{title}</span>
        <span className="text-accent-coral font-bold">·</span>
        <span>{subtitle}</span>
      </span>
      <span>{page}</span>
    </div>
  )
}

/** Eyebrow + Heading + Sub-paragraph block shared across sections */
interface SectionHeaderProps {
  eyebrow: string
  heading: React.ReactNode
  sub?: string
  align?: 'left' | 'center'
  maxW?: string
}
function SectionHeader({
  eyebrow,
  heading,
  sub,
  align = 'left',
  maxW = 'max-w-2xl',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : ''
  return (
    <div className={`space-y-6 ${maxW} ${alignClass} mb-16`}>
      <span className="font-sans text-[11px] font-semibold tracking-[0.22em] uppercase text-accent-coral inline-flex items-center gap-3">
        <span className="w-4.5 h-px bg-accent-coral inline-block" />
        {eyebrow}
      </span>
      <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-none">
        {heading}
      </h2>
      {sub && (
        <p className="font-sans text-base text-text-secondary leading-relaxed max-w-[48ch]">
          {sub}
        </p>
      )}
    </div>
  )
}

/** AI chat preview card floating on the hero right column */
function HeroChatCard() {
  return (
    <div className="w-full max-w-105 glass-panel border border-glass-border rounded-[18px] overflow-hidden flex flex-col">
      {/* Title bar */}
      <div className="bg-bg-surface-accent/60 dark:bg-bg-surface-accent/20 px-4 py-3 flex items-center border-b border-glass-border">
        <div className="flex gap-1.5 items-center">
          <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
          <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
          <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
        </div>
        <span className="font-sans text-[11.5px] font-semibold text-text-muted ml-2 tracking-wide">
          Maguru AI Co-Teacher
        </span>
      </div>

      {/* Messages body */}
      <div className="p-5 flex flex-col gap-3">
        <div className="bg-bg-surface/85 dark:bg-bg-surface text-text-secondary border border-glass-border rounded-[12px_12px_12px_4px] border-l-[3px]! border-l-accent-coral! p-4 text-[13.5px] leading-relaxed">
          Kamu hampir menguasai rekursi. Coba tulis fungsi{" "}
          <code className="font-mono bg-bg-surface-accent dark:bg-bg-surface-accent/70 px-1.5 py-0.5 rounded text-accent-coral text-xs">
            fibonacci(n)
          </code>{" "}
          tanpa loop — hanya rekursi murni.
        </div>

        <div className="bg-text-primary text-bg-canvas dark:text-bg-canvas rounded-[12px_12px_4px_12px] p-4 text-[13.5px] leading-normal self-end max-w-[80%]">
          Apakah base case-nya harus dua kondisi?
        </div>

        <div className="bg-bg-surface/85 dark:bg-bg-surface text-text-secondary border border-glass-border rounded-[12px_12px_12px_4px] border-l-[3px]! border-l-accent-olive! p-4 text-[13.5px] leading-relaxed">
          Tepat. <strong>n === 0</strong> dan <strong>n === 1</strong> adalah kedua base case-nya. Tanpanya, rekursi tidak berhenti.
        </div>
      </div>

      {/* Progress Footer */}
      <div className="p-[16px_20px] border-t border-glass-border">
        <div className="flex justify-between text-xs text-text-faint mb-2 font-sans">
          <span>Rekursi &amp; Stack</span>
          <span className="text-accent-coral font-bold">72%</span>
        </div>
        <div className="h-1 w-full bg-bg-surface-accent dark:bg-bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-linear-to-r from-accent-coral to-accent-mustard rounded-full w-[72%]" />
        </div>
      </div>
    </div>
  )
}

/** Pillar card with tilt effect */
interface PillarCardProps {
  number: string
  title: string
  description: string
  tag: string
  accentClass: string
}
function PillarCard({ number, title, description, tag, accentClass }: PillarCardProps) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const r = card.getBoundingClientRect()
    const x = e.clientX - r.left - r.width / 2
    const y = e.clientY - r.top - r.height / 2
    card.style.transform = `perspective(1000px) rotateX(${-(y / (r.height / 2)) * 9}deg) rotateY(${(x / (r.width / 2)) * 9}deg) translateZ(6px)`
  }
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden glass-panel p-7 sm:p-8 rounded-[18px] border border-glass-border transition-all duration-300 flex flex-col justify-between group min-h-57"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="flex flex-col gap-4">
        <div className="font-serif italic text-2xl font-medium tracking-wider flex justify-between items-baseline select-none text-accent-coral">
          <span className={accentClass}>{number}</span>
          <span className="font-sans text-[9.5px] font-medium tracking-[0.18em] uppercase text-text-faint">
            {tag}
          </span>
        </div>
        <h3 className="font-sans text-xl font-bold tracking-tight text-text-primary leading-none mt-2">
          {title}
        </h3>
        <p className="font-sans text-xs sm:text-[13.5px] text-text-secondary leading-relaxed max-w-[26ch]">
          {description}
        </p>
      </div>

      <span className="absolute right-6 bottom-6 w-7 h-7 border border-text-primary/16 rounded-full flex items-center justify-center text-text-primary transition-all duration-200 group-hover:bg-accent-coral group-hover:border-accent-coral group-hover:text-white">
        <svg className="w-2.5 h-2.5 stroke-current fill-none stroke-[1.6]" viewBox="0 0 12 12">
          <path d="M2 6h8M7 3l3 3-3 3" />
        </svg>
      </span>
    </div>
  )
}

/** Footer navigation link list */
const FOOTER_LINKS = [
  { href: '#pilar', label: 'Tentang Maguru' },
  { href: '#pilar', label: 'Jalur Belajar' },
  { href: '#chat-sim', label: 'Kebijakan Privasi' },
  { href: '#assessment', label: 'Hubungi Kami' },
]
function FooterLinks() {
  return (
    <ul className="space-y-3">
      {FOOTER_LINKS.map(({ href, label }) => (
        <li key={label}>
          <a
            href={href}
            className="text-xs sm:text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG Icons
// ─────────────────────────────────────────────────────────────────────────────
const PILLARS: PillarCardProps[] = [
  {
    number: 'I',
    title: 'AI Co-Teacher',
    description:
      'Asisten belajar berbasis AI yang memahami konteks pemahamanmu, menyesuaikan penjelasan secara real-time, dan memberikan umpan balik spesifik — bukan jawaban generik.',
    tag: 'Adaptif · Kontekstual',
    accentClass: 'text-accent-coral',
  },
  {
    number: 'II',
    title: 'Project-Based Learning',
    description:
      'Setiap jalur belajar dirancang menuju sebuah proyek nyata yang bisa masuk portofoliomu. Belajar dengan mengerjakan — bukan menghafal teori tanpa tujuan.',
    tag: 'Portofolio-Ready',
    accentClass: 'text-accent-mustard',
  },
  {
    number: 'III',
    title: 'Mastery Validation',
    description:
      'Kompetensimu divalidasi melalui asesmen multi-lapisan: konsep, penerapan, dan proyek akhir. Badge mastery yang diterbitkan bisa dibagikan ke LinkedIn.',
    tag: 'Terverifikasi · Shareable',
    accentClass: 'text-accent-olive',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────
export default function LandingPageNew() {
  return (
    <ClickSpark
      sparkColor="#eb7458"
      sparkSize={29}
      sparkRadius={88}
      sparkCount={13}
      duration={1000}
      easing="ease-out"
      extraScale={1.3}
    >
      {/* ── LAYER 0: Fixed Ambient Gradient Mesh ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-500 bg-bg-canvas"
      >
        {/* Soft Coral radial glow at top-right */}
        <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-[0.07] dark:opacity-[0.09] bg-accent-coral" />

        {/* Soft Mustard radial glow at bottom-left */}
        <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-[0.06] dark:opacity-[0.08] bg-accent-mustard" />
      </div>

      {/* ── Content wrapper ── */}
      <div className="relative min-h-screen overflow-x-hidden text-text-primary">
        {/* ── Hero ── */}
        <section className="relative flex flex-col pt-24 pb-16 lg:pt-28 lg:pb-16 z-10">
          <div className="max-w-7xl w-[90%] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left: copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="font-sans text-[10.5px] tracking-[0.18em] uppercase text-text-faint flex items-center justify-between w-full select-none">
                Atelier Zero · EdTech Platform
                <span className="text-accent-coral font-bold">· Nº 01</span>
              </span>

              <h1 className="font-sans text-5xl sm:text-6xl md:text-[76px] font-extrabold tracking-tight text-text-primary leading-none mt-4">
                Maguru<span className="text-accent-coral">.</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-xl leading-relaxed mx-auto lg:mx-0 pt-2 font-sans">
                Maguru hadir sebagai AI Co-Teacher yang membimbing setiap langkah kompetensimu —
                dari pemahaman awal hingga penguasaan nyata, dengan metode project-based yang
                terukur.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() =>
                    document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="w-full sm:w-auto bg-accent-coral hover:bg-[#e25e4a] text-white text-sm font-semibold py-4 px-8 rounded-full transition-all duration-180 shadow-sm cursor-pointer"
                >
                  Mulai Asesmen — Gratis
                  <span className="inline-block ml-2 select-none">
                    <svg
                      className="w-3.5 h-3.5 stroke-current fill-none inline"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="1.6" />
                    </svg>
                  </span>
                </button>
                <button
                  onClick={() =>
                    document.getElementById('chat-sim')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="w-full sm:w-auto bg-transparent hover:bg-bg-bone/40 text-text-primary text-sm font-semibold py-4 px-8 rounded-full border border-text-primary/20 transition-all duration-180 cursor-pointer"
                >
                  Lihat AI Demo
                </button>
              </div>
            </div>

            {/* Right: chat card */}
            <div className="lg:col-span-5 hidden lg:flex items-center justify-center">
              <HeroChatCard />
            </div>
          </div>

          {/* Stats Bar below the hero columns */}
          <div className="max-w-7xl w-[90%] mx-auto border-t border-text-primary/8 dark:border-white/8 mt-16 pt-6 flex flex-wrap gap-10 items-center justify-between">
            <div className="flex flex-wrap items-center gap-8">
              <div className="inline-flex items-center gap-3">
                <div className="w-8.5 h-8.5 rounded-full border border-accent-coral text-accent-coral flex items-center justify-center font-sans text-[11px] font-bold shrink-0">
                  12K
                </div>
                <div className="font-sans text-[11px] leading-tight text-text-secondary tracking-wide uppercase">
                  <b className="block font-bold text-text-primary text-xs">Pelajar</b>
                  Aktif
                </div>
              </div>

              <div className="inline-flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-dashed border-text-primary dark:border-white/30 flex items-center justify-center font-sans text-[11px] font-bold shrink-0">
                  87%
                </div>
                <div className="font-sans text-[11px] leading-tight text-text-secondary tracking-wide uppercase">
                  <b className="block font-bold text-text-primary text-xs">Tingkat</b>
                  Penguasaan
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 select-none">
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-text-faint">
                Platform · EdTech · Indonesia · MMXXVI
              </span>
            </div>
          </div>
        </section>

        {/* ── Three Pillars ── */}
        <section id="pilar" className="py-24 relative z-10">
          <div className="max-w-7xl w-[90%] mx-auto">
            <SectionDivider
              roman="II."
              title="Tiga Pilar Maguru"
              subtitle="Sistem Belajar / Kompetensi"
              page="002 / 005"
            />
            <SectionHeader
              eyebrow="Metodologi · Nº 02"
              heading={
                <>
                  Sistem belajar yang dirancang untuk menghasilkan penguasaan{' '}
                  <em className="font-serif italic font-normal text-accent-coral">nyata.</em>
                </>
              }
              sub="Bukan sekadar menonton video. Maguru memadukan kecerdasan AI, pembelajaran berbasis proyek, dan validasi kompetensi terukur."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PILLARS.map((p) => (
                <PillarCard key={p.number} {...p} />
              ))}
            </div>
          </div>
        </section>

        {/* ── AI Chat Simulator ── */}
        <section
          id="chat-sim"
          className="py-24 relative z-10 bg-bg-bone/35 dark:bg-bg-surface-accent/5"
        >
          <div className="max-w-7xl w-[90%] mx-auto">
            <SectionDivider
              roman="III."
              title="AI Co-Teacher · Live Demo"
              subtitle="Interaktif / Real-time"
              page="003 / 005"
            />
            <AIChatbotSimulator />
          </div>
        </section>

        {/* ── Micro-Assessment ── */}
        <section id="assessment" className="py-24 relative z-10">
          <div className="max-w-7xl w-[90%] mx-auto">
            <SectionDivider
              roman="IV."
              title="Asesmen Awal · Gratis"
              subtitle="Peta Kompetensi / AI-Powered"
              page="004 / 005"
            />
            <SectionHeader
              eyebrow="Asesmen · Nº 04"
              heading="Seberapa jauh pemahamanmu sekarang?"
              sub="Satu pertanyaan untuk memulai. Maguru memetakan jalur belajar terbaik untukmu secara otomatis."
              align="center"
            />
            <MicroAssessment />
          </div>
        </section>

        {/* ── Footer / CTA (Melayang Gelap / Editorial Card) ── */}
        <footer className="relative z-10 px-4 sm:px-16 pb-16">
          <div className="relative bg-[#15140f] text-[#f7f1de] rounded-[32px] overflow-hidden px-8 sm:px-16 py-20 shadow-xl border border-white/5">
            {/* Grain overlay inside footer card */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.4] mix-blend-screen bg-[url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'240\' height=\'240\'><filter id=\'n2\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'2\' stitchTiles=\'stitch\'/><feColorMatrix values=\'0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.85  0 0 0 0.05 0\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n2)\'/></svg>')] bg-repeat" />

            {/* Footer sec-rule */}
            <div className="border-t border-white/12 pt-4.5 mb-16 flex justify-between items-center font-sans text-[10.5px] tracking-[0.18em] uppercase text-white/50 select-none">
              <span className="font-serif italic text-[14px] text-accent-coral tracking-[0.05em] normal-case">
                V.
              </span>
              <span className="hidden sm:inline-flex items-center gap-6">
                <span>CTA / Footer</span>
                <span className="text-accent-coral font-bold">·</span>
                <span>Mulai Belajar · Asesmen Gratis</span>
              </span>
              <span>005 / 005</span>
            </div>

            {/* Footer content grid */}
            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Column: CTA */}
              <div className="lg:col-span-6 space-y-6">
                <span className="font-sans text-[11px] font-semibold tracking-[0.22em] uppercase text-accent-coral inline-flex items-center gap-3">
                  <span className="w-4.5 h-px bg-accent-coral inline-block" />
                  Mulai Sekarang
                </span>
                <h2 className="font-sans text-4xl sm:text-5xl md:text-[56px] font-extrabold tracking-tight text-white leading-none">
                  Saatnya belajar dengan{' '}
                  <em className="font-serif italic font-normal text-accent-coral">tujuan.</em>
                </h2>
                <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed max-w-[42ch]">
                  Ribuan pelajar sudah menemukan jalur kompetensi mereka bersama Maguru. Mulai
                  dengan asesmen gratis — tanpa kartu kredit, tanpa komitmen.
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() =>
                      document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="inline-flex items-center gap-2.5 p-[14px_24px] rounded-full bg-accent-coral text-white font-sans text-sm font-semibold tracking-[-0.005em] hover:-translate-y-px hover:bg-[#e25e4a] transition-all duration-180 cursor-pointer border-none"
                  >
                    Mulai Asesmen — Gratis
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Middle Column: Brand & links */}
              <div className="lg:col-span-3 space-y-6 lg:border-l lg:border-white/10 lg:pl-10">
                <div className="flex items-center gap-2.5 select-none text-white">
                  <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center font-serif italic text-base">
                    M
                  </div>
                  <span className="font-manrope text-xl font-bold tracking-wider">
                    MAGURU<span className="text-accent-coral">.</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-[26ch]">
                  AI Co-Teacher untuk penguasaan kompetensi yang terukur dan nyata.
                </p>
                <FooterLinks />
              </div>

              {/* Right Column: Stats */}
              <div className="lg:col-span-3 flex flex-col gap-6 lg:border-l lg:border-white/10 lg:pl-10">
                <div>
                  <div className="font-sans text-[32px] font-extrabold tracking-tight text-white [font-variant-numeric:tabular-nums]">
                    12K
                  </div>
                  <div className="font-sans text-[11px] tracking-[0.16em] uppercase text-white/50 mt-1">
                    Pelajar Aktif
                  </div>
                </div>
                <div>
                  <div className="font-sans text-[32px] font-extrabold tracking-tight text-white [font-variant-numeric:tabular-nums]">
                    87%
                  </div>
                  <div className="font-sans text-[11px] tracking-[0.16em] uppercase text-white/50 mt-1">
                    Tingkat Penguasaan
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="relative mt-16 pt-8 border-t border-white/10 flex justify-between items-center text-xs text-white/30 flex-wrap gap-4 select-none">
              <span>&copy; 2026 Maguru. Semua hak dilindungi.</span>
              <span>Platform · EdTech · Indonesia · MMXXVI</span>
            </div>
          </div>
        </footer>
      </div>
    </ClickSpark>
  )
}
