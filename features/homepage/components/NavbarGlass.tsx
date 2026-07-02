'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { Sun, Moon } from 'lucide-react'
import { gsap } from 'gsap'
import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'
import { useRoleNavigation } from '@/features/auth'
import { usePathname } from 'next/navigation'

// ─── Nav items data ────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Beranda', href: '/' },
  { label: 'Kursus', href: '/course' },
  { label: 'Tentang', href: '/about' },
  { label: 'Kontak', href: '/contact' },
]

const EASE = 'power3.out'

// ─── Component ─────────────────────────────────────────────────────────────────
export function NavbarGlass() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const { isSignedIn } = useUser()
  const { getDashboardUrl } = useRoleNavigation()

  // ponytail: Hide NavbarGlass on full-screen workspace and auth pages
  const isWorkspace =
    pathname?.includes('/learn') ||
    pathname?.startsWith('/creator') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/sign-in') ||
    pathname?.startsWith('/sign-up')

  if (isWorkspace) return null

  // GSAP refs
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([])
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([])
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([])
  const navItemsRef = useRef<HTMLDivElement | null>(null)
  const logoRef = useRef<HTMLDivElement | null>(null)
  const hamburgerRef = useRef<HTMLButtonElement | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const themeToggleRef = useRef<HTMLButtonElement | null>(null)
  const ctaRef = useRef<HTMLAnchorElement | null>(null)

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(handle)
  }, [])

  // ── GSAP layout + initial animation ──────────────────────────────────────────
  useEffect(() => {
    /**
     * Compute the circular bubble geometry for each pill.
     * The bubble is a circle whose arc perfectly fills the pill width,
     * positioned at the bottom-center so it rises up on hover.
     */
    const layout = () => {
      circleRefs.current.forEach((circle, i) => {
        if (!circle?.parentElement) return
        const pill = circle.parentElement as HTMLElement
        const { width: w, height: h } = pill.getBoundingClientRect()

        // Radius of a circle whose chord = pill width, sitting at bottom
        const R = ((w * w) / 4 + h * h) / (2 * h)
        const D = Math.ceil(2 * R) + 2
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1

        circle.style.width = `${D}px`
        circle.style.height = `${D}px`
        circle.style.bottom = `-${delta}px`

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${D - delta}px`,
        })

        const label = pill.querySelector<HTMLElement>('.pill-label')
        const labelHover = pill.querySelector<HTMLElement>('.pill-label-hover')

        if (label) gsap.set(label, { y: 0 })
        if (labelHover) gsap.set(labelHover, { y: h + 12, opacity: 0 })

        // Build per-pill hover timeline
        tlRefs.current[i]?.kill()
        const tl = gsap.timeline({ paused: true })

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 0.55, ease: EASE }, 0)
        if (label) tl.to(label, { y: -(h + 8), duration: 0.55, ease: EASE }, 0)
        if (labelHover) {
          gsap.set(labelHover, { y: Math.ceil(h + 100), opacity: 0 })
          tl.to(labelHover, { y: 0, opacity: 1, duration: 0.55, ease: EASE }, 0)
        }

        tlRefs.current[i] = tl
      })
    }

    layout()
    window.addEventListener('resize', layout)
    if (document.fonts) document.fonts.ready.then(layout).catch(() => {})

    // ── Initial load: full left-to-right reveal sequence ────────────────────
    // 1. Logo scale+fade in
    if (logoRef.current) {
      gsap.from(logoRef.current, {
        opacity: 0,
        scale: 0.85,
        duration: 0.5,
        ease: EASE,
        delay: 0.05,
      })
    }
    // 2. Nav items stagger up
    if (navItemsRef.current) {
      gsap.from(Array.from(navItemsRef.current.children), {
        opacity: 0,
        y: -6,
        stagger: 0.07,
        duration: 0.45,
        ease: EASE,
        delay: 0.15,
      })
    }
    // 3. Theme toggle fade+scale in (after nav items)
    if (themeToggleRef.current) {
      gsap.from(themeToggleRef.current, {
        opacity: 0,
        scale: 0.75,
        duration: 0.4,
        ease: EASE,
        delay: 0.38,
      })
    }
    // 4. CTA button slide in from right
    if (ctaRef.current) {
      gsap.from(ctaRef.current, {
        opacity: 0,
        x: 12,
        duration: 0.4,
        ease: EASE,
        delay: 0.46,
      })
    }

    // Hide mobile menu initially (GSAP-controlled visibility)
    if (mobileMenuRef.current) {
      gsap.set(mobileMenuRef.current, { visibility: 'hidden', opacity: 0 })
    }

    return () => window.removeEventListener('resize', layout)
  }, [])

  // ── Pill hover handlers ───────────────────────────────────────────────────────
  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: EASE,
      overwrite: 'auto',
    })
  }

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease: EASE,
      overwrite: 'auto',
    })
  }

  // ── Mobile menu toggle (GSAP animated) ───────────────────────────────────────
  const toggleMobile = () => {
    const next = !mobileOpen
    setMobileOpen(next)

    const burger = hamburgerRef.current
    const menu = mobileMenuRef.current

    if (burger) {
      const lines = burger.querySelectorAll('.burger-line')
      if (next) {
        gsap.to(lines[0], { rotation: 45, y: 4, duration: 0.25, ease: EASE })
        gsap.to(lines[1], { rotation: -45, y: -4, duration: 0.25, ease: EASE })
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.25, ease: EASE })
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.25, ease: EASE })
      }
    }

    if (menu) {
      if (next) {
        gsap.set(menu, { visibility: 'visible' })
        gsap.fromTo(menu, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.28, ease: EASE })
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: -10,
          duration: 0.2,
          ease: EASE,
          onComplete: () => gsap.set(menu, { visibility: 'hidden' }),
        })
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-7xl z-50
                 glass-panel rounded-full px-4 py-2
                 flex items-center justify-between"
    >
      {/* ── Brand logo ── */}
      <div ref={logoRef} className="flex items-center gap-2.5 select-none">
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-accent-coral/20 shrink-0">
          <Image
            src="/page/icon.png"
            alt="Maguru logo"
            fill
            sizes="32px"
            className="object-cover"
            priority
          />
        </div>
        <span className="font-manrope text-[17px] font-bold tracking-wider text-text-primary">
          MAGURU<span className="text-accent-coral">.</span>
        </span>
      </div>

      {/* ── Desktop pill nav ── */}
      <div ref={navItemsRef} className="hidden md:flex items-center gap-1" role="menubar">
        {NAV_ITEMS.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            role="menuitem"
            aria-label={item.label}
            onMouseEnter={() => handleEnter(i)}
            onMouseLeave={() => handleLeave(i)}
            className="relative overflow-hidden inline-flex items-center justify-center
                       h-9 px-5 rounded-full cursor-pointer select-none
                       focus-visible:outline-2 focus-visible:outline-offset-2
                       focus-visible:outline-accent-coral"
            style={{
              /*
               * Pill background: semi-transparent surface from design system.
               * This keeps the glassmorphism aesthetic while giving each pill
               * a subtle frosted-card look distinct from the outer navbar bg.
               */
              background: 'var(--color-bg-surface)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {/*
             * GSAP circular bubble — rises from the bottom of the pill on hover.
             * Color = accent-coral (brand primary), creates a bold fill effect.
             */}
            <span
              aria-hidden="true"
              ref={(el) => {
                circleRefs.current[i] = el
              }}
              className="absolute left-1/2 bottom-0 rounded-full pointer-events-none z-1"
              style={{
                background: 'var(--color-accent-coral)',
                willChange: 'transform',
              }}
            />

            {/* Stacked label pair — original slides up, hover copy slides in */}
            <span className="relative inline-block leading-none z-2">
              <span
                className="pill-label relative z-2 inline-block leading-none
                           text-[13px] font-semibold"
                style={{ willChange: 'transform' }}
              >
                {item.label}
              </span>
              <span
                aria-hidden="true"
                className="pill-label-hover absolute left-0 top-0 z-3 inline-block
                           text-[13px] font-semibold text-white"
                style={{ willChange: 'transform, opacity' }}
              >
                {item.label}
              </span>
            </span>
          </Link>
        ))}
      </div>

      {/* ── Action area ── */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        {mounted && (
          <button
            ref={themeToggleRef}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle colour theme"
            className="w-10 h-10 flex items-center justify-center rounded-full
                       hover:bg-bg-surface-accent/50 text-text-secondary
                       transition-colors duration-200 cursor-pointer
                       focus-visible:outline-2 focus-visible:outline-accent-coral"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-accent-mustard" />
            ) : (
              <Moon className="w-4 h-4 text-accent-olive" />
            )}
          </button>
        )}

        {/* CTA / Auth Actions */}
        {!isSignedIn ? (
          <>
            <Link
              href="/sign-in"
              className="hidden sm:inline-flex items-center justify-center
                         px-4 py-2 text-xs font-semibold text-text-secondary hover:text-accent-coral
                         transition-colors duration-200"
            >
              Masuk
            </Link>
            <Link
              ref={ctaRef}
              href="/sign-up"
              className="hidden sm:inline-flex items-center justify-center
                         px-5 py-2 text-xs font-bold tracking-wide
                         text-white bg-accent-coral rounded-full shadow-sm
                         hover:bg-accent-coral/90 hover:-translate-y-0.5
                         transition-all duration-200"
            >
              Mulai Gratis
            </Link>
          </>
        ) : (
          <>
            <Link
              ref={ctaRef}
              href={getDashboardUrl()}
              className="hidden sm:inline-flex items-center justify-center
                         px-4 py-2 text-xs font-semibold text-text-secondary hover:text-accent-coral
                         transition-colors duration-200"
            >
              Dashboard
            </Link>
            <div className="flex items-center justify-center pl-1">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-7 h-7 rounded-full border border-accent-coral/20',
                  },
                }}
              />
            </div>
          </>
        )}

        {/* Mobile hamburger */}
        <button
          ref={hamburgerRef}
          onClick={toggleMobile}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.25
                     rounded-full cursor-pointer hover:bg-bg-surface-accent/50
                     transition-colors duration-200"
        >
          <span className="burger-line block w-4 h-0.5 rounded bg-text-secondary origin-center" />
          <span className="burger-line block w-4 h-0.5 rounded bg-text-secondary origin-center" />
        </button>
      </div>

      {/* ── Mobile dropdown (GSAP animated) ── */}
      <div
        ref={mobileMenuRef}
        role="menu"
        aria-label="Mobile navigation"
        className="md:hidden absolute top-[calc(100%+8px)] left-0 right-0
                   glass-panel rounded-2xl p-2 flex flex-col gap-1
                   z-50 border border-glass-border"
        style={{ visibility: 'hidden' }}
      >
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            role="menuitem"
            onClick={toggleMobile}
            className="text-sm font-semibold text-text-secondary
                       hover:text-accent-coral hover:bg-bg-surface-accent/40
                       px-4 py-3 rounded-xl transition-all duration-200"
          >
            {item.label}
          </Link>
        ))}

        {!isSignedIn ? (
          <>
            <Link
              href="/sign-in"
              role="menuitem"
              onClick={toggleMobile}
              className="text-sm font-semibold text-text-secondary
                         hover:text-accent-coral hover:bg-bg-surface-accent/40
                         px-4 py-3 rounded-xl transition-all duration-200"
            >
              Masuk
            </Link>
            <Link
              href="/sign-up"
              role="menuitem"
              onClick={() => setMobileOpen(false)}
              className="inline-flex items-center justify-center w-full mt-1 py-3
                         text-sm font-bold text-white bg-accent-coral rounded-xl
                         hover:bg-accent-coral/90 transition-colors duration-200"
            >
              Mulai Gratis
            </Link>
          </>
        ) : (
          <>
            <Link
              href={getDashboardUrl()}
              role="menuitem"
              onClick={toggleMobile}
              className="text-sm font-semibold text-text-secondary
                         hover:text-accent-coral hover:bg-bg-surface-accent/40
                         px-4 py-3 rounded-xl transition-all duration-200"
            >
              Dashboard
            </Link>
            <div className="flex items-center justify-between px-4 py-3 mt-1 border-t border-glass-border">
              <span className="text-sm font-semibold text-text-secondary">Akun Saya</span>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: 'w-8 h-8 rounded-full border border-accent-coral/20',
                  },
                }}
              />
            </div>
          </>
        )}
      </div>
    </nav>
  )
}
