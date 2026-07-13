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
        lightHex: '#ed6f5c',
        darkHex: '#f08e7c',
        usage: 'Aksen utama, tautan aktif, bullet points, dan tombol primer (.coral-skeuo).',
        gradientDesc: 'Gradien: #f28f80 ke #ed6f5c',
      },
      {
        name: 'AI Blue (Co-Teacher)',
        variable: '--color-ai-blue',
        lightHex: '#4a90e2',
        darkHex: '#5da9ff',
        usage: 'Akses khusus asisten AI Co-Teacher dan aksi interaktif AI (.ai-blue-skeuo).',
        gradientDesc: 'Gradien: #7cb4f5 ke #4a90e2',
      },
      {
        name: 'Accent Mustard (Premium Badge)',
        variable: '--color-accent-mustard',
        lightHex: '#e9b94a',
        darkHex: '#f4cf74',
        usage: 'Mustard - Elemen status khusus dan lencana kreator terverifikasi (.gold-skeuo).',
      },
      {
        name: 'Accent Olive (Natural)',
        variable: '--color-accent-olive',
        lightHex: '#6e7448',
        darkHex: '#8a915e',
        usage: 'Olive - Aksen lempengan zaitun tanah liat Makassar (.olive-skeuo).',
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
        name: 'Text Primary (Ink)',
        variable: '--color-text-primary',
        lightHex: '#15140f',
        darkHex: '#efe7d2',
        usage: 'Warna tinta utama untuk judul, teks utama, dan tombol primer.',
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
                  className="grid grid-cols-1 sm:grid-cols-3 rounded-2xl overflow-hidden border border-text-faint/15 shadow-sm paper-skeuo min-h-[200px]"
                >
                  {/* Left part: Big Diagonal Color Split Container */}
                  <div
                    style={splitGradientStyle}
                    className="relative flex items-stretch min-h-[140px] sm:min-h-full overflow-hidden border-b sm:border-b-0 sm:border-r border-text-faint/15 shadow-inner"
                  >
                    {/* SVG Noise overlay for texture */}
                    <div className="absolute inset-0 pointer-events-none paper-texture opacity-30" />

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
                className="grid grid-cols-1 sm:grid-cols-3 rounded-2xl overflow-hidden border border-text-faint/15 shadow-sm paper-skeuo min-h-[200px]"
              >
                {/* Left part: Live 3D CSS Render Block */}
                <div className="relative flex items-stretch min-h-[140px] sm:min-h-full overflow-hidden">
                  <div
                    className={cn(
                      'w-full flex flex-col items-center justify-center p-6 text-center select-none relative',
                      util.className,
                    )}
                  >
                    {/* SVG Noise overlay for skeuomorphic texture */}
                    <div className="absolute inset-0 pointer-events-none paper-texture opacity-25" />

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
    </div>
  )
}
