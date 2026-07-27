import React from 'react'
import Image from 'next/image'
import { NavCard } from './components/NavCard'

const QUICK_NAV = [
  {
    href: '/design-system/typography',
    title: 'Typography',
    description: 'Font system & hierarchy',
    detail: 'Manrope ExtraBold headings, Inter body, Playfair Display hero accent, Cinzel Romawi, Fira Code mono.',
  },
  {
    href: '/design-system/colors',
    title: 'Colors',
    description: 'Palet Atelier Zero',
    detail: 'Swatches interaktif Light (Warm Parchment) & Dark (Warm Charcoal) — coral, mustard, olive, AI blue.',
  },
  {
    href: '/design-system/ui-elements',
    title: 'UI Elements',
    description: 'Pustaka komponen visual',
    detail: 'Button (incl. deckle edge), input, badge, chat bubble, course card, dan AI input bar.',
  },
]

const PILLARS = [
  {
    label: 'Texture-First',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
    description: 'Grain halus kertas *adalah* karakter visual halaman — bukan overlay dekoratif. Opacity 6–8%, mix-blend multiply.',
  },
  {
    label: 'Print-Flat Depth',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
      </svg>
    ),
    description: 'Kedalaman dari hierarki tipografi & whitespace — bukan glassmorphism atau 3D emboss tebal.',
  },
  {
    label: 'Deckle Edge',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.459 7.459 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
      </svg>
    ),
    description: 'Tepi komponen CTA menggunakan clip-path organik bergelombang — seperti kertas artisan yang disobek tangan.',
  },
]

