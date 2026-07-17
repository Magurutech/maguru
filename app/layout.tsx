import type React from 'react'
import type { Metadata } from 'next'
import { UserRoleProvider } from '../features/auth'
import { Providers } from '../lib/providers'
import '../styles/globals.css'
import { Toaster } from 'sonner'
import { NavbarGlass } from '../features/homepage/components/NavbarGlass'
import { EditorialSideRails } from '../features/homepage/components/EditorialSideRails'

// Load Google Fonts via next/font/google
import { Poppins, Fraunces, Fira_Code, Cinzel } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
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
        className={`${poppins.variable} ${fraunces.variable} ${firaCode.variable} ${cinzel.variable} font-sans antialiased`}
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
            
            {/* Editorial Side Rails (Conditional client component) */}
            <EditorialSideRails />

            {children}
            <Toaster position="bottom-right" richColors closeButton />
          </UserRoleProvider>
        </Providers>
      </body>
    </html>
  )
}
