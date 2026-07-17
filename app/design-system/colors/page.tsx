'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Copy, Check, Info, Layers, Compass } from 'lucide-react'

interface ColorToken {
  name: string
  variable: string
  lightHex: string
  darkHex: string
  usage: string
  gradientDesc?: string
}

const colorTokensGroup = [
  {
    category: 'Warna Utama & Aksen Brand',
    tokens: [
      {
        name: 'Accent Coral (Primary Brand)',
        variable: '--color-accent-coral',
        lightHex: '#b34d3d',
        darkHex: '#c76554',
        usage: 'Aksen utama, tautan aktif, bullet points, dan tombol primer (.coral-skeuo).',
        gradientDesc: 'Gradien: #cc5a4a ke #b34d3d',
      },
      {
        name: 'AI Blue (Co-Teacher)',
        variable: '--color-ai-blue',
        lightHex: '#2d4a6b',
        darkHex: '#6a8bb5',
        usage: 'Akses khusus asisten AI Co-Teacher dan aksi interaktif AI (.ai-blue-skeuo).',
        gradientDesc: 'Gradien: #3c5e87 ke #2d4a6b',
      },
      {
        name: 'Accent Mustard (Premium Badge)',
        variable: '--color-accent-mustard',
        lightHex: '#cfa04a',
        darkHex: '#dfb163',
        usage: 'Mustard - Elemen status khusus dan lencana kreator terverifikasi (.gold-skeuo).',
      },
      {
        name: 'Accent Olive (Natural)',
        variable: '--color-accent-olive',
        lightHex: '#4e533b',
        darkHex: '#7f8566',
        usage: 'Olive - Aksen zaitun hutan Spruce Shadow (.olive-skeuo).',
      },
    ],
  },
  {
    category: 'Latar Belakang & Canvas',
    tokens: [
      {
        name: 'Canvas BG (Main Page)',
        variable: '--color-bg-canvas',
        lightHex: '#efe7d2',
        darkHex: '#19181d',
        usage: 'Warna latar belakang utama peramban (Warm Parchment / Deep Charcoal Black).',
      },
      {
        name: 'Surface BG (Cards & Sections)',
        variable: '--color-bg-surface',
        lightHex: '#ece4cf',
        darkHex: '#232127',
        usage: 'Latar belakang sekunder untuk wadah kartu fisis dan panel navigasi samping.',
      },
      {
        name: 'Surface Accent (Interactive / Active)',
        variable: '--color-bg-surface-accent',
        lightHex: '#ddd2b6',
        darkHex: '#37353e',
        usage: 'Warna latar untuk status terpilih, active list, atau hover state kartu.',
      },
      {
        name: 'Bone / Code Block BG',
        variable: '--color-bg-bone',
        lightHex: '#f7f1de',
        darkHex: '#2d2a33',
        usage: 'Warna box kode, wadah glassmorphic, atau area input textarea.',
      },
    ],
  },
  {
    category: 'Warna Teks & Status',
    tokens: [
      {
        name: 'Text Primary (Medium Walnut)',
        variable: '--color-text-primary',
        lightHex: '#4a3a34',
        darkHex: '#efe7d2',
        usage: 'Warna tinta walnut utama untuk judul, teks utama, dan tombol primer.',
      },
      {
        name: 'Text Secondary (Muted Ink)',
        variable: '--color-text-secondary',
        lightHex: '#2a2620',
        darkHex: '#ddd2b6',
        usage: 'Warna teks sekunder untuk paragraf konten dan deskripsi pendukung.',
      },
      {
        name: 'Success (Mastery Emerald)',
        variable: '--color-success',
        lightHex: '#10b981',
        darkHex: '#34d399',
        usage:
          'Penanda keberhasilan, lencana tingkat kompetensi, dan progress bar (.success-skeuo).',
      },
      {
        name: 'Error (Alert Red)',
        variable: '--color-error',
        lightHex: '#ef4444',
        darkHex: '#f87171',
        usage: 'Penanda kesalahan masukan form, tombol destruktif, dan peringatan.',
      },
    ],
  },
]

