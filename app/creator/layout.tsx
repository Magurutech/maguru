'use client'

/**
 * Creator Layout
 *
 * Implements the Dark Lacquer & Gold Ancient Asian Creator Studio layout
 * matching the Designer Reference in Gambar 2:
 * - Dark Lacquer sidebar (#18130F) with gold crest seal & tactile active states
 * - 5 focused core navigation items
 * - Crimson lacquer "+ Buat Kursus" tactile CTA button
 * - Master Mentor profile card & ancient wisdom motto
 * - Top search bar with ⌘K shortcut, notification bell, and XP capsule
 */

import React, { useState} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  Plus,
  Bell,
  Search,
  ChevronRight,
  LogOut,
} from 'lucide-react'
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
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  // 5 Focused Core Menus as shown in Gambar 2
  const navItems = [
    {
      label: 'Creator Studio',
      href: '/creator',
      icon: Home,
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
      label: 'Analisis & Siswa',
      href: '/creator/students',
      icon: BarChart3,
    },
    {
      label: 'Pengaturan',
      href: '/creator/profile',
      icon: Settings,
    },
  ]

  return (
    <Sidebar className="border border-[#3A2E24]/60 bg-[#18130F] text-[#FAF5ED] rounded-[32px] shadow-lg">
      {/* ── 1. Studio Header with Maguru Seal Logo ── */}
      <SidebarHeader className="p-4 sm:p-5 border-b border-[#2D2319]/80 bg-[#18130F]">
        <Link
          href="/creator"
          className="flex items-center space-x-3 overflow-hidden transition-all duration-300 group"
        >
          {/* Flaming Lotus Crest Seal */}
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-[#FF4D4D] via-[#D32F2F] to-[#9A1B1B] p-0.5 shadow-[0_2px_10px_rgba(255,77,77,0.35)] shrink-0 flex items-center justify-center">
            <div className="w-full h-full rounded-[14px] bg-[#1E1711] flex items-center justify-center">
              <span className="text-xl select-none">🔥</span>
            </div>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col min-w-0 animate-fade-in">
              <div className="flex items-center gap-1.5">
                <span className="font-sans font-extrabold text-base tracking-tight text-[#FAF5ED] group-hover:text-[#FFB148] transition-colors">
                  Maguru
                </span>
              </div>
              <span className="text-[9.5px] tracking-[0.18em] uppercase text-[#D8C4A7]/70 font-sans font-semibold leading-none">
                CREATOR STUDIO
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      {/* ── 2. Sidebar Navigation Menus ── */}
      <SidebarContent className="px-3 py-5 space-y-4 overflow-y-auto bg-[#18130F]">
        <SidebarMenu className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  isActive={isActive}
                  tooltip={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-sans font-medium transition-all duration-150 select-none cursor-pointer ${
                    isActive
                      ? 'bg-[#2A2016] border border-[#FFB148]/60 text-[#FFB148] font-bold shadow-xs [&_svg]:text-[#FFB148]'
                      : 'text-[#C5B7A6] hover:bg-[#2A2016]/50 hover:text-[#FAF5ED] [&_svg]:text-[#8C7D6E] hover:[&_svg]:text-[#FAF5ED]'
                  }`}
                >
                  <Link href={item.href} className="flex items-center gap-3 w-full">
                    <Icon className="w-4 h-4 shrink-0 transition-colors" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        {/* ── 3. Tactile Crimson Lacquer Button: + Buat Kursus ── */}
        {!isCollapsed && (
          <div className="pt-2 px-1 animate-fade-in">
            <Link
              href="/creator/courses/create"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-linear-to-r from-[#E53935] via-[#D32F2F] to-[#C62828] hover:from-[#F44336] hover:to-[#D32F2F] text-white font-sans text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(229,57,53,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_6px_20px_rgba(229,57,53,0.45)] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Kursus</span>
            </Link>
          </div>
        )}
      </SidebarContent>

      {/* ── 4. Sidebar Footer: Master Mentor Profile & Ancient Motto ── */}
      <SidebarFooter className="p-3.5 sm:p-4 border-t border-[#2D2319]/80 bg-[#14100D] space-y-3">
        {/* Profile Card */}
        <Link
          href="/creator/profile"
          className={`flex items-center ${isCollapsed ? 'justify-center p-1' : 'justify-between p-2 rounded-2xl bg-[#1E1711] border border-[#3A2E24] hover:border-[#FFB148]/40 transition-colors group cursor-pointer'}`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar with Gold Trim */}
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#FFE8C4] to-[#FFB148] p-0.5 shrink-0 shadow-xs">
              <div className="w-full h-full rounded-full bg-[#2D2319] flex items-center justify-center text-[#FFE8C4] text-xs font-bold">
                L
              </div>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0 animate-fade-in text-left">
                <span className="text-[10px] font-sans font-semibold text-[#FFB148] leading-none">
                  Master Mentor
                </span>
                <span className="text-xs font-sans font-bold text-[#FAF5ED] group-hover:text-white truncate mt-1 flex items-center gap-1">
                  <span>Lutfi</span>
                  <span className="text-[10px]">👑</span>
                </span>
                <span className="text-[9.5px] font-sans text-[#8C7D6E] truncate">
                  Creator di Maguru
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <ChevronRight className="w-4 h-4 text-[#8C7D6E] group-hover:text-[#FFB148] group-hover:translate-x-0.5 transition-all shrink-0" />
          )}
        </Link>

        {/* Ancient Wisdom Motto */}
        {!isCollapsed && (
          <div className="px-2 pt-1 border-t border-[#2D2319]/50 animate-fade-in">
            <p className="font-serif italic text-[10px] text-[#A89885]/80 leading-relaxed text-center">
              &ldquo;Ilmu adalah senjata terbaik petualang di masa depan.&rdquo;
            </p>
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default function CreatorLayout({ children }: CreatorLayoutProps) {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-[#FAF5ED] text-[#2D2319] flex w-full">
        {/* CSS Override to hide student public navigation in creator studio */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          nav[aria-label="Primary navigation"] {
            display: none !important;
          }
        `,
          }}
        />

        {/* Dark Lacquer Sidebar Component */}
        <CreatorSidebar />

        {/* Main Content Area */}
        <SidebarInset className="bg-[#FAF5ED] flex-1 min-h-screen flex flex-col relative overflow-x-hidden">
          {/* ── TOP HEADER BAR: Search, Notifications, XP, and Profile ── */}
          <header className="px-5 md:px-8 lg:px-10 pt-3 pb-2.5 flex items-center justify-between border-b border-[#D8C4A7]/40 bg-[#FAF5ED]/95 backdrop-blur-md sticky top-0 z-30">
            {/* Left: Sidebar trigger + Search input */}
            <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
              <SidebarTrigger className="w-8.5 h-8.5 rounded-xl border border-[#D8C4A7]/60 bg-[#FFFDF9] hover:bg-[#FAF5ED] text-[#2D2319] flex items-center justify-center cursor-pointer shadow-2xs" />

              {/* Search Bar matching Gambar 2 */}
              <div className="relative w-full max-w-md hidden sm:block">
                <Search className="w-4 h-4 text-[#6E5D4B]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  placeholder="Cari kursus, topik, atau kata kunci..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-10 pr-12 py-1.5 text-xs rounded-xl border border-[#D8C4A7]/60 bg-[#FFFDF9] text-[#2D2319] placeholder:text-[#6E5D4B]/60 focus:outline-none focus:border-[#FF4D4D] focus:ring-2 focus:ring-[#FF4D4D]/20 transition-all font-sans shadow-2xs"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#6E5D4B]/70 bg-[#FAF5ED] border border-[#D8C4A7]/60 px-1.5 py-0.5 rounded">
                  ⌘ K
                </span>
              </div>
            </div>

            {/* Right: Notifications, XP Capsule, Profile */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Notifications with Unread Dot */}
              <button
                type="button"
                aria-label="Notifikasi"
                className="w-8.5 h-8.5 rounded-xl border border-[#D8C4A7]/60 bg-[#FFFDF9] hover:bg-[#FAF5ED] text-[#2D2319] flex items-center justify-center relative cursor-pointer shadow-2xs transition-colors"
              >
                <Bell className="w-3.5 h-3.5 text-[#6E5D4B]" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E53935]" />
              </button>

              {/* XP Capsule Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#FFFDF9] border border-[#D8C4A7]/60 shadow-2xs text-xs font-sans font-bold text-[#2D2319]">
                <span className="select-none">🪙</span>
                <span>1.250 XP</span>
              </div>

              {/* User Avatar + Name Capsule */}
              <div className="flex items-center gap-2 pl-1">
                <div className="w-8 h-8 rounded-full bg-[#2D2319] text-[#FAF5ED] text-xs font-bold flex items-center justify-center select-none shadow-2xs">
                  L
                </div>
                <span className="text-xs font-sans font-bold text-[#2D2319] hidden md:inline">
                  Lutfi
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Keluar dari akun"
                  className="p-1 hover:bg-[#FAF5ED] rounded-lg text-[#6E5D4B] hover:text-[#E53935] transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </header>

          {/* Children Creator Content (Tightened padding) */}
          <div className="flex-1 w-full max-w-7xl mx-auto px-5 md:px-8 lg:px-10 py-3.5 sm:py-4">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
