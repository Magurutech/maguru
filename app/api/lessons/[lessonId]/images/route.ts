import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { generateLessonImageFileName, validateImageFile } from '@/lib/tiptap/image-upload'

const BUCKET = 'course-materials'

/**
 * POST /api/lessons/[lessonId]/images
 *
 * Upload gambar untuk lesson ke Supabase Storage
 *
 * @description
 * Endpoint ini menerima file gambar via FormData dan upload ke Supabase Storage.
 * Menggunakan supabaseAdmin (service role key) untuk bypass RLS policies.
 * Validasi dilakukan di server-side untuk security.
 *
 * Security:
 * - Clerk auth check (user harus authenticated)
 * - Validasi MIME type (JPG, PNG, GIF, WebP)
 * - Validasi file size (max 5MB)
 * - Upload menggunakan service role key (bypasses RLS)
 *
 * @param req - Next.js request dengan FormData
 * @param params - Route params { lessonId: string }
 * @returns JSON response dengan public URL atau error
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> },
) {
  try {
    // 1. Clerk auth check
    const session = await auth()
    if (!session?.userId) {
      return NextResponse.json({ message: 'Unauthorized. Please login.' }, { status: 401 })
    }

    // 2. Get lesson ID from params
    const { lessonId } = await params
    if (!lessonId) {
      return NextResponse.json({ message: 'Lesson ID is required' }, { status: 400 })
    }

    // 3. Parse FormData
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ message: 'File is required' }, { status: 400 })
    }

    // 4. Validate file (MIME type & size)
    try {
      validateImageFile(file)
    } catch (validationError) {
      return NextResponse.json(
        {
          message:
            validationError instanceof Error ? validationError.message : 'Validasi file gagal',
        },
        { status: 400 },
      )
    }

    // 5. Generate unique filename
    const fileName = generateLessonImageFileName(lessonId, file.name)

    // 6. Convert file to ArrayBuffer
    const buffer = await file.arrayBuffer()

    // 7. Upload to Supabase Storage using admin client (bypasses RLS)
    const { data, error } = await supabaseAdmin.storage.from(BUCKET).upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
      cacheControl: '3600',
    })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json({ message: `Upload gagal: ${error.message}` }, { status: 500 })
    }

    // 8. Get public URL using admin client
    const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName)

    // 9. Return success response
    return NextResponse.json(
      {
        url: urlData.publicUrl,
        fileName: fileName,
        path: data.path,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Gagal mengupload gambar. Coba lagi.',
      },
      { status: 500 },
    )
  }
}
