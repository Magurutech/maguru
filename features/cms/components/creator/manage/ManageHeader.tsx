'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Globe, EyeOff, Sparkles, Brain, RefreshCw, ShieldAlert, ShieldCheck, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useManageContext } from '../../../Context/creator/ManageContext'
import { createClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'
import { toast } from 'sonner'

// ─── Auth Session Chip ──────────────────────────────────────────────────────────
/**
 * Komponen indikator sesi auth yang di-render di dalam header Manage Page.
 * Memantau supabase.auth.onAuthStateChange secara real-time dan memberikan:
 * - Indikator hijau: sesi aktif dan valid
 * - Indikator merah: sesi expired / tidak terdeteksi
 * - Tombol Refresh Sesi: memperbarui token tanpa reload halaman
 */
function AuthSessionChip() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Ambil sesi awal
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
    })

    // Monitor perubahan auth secara real-time
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleRefreshSession = async () => {
    if (refreshing) return
    setRefreshing(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.refreshSession()
      if (error || !data.session) {
        toast.error('Sesi gagal diperbarui. Silakan login ulang.', {
          action: {
            label: 'Login',
            onClick: () => router.push('/sign-in'),
          },
        })
      } else {
        setSession(data.session)
        setUser(data.session.user)
        toast.success('✅ Sesi berhasil diperbarui')
      }
    } catch {
      toast.error('Gagal terhubung ke server autentikasi.')
    } finally {
      setRefreshing(false)
    }
  }

  const isSessionValid = !!session && !!user
  const sessionExpiresAt = session?.expires_at
  const isAboutToExpire = sessionExpiresAt
    ? (sessionExpiresAt * 1000 - Date.now()) < 5 * 60 * 1000 // < 5 menit
    : false

  const role = user?.app_metadata?.role || user?.user_metadata?.role || 'user'
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Pengguna'
  const avatarInitial = displayName.charAt(0).toUpperCase()

  if (!isSessionValid) {
    return (
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-bold uppercase tracking-wider"
          title="Sesi tidak terdeteksi. Halaman ini mungkin membutuhkan login ulang."
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Sesi Expired</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/sign-in')}
          className="border-destructive/20 text-destructive hover:bg-destructive/5 rounded-full px-3 text-[10px] font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <LogIn className="w-3 h-3" />
          Login Ulang
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      {/* Status Badge */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
          isAboutToExpire
            ? 'bg-accent-mustard/10 border-accent-mustard/20 text-accent-mustard'
            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
        }`}
        title={
          isAboutToExpire
            ? 'Sesi hampir berakhir. Klik refresh untuk memperbarui.'
            : `Sesi aktif sebagai ${role}. Email: ${user.email}`
        }
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>{isAboutToExpire ? 'Sesi Hampir Habis' : role}</span>
      </div>

      {/* Avatar chip */}
      <div
        className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-bg-surface-accent border border-border/15 cursor-default"
        title={`Login sebagai: ${user.email}`}
      >
        <div className="w-5 h-5 rounded-full bg-accent-coral text-white flex items-center justify-center text-[9px] font-black shrink-0">
          {avatarInitial}
        </div>
        <span className="text-[10px] font-semibold text-text-secondary max-w-[80px] truncate">
          {displayName}
        </span>
      </div>

      {/* Refresh Session Button */}
      <Button
        variant="ghost"
        size="sm"
        disabled={refreshing}
        onClick={handleRefreshSession}
        className="w-7 h-7 p-0 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-surface-accent cursor-pointer disabled:opacity-50"
        title="Perbarui Sesi Auth (jika Unauthorized)"
      >
        <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin text-accent-coral' : ''}`} />
      </Button>
    </div>
  )
}

// ─── ManageHeader ───────────────────────────────────────────────────────────────
interface ManageHeaderProps {
  onToggleInspector?: () => void
  isInspectorOpen?: boolean
}

