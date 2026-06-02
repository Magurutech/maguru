import { supabaseStorage } from '@/lib/supabase'

/**
 * Image Upload Utility untuk Tiptap Editor
 *
 * @description
 * Utility untuk upload gambar ke Supabase Storage bucket `course-materials`.
 * Menggunakan API route untuk handle upload dengan Clerk auth validation.
 *
 * Features:
 * - Validasi MIME type (JPG, PNG, GIF, WebP)
 * - Validasi file size (max 5MB)
 * - Upload ke Supabase Storage via API route
 * - Generate unique filename dengan timestamp
 * - Return public URL untuk insert ke editor
 */

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const BUCKET = 'course-materials'

/**
 * Upload lesson image ke Supabase Storage via API route
 *
 * @param file - File gambar yang akan diupload
 * @param lessonId - ID lesson (untuk generate unique filename)
 * @returns Promise dengan public URL gambar
 * @throws Error jika validasi gagal atau upload gagal
 */
export async function uploadLessonImage(file: File, lessonId: string): Promise<string> {
  // Client-side validation
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.')
  }

  if (file.size > MAX_SIZE) {
    throw new Error('Ukuran gambar maksimal 5MB.')
  }

  // Prepare FormData untuk API route
  const formData = new FormData()
  formData.append('file', file)

  // Call API route untuk upload (server-side validation & Clerk auth)
  const response = await fetch(`/api/lessons/${lessonId}/images`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Gagal mengupload gambar. Coba lagi.')
  }

  const { url } = await response.json()
  return url
}

/**
 * Upload lesson image directly ke Supabase Storage (fallback/alternative)
 *
 * @param file - File gambar yang akan diupload
 * @returns Promise dengan public URL gambar
 * @throws Error jika validasi gagal atau upload gagal
 *
 * @deprecated Gunakan uploadLessonImage dengan API route untuk security
 */
export async function uploadLessonImageDirect(file: File): Promise<string> {
  // Validate MIME type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.')
  }

  // Validate file size
  if (file.size > MAX_SIZE) {
    throw new Error('Ukuran gambar maksimal 5MB.')
  }

  // Generate unique filename
  const ext = file.name.split('.').pop()
  const fileName = `lesson-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  // Convert file to ArrayBuffer
  const buffer = await file.arrayBuffer()

  // Upload to Supabase Storage
  const { error } = await supabaseStorage.storage.from(BUCKET).upload(fileName, buffer, {
    contentType: file.type,
    upsert: false,
    cacheControl: '3600',
  })

  if (error) {
    throw new Error(`Upload gagal: ${error.message}`)
  }

  // Get public URL
  const { data: urlData } = supabaseStorage.storage.from(BUCKET).getPublicUrl(fileName)

  return urlData.publicUrl
}

/**
 * Validate image file sebelum upload
 *
 * @param file - File yang akan divalidasi
 * @throws Error jika validasi gagal
 */
export function validateImageFile(file: File): void {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.')
  }

  if (file.size > MAX_SIZE) {
    throw new Error('Ukuran gambar maksimal 5MB.')
  }
}

/**
 * Extract file extension dari filename
 *
 * @param fileName - Nama file
 * @returns Extension file (tanpa dot)
 */
export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop() || ''
}

/**
 * Generate unique filename untuk lesson image
 *
 * @param lessonId - ID lesson
 * @param originalFileName - Nama file asli
 * @returns Unique filename
 */
export function generateLessonImageFileName(lessonId: string, originalFileName: string): string {
  const ext = getFileExtension(originalFileName)
  return `lesson-${lessonId}-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
}
