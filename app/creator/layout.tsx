'use client'

/**
 * Creator Layout
 *
 * Layout khusus untuk creator/mentor role yang menyediakan:
 * - Navigasi Studio Pembuat (Creator Studio) modular.
 * - Sidebar dengan kustomisasi margin 5px, rounded corners 40px, dan collapse mode.
 * - Integrasi tema gelap (Dark Mode) dan Clerk UserButton.
 * - Override CSS untuk menyembunyikan Navbar landing page global.
 */

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { PenTool, BookOpen, FileText, Video, Users, Sun, Moon, LogOut, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar'

interface CreatorLayoutProps {
  children: React.ReactNode
}

function CreatorSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { state } = useSidebar()
  const [mounted, setMounted] = useState(false)
  const isCollapsed = state === 'collapsed'

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const navItems = [
    {
      label: 'Creator Studio',
      href: '/creator',
      icon: PenTool,
    },
    {
      label: 'Kursus Saya',
      href: '/creator/courses',
      icon: BookOpen,
    },
    {
      label: 'Pustaka Konten',
      href: '/creator/content',
      icon: FileText,
    },
    {
      label: 'Pengelola Video',
      href: '/creator/videos',
      icon: Video,
    },
    {
      label: 'Daftar Siswa',
      href: '/creator/students',
      icon: Users,
    },
    {
      label: 'Profil Saya',
      href: '/creator/profile',
      icon: User,
    },
  ]

  return (
    <Sidebar className="border-none bg-transparent">
      {/* 1. Sidebar Header */}
      <SidebarHeader className="p-4 border-b border-border/10">
        <div className="flex items-center space-x-3 overflow-hidden transition-all duration-300">
          <div className="w-9 h-9 border border-text-primary rounded-full flex items-center justify-center font-serif italic text-lg text-text-primary bg-background shrink-0 select-none">
            C
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-fade-in">
              <span className="font-manrope font-bold text-base tracking-tight text-text-primary">
                STUDIO PEMBUAT
              </span>
              <span className="text-[9px] tracking-[0.14em] uppercase text-text-muted font-sans font-semibold leading-none">
                MAGURU Creator
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* 2. Sidebar Navigation Items */}
      <SidebarContent className="px-3 py-6 space-y-1.5 overflow-y-auto">
        <SidebarMenu className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all duration-180 select-none cursor-pointer ${
                    isActive
                      ? 'bg-accent-coral text-white font-semibold shadow-glow [&_svg]:text-white'
                      : 'text-text-secondary hover:bg-bg-surface-accent hover:text-text-primary [&_svg]:text-text-muted hover:[&_svg]:text-text-primary'
                  }`}
                >
                  <a href={item.href} className="flex items-center gap-3 w-full">
                    <Icon className="w-4 h-4 shrink-0 transition-colors" />
                    {!isCollapsed && <span className="animate-fade-in">{item.label}</span>}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        {/* Quick New Course Button inside Sidebar (Hidden when collapsed) */}
        {!isCollapsed && (
          <div className="mt-8 p-4 bg-bg-bone/60 border border-border/10 rounded-2xl relative overflow-hidden paper-texture animate-fade-in mx-1 text-center">
            <h4 className="text-[10px] font-bold text-text-primary tracking-wider uppercase mb-2">
              Mulai Kelas Baru
            </h4>
            <button
              onClick={() => console.log('Create new course')}
              className="w-full btn-primary text-xs py-2 px-4 rounded-full font-bold select-none cursor-pointer"
            >
              + Buat Kursus
            </button>
          </div>
        )}
      </SidebarContent>

      {/* 3. Sidebar Footer */}
      <SidebarFooter className="p-4 border-t border-border/10 bg-card space-y-3">
        <div
          className={`flex items-center ${isCollapsed ? 'flex-col gap-3 justify-center' : 'justify-between px-2'}`}
        >
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme mode"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-background border border-border/10 hover:bg-bg-surface-accent text-text-secondary transition-colors duration-180 cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-accent-mustard" />
              ) : (
                <Moon className="w-4 h-4 text-accent-olive" />
              )}
            </button>
          )}

          {/* Logout button */}
          <button
            onClick={handleSignOut}
            aria-label="Keluar dari akun"
            className="w-9 h-9 flex items-center justify-center rounded-full bg-background border border-border/10 hover:bg-error hover:text-white text-text-muted transition-all duration-180 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* User Profile Info */}
        <div
          className={`flex items-center ${isCollapsed ? 'justify-center p-1' : 'space-x-3 p-2 bg-background/50 border border-border/5 rounded-2xl min-w-0'}`}
        >
          <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-accent-coral/10 text-accent-coral border border-accent-coral/20">
            <User className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 animate-fade-in">
              <span className="text-xs font-semibold text-text-primary truncate font-sans">
                Lutfi Mentor
              </span>
              <span className="text-[10px] text-text-muted font-medium font-sans truncate">
                lutfi@maguru.com
              </span>
            </div>
          )}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default function CreatorLayout({ children }: CreatorLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex w-full">
        {/* CSS Override untuk menyembunyikan NavbarGlass landing page di halaman studio */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          nav[aria-label="Primary navigation"] {
            display: none !important;
          }
        `,
          }}
        />

        {/* Sidebar Component */}
        <CreatorSidebar />

        {/* Main Content Area */}
        <SidebarInset className="bg-transparent flex-1 min-h-screen flex flex-col relative overflow-x-hidden">
          {/* Dashboard Sticky header bar */}
          <header className="px-6 md:px-12 pt-6 flex items-center justify-between border-b border-border/5 pb-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="w-9 h-9 border border-border/10 rounded-full flex items-center justify-center hover:bg-bg-surface-accent text-text-secondary cursor-pointer" />
              <span className="text-[10px] font-bold font-mono tracking-widest text-text-muted">
                MAGURU CREATOR STUDIO
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              <span className="text-[9px] font-bold font-sans tracking-wider uppercase text-text-muted">
                Creator Assistant Active
              </span>
            </div>
          </header>

          {/* Children Creator Content */}
          <div className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-8">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
