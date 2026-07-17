'use client'

import React, { useState } from 'react'

const fonts = [
  {
    name: 'Fraunces',
    type: 'Editorial Serif (Heading)',
    token: 'font-serif',
    sample: 'China — golden courtyards, silk-road myths.',
    characters: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z\na b c d e f g h i j k l m n o p q r s t u v w x y z\n0 1 2 3 4 5 6 7 8 9',
    role: 'Digunakan untuk judul utama (Hero, H1-H3), kutipan sastra, serta elemen dekoratif yang membutuhkan nuansa klasik, ekspresif, dan taktil.',
  },
  {
    name: 'Poppins',
    type: 'Geometric Sans-Serif (Body & UI)',
    token: 'font-sans',
    sample: 'The quick brown fox jumps over the lazy dog.',
    characters: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z\na b c d e f g h i j k l m n o p q r s t u v w x y z\n0 1 2 3 4 5 6 7 8 9',
    role: 'Digunakan untuk teks utama (body copy - Poppins Regular 400), teks tombol, menu navigasi, kartu informasi, serta tulisan UI standar demi menjaga tingkat keterbacaan yang tinggi.',
  },
  {
    name: 'Fira Code',
    type: 'Technical Monospace (Specs & Code)',
    token: 'font-mono',
    sample: 'const font = "Fira Code";',
    characters: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z\na b c d e f g h i j k l m n o p q r s t u v w x y z\n0 1 2 3 4 5 6 7 8 9',
    role: 'Digunakan untuk spesifikasi teknis, data angka di tabel, baris kode pemrograman, penanda versi, serta meta-info dekoratif bersudut kaku.',
  },
  {
    name: 'Cinzel',
    type: 'Decorative Roman Display',
    token: 'font-cinzel',
    sample: 'ESTABLISHED IN MCMXCIV',
    characters: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z\nI II III IV V VI VII VIII IX X L C D M\n0 1 2 3 4 5 6 7 8 9',
    role: 'Digunakan sebagai aksen dekoratif angka Romawi kuno, judul bab seremonial, stempel legalitas, dan nomor penanda urutan modul kursus.',
  },
]