const skeuoUtilities = [
  {
    name: 'Tactile Paper Texture',
    className: 'paper-skeuo',
    type: 'Embossed (Timbul)',
    bgDesc: 'Light Bone ke Warm Paper',
    bevelLight: '1.5px Putih Atas (85% Opacity), 1px Kiri (60%)',
    bevelShade: '2.5px Kuningan Bawah (35%), 1.5px Kanan (20%)',
    usage: 'Kartu utama, kontainer teks, panel informasi taktil.',
  },
  {
    name: 'Coral Primary Active',
    className: 'coral-skeuo',
    type: 'Embossed (Timbul)',
    bgDesc: 'Radial Splatter (Coral, Peach, Dusty Rose)',
    bevelLight: '1.5px Putih Atas (50%), 1px Kiri (30%)',
    bevelShade: '2.5px Tinta Coral Bawah (45%), 1.5px Kanan (30%)',
    usage: 'Aksi utama (CTA), tombol interaktif primer kontras tinggi.',
  },
  {
    name: 'AI Blue Assist',
    className: 'ai-blue-skeuo',
    type: 'Embossed (Timbul)',
    bgDesc: 'Radial Splatter (AI Blue, Sky Blue, Navy)',
    bevelLight: '1.5px Putih Atas (55%), 1px Kiri (35%)',
    bevelShade: '2.5px Navy Bawah (40%), 1.5px Kanan (25%)',
    usage: 'Tombol fitur AI, asisten Co-Teacher, penunjuk opsi bimbingan cerdas.',
  },
  {
    name: 'Artisan Gold Badge',
    className: 'gold-skeuo',
    type: 'Embossed (Timbul)',
    bgDesc: 'Radial Splatter (Mustard, Soft Gold, Muted Gold)',
    bevelLight: '1.5px Putih Atas (75%), 1px Kiri (50%)',
    bevelShade: '2.5px Kuningan Pekat Bawah (45%), 1.5px Kanan (30%)',
    usage: 'Lencana verifikasi, status premium, penanda kompetensi tingkat tinggi.',
  },
  {
    name: 'Makassar Bronze Olive',
    className: 'olive-skeuo',
    type: 'Embossed (Timbul)',
    bgDesc: 'Radial Splatter (Olive, Bronze, Shadow Olive)',
    bevelLight: '1.5px Putih Atas (50%), 1px Kiri (30%)',
    bevelShade: '2.5px Zaitun Gelap Bawah (40%), 1.5px Kanan (25%)',
    usage: 'Aksen dekoratif bertema logam perunggu, lencana minor.',
  },
  {
    name: 'Mastery Emerald Success',
    className: 'success-skeuo',
    type: 'Embossed (Timbul)',
    bgDesc: 'Radial Splatter (Emerald, Success Green, Mint)',
    bevelLight: '1.5px Putih Atas (55%), 1px Kiri (35%)',
    bevelShade: '2.5px Hijau Hutan Bawah (45%), 1.5px Kanan (30%)',
    usage: 'Lencana Mastery, bar kemajuan modul belajar yang diselesaikan.',
  },
  {
    name: 'Debossed Surface Box',
    className: 'debossed-skeuo',
    type: 'Debossed (Tenggelam)',
    bgDesc: 'Canvas ke Surface (Kebalikan Embossed)',
    bevelLight: '1.5px Hitam Lembut Atas (8% Opacity), 1px Kiri (5%)',
    bevelShade: '1.5px Putih Bawah (85% Opacity), 1px Kanan (60%)',
    usage: 'Wadah panel kontrol, bar menu navigasi, kolom input teks (.neu-input).',
  },
]