export default function DesignSystemIndex() {
  return (
    <div className="space-y-16">

      {/* ── Hero: Design Inspiration Visual ────────────────────────────── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <p
            className="text-caption font-medium tracking-widest uppercase"
            style={{ color: 'var(--color-accent-coral)' }}
          >
            Maguru Design System — v2.0.0
          </p>
          <h1
            className="font-manrope font-extrabold leading-tight"
            style={{ fontSize: '2.25rem', letterSpacing: '-0.03em', color: 'var(--color-text-primary)' }}
          >
            Atelier Zero<br />
            <span style={{ color: 'var(--color-accent-coral)' }}>Artisan Print</span>
          </h1>
          <p className="text-body-lg max-w-xl" style={{ color: 'var(--color-text-secondary)' }}>
            Gaya visual yang memadukan kehangatan kertas cetak fisik dengan kecerdasan AI-Native — editorial, hangat, dan memberdayakan.
          </p>
        </div>

        {/* Visual Reference Card */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(21, 20, 15, 0.12)',
            boxShadow: '0 2px 8px rgba(21, 20, 15, 0.1)',
          }}
        >
          {/* Image */}
          <div className="relative w-full" style={{ aspectRatio: '16/7' }}>
            <Image
              src="/page/design.jpg"
              alt="Referensi visual Artisan Print — editorial paper texture dengan tipografi serif dramatis"
              fill
              className="object-cover object-top"
              priority
            />
            {/* Overlay label */}
            <div
              className="absolute bottom-0 left-0 right-0 px-6 py-3 flex items-center justify-between"
              style={{
                background: 'linear-gradient(to top, rgba(21,20,15,0.75) 0%, transparent 100%)',
              }}
            >
              <div>
                <p className="text-caption" style={{ color: 'rgba(239,231,210,0.7)', letterSpacing: '0.08em' }}>
                  VISUAL REFERENCE
                </p>
                <p className="font-manrope font-semibold text-sm" style={{ color: '#efe7d2' }}>
                  Artisan Print — Linen texture, editorial typography, print-flat depth
                </p>
              </div>
              <span
                className="text-caption px-3 py-1 rounded-full"
                style={{
                  background: 'rgba(237,111,92,0.25)',
                  border: '1px solid rgba(237,111,92,0.4)',
                  color: '#fcd8bd',
                  letterSpacing: '0.05em',
                }}
              >
                v2.0 Direction
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three Pillars ───────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2
          className="font-manrope font-semibold"
          style={{ fontSize: '1.25rem', letterSpacing: '-0.01em', color: 'var(--color-text-primary)' }}
        >
          Tiga Pilar Artisan Print
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.label}
              className="bg-bg-bone rounded-xl p-5 space-y-3"
              style={{
                border: '1px solid rgba(21, 20, 15, 0.1)',
                boxShadow: '0 1px 3px rgba(21, 20, 15, 0.08)',
              }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--color-accent-coral)' }}>{pillar.icon}</span>
                <span
                  className="font-manrope font-semibold text-sm"
                  style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}
                >
                  {pillar.label}
                </span>
              </div>
              <p className="text-caption leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Do's & Don'ts ───────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Do's */}
        <div
          className="bg-bg-bone rounded-xl p-6 space-y-4"
          style={{
            border: '1px solid rgba(21, 20, 15, 0.1)',
            borderLeft: '4px solid var(--color-success)',
            boxShadow: '0 1px 3px rgba(21, 20, 15, 0.08)',
          }}
        >
          <h3
            className="font-manrope font-semibold flex items-center gap-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <span style={{ color: 'var(--color-success)' }}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
              </svg>
            </span>
            Anjuran Desain
          </h3>
          <ul className="space-y-2.5">
            {[
              'Gunakan whitespace longgar — kurangi beban kognitif belajar.',
              'Pastikan AI Co-Teacher mudah diakses namun tidak menghalangi konten.',
              'Gunakan Manrope ExtraBold (800) untuk heading hero — kesan editorial cetak.',
              'Gunakan Cinzel Roman numeral untuk status pencapaian kompetensi mastery.',
              'Grain tekstur kertas pada body — opacity 6–8%, bukan 0.04 flat.',
              'Shadow flat tipis 1-layer untuk card (print-flat depth system).',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0" style={{ color: 'var(--color-success)' }}>
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M12.207 4.793a1 1 0 0 1 0 1.414l-5 5a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L6.5 9.086l4.293-4.293a1 1 0 0 1 1.414 0Z" />
                  </svg>
                </span>
                <span className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Don'ts */}
        <div
          className="bg-bg-bone rounded-xl p-6 space-y-4"
          style={{
            border: '1px solid rgba(21, 20, 15, 0.1)',
            borderLeft: '4px solid var(--color-error)',
            boxShadow: '0 1px 3px rgba(21, 20, 15, 0.08)',
          }}
        >
          <h3
            className="font-manrope font-semibold flex items-center gap-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            <span style={{ color: 'var(--color-error)' }}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </span>
            Hindari Desain
          </h3>
          <ul className="space-y-2.5">
            {[
              'Jangan gunakan backdrop-filter: blur() glassmorphic pada komponen reguler.',
              'Jangan gunakan multi-layer 3D inset shadow pada komponen aktif produk.',
              'Jangan campur gaya digital screen-born dengan Artisan Print di halaman yang sama.',
              'Jangan gunakan emoji sebagai ikon — selalu SVG Lucide yang konsisten.',
              'Jangan abaikan prefers-reduced-motion — semua animasi harus bisa dimatikan.',
              'Deckle clip-path tidak boleh memotong area fokus atau teks yang bisa diklik.',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0" style={{ color: 'var(--color-error)' }}>
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                  </svg>
                </span>
                <span className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Version badge ───────────────────────────────────────────────── */}
      <section>
        <div
          className="bg-bg-bone rounded-xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{
            border: '1px solid rgba(21, 20, 15, 0.08)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--color-accent-coral)' }}
            />
            <div>
              <p className="font-manrope font-semibold text-sm" style={{ color: 'var(--color-text-primary)' }}>
                Design System v2.0.0 — Artisan Print
              </p>
              <p className="text-caption" style={{ color: 'var(--color-text-muted)' }}>
                Rilis 16 Juli 2026 · Menggantikan Atelier Zero 3D Glassmorphic (v1.0)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {['Texture-First', 'Print-Flat', 'Deckle Edge'].map((tag) => (
              <span
                key={tag}
                className="text-caption px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(237,111,92,0.1)',
                  border: '1px solid rgba(237,111,92,0.25)',
                  color: 'var(--color-accent-coral)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quick Navigation ────────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2
          className="font-manrope font-semibold"
          style={{ fontSize: '1.25rem', letterSpacing: '-0.01em', color: 'var(--color-text-primary)' }}
        >
          Navigasi Panduan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {QUICK_NAV.map((item) => (
            <NavCard
              key={item.href}
              href={item.href}
              title={item.title}
              description={item.description}
              detail={item.detail}
            />
          ))}
        </div>
      </section>

    </div>
  )
}