export function ManageHeader({ onToggleInspector, isInspectorOpen }: ManageHeaderProps) {
  const router = useRouter()
  const {
    course,
    publishing,
    handleTogglePublish,
    syncingKnowledge,
    knowledgeStatus,
    handleSyncKnowledge,
  } = useManageContext()

  if (!course) return null

  const isPublished = course.status === 'PUBLISHED'

  return (
    <header className="bg-card border-b border-border/10 px-6 py-4 flex items-center gap-4 shrink-0 paper-texture select-none">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/creator/courses')}
        className="text-text-secondary hover:text-text-primary hover:bg-bg-surface-accent -ml-2 rounded-full px-3 cursor-pointer"
        data-testid="back-to-courses-btn"
      >
        <ArrowLeft className="h-4 w-4 mr-1.5" />
        Kembali ke Pustaka
      </Button>

      <div className="h-5 w-px bg-border/10" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-bold text-accent-coral uppercase tracking-widest">
            {course.category || 'Materi'}
          </span>
          <h1 className="text-sm font-bold text-text-primary truncate">{course.title}</h1>
          <Badge
            variant="outline"
            className={
              isPublished
                ? 'bg-success/5 text-success border-success/10 text-[10px] font-bold uppercase tracking-wider'
                : 'bg-accent-mustard/15 text-accent-mustard border-accent-mustard/10 text-[10px] font-bold uppercase tracking-wider'
            }
          >
            {course.status}
          </Badge>

          {/* AI Knowledge Base Sync Indicator Badge */}
          {knowledgeStatus && (
            <Badge
              variant="outline"
              className={
                knowledgeStatus.is_synced
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5'
                  : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5'
              }
              title={`AI Vector Store Knowledge: ${knowledgeStatus.total_chunks} chunk tersimpan`}
            >
              <Brain className="w-3 h-3" />
              <span>{knowledgeStatus.is_synced ? `${knowledgeStatus.total_chunks} Chunks AI` : 'AI Inactive'}</span>
            </Badge>
          )}
        </div>
      </div>

      {/* ─── Auth Session Live Indicator ─────────────────────────────────── */}
      <AuthSessionChip />

      <div className="h-5 w-px bg-border/10" />

      {/* One-Click Bulk Sync AI Knowledge Base */}
      <Button
        variant="outline"
        size="sm"
        disabled={syncingKnowledge}
        onClick={handleSyncKnowledge}
        data-testid="sync-ai-knowledge-btn"
        className="border-border/20 text-text-secondary hover:text-text-primary hover:bg-bg-surface-accent rounded-full px-3.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        title="Sinkronkan seluruh materi pelajaran ke AI Vector Store"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${syncingKnowledge ? 'animate-spin text-amber-500' : ''}`} />
        <span>{syncingKnowledge ? 'Menyinkronkan...' : 'Sync AI'}</span>
      </Button>

      {onToggleInspector && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleInspector}
          className={`text-text-secondary hover:text-text-primary hover:bg-bg-surface-accent rounded-full w-9 h-9 p-0 flex items-center justify-center cursor-pointer ${
            isInspectorOpen ? 'bg-bg-surface-accent text-accent-coral border border-accent-coral/20' : ''
          }`}
          title="Tampilkan Inspector"
        >
          <Sparkles className="w-4 h-4" />
        </Button>
      )}

      <Button
        size="sm"
        disabled={publishing}
        onClick={handleTogglePublish}
        data-testid="publish-toggle-btn"
        className={
          isPublished
            ? 'border-accent-mustard/20 text-accent-mustard bg-accent-mustard/5 hover:bg-accent-mustard/10 border cursor-pointer rounded-full px-4 text-xs font-bold'
            : 'bg-accent-coral hover:bg-accent-coral/95 text-white cursor-pointer rounded-full px-4 text-xs font-bold shadow-glow'
        }
      >
        {publishing ? (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent mr-2" />
        ) : isPublished ? (
          <EyeOff className="h-3.5 w-3.5 mr-1.5" />
        ) : (
          <Globe className="h-3.5 w-3.5 mr-1.5" />
        )}
        {publishing ? 'Menyimpan...' : isPublished ? 'Unpublish' : 'Publish'}
      </Button>
    </header>
  )
}

