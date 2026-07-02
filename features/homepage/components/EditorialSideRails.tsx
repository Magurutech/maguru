'use client'

import { usePathname } from 'next/navigation'

/**
 * EditorialSideRails Component
 *
 * Renders the vertical text rails on the left and right margins of the viewport.
 * Automatically hidden on full-screen workspace routes (learn page, creator dashboard, admin, auth pages).
 */
export function EditorialSideRails() {
  const pathname = usePathname()

  // ponytail: Hide side rails on full-screen workspace and auth pages
  const isWorkspace =
    pathname?.includes('/learn') ||
    pathname?.startsWith('/creator') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/sign-in') ||
    pathname?.startsWith('/sign-up')

  if (isWorkspace) return null

  return (
    <>
      {/* Editorial Side Rails (Visible on desktop viewports) */}
      <div
        className="hidden xl:flex fixed left-0 top-0 bottom-0 w-9 z-40 pointer-events-none items-center justify-center"
        aria-hidden="true"
      >
        <span className="font-sans text-[10px] font-bold tracking-[0.42em] uppercase text-text-faint/50 [writing-mode:vertical-rl] select-none">
          Maguru · EdTech Platform · MMXXVI
        </span>
      </div>
      <div
        className="hidden xl:flex fixed right-0 top-0 bottom-0 w-9 z-40 pointer-events-none items-center justify-center"
        aria-hidden="true"
      >
        <span className="font-sans text-[10px] font-bold tracking-[0.42em] uppercase text-text-faint/50 [writing-mode:vertical-rl] select-none rotate-180">
          AI Co-Teacher · Penguasaan Kompetensi
        </span>
      </div>
    </>
  )
}
