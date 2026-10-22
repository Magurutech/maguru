import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

const PRIMARY_BUCKET = 'avatars'
const FALLBACK_BUCKET = 'course-materials'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

/**
 * POST /api/creator/profile/avatar
 *
 * Uploads creator avatar image to Supabase Storage.
 * Accepts FormData with 'file' field.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verify authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Sesi tidak valid. Silakan login kembali.' },
        { status: 401 }
      )
    }

    // 2. Parse FormData
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Berkas gambar avatar wajib diunggah' }, { status: 400 })
    }

    // 3. Validate file size and type
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Ukuran berkas maksimal 5MB' }, { status: 400 })
    }

    const allowedTypes = ['image/webp', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format berkas tidak didukung. Gunakan WebP, PNG, atau JPG.' },
        { status: 400 }
      )
    }

    // 4. Generate unique file name
    const timestamp = Date.now()
    const fileName = `avatars/${user.id}-${timestamp}.webp`
    const buffer = await file.arrayBuffer()

    // 5. Determine bucket and ensure availability
    let targetBucket = PRIMARY_BUCKET
    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets()
      const avatarBucketExists = buckets?.some((b) => b.name === PRIMARY_BUCKET)

      if (!avatarBucketExists) {
        const { error: createError } = await supabaseAdmin.storage.createBucket(PRIMARY_BUCKET, {
          public: true,
          fileSizeLimit: MAX_FILE_SIZE,
          allowedMimeTypes: allowedTypes,
        })
        if (createError) {
          targetBucket = FALLBACK_BUCKET
        }
      }
    } catch {
      targetBucket = FALLBACK_BUCKET
    }

    // 6. Upload to Supabase Storage
    let { data, error } = await supabaseAdmin.storage.from(targetBucket).upload(fileName, buffer, {
      contentType: file.type || 'image/webp',
      upsert: true,
      cacheControl: '3600',
    })

    // If primary bucket failed, attempt fallback bucket
    if (error && targetBucket !== FALLBACK_BUCKET) {
      targetBucket = FALLBACK_BUCKET
      const fallbackResult = await supabaseAdmin.storage.from(targetBucket).upload(fileName, buffer, {
        contentType: file.type || 'image/webp',
        upsert: true,
        cacheControl: '3600',
      })
      data = fallbackResult.data
      error = fallbackResult.error
    }

    if (error || !data) {
      console.error('Supabase avatar upload error:', error)
      return NextResponse.json(
        { error: `Gagal menyimpan ke storage: ${error?.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    // 7. Get public URL
    const { data: urlData } = supabaseAdmin.storage.from(targetBucket).getPublicUrl(fileName)

    return NextResponse.json(
      {
        url: urlData.publicUrl,
        fileName,
        size: file.size,
        bucket: targetBucket,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error handling avatar upload:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gagal mengunggah foto avatar' },
      { status: 500 }
    )
  }
}