const typographySpecs = [
  {
    tag: 'Heading 1',
    token: 'text-h1',
    mobileSize: '36px / 2.25rem',
    tabletSize: '48px / 3rem',
    desktopSize: '60px / 3.75rem',
    mobileClass: 'font-serif font-medium text-[36px]',
    tabletClass: 'font-serif font-medium text-[48px]',
    desktopClass: 'font-serif font-medium text-[60px]',
    sample: 'Bicket Studio',
    desc: 'Digunakan untuk judul utama halaman utama (Page Title). Memiliki penyesuaian otomatis dari HP (36px) -> Tablet (48px) -> Desktop (60px).',
  },
  {
    tag: 'Heading 2',
    token: 'text-h2',
    mobileSize: '28px / 1.75rem',
    tabletSize: '38px / 2.375rem',
    desktopSize: '44px / 2.75rem',
    mobileClass: 'font-serif font-medium text-[28px]',
    tabletClass: 'font-serif font-medium text-[38px]',
    desktopClass: 'font-serif font-medium text-[44px]',
    sample: 'Desain Buket',
    desc: 'Digunakan untuk judul bagian utama (Section Title). Memiliki penyesuaian otomatis dari HP (28px) -> Tablet (38px) -> Desktop (44px).',
  },
  {
    tag: 'Heading 3',
    token: 'text-h3',
    mobileSize: '22px / 1.375rem',
    tabletSize: '28px / 1.75rem',
    desktopSize: '32px / 2rem',
    mobileClass: 'font-serif font-medium text-[22px]',
    tabletClass: 'font-serif font-medium text-[28px]',
    desktopClass: 'font-serif font-medium text-[32px]',
    sample: 'Kursus Florist',
    desc: 'Digunakan untuk sub-bagian atau judul kartu penting. Memiliki penyesuaian otomatis dari HP (22px) -> Tablet (28px) -> Desktop (32px).',
  },
  {
    tag: 'Heading 4',
    token: 'text-h4',
    mobileSize: '18px / 1.125rem',
    tabletSize: '22px / 1.375rem',
    desktopSize: '24px / 1.5rem',
    mobileClass: 'font-serif font-medium text-[18px]',
    tabletClass: 'font-serif font-medium text-[22px]',
    desktopClass: 'font-serif font-medium text-[24px]',
    sample: 'Spesifikasi Bunga',
    desc: 'Digunakan untuk judul kartu kecil atau sub-judul item list. Memiliki penyesuaian otomatis dari HP (18px) -> Tablet (22px) -> Desktop (24px).',
  },
  {
    tag: 'Subtitle Medium',
    token: 'text-subtitle-md',
    mobileSize: '20px / 1.25rem',
    tabletSize: '20px / 1.25rem',
    desktopSize: '20px / 1.25rem',
    mobileClass: 'font-sans font-medium text-[20px]',
    tabletClass: 'font-sans font-medium text-[20px]',
    desktopClass: 'font-sans font-medium text-[20px]',
    sample: 'Florist Seni & Edukasi Modern',
    desc: 'Digunakan untuk sub-judul halaman, keterangan kartu, atau paragraf penjelas menengah. Berjalan pada Poppins Medium 500.',
  },
  {
    tag: 'Body Large',
    token: 'text-body-lg',
    mobileSize: '10px / 0.625rem',
    tabletSize: '12px / 0.75rem',
    desktopSize: '14px / 0.875rem',
    mobileClass: 'font-sans font-normal text-[10px]',
    tabletClass: 'font-sans font-normal text-[12px]',
    desktopClass: 'font-sans font-normal text-[14px]',
    sample: 'Belajar merangkai bunga langsung dari mentor profesional dengan modul terstruktur.',
    desc: 'Digunakan untuk teks pengantar paragraf utama (lead paragraph) atau teks deskripsi besar. Berjalan pada Poppins Regular 400.',
  },
  {
    tag: 'Body Medium',
    token: 'text-body-md',
    mobileSize: '8px / 0.5rem',
    tabletSize: '10px / 0.625rem',
    desktopSize: '12px / 0.75rem',
    mobileClass: 'font-sans font-normal text-[8px]',
    tabletClass: 'font-sans font-normal text-[10px]',
    desktopClass: 'font-sans font-normal text-[12px]',
    sample: 'Platform belajar online terlengkap untuk para florist pemula hingga profesional di Indonesia.',
    desc: 'Digunakan untuk teks paragraf standar, deskripsi detail, tulisan artikel, dan UI copy utama. Berjalan pada Poppins Regular 400.',
  },
  {
    tag: 'Code Text (Technical Mono)',
    token: 'text-code',
    mobileSize: '10px / 0.625rem',
    tabletSize: '12px / 0.75rem',
    desktopSize: '14px / 0.875rem',
    mobileClass: 'font-mono text-[10px]',
    tabletClass: 'font-mono text-[12px]',
    desktopClass: 'font-mono text-[14px]',
    sample: 'const Course = () => { return <Florist /> }',
    desc: 'Digunakan untuk kode pemrograman, data spesifikasi angka, nomor versi, dan log data. Berjalan pada Fira Code.',
  },
  {
    tag: 'Roman Numeral Decor',
    token: 'text-roman',
    mobileSize: '10px / 0.625rem',
    tabletSize: '12px / 0.75rem',
    desktopSize: '14px / 0.875rem',
    mobileClass: 'font-cinzel font-bold tracking-widest text-[10px] uppercase',
    tabletClass: 'font-cinzel font-bold tracking-widest text-[12px] uppercase',
    desktopClass: 'font-cinzel font-bold tracking-widest text-[14px] uppercase',
    sample: 'CHAPTER III — MASTERY SEC. IV',
    desc: 'Digunakan untuk dekorasi romawi, badge modul level, stamp legalitas, dan nomor bab formal. Berjalan pada Cinzel Bold 700.',
  },
]

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1.5 rounded-lg border border-text-faint/12 hover:border-accent-coral/30 hover:bg-bg-bone/40 text-[10px] font-mono tracking-wide uppercase transition-all duration-150 flex items-center gap-1.5 cursor-pointer text-text-muted hover:text-accent-coral"
    >
      {copied ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
          </svg>
          Copy Class Name
        </>
      )}
    </button>
  )
}

