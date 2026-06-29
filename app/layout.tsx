import type React from 'react'
import type { Metadata } from 'next'
import { UserRoleProvider } from '../features/auth'
import { Providers } from '../lib/providers'
import '../styles/globals.css'
import { Toaster } from 'sonner'
import { NavbarGlass } from '../features/homepage/components/NavbarGlass'

// Load Google Fonts via next/font/google
import { Poppins, Playfair_Display, Fira_Code } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Maguru - Platform Course Online Terdepan',
  description:
    'Belajar skill digital terbaru dengan mentor expert di Maguru. Ribuan course berkualitas tinggi untuk mengembangkan karir Anda.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${poppins.variable} ${playfair.variable} ${firaCode.variable} font-sans antialiased`}
      >
        <Providers>
          <UserRoleProvider
            devMode={{
              enabled: process.env.NODE_ENV === 'development',
              allowRoleSwitching: process.env.NODE_ENV === 'development',
            }}
            cacheConfig={{
              ttl: parseInt(process.env.NEXT_PUBLIC_ROLE_CACHE_TTL || '300000'),
              enableSessionStorage: process.env.NEXT_PUBLIC_ENABLE_ROLE_CACHE !== 'false',
            }}
          >
            {/* Global navbar — fixed pill nav, visible on all pages */}
            <NavbarGlass />
            
            {/* Editorial Side Rails (Visible on desktop viewports) */}
            <div className="hidden xl:flex fixed left-0 top-0 bottom-0 w-9 z-40 pointer-events-none items-center justify-center" aria-hidden="true">
              <span className="font-sans text-[10px] font-bold tracking-[0.42em] uppercase text-text-faint/50 [writing-mode:vertical-rl] select-none">
                Maguru · EdTech Platform · MMXXVI
              </span>
            </div>
            <div className="hidden xl:flex fixed right-0 top-0 bottom-0 w-9 z-40 pointer-events-none items-center justify-center" aria-hidden="true">
              <span className="font-sans text-[10px] font-bold tracking-[0.42em] uppercase text-text-faint/50 [writing-mode:vertical-rl] select-none rotate-180">
                AI Co-Teacher · Penguasaan Kompetensi
              </span>
            </div>

            {children}
            <Toaster position="bottom-right" richColors closeButton />
          </UserRoleProvider>
        </Providers>
      </body>
    </html>
  )
}
