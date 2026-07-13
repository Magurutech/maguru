import React from 'react'
import { SkeuoCard } from '@/components/skeuo-card'

const typographySpecs = [
  {
    role: 'Display L',
    className: 'text-display-l',
    font: 'Manrope',
    size: '48px / 3rem',
    weight: 'Bold (700)',
    lineHeight: '1.2',
    spacing: '-0.02em',
    sample: 'Empowering Mastery',
  },
  {
    role: 'Heading 1',
    className: 'text-h1',
    font: 'Manrope',
    size: '32px / 2rem',
    weight: 'Semibold (600)',
    lineHeight: '1.3',
    spacing: '-0.01em',
    sample: 'Belajar Cerdas Bersama AI',
  },
  {
    role: 'Heading 2',
    className: 'text-h2',
    font: 'Manrope',
    size: '24px / 1.5rem',
    weight: 'Semibold (600)',
    lineHeight: '1.4',
    spacing: '-0.01em',
    sample: 'Modul I: Pemrograman Dasar',
  },
  {
    role: 'Body Large',
    className: 'text-body-lg',
    font: 'Poppins',
    size: '18px / 1.125rem',
    weight: 'Regular (400)',
    lineHeight: '1.6',
    spacing: '0',
    sample: 'Gaya desain Atelier Zero menggabungkan kehangatan kertas fisik dengan kegunaan digital yang canggih.',
  },
  {
    role: 'Body Medium',
    className: 'text-body-md',
    font: 'Poppins',
    size: '16px / 1rem',
    weight: 'Regular (400)',
    lineHeight: '1.5',
    spacing: '0',
    sample: 'Gunakan spacing modular berbasis 8px untuk memastikan ketertiban layout di seluruh halaman web.',
  },
  {
    role: 'Caption / Metadata',
    className: 'text-caption',
    font: 'Poppins',
    size: '12px / 0.75rem',
    weight: 'Medium (500)',
    lineHeight: '1.4',
    spacing: '0.02em',
    sample: 'Terakhir diperbarui pada 13 Juli 2026 oleh Desainer UI/UX.',
  },
  {
    role: 'Roman Number',
    className: 'text-roman font-cinzel',
    font: 'Cinzel',
    size: '14px / 0.875rem',
    weight: 'Bold (700)',
    lineHeight: '1.3',
    spacing: '0.1em',
    sample: 'CHAPTER III • MASTERED',
  },
  {
    role: 'Code Snippet',
    className: 'text-code font-mono',
    font: 'Fira Code',
    size: '14px / 0.875rem',
    weight: 'Regular (400)',
    lineHeight: '1.5',
    spacing: '0',
    sample: 'const maguru = () => { return "Artisan Skeuomorphism"; }',
  },
]

export default function TypographyShowcase() {
  return (
    <div className="space-y-12">
      {/* Font Families Showcase */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SkeuoCard variant="paper" titleText="UI / Sans Font" descriptionText="Poppins (--font-sans)">
          <div className="mt-2 text-text-primary">
            <span className="text-display-l block font-sans">Aa</span>
            <span className="text-caption text-text-muted block mt-1">Digunakan untuk UI utama, navigasi, form, dan konten paragraf.</span>
          </div>
        </SkeuoCard>

        <SkeuoCard variant="paper" titleText="Serif Font" descriptionText="Playfair Display (--font-serif)">
          <div className="mt-2 text-text-primary">
            <span className="text-display-l block font-serif">Aa</span>
            <span className="text-caption text-text-muted block mt-1">Digunakan untuk aksen editorial, tulisan serif dekoratif.</span>
          </div>
        </SkeuoCard>

        <SkeuoCard variant="paper" titleText="Roman Accent" descriptionText="Cinzel (font-cinzel)">
          <div className="mt-2 text-text-primary">
            <span className="text-display-l block font-cinzel">IV</span>
            <span className="text-caption text-text-muted block mt-1">Digunakan untuk status khusus, lencana pencapaian, angka romawi bab.</span>
          </div>
        </SkeuoCard>

        <SkeuoCard variant="paper" titleText="Monospace Font" descriptionText="Fira Code (font-mono)">
          <div className="mt-2 text-text-primary">
            <span className="text-display-l block font-mono">{`{ }`}</span>
            <span className="text-caption text-text-muted block mt-1">Digunakan untuk cuplikan kode pemrograman dan data tabel angka.</span>
          </div>
        </SkeuoCard>
      </section>

      {/* Typography Scale Table */}
      <section className="space-y-6">
        <h2 className="text-h2 font-manrope font-semibold text-text-primary">Daftar Skala Tipografi</h2>
        
        <div className="space-y-6">
          {typographySpecs.map((spec, index) => (
            <SkeuoCard key={index} variant="paper" className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                {/* Meta details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-body-md font-semibold font-manrope text-text-primary">{spec.role}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-bg-surface-accent text-text-muted font-mono font-medium">{spec.font}</span>
                  </div>
                  <div className="text-caption text-text-muted space-y-0.5">
                    <div>Size: <code className="text-text-primary">{spec.size}</code></div>
                    <div>Weight: <code className="text-text-primary">{spec.weight}</code></div>
                    <div>Line Height: <code className="text-text-primary">{spec.lineHeight}</code></div>
                    <div>Letter Spacing: <code className="text-text-primary">{spec.spacing}</code></div>
                  </div>
                </div>

                {/* Live Preview */}
                <div className="lg:col-span-2 border-l border-text-faint/15 pl-6 py-2">
                  <div className={spec.className}>
                    {spec.sample}
                  </div>
                </div>
              </div>
            </SkeuoCard>
          ))}
        </div>
      </section>
    </div>
  )
}
