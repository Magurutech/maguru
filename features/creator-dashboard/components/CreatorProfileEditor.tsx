'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  User,
  Crown,
  Award,
  Sparkles,
  Star,
  Users,
  BookOpen,
  Camera,
  Linkedin,
  Youtube,
  Github,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  Eye,
  Edit3,
  RotateCcw,
  Save,
  Scroll,
  ExternalLink,
  Upload,
  Link2,
  Copy,
  Check,
  FileText,
} from 'lucide-react'
import { SkeuButton } from '@/components/shadcn-studio/button/skeu-button'
import { compressAndConvertToWebp } from '@/lib/image-compress'
import { createClient as createBrowserSupabaseClient } from '@/lib/supabase/client'

interface CreatorStats {
  rating: number
  studentsCount: number
  coursesCount: number
}

interface CreatorProfile {
  name: string
  title: string
  bio: string
  experience: string
  avatarUrl: string
  socialLinks: {
    linkedin: string
    youtube: string
    github: string
  }
  stats?: CreatorStats
}

const DRAFT_STORAGE_KEY = 'maguru_creator_profile_draft'

interface ProfileDraft {
  name: string
  title: string
  bio: string
  experience: string
  avatarUrl: string
  linkedin: string
  youtube: string
  github: string
  savedAt: number
}