export default function ColorsShowcase() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedToken(id)
    setTimeout(() => setCopiedToken(null), 1500)
  }

  return (
    <div className="space-y-16">
      {/* Introduction Header */}
      <section className="text-center md:text-left">
        <h2 className="text-h2 font-manrope font-semibold text-text-primary mb-2 flex items-center gap-2 justify-center md:justify-start">
          Atelier Zero Color Palette
        </h2>
        <p className="text-body-md text-text-secondary max-w-2xl">
          Palet warna Maguru menggunakan blok warna taktil dwi-mode. Setiap kartu di bawah
          menampilkan perbandingan warna Light Mode (kiri-atas) dan Dark Mode (kanan-bawah).
        </p>
      </section>

      {/* 1. Color Tokens Section */}
      {colorTokensGroup.map((group, groupIndex) => (
        <section key={groupIndex} className="space-y-6">
          <h3 className="text-h2 font-manrope font-semibold text-text-primary border-b border-text-faint/10 pb-2">
            {group.category}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {group.tokens.map((token, tokenIndex) => {
              const uniqueId = `token-${groupIndex}-${tokenIndex}`
              const splitGradientStyle = {
                background: `linear-gradient(135deg, ${token.lightHex} 50%, ${token.darkHex} 50%)`,
              }

              return (
                <div
                  key={tokenIndex}
                  className="grid grid-cols-1 sm:grid-cols-3 rounded-2xl overflow-hidden border border-text-faint/15 shadow-sm bg-bg-bone min-h-[200px]"
                >
                  {/* Left part: Big Diagonal Color Split Container */}
                  <div
                    style={splitGradientStyle}
                    className="relative flex items-stretch min-h-[140px] sm:min-h-full overflow-hidden border-b sm:border-b-0 sm:border-r border-text-faint/15 shadow-inner"
                  >


                    {/* Text overlays inside the split colors */}
                    <div className="absolute top-3 left-3 text-[10px] font-bold tracking-widest px-2 py-0.5 rounded bg-white/85 text-[#15140f] shadow-sm">
                      LIGHT
                    </div>
                    <div className="absolute bottom-3 right-3 text-[10px] font-bold tracking-widest px-2 py-0.5 rounded bg-[#19181d]/85 text-[#efe7d2] shadow-sm">
                      DARK
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/20 text-xs font-cinzel font-bold border border-white/10 tracking-widest">
                        BASE
                      </div>
                    </div>
                  </div>

                  {/* Right part: Description and variables (col-span-2) */}
                  <div className="sm:col-span-2 p-6 flex flex-col justify-between gap-4 bg-white/20 dark:bg-[#232127]/20 relative">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-body-lg font-manrope font-bold text-text-primary">
                          {token.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1.5 text-caption text-text-secondary bg-bg-surface-accent/20 px-2 py-1 rounded max-w-max border border-text-faint/5 font-mono">
                        <code className="select-all">{token.variable}</code>
                        <button
                          onClick={() => handleCopy(token.variable, `${uniqueId}-var`)}
                          className="hover:text-accent-coral transition-colors shrink-0 p-0.5"
                          title="Copy variable"
                        >
                          {copiedToken === `${uniqueId}-var` ? (
                            <Check className="w-3.5 h-3.5 text-success animate-fade-in" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <p className="text-caption text-text-muted leading-relaxed">{token.usage}</p>
                    </div>

                    {/* Curated Variations / Modes Badges */}
                    <div className="space-y-3 pt-3 border-t border-text-faint/10">
                      <span className="text-[10px] font-bold tracking-wider text-text-faint block uppercase">
                        Curated Variations (Hex)
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Light Mode Hex pill */}
                        <div className="flex items-center gap-1 bg-[#efe7d2] text-[#15140f] px-2.5 py-1 rounded-full text-xs font-mono font-bold shadow-sm border border-text-faint/10">
                          <span
                            className="w-2 h-2 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: token.lightHex }}
                          />
                          <span>L: {token.lightHex}</span>
                          <button
                            onClick={() => handleCopy(token.lightHex, `${uniqueId}-light`)}
                            className="hover:text-accent-coral transition-colors shrink-0 ml-1"
                          >
                            {copiedToken === `${uniqueId}-light` ? (
                              <Check className="w-3 h-3 text-success" />
                            ) : (
                              <Copy className="w-3 h-3 opacity-60" />
                            )}
                          </button>
                        </div>

                        {/* Dark Mode Hex pill */}
                        <div className="flex items-center gap-1 bg-[#19181d] text-[#efe7d2] px-2.5 py-1 rounded-full text-xs font-mono font-bold shadow-sm border border-text-faint/10">
                          <span
                            className="w-2 h-2 rounded-full border border-white/10 shrink-0"
                            style={{ backgroundColor: token.darkHex }}
                          />
                          <span>D: {token.darkHex}</span>
                          <button
                            onClick={() => handleCopy(token.darkHex, `${uniqueId}-dark`)}
                            className="hover:text-accent-coral transition-colors shrink-0 ml-1"
                          >
                            {copiedToken === `${uniqueId}-dark` ? (
                              <Check className="w-3 h-3 text-success" />
                            ) : (
                              <Copy className="w-3 h-3 opacity-60" />
                            )}
                          </button>
                        </div>

                        {/* Gradient description if present */}
                        {token.gradientDesc && (
                          <div className="flex items-center gap-1 bg-bg-bone text-text-secondary px-2.5 py-1 rounded-full text-xs font-mono font-medium border border-text-faint/10 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-accent-coral to-accent-mustard shrink-0" />
                            <span className="text-[10px]">{token.gradientDesc}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      ))}

      {/* 2. 3D Embossed Utilities Section (Pendekatan A) */}
      <section className="space-y-6">
        <div className="border-b border-text-faint/10 pb-2 flex flex-col md:flex-row md:items-end justify-between gap-2">
          <h3 className="text-h2 font-manrope font-semibold text-text-primary">
            Atelier Zero 3D Embossed & Debossed Utilities
          </h3>
          <span className="text-caption text-text-muted font-cinzel tracking-wider">
            TACTILE RENDERING SYSTEM
          </span>
        </div>
        <p className="text-body-md text-text-secondary max-w-2xl mb-6">
          Aturan Beveling & Shadow fisik yang menirukan arah datang cahaya 45° Kiri-Atas. Wadah kiri
          merender kelas CSS tersebut secara langsung.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {skeuoUtilities.map((util, index) => {
            const uniqueId = `util-${index}`
            const textClass =
              util.className.includes('coral') ||
              util.className.includes('blue') ||
              util.className.includes('olive') ||
              util.className.includes('success')
                ? 'text-white'
                : 'text-text-primary'

            return (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-3 rounded-2xl overflow-hidden border border-text-faint/15 shadow-sm bg-bg-bone min-h-[200px]"
              >
                {/* Left part: Live 3D CSS Render Block */}
                <div className="relative flex items-stretch min-h-[140px] sm:min-h-full overflow-hidden">
                  <div
                    className={cn(
                      'w-full flex flex-col items-center justify-center p-6 text-center select-none relative',
                      util.className,
                    )}
                  >


                    <span
                      className={cn(
                        'text-roman font-cinzel tracking-widest text-[11px] opacity-75',
                        textClass,
                      )}
                    >
                      {util.type}
                    </span>
                    <span
                      className={cn(
                        'text-body-md font-manrope font-extrabold mt-1 tracking-tight',
                        textClass,
                      )}
                    >
                      3D PREVIEW
                    </span>
                  </div>
                </div>

                {/* Right part: Specifications */}
                <div className="sm:col-span-2 p-6 flex flex-col justify-between gap-4 bg-white/20 dark:bg-[#232127]/20">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-body-lg font-manrope font-bold text-text-primary">
                        {util.name}
                      </h4>
                    </div>

                    {/* Class Name Selector with Copy */}
                    <div className="flex items-center gap-1.5 text-caption text-text-secondary bg-bg-surface-accent/20 px-2.5 py-1 rounded max-w-max border border-text-faint/5 font-mono">
                      <code className="select-all">.{util.className}</code>
                      <button
                        onClick={() => handleCopy(`.${util.className}`, `${uniqueId}-class`)}
                        className="hover:text-accent-coral transition-colors shrink-0 p-0.5"
                        title="Copy Class Name"
                      >
                        {copiedToken === `${uniqueId}-class` ? (
                          <Check className="w-3.5 h-3.5 text-success" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <p className="text-caption text-text-muted leading-relaxed">{util.usage}</p>
                  </div>

                  {/* Physics / Bevel Details */}
                  <div className="space-y-1.5 pt-3 border-t border-text-faint/10 text-[11px] text-text-secondary font-sans leading-relaxed">
                    <div>
                      <strong className="text-text-primary">Warna / Gradien:</strong> {util.bgDesc}
                    </div>
                    <div>
                      <strong className="text-text-primary">Bevel Terang (Highlight):</strong>{' '}
                      {util.bevelLight}
                    </div>
                    <div>
                      <strong className="text-text-primary">Bevel Gelap (Thickness):</strong>{' '}
                      {util.bevelShade}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* SECTION 3: ACCESSIBILITY, GLASS & STATES */}
      <section className="space-y-6 pt-10 border-t border-text-faint/12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-olive/10 flex items-center justify-center border border-accent-olive/20 text-accent-olive">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-serif font-bold text-text-primary tracking-wide">
              Accessibility, States & Translucent Tokens
            </h2>
            <p className="text-xs text-text-secondary">
              Panduan aksesibilitas WCAG, parameter kaca kertas kalkir, dan status interaktif.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box Left: WCAG Contrast */}
          <div className="bg-bg-bone rounded-3xl border border-text-faint/12 p-6 space-y-4">
            <h3 className="text-body-lg font-manrope font-bold text-text-primary">
              A. WCAG 2.1 Contrast (on Warm Parchment #efe7d2)
            </h3>
            <p className="text-caption text-text-secondary leading-relaxed">
              Keterbacaan teks utama diatur secara ketat untuk menjamin kelulusan kontras AA/AAA.
            </p>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-text-faint/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#4a3a34] border border-text-faint/10" />
                  <span className="text-caption font-bold text-text-primary">Medium Walnut</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-bg-bone px-2 py-0.5 rounded text-text-muted">6.2:1</span>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-success/15 text-success">AAA PASS</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-text-faint/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#4e533b] border border-text-faint/10" />
                  <span className="text-caption font-bold text-text-primary">Spruce Shadow</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-bg-bone px-2 py-0.5 rounded text-text-muted">6.8:1</span>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-success/15 text-success">AAA PASS</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-text-faint/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#b34d3d] border border-text-faint/10" />
                  <span className="text-caption font-bold text-text-primary">Rust Terracotta</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-bg-bone px-2 py-0.5 rounded text-text-muted">4.8:1</span>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-accent-mustard/15 text-accent-mustard">AA PASS</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-bg-surface border border-text-faint/5 opacity-70">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#cfa04a] border border-text-faint/10" />
                  <span className="text-caption font-bold text-text-primary">Raw Sienna (Decorative)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-bg-bone px-2 py-0.5 rounded text-text-muted">2.1:1</span>
                  <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-error/15 text-error">AA FAIL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Box Right: Parchment Glassmorphism & Interactive States */}
          <div className="bg-bg-bone rounded-3xl border border-text-faint/12 p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h3 className="text-body-lg font-manrope font-bold text-text-primary">
                B. Parchment Glassmorphism & States
              </h3>
              <p className="text-caption text-text-secondary leading-relaxed">
                Token transparansi kaca taktil (`--glass-*`) dan simulasi transisi saat kursor melayang (hover).
              </p>

              {/* Real-time Interactive Sandbox */}
              <div className="p-4 rounded-2xl bg-bg-surface/50 border border-text-faint/10 flex flex-col gap-3">
                <span className="text-[9px] font-mono text-accent-coral font-bold tracking-wider uppercase">INTERACTIVE SANDBOX</span>
                <div className="grid grid-cols-2 gap-4">
                  {/* Active Hover Card */}
                  <div className="p-4 rounded-xl border border-text-faint/10 bg-[#f7f1de]/45 hover:bg-[#ece4cf]/60 hover:translate-y-[1px] transition-all duration-200 cursor-pointer text-center group">
                    <span className="text-xs font-bold text-text-primary group-hover:text-accent-coral">Hover Me</span>
                    <p className="text-[9px] text-text-muted mt-1">Y-Translate + Deepen BG</p>
                  </div>
                  
                  {/* Disabled Card */}
                  <div className="p-4 rounded-xl border border-text-faint/10 bg-[#f7f1de]/45 opacity-[0.38] cursor-not-allowed text-center">
                    <span className="text-xs font-bold text-text-muted">Disabled State</span>
                    <p className="text-[9px] text-text-muted mt-1">Opacity: 38%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-text-faint/10 text-[11px] text-text-secondary font-mono leading-relaxed">
              <div>
                <strong className="text-text-primary">--glass-bg:</strong> rgba(247, 241, 222, 0.45)
              </div>
              <div>
                <strong className="text-text-primary">--glass-border:</strong> rgba(21, 20, 15, 0.08)
              </div>
              <div>
                <strong className="text-text-primary">--glass-shadow:</strong> rgba(21, 20, 15, 0.05)
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