export default function TypographyPage() {
  return (
    <div className="space-y-16 pb-12">
      {/* ── HEADER DISPLAY AREA ── */}
      <div className="text-center space-y-3">
        <span className="font-mono text-[10px] tracking-[0.25em] text-text-muted uppercase block">
          Design System Library
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-text-primary tracking-tight font-medium">
          Typography Showcase
        </h1>
        
        {/* Decorative Divider with Diamond */}
        <div className="relative flex py-6 items-center max-w-lg mx-auto">
          <div className="flex-grow border-t border-text-faint/10"></div>
          <span className="flex-shrink mx-4 text-text-muted/30 text-sm font-serif">🙎 ✦ 🙎</span>
          <div className="flex-grow border-t border-text-faint/10"></div>
        </div>
      </div>

      {/* ── SECTION 1: PRIMARY FONT FAMILIES (4 FONTS) ── */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-text-faint/10 pb-3">
          <span className="font-mono text-sm text-accent-olive font-bold">T</span>
          <h2 className="text-lg font-serif font-bold text-text-primary tracking-wide">
            Primary Font Families
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fonts.map((f) => (
            <div
              key={f.name}
              className="bg-bg-bone rounded-2xl border border-text-faint/12 p-6 flex flex-col justify-between space-y-4 hover:border-text-faint/25 transition-all duration-300"
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <h3 className="font-serif font-bold text-lg text-text-primary">{f.name}</h3>
                  <span className="font-mono text-[9px] uppercase tracking-wider bg-bg-bone px-2 py-0.5 rounded text-text-muted">
                    {f.type}
                  </span>
                </div>
                <code className="text-xs bg-bg-bone/80 px-1.5 py-0.5 rounded font-mono text-accent-coral inline-block">
                  .{f.token}
                </code>
              </div>

              <div className="py-3 border-t border-b border-text-faint/8">
                <p className={`${f.token} text-base text-text-primary truncate`}>{f.sample}</p>
                <p className={`${f.token} text-[11px] text-text-muted leading-relaxed whitespace-pre-line mt-1 opacity-80`}>
                  {f.characters}
                </p>
              </div>

              <p className="text-xs text-text-muted leading-relaxed">
                {f.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 2: RESPONSIVE HEADING 1 SIMULATION ── */}
      <section className="space-y-6">
        <div className="space-y-1.5 border-b border-text-faint/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-accent-olive font-bold">T</span>
            <h2 className="text-lg font-serif font-bold text-text-primary tracking-wide">
              Responsive Heading 1 (Simulation)
            </h2>
          </div>
          <p className="text-xs text-text-muted font-sans leading-relaxed">
            Simulasi perbandingan ukuran kelas <code className="font-mono bg-bg-bone px-1 rounded text-accent-coral">text-h1</code> di berbagai ukuran layar perangkat secara responsif:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card Mobile */}
          <div className="bg-bg-bone/40 rounded-2xl border border-text-faint/12 p-6 flex flex-col justify-between h-56 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-muted font-mono tracking-wider">Preview (36px):</span>
              <span className="text-[9px] font-mono uppercase tracking-wider bg-accent-coral/10 text-accent-coral font-bold px-2 py-0.5 rounded-full">
                Mobile (HP)
              </span>
            </div>
            <div className="my-auto">
              <h1 className="font-serif font-medium text-[36px] leading-[1.15] text-text-primary">
                Bicket Studio Florist
              </h1>
            </div>
            <div>
              <span className="inline-block text-[9px] font-mono uppercase bg-bg-bone text-text-muted px-2 py-0.5 rounded border border-text-faint/8">
                Viewport: &lt; 768px
              </span>
            </div>
          </div>

          {/* Card Tablet */}
          <div className="bg-bg-bone/40 rounded-2xl border border-text-faint/12 p-6 flex flex-col justify-between h-56 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-muted font-mono tracking-wider">Preview (48px):</span>
              <span className="text-[9px] font-mono uppercase tracking-wider bg-accent-olive/10 text-accent-olive font-bold px-2 py-0.5 rounded-full">
                Tablet
              </span>
            </div>
            <div className="my-auto">
              <h1 className="font-serif font-medium text-[48px] leading-[1.1] text-text-primary">
                Bicket Studio Florist
              </h1>
            </div>
            <div>
              <span className="inline-block text-[9px] font-mono uppercase bg-bg-bone text-text-muted px-2 py-0.5 rounded border border-text-faint/8">
                Viewport: &gt;= 768px
              </span>
            </div>
          </div>

          {/* Card Desktop */}
          <div className="bg-bg-bone/40 rounded-2xl border border-text-faint/12 p-6 flex flex-col justify-between h-56 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] text-text-muted font-mono tracking-wider">Preview (60px):</span>
              <span className="text-[9px] font-mono uppercase tracking-wider bg-accent-mustard/20 text-text-primary font-bold px-2 py-0.5 rounded-full">
                Desktop
              </span>
            </div>
            <div className="my-auto">
              <h1 className="font-serif font-medium text-[60px] leading-[1.05] text-text-primary">
                Bicket Studio Florist
              </h1>
            </div>
            <div>
              <span className="inline-block text-[9px] font-mono uppercase bg-bg-bone text-text-muted px-2 py-0.5 rounded border border-text-faint/8">
                Viewport: &gt;= 1024px
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: TYPOGRAPHY CATALOG & UTILITIES ── */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-text-faint/10 pb-3">
          <span className="font-mono text-sm text-accent-olive font-bold">T</span>
          <h2 className="text-lg font-serif font-bold text-text-primary tracking-wide">
            Typography Catalog & Utilities
          </h2>
        </div>

        <div className="space-y-6">
          {typographySpecs.map((spec) => (
            <div
              key={spec.token}
              className="bg-bg-bone rounded-3xl border border-text-faint/12 p-8 space-y-6 hover:border-text-faint/20 transition-all duration-300"
            >
              {/* Header Box Row */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-sans font-bold text-text-primary text-base">
                    {spec.tag}
                  </h3>
                  <code className="text-xs bg-bg-bone px-2 py-0.5 rounded font-mono text-accent-coral font-semibold">
                    .{spec.token}
                  </code>
                </div>
                <CopyButton text={spec.token} />
              </div>

              {/* Responsive Grid Previews */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 border-t border-text-faint/8">
                {/* Mobile Preview */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono tracking-wider uppercase text-accent-coral/80 block">
                    Mobile (HP) — {spec.mobileSize}
                  </span>
                  <div className="min-h-[96px] flex items-center p-4 rounded-xl bg-bg-canvas border border-text-faint/5">
                    <span className={`leading-tight text-text-primary ${spec.mobileClass}`}>
                      {spec.sample}
                    </span>
                  </div>
                </div>

                {/* Tablet Preview */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono tracking-wider uppercase text-accent-olive/80 block">
                    Tablet — {spec.tabletSize}
                  </span>
                  <div className="min-h-[96px] flex items-center p-4 rounded-xl bg-bg-canvas border border-text-faint/5">
                    <span className={`leading-tight text-text-primary ${spec.tabletClass}`}>
                      {spec.sample}
                    </span>
                  </div>
                </div>

                {/* Desktop Preview */}
                <div className="space-y-2">
                  <span className="text-[9px] font-mono tracking-wider uppercase text-text-muted block">
                    Desktop — {spec.desktopSize}
                  </span>
                  <div className="min-h-[96px] flex items-center p-4 rounded-xl bg-bg-canvas border border-text-faint/5">
                    <span className={`leading-tight text-text-primary ${spec.desktopClass}`}>
                      {spec.sample}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Bottom Label */}
              <p className="text-xs text-text-muted leading-relaxed pt-2">
                {spec.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