export function CreatorProfileEditor() {
  const router = useRouter()
  const [profile, setProfile] = useState<CreatorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  // Form state
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [bio, setBio] = useState('')
  const [experience, setExperience] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [youtube, setYoutube] = useState('')
  const [github, setGithub] = useState('')

  // Draft & dirty states
  const [hasDraftRecovered, setHasDraftRecovered] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const isInitialLoadedRef = React.useRef(false)

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Avatar upload & WebP compression state
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [compressingAvatar, setCompressingAvatar] = useState(false)
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)

  // Check whether form values differ from saved server profile
  const isDirty = React.useMemo(() => {
    if (!profile) return false
    return (
      name !== (profile.name || '') ||
      title !== (profile.title || '') ||
      bio !== (profile.bio || '') ||
      experience !== (profile.experience || '') ||
      avatarUrl !== (profile.avatarUrl || '') ||
      linkedin !== (profile.socialLinks?.linkedin || '') ||
      youtube !== (profile.socialLinks?.youtube || '') ||
      github !== (profile.socialLinks?.github || '')
    )
  }, [profile, name, title, bio, experience, avatarUrl, linkedin, youtube, github])

  // Helper to obtain fresh Bearer token from Supabase browser client
  const getAuthHeaders = async (contentType?: string): Promise<Record<string, string>> => {
    const headers: Record<string, string> = {}
    if (contentType) {
      headers['Content-Type'] = contentType
    }
    if (typeof window !== 'undefined') {
      try {
        const supabase = createBrowserSupabaseClient()
        const { data } = await supabase.auth.getSession()
        if (data?.session?.access_token) {
          headers['Authorization'] = `Bearer ${data.session.access_token}`
        }
      } catch (err) {
        console.warn('[CreatorProfileEditor] Unable to read browser auth session:', err)
      }
    }
    return headers
  }

  const processAndUploadAvatar = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Berkas harus berupa gambar (PNG, JPG, atau WebP)')
      return
    }

    setCompressingAvatar(true)
    try {
      toast.loading('Mengompres foto ke format WebP...', { id: 'avatar-process' })

      const compressed = await compressAndConvertToWebp(file, {
        maxSize: 512,
        quality: 0.85,
        cropSquare: true,
      })

      // Immediate local preview so UI updates instantly
      setAvatarUrl(compressed.previewUrl)
      setCompressingAvatar(false)
      setUploadingAvatar(true)

      toast.loading('Menyimpan foto ke storage...', { id: 'avatar-process' })

      const formData = new FormData()
      formData.append('file', compressed.file)

      const authHeaders = await getAuthHeaders()
      const res = await fetch('/api/creator/profile/avatar', {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengunggah foto avatar')
      }

      setAvatarUrl(data.url)
      toast.success('Foto avatar berhasil diperbarui!', { id: 'avatar-process' })
    } catch (err: unknown) {
      console.error('Avatar upload failed:', err)
      toast.error(
        err instanceof Error ? err.message : 'Gagal mengunggah foto avatar',
        { id: 'avatar-process' }
      )
    } finally {
      setCompressingAvatar(false)
      setUploadingAvatar(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Load profile from server, check for uncommitted localStorage drafts
  useEffect(() => {
    async function loadProfile() {
      try {
        const authHeaders = await getAuthHeaders()
        const res = await fetch('/api/creator/profile', {
          headers: authHeaders,
        })
        if (!res.ok) throw new Error('Gagal memuat profil')
        const data = await res.json()
        setProfile(data)

        // Check for existing localStorage draft (e.g. from previous edit before refresh)
        let draftApplied = false
        if (typeof window !== 'undefined') {
          try {
            const rawDraft = localStorage.getItem(DRAFT_STORAGE_KEY)
            if (rawDraft) {
              const draft: Partial<ProfileDraft> = JSON.parse(rawDraft)
              const differs =
                (draft.name !== undefined && draft.name !== (data.name || '')) ||
                (draft.title !== undefined && draft.title !== (data.title || '')) ||
                (draft.bio !== undefined && draft.bio !== (data.bio || '')) ||
                (draft.experience !== undefined && draft.experience !== (data.experience || '')) ||
                (draft.avatarUrl !== undefined && draft.avatarUrl !== (data.avatarUrl || '')) ||
                (draft.linkedin !== undefined && draft.linkedin !== (data.socialLinks?.linkedin || '')) ||
                (draft.youtube !== undefined && draft.youtube !== (data.socialLinks?.youtube || '')) ||
                (draft.github !== undefined && draft.github !== (data.socialLinks?.github || ''))

              if (differs) {
                setName(draft.name ?? data.name ?? '')
                setTitle(draft.title ?? data.title ?? '')
                setBio(draft.bio ?? data.bio ?? '')
                setExperience(draft.experience ?? data.experience ?? '')
                setAvatarUrl(draft.avatarUrl ?? data.avatarUrl ?? '')
                setLinkedin(draft.linkedin ?? data.socialLinks?.linkedin ?? '')
                setYoutube(draft.youtube ?? data.socialLinks?.youtube ?? '')
                setGithub(draft.github ?? data.socialLinks?.github ?? '')
                setHasDraftRecovered(true)
                draftApplied = true
                toast.info('Draf belum tersimpan berhasil dipulihkan dari peramban!')
              }
            }
          } catch (storageErr) {
            console.warn('Gagal membaca draf dari peramban:', storageErr)
          }
        }

        if (!draftApplied) {
          // Populate fields directly from server data
          setName(data.name || '')
          setTitle(data.title || '')
          setBio(data.bio || '')
          setExperience(data.experience || '')
          setAvatarUrl(data.avatarUrl || '')
          setLinkedin(data.socialLinks?.linkedin || '')
          setYoutube(data.socialLinks?.youtube || '')
          setGithub(data.socialLinks?.github || '')
        }
      } catch (err) {
        toast.error('Gagal mengambil data profil')
        console.error(err)
      } finally {
        setLoading(false)
        setTimeout(() => {
          isInitialLoadedRef.current = true
        }, 100)
      }
    }
    loadProfile()
  }, [])

  // Auto-save form draft to localStorage whenever fields change
  useEffect(() => {
    if (!isInitialLoadedRef.current || typeof window === 'undefined') return

    if (isDirty) {
      const draft: ProfileDraft = {
        name,
        title,
        bio,
        experience,
        avatarUrl,
        linkedin,
        youtube,
        github,
        savedAt: Date.now(),
      }
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
      } catch (e) {
        console.warn('Gagal menyimpan draf ke localStorage:', e)
      }
    } else {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY)
      } catch {
        // ignore
      }
    }
  }, [isDirty, name, title, bio, experience, avatarUrl, linkedin, youtube, github])

  // Discard draft and revert to server data
  const handleDiscardDraft = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY)
      } catch {
        // ignore
      }
    }
    setHasDraftRecovered(false)
    if (profile) {
      setName(profile.name || '')
      setTitle(profile.title || '')
      setBio(profile.bio || '')
      setExperience(profile.experience || '')
      setAvatarUrl(profile.avatarUrl || '')
      setLinkedin(profile.socialLinks?.linkedin || '')
      setYoutube(profile.socialLinks?.youtube || '')
      setGithub(profile.socialLinks?.github || '')
    }
    setErrors({})
    toast.success('Draf lokal dibuang, kembali ke data server')
  }

  const handleCancel = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY)
      } catch {
        // ignore
      }
    }
    setHasDraftRecovered(false)
    if (!profile) return
    setName(profile.name || '')
    setTitle(profile.title || '')
    setBio(profile.bio || '')
    setExperience(profile.experience || '')
    setAvatarUrl(profile.avatarUrl || '')
    setLinkedin(profile.socialLinks?.linkedin || '')
    setYoutube(profile.socialLinks?.youtube || '')
    setGithub(profile.socialLinks?.github || '')
    setErrors({})
    toast.info('Formulir dikembalikan ke data semula')
  }

  const handleCopyProfileLink = async () => {
    if (typeof window === 'undefined') return
    try {
      const url = window.location.href
      await navigator.clipboard.writeText(url)
      setCopiedLink(true)
      toast.success('Tautan pratinjau profil berhasil disalin ke papan klip!')
      setTimeout(() => setCopiedLink(false), 2000)
    } catch {
      toast.error('Gagal menyalin tautan profil')
    }
  }

  const validateUrl = (url: string): boolean => {
    if (!url.trim()) return true
    try {
      if (!URL.canParse(url)) return false
      const parsed = new URL(url)
      return ['http:', 'https:'].includes(parsed.protocol)
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const nextErrors: Record<string, string> = {}

    // Validate name (min 2 chars)
    if (name.trim().length < 2) {
      nextErrors.name = 'Nama minimal 2 karakter'
    }

    // Validate social links
    if (!validateUrl(linkedin)) {
      nextErrors.linkedin = 'URL LinkedIn tidak valid'
    }
    if (!validateUrl(youtube)) {
      nextErrors.youtube = 'URL YouTube tidak valid'
    }
    if (!validateUrl(github)) {
      nextErrors.github = 'URL GitHub tidak valid'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setSaving(true)
    try {
      const payload = {
        name,
        title,
        bio,
        experience,
        avatarUrl,
        socialLinks: {
          linkedin,
          youtube,
          github,
        },
      }

      const authHeaders = await getAuthHeaders('application/json')
      const res = await fetch('/api/creator/profile', {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan profil')
      }

      // Clear draft on successful save
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(DRAFT_STORAGE_KEY)
        } catch {
          // ignore
        }
      }
      setHasDraftRecovered(false)

      setProfile((prev) => (prev ? { ...prev, ...payload } : prev))
      toast.success('Profil berhasil disimpan ke seluruh sanctum')
    } catch (err: unknown) {
      console.error('[CreatorProfileEditor] Failed to save profile:', err)
      toast.error(err instanceof Error ? err.message : 'Gagal menyimpan profil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center p-12 min-h-95 bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-3xl"
        data-testid="loading-spinner"
      >
        <Loader2 className="w-9 h-9 text-[#E53935] animate-spin mb-3" />
        <p className="text-xs font-serif font-bold text-[#8C7D6E] tracking-wide">
          Membuka Gulungan Profil Mentor...
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3.5 sm:space-y-4 font-sans select-none">
      {/* ── 1. HEADER SECTION (Ancient Asian Fantasy Bento Header) ── */}
      <div className="relative overflow-hidden rounded-3xl border border-[#D8C4A7]/60 bg-[#FFFDF9] p-4 sm:p-5 shadow-[0_4px_20px_rgba(45,35,25,0.04)]">
        {/* Subtle Oriental Mountain Banner Background */}
        <div className="absolute right-0 top-0 bottom-0 w-2/5 pointer-events-none select-none overflow-hidden opacity-20 hidden md:block">
          <Image
            src="/assets/course-catalog-banner.webp"
            alt="Oriental Mountain Banner"
            fill
            sizes="40vw"
            priority
            className="object-cover object-right mask-[linear-gradient(to_left,black_20%,transparent_100%)]"
          />
        </div>

        <div className="relative z-1 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          {/* Left: Breadcrumbs + Title + Seal + Verification Badge */}
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => router.push('/creator')}
              className="inline-flex items-center gap-1.5 text-xs text-[#8C7D6E] hover:text-[#2D2319] transition-colors cursor-pointer group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-sans font-medium">Studio</span>
              <span className="text-[#C5B49D]">/</span>
              <span className="text-[#2D2319] font-semibold">Profil Saya</span>
            </button>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              <h1 className="font-sans text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#2D2319] tracking-tight">
                Pengaturan Profil
              </h1>
              {/* Vermilion Mentor Badge */}
              <span className="inline-flex items-center px-2 py-0.5 rounded border border-[#E53935]/40 bg-[#E53935]/10 text-[#C62828] text-[10px] font-sans font-bold tracking-wider uppercase shadow-xs">
                MENTOR
              </span>
              {/* Verification Status Badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-emerald-500/30 bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Profil Terverifikasi
              </span>
            </div>

            <p className="text-xs text-[#8C7D6E] leading-relaxed max-w-xl">
              Pusat kendali reputasi petualang, gelar kehormatan, dan identitas perguruan Anda di Sanctum Maguru.
            </p>
          </div>

          {/* Right: Segmented Mode Selector (Edit Formulir vs Pratinjau Publik) */}
          <div className="flex items-center gap-1 bg-[#FAF5ED] p-1 rounded-2xl border border-[#D8C4A7]/60 self-start md:self-auto shrink-0 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'edit'
                  ? 'bg-[#FFFDF9] text-[#2D2319] shadow-sm border border-[#D8C4A7]/50'
                  : 'text-[#8C7D6E] hover:text-[#2D2319]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-[#E53935]" />
              <span>Edit Formulir</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-[#FFFDF9] text-[#2D2319] shadow-sm border border-[#D8C4A7]/50'
                  : 'text-[#8C7D6E] hover:text-[#2D2319]'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Pratinjau Publik</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. CONDITIONAL VIEW: EDIT FORM OR PUBLIC PREVIEW ── */}
      {activeTab === 'preview' ? (
        /* ── 2A. PRATINJAU PUBLIK (Live Student-Facing Preview) ── */
        <div className="space-y-3.5 sm:space-y-4">
          {/* Public Profile Hero Card */}
          <div className="relative overflow-hidden rounded-3xl border border-[#D8C4A7]/60 bg-[#FAF5ED] p-5 sm:p-7 shadow-[0_4px_24px_rgba(45,35,25,0.06)]">
            <div className="absolute inset-0 z-0">
              <Image
                src="/assets/course-catalog-banner.webp"
                alt="Banner Landscape"
                fill
                sizes="100vw"
                className="object-cover object-right opacity-30 pointer-events-none select-none"
              />
              <div className="absolute inset-0 bg-linear-to-r from-[#FAF5ED] via-[#FAF5ED]/95 to-transparent/30" />
            </div>

            <div className="relative z-1 flex flex-col md:flex-row items-center md:items-start gap-5 sm:gap-6">
              {/* Ornate Dragon Gold Avatar */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 border-2 border-[#D4AF37] ring-4 ring-[#E6CA65]/25 shadow-[0_4px_20px_rgba(212,175,55,0.25)] bg-[#FFFDF9] overflow-hidden flex items-center justify-center">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name || 'Avatar'}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-14 h-14 text-[#B8860B]/60" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 px-2.5 py-0.5 rounded-full bg-linear-to-r from-[#D4AF37] to-[#B8860B] text-white text-[10px] font-bold shadow-md border-2 border-[#FFFDF9] flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-100" />
                  <span>Master</span>
                </div>
              </div>

              {/* Bio & Information */}
              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2D2319] tracking-tight">
                    {name || 'Nama Belum Diisi'}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E53935]/10 text-[#C62828] border border-[#E53935]/30 text-[10px] font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3" />
                    Terverifikasi
                  </span>
                </div>

                <p className="text-sm font-semibold text-[#8C7D6E]">
                  {title || 'Gelar Kehormatan Belum Ditentukan'}
                </p>

                <p className="text-xs text-[#5D5043] leading-relaxed max-w-2xl pt-1">
                  {bio || 'Bio singkat perguruan belum diisi oleh mentor.'}
                </p>

                {/* Social Links Row */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
                  {linkedin && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFFDF9] border border-[#D8C4A7]/60 text-xs font-semibold text-[#0077B5] hover:bg-white transition-all shadow-xs"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>LinkedIn</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  )}
                  {youtube && (
                    <a
                      href={youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFFDF9] border border-[#D8C4A7]/60 text-xs font-semibold text-[#FF0000] hover:bg-white transition-all shadow-xs"
                    >
                      <Youtube className="w-3.5 h-3.5" />
                      <span>YouTube</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  )}
                  {github && (
                    <a
                      href={github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FFFDF9] border border-[#D8C4A7]/60 text-xs font-semibold text-[#24292e] hover:bg-white transition-all shadow-xs"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Public Preview Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4">
            {/* Experience / Rekam Jejak Card */}
            <div className="md:col-span-8 bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-3xl p-5 shadow-[0_4px_20px_rgba(45,35,25,0.03)] space-y-3 relative before:absolute before:top-2 before:left-2 before:w-2 before:h-2 before:border-t-2 before:border-l-2 before:border-[#D4AF37]/50 after:absolute after:bottom-2 after:right-2 after:w-2 after:h-2 after:border-b-2 after:border-r-2 after:border-[#D4AF37]/50">
              <div className="flex items-center justify-between border-b border-[#D8C4A7]/40 pb-2.5">
                <div className="flex items-center gap-2">
                  <Scroll className="w-4 h-4 text-[#E53935]" />
                  <h3 className="text-xs font-bold text-[#2D2319] uppercase tracking-wider">
                    Rekam Jejak & Pengalaman Perguruan
                  </h3>
                </div>
                <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded border border-[#E53935]/30 bg-[#E53935]/5 text-[#C62828] uppercase tracking-wider">
                  RIWAYAT
                </span>
              </div>

              <div className="text-xs text-[#5D5043] leading-relaxed whitespace-pre-wrap font-sans p-3 rounded-2xl bg-[#FAF5ED]/60 border border-[#D8C4A7]/30">
                {experience || 'Belum ada catatan pengalaman atau riwayat petualangan yang ditambahkan.'}
              </div>
            </div>

            {/* Public Stats Capsule */}
            <div className="md:col-span-4 bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-3xl p-5 shadow-[0_4px_20px_rgba(45,35,25,0.03)] space-y-3 relative before:absolute before:top-2 before:left-2 before:w-2 before:h-2 before:border-t-2 before:border-l-2 before:border-[#D4AF37]/50 after:absolute after:bottom-2 after:right-2 after:w-2 after:h-2 after:border-b-2 after:border-r-2 after:border-[#D4AF37]/50">
              <div className="flex items-center gap-2 border-b border-[#D8C4A7]/40 pb-2.5">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-xs font-bold text-[#2D2319] uppercase tracking-wider">
                  Kredensial Mengajar
                </h3>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF5ED]/80 border border-[#D8C4A7]/40">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    <span className="text-xs font-medium text-[#5D5043]">Rating Rata-rata</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#2D2319]">
                    {profile?.stats?.rating !== undefined ? profile.stats.rating : '-'} ★
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF5ED]/80 border border-[#D8C4A7]/40">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-[#5D5043]">Total Pelajar</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#2D2319]">
                    {profile?.stats?.studentsCount !== undefined ? profile.stats.studentsCount : '0'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF5ED]/80 border border-[#D8C4A7]/40">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-[#5D5043]">Gulungan Kursus</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#2D2319]">
                    {profile?.stats?.coursesCount !== undefined ? profile.stats.coursesCount : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Return Bar & Share */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <SkeuButton
              type="button"
              variant="secondary"
              onClick={handleCopyProfileLink}
              className="cursor-pointer text-xs"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 mr-1 text-[#8C7D6E]" />
              )}
              <span>{copiedLink ? 'Tautan Profil Tersalin!' : 'Salin Tautan Profil'}</span>
            </SkeuButton>

            <SkeuButton
              type="button"
              variant="secondary"
              onClick={() => setActiveTab('edit')}
              className="cursor-pointer text-xs"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1 text-[#E53935]" />
              <span>Kembali ke Mode Edit Formulir</span>
            </SkeuButton>
          </div>
        </div>
      ) : (
        /* ── 2B. EDIT FORMULIR BENTO LAYOUT (2 Columns: Left 4/12, Right 8/12) ── */
        <div className="space-y-3.5 sm:space-y-4">
          {/* Unsaved Local Storage Draft Recovery Alert Banner */}
          {hasDraftRecovered && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-amber-500/10 border border-amber-500/30 rounded-3xl text-xs text-amber-900 shadow-xs animate-in fade-in-50">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <span className="font-bold">Draf Lokal Berhasil Dipulihkan:</span>
                  <span className="text-amber-800 ml-1">
                    Perubahan profil sebelum halaman di-refresh tersimpan aman di peramban Anda.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={handleDiscardDraft}
                  className="px-3 py-1.5 rounded-xl bg-[#FFFDF9] border border-[#D8C4A7] text-[11px] font-bold text-[#8C7D6E] hover:text-[#C62828] hover:border-[#E53935]/40 transition-colors cursor-pointer"
                >
                  Buang Draf & Gunakan Data Server
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-start">
            {/* ═══════════════════════════════════════════════════════════
                LEFT COLUMN: AVATAR STUDIO & GUILD CULTIVATION XP CARDS
               ═══════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-4 space-y-3.5 sm:space-y-4">
              {/* Card A: Avatar Studio Card */}
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDraggingAvatar(true)
                }}
                onDragLeave={() => setIsDraggingAvatar(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDraggingAvatar(false)
                  const droppedFile = e.dataTransfer.files?.[0]
                  if (droppedFile) processAndUploadAvatar(droppedFile)
                }}
                className={`relative overflow-hidden bg-[#FFFDF9] border rounded-3xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(45,35,25,0.04)] space-y-3 text-center transition-all before:absolute before:top-2 before:left-2 before:w-2 before:h-2 before:border-t-2 before:border-l-2 before:border-[#D4AF37]/50 after:absolute after:bottom-2 after:right-2 after:w-2 after:h-2 after:border-b-2 after:border-r-2 after:border-[#D4AF37]/50 ${
                  isDraggingAvatar
                    ? 'border-[#E53935] ring-2 ring-[#E53935]/20 bg-[#FAF5ED]'
                    : 'border-[#D8C4A7]/60'
                }`}
              >
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) processAndUploadAvatar(file)
                  }}
                />

                <div className="flex items-center gap-1.5 border-b border-[#D8C4A7]/40 pb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#B96500]" />
                  <span className="text-[10px] font-bold text-[#8C7D6E] uppercase tracking-wider">
                    Avatar Mentor
                  </span>
                </div>

                {/* Interactive Ornate Dragon Gold Ring Avatar */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto my-2 cursor-pointer group"
                  title="Klik untuk memilih foto dari perangkat Anda"
                >
                  <div className="w-full h-full rounded-full p-1 border-2 border-[#D4AF37] ring-4 ring-[#E6CA65]/25 shadow-[0_4px_16px_rgba(212,175,55,0.2)] bg-[#FAF5ED] overflow-hidden flex items-center justify-center relative transition-transform group-hover:scale-102">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={name || 'Avatar Preview'}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-14 h-14 text-[#B8860B]/60" />
                    )}

                    {/* Hover or Loading Overlay */}
                    <div
                      className={`absolute inset-0 bg-[#2D2319]/60 backdrop-blur-[1px] rounded-full flex flex-col items-center justify-center text-white transition-opacity ${
                        uploadingAvatar || compressingAvatar
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {uploadingAvatar || compressingAvatar ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin text-[#FFB148] mb-1" />
                          <span className="text-[9px] font-bold text-amber-100">
                            {compressingAvatar ? 'Kompresi...' : 'Mengunggah...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-6 h-6 text-white mb-0.5 group-hover:scale-110 transition-transform" />
                          <span className="text-[9px] font-bold uppercase tracking-wider">
                            Ubah Foto
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Floating Level Badge */}
                  <div className="absolute -bottom-1 right-1 px-2.5 py-0.5 rounded-full bg-linear-to-r from-[#D4AF37] to-[#B8860B] text-white text-[10px] font-bold shadow-md border border-[#FFFDF9] flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-100" />
                    <span>Lv. 8 Master</span>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-sm font-bold text-[#2D2319]">
                    {name || 'Potret Resmi Perguruan'}
                  </h3>
                </div>

                {/* Upload CTA Button & URL Fallback */}
                <div className="pt-2 border-t border-[#D8C4A7]/30 space-y-2">
                  <SkeuButton
                    type="button"
                    variant="secondary"
                    disabled={uploadingAvatar || compressingAvatar || saving}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full text-xs cursor-pointer"
                  >
                    {uploadingAvatar || compressingAvatar ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1 text-[#E53935]" />
                    ) : (
                      <Upload className="w-3.5 h-3.5 mr-1 text-[#E53935]" />
                    )}
                    <span>
                      {compressingAvatar
                        ? 'Mengompres ke WebP...'
                        : uploadingAvatar
                        ? 'Menyimpan Foto...'
                        : 'Pilih & Unggah Foto Avatar'}
                    </span>
                  </SkeuButton>

                  {/* Secondary toggle to view / paste manual URL if needed */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="text-[10px] font-medium text-[#8C7D6E] hover:text-[#2D2319] transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <Link2 className="w-3 h-3" />
                      <span>{showUrlInput ? 'Sembunyikan Tautan URL' : 'Tautkan via URL'}</span>
                    </button>
                  </div>

                  {showUrlInput && (
                    <div className="pt-1 text-left animate-in fade-in-50 duration-200">
                      <label
                        htmlFor="avatarUrl"
                        className="text-[10px] font-bold text-[#8C7D6E] uppercase tracking-wider block mb-1"
                      >
                        Avatar URL
                      </label>
                      <div className="relative flex items-center">
                        <Camera className="w-3.5 h-3.5 text-[#8C7D6E] absolute left-3 pointer-events-none" />
                        <input
                          type="text"
                          id="avatarUrl"
                          placeholder="https://..."
                          maxLength={255}
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          disabled={saving}
                          className="w-full text-xs text-[#2D2319] bg-[#FAF5ED] border border-[#D8C4A7]/60 pl-8 pr-3 py-2 rounded-xl focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]/30 focus:outline-none transition-all placeholder:text-[#A89887]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card B: Guild Cultivation XP & Live Stats Bento */}
              <div className="relative overflow-hidden bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-3xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(45,35,25,0.04)] space-y-3.5 before:absolute before:top-2 before:left-2 before:w-2 before:h-2 before:border-t-2 before:border-l-2 before:border-[#D4AF37]/50 after:absolute after:bottom-2 after:right-2 after:w-2 after:h-2 after:border-b-2 after:border-r-2 after:border-[#D4AF37]/50">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#D8C4A7]/40 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#E53935]" />
                    <h3 className="text-xs font-bold text-[#2D2319] uppercase tracking-wider">
                      Kultivasi Mentor
                    </h3>
                  </div>
                  {/* Vermilion Badge */}
                  <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded border border-[#E53935]/40 bg-[#E53935]/10 text-[#C62828] uppercase tracking-wider">
                    PROGRES
                  </span>
                </div>

                {/* Level & XP Progress Track */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-[#FAF5ED] border border-[#D8C4A7]/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#5D5043]">
                      Tingkat: <span className="text-[#2D2319] font-bold">Master Naga Langit</span>
                    </span>
                    <span className="text-[11px] font-bold text-[#B96500]">Tingkat 8</span>
                  </div>
                  {/* Golden XP Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-[#E5DCBE] overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-[#D4AF37] via-[#FFB148] to-[#E53935] rounded-full transition-all duration-500"
                      style={{ width: '71%' }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#8C7D6E]">
                    <span>142,000 XP</span>
                    <span className="font-medium">Menuju Lv. 9 (200k XP)</span>
                  </div>
                </div>

                {/* 3-Item Stats Micro Grid (Exact values for test & UI) */}
                <div className="grid grid-cols-1 gap-2 pt-0.5">
                  {/* Rating */}
                  <div className="p-3 bg-[#FAF5ED]/80 border border-[#D8C4A7]/40 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-[#8C7D6E] uppercase tracking-wider block">
                          Rating Kelas
                        </span>
                        <span className="text-sm font-extrabold text-[#2D2319] leading-none block mt-0.5">
                          {profile?.stats?.rating !== undefined ? profile.stats.rating : '-'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-serif font-black px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300">
                      4.9 ★
                    </span>
                  </div>

                  {/* Total Students */}
                  <div className="p-3 bg-[#FAF5ED]/80 border border-[#D8C4A7]/40 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-[#8C7D6E] uppercase tracking-wider block">
                          Total Pelajar
                        </span>
                        <span className="text-sm font-extrabold text-[#2D2319] leading-none block mt-0.5">
                          {profile?.stats?.studentsCount !== undefined
                            ? profile.stats.studentsCount
                            : '0'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-serif font-black px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      Aktif
                    </span>
                  </div>

                  {/* Course Count */}
                  <div className="p-3 bg-[#FAF5ED]/80 border border-[#D8C4A7]/40 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-[#8C7D6E] uppercase tracking-wider block">
                          Jumlah Kelas
                        </span>
                        <span className="text-sm font-extrabold text-[#2D2319] leading-none block mt-0.5">
                          {profile?.stats?.coursesCount !== undefined
                            ? profile.stats.coursesCount
                            : '0'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-serif font-black px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Gulungan
                    </span>
                  </div>
                </div>

                {/* Status footer pill */}
                <div className="pt-2 border-t border-[#D8C4A7]/30 text-center">
                  <span className="text-[11px] font-medium text-[#5D5043] inline-flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Status: Aktif Mengajar di Sanctum Maguru
                  </span>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                RIGHT COLUMN: 3-STAGE NUMBERED FORM CARDS
               ═══════════════════════════════════════════════════════════ */}
            <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-3.5 sm:space-y-4">
              {/* ── STAGE 1: IDENTITAS UTAMA ── */}
              <div className="relative overflow-hidden bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-3xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(45,35,25,0.03)] space-y-3.5 before:absolute before:top-2 before:left-2 before:w-2 before:h-2 before:border-t-2 before:border-l-2 before:border-[#D4AF37]/50 after:absolute after:bottom-2 after:right-2 after:w-2 after:h-2 after:border-b-2 after:border-r-2 after:border-[#D4AF37]/50">
                <div className="flex items-center justify-between border-b border-[#D8C4A7]/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#E53935]/10 text-[#C62828] text-xs font-black flex items-center justify-center font-serif">
                      01
                    </div>
                    <h2 className="text-xs font-bold text-[#2D2319] uppercase tracking-wider">
                      Identitas Utama
                    </h2>
                  </div>
                  <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded border border-[#E53935]/30 bg-[#E53935]/5 text-[#C62828] uppercase tracking-wider">
                    TAHAP 01
                  </span>
                </div>

                <p className="text-[11px] text-[#8C7D6E]">
                  Nama resmi dan gelar kehormatan yang terpatri pada gulungan sertifikat para murid.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="text-[10px] font-bold text-[#8C7D6E] uppercase tracking-wider block"
                    >
                      Nama Lengkap
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-[#8C7D6E] absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        id="name"
                        maxLength={100}
                        placeholder="Contoh: Ryu Takahashi"
                        className="w-full text-xs text-[#2D2319] bg-[#FAF5ED] border border-[#D8C4A7]/60 pl-9 pr-3 py-2.5 rounded-2xl focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]/30 focus:outline-none transition-all placeholder:text-[#A89887]"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={saving}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-[11px] text-[#E53935] font-medium pt-0.5">{errors.name}</p>
                    )}
                  </div>

                  {/* Title / Honorific */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="title"
                      className="text-[10px] font-bold text-[#8C7D6E] uppercase tracking-wider block"
                    >
                      Gelar
                    </label>
                    <div className="relative flex items-center">
                      <Award className="w-4 h-4 text-[#8C7D6E] absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        id="title"
                        maxLength={100}
                        placeholder="Contoh: Grandmaster Cloud Architecture & AI"
                        className="w-full text-xs text-[#2D2319] bg-[#FAF5ED] border border-[#D8C4A7]/60 pl-9 pr-3 py-2.5 rounded-2xl focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]/30 focus:outline-none transition-all placeholder:text-[#A89887]"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ── STAGE 2: GULUNGAN RIWAYAT ── */}
              <div className="relative overflow-hidden bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-3xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(45,35,25,0.03)] space-y-3.5 before:absolute before:top-2 before:left-2 before:w-2 before:h-2 before:border-t-2 before:border-l-2 before:border-[#D4AF37]/50 after:absolute after:bottom-2 after:right-2 after:w-2 after:h-2 after:border-b-2 after:border-r-2 after:border-[#D4AF37]/50">
                <div className="flex items-center justify-between border-b border-[#D8C4A7]/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#E53935]/10 text-[#C62828] text-xs font-black flex items-center justify-center font-serif">
                      02
                    </div>
                    <h2 className="text-xs font-bold text-[#2D2319] uppercase tracking-wider">
                      Gulungan Riwayat
                    </h2>
                  </div>
                  <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded border border-[#E53935]/30 bg-[#E53935]/5 text-[#C62828] uppercase tracking-wider">
                    TAHAP 02
                  </span>
                </div>

                <p className="text-[11px] text-[#8C7D6E]">
                  Kisah perjalanan, filosofi kebijaksanaan, dan rekam jejak petualangan perguruan Anda.
                </p>

                {/* Bio Singkat */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="bio"
                      className="text-[10px] font-bold text-[#8C7D6E] uppercase tracking-wider block"
                    >
                      Bio Singkat
                    </label>
                    <span className="text-[10px] font-mono text-[#8C7D6E]">
                      {bio.length} / 500 Karakter
                    </span>
                  </div>
                  <textarea
                    id="bio"
                    rows={3}
                    maxLength={500}
                    placeholder="Ceritakan filosofi mengajar dan ringkasan perkenalan Anda kepada calon murid..."
                    className="w-full text-xs text-[#2D2319] bg-[#FAF5ED] border border-[#D8C4A7]/60 p-3 rounded-2xl focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]/30 focus:outline-none transition-all resize-none placeholder:text-[#A89887] leading-relaxed"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    disabled={saving}
                  />
                </div>

                {/* Experience */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="experience"
                      className="text-[10px] font-bold text-[#8C7D6E] uppercase tracking-wider block"
                    >
                      Pengalaman
                    </label>
                    <span className="text-[10px] font-mono text-[#8C7D6E]">
                      {experience.length} / 1000 Karakter
                    </span>
                  </div>
                  <textarea
                    id="experience"
                    rows={4}
                    maxLength={1000}
                    placeholder="Detail perjalanan industri, sertifikasi guild, dan proyek petualangan terdahulu..."
                    className="w-full text-xs text-[#2D2319] bg-[#FAF5ED] border border-[#D8C4A7]/60 p-3 rounded-2xl focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]/30 focus:outline-none transition-all resize-none placeholder:text-[#A89887] leading-relaxed"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    disabled={saving}
                  />
                </div>
              </div>

              {/* ── STAGE 3: JEJARING PETUALANG ── */}
              <div className="relative overflow-hidden bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-3xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(45,35,25,0.03)] space-y-3.5 before:absolute before:top-2 before:left-2 before:w-2 before:h-2 before:border-t-2 before:border-l-2 before:border-[#D4AF37]/50 after:absolute after:bottom-2 after:right-2 after:w-2 after:h-2 after:border-b-2 after:border-r-2 after:border-[#D4AF37]/50">
                <div className="flex items-center justify-between border-b border-[#D8C4A7]/40 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#E53935]/10 text-[#C62828] text-xs font-black flex items-center justify-center font-serif">
                      03
                    </div>
                    <h2 className="text-xs font-bold text-[#2D2319] uppercase tracking-wider">
                      Jejaring Petualang
                    </h2>
                  </div>
                  <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded border border-[#E53935]/30 bg-[#E53935]/5 text-[#C62828] uppercase tracking-wider">
                    TAHAP 03
                  </span>
                </div>

                <p className="text-[11px] text-[#8C7D6E]">
                  Tautkan gerbang komunikasi digital agar murid dan rekan petualang dapat terhubung.
                </p>

                <div className="space-y-3">
                  {/* LinkedIn */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="linkedin"
                      className="text-[10px] font-bold text-[#8C7D6E] uppercase tracking-wider block"
                    >
                      LinkedIn
                    </label>
                    <div className="relative flex items-center">
                      <Linkedin className="w-4 h-4 text-[#0077B5] absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        id="linkedin"
                        maxLength={255}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full text-xs text-[#2D2319] bg-[#FAF5ED] border border-[#D8C4A7]/60 pl-9 pr-3 py-2.5 rounded-2xl focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]/30 focus:outline-none transition-all placeholder:text-[#A89887]"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        disabled={saving}
                      />
                    </div>
                    {errors.linkedin && (
                      <p className="text-[11px] text-[#E53935] font-medium pt-0.5">
                        {errors.linkedin}
                      </p>
                    )}
                  </div>

                  {/* YouTube */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="youtube"
                      className="text-[10px] font-bold text-[#8C7D6E] uppercase tracking-wider block"
                    >
                      YouTube
                    </label>
                    <div className="relative flex items-center">
                      <Youtube className="w-4 h-4 text-[#FF0000] absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        id="youtube"
                        maxLength={255}
                        placeholder="https://youtube.com/@channel"
                        className="w-full text-xs text-[#2D2319] bg-[#FAF5ED] border border-[#D8C4A7]/60 pl-9 pr-3 py-2.5 rounded-2xl focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]/30 focus:outline-none transition-all placeholder:text-[#A89887]"
                        value={youtube}
                        onChange={(e) => setYoutube(e.target.value)}
                        disabled={saving}
                      />
                    </div>
                    {errors.youtube && (
                      <p className="text-[11px] text-[#E53935] font-medium pt-0.5">
                        {errors.youtube}
                      </p>
                    )}
                  </div>

                  {/* GitHub */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="github"
                      className="text-[10px] font-bold text-[#8C7D6E] uppercase tracking-wider block"
                    >
                      GitHub
                    </label>
                    <div className="relative flex items-center">
                      <Github className="w-4 h-4 text-[#24292e] absolute left-3 pointer-events-none" />
                      <input
                        type="text"
                        id="github"
                        maxLength={255}
                        placeholder="https://github.com/username"
                        className="w-full text-xs text-[#2D2319] bg-[#FAF5ED] border border-[#D8C4A7]/60 pl-9 pr-3 py-2.5 rounded-2xl focus:border-[#E53935] focus:ring-1 focus:ring-[#E53935]/30 focus:outline-none transition-all placeholder:text-[#A89887]"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        disabled={saving}
                      />
                    </div>
                    {errors.github && (
                      <p className="text-[11px] text-[#E53935] font-medium pt-0.5">
                        {errors.github}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── FORM ACTIONS BAR ── */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-[#FFFDF9] border border-[#D8C4A7]/60 rounded-3xl shadow-xs">
                <div className="text-[11px] text-[#8C7D6E] flex flex-wrap items-center gap-2 text-center sm:text-left">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Perubahan akan langsung disinkronkan ke seluruh sanctum kursus.</span>
                  {isDirty && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/30 text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Draf peramban aktif
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <SkeuButton
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={saving}
                    className="cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1 text-[#8C7D6E]" />
                    <span>Batal</span>
                  </SkeuButton>

                  <SkeuButton
                    type="submit"
                    variant="primary"
                    disabled={saving}
                    className="cursor-pointer"
                  >
                    {saving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                    ) : (
                      <Save className="w-3.5 h-3.5 mr-1" />
                    )}
                    <span>Simpan Profil</span>
                  </SkeuButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
