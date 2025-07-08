import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Client untuk Storage Operations
 *
 * @description
 * Client ini digunakan untuk operasi storage (upload, download, delete) dengan anon key.
 * Menggunakan pendekatan sederhana tanpa JWT integration yang kompleks.
 *
 * Referensi:
 * - https://supabase.com/docs/guides/storage/quickstart
 * - https://supabase.com/docs/guides/storage/uploads/standard-uploads
 * - https://supabase.com/docs/guides/storage/serving/downloads
 */

// Client untuk storage operations dengan anon key
export const supabaseStorage = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

/**
 * Utility functions untuk storage operations
 */
export const storageUtils = {
  /**
   * Upload file ke bucket course-thumbnails
   *
   * @param file - File yang akan diupload
   * @param fileName - Nama file (opsional, akan generate otomatis jika tidak disediakan)
   * @returns Promise dengan URL publik file
   */
  async uploadThumbnail(file: File, fileName?: string): Promise<string> {
    const buffer = await file.arrayBuffer()
    const fileExt = file.name.split('.').pop()
    const finalFileName = fileName || `course-${Date.now()}.${fileExt}`

    const { error } = await supabaseStorage.storage
      .from('course-thumbnails')
      .upload(finalFileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Generate public URL
    const { data: publicUrlData } = supabaseStorage.storage
      .from('course-thumbnails')
      .getPublicUrl(finalFileName)

    return publicUrlData.publicUrl
  },

  /**
   * Hapus file dari bucket course-thumbnails
   *
   * @param filePath - Path file yang akan dihapus
   */
  async deleteThumbnail(filePath: string): Promise<void> {
    const { error } = await supabaseStorage.storage.from('course-thumbnails').remove([filePath])

    if (error) {
      console.warn('Failed to delete thumbnail:', error)
      // Tidak throw error karena ini bukan critical operation
    }
  },

  /**
   * Extract file path dari URL Supabase
   *
   * @param url - URL lengkap dari Supabase Storage
   * @returns Path file relatif
   */
  extractFilePathFromUrl(url: string): string | null {
    const urlParts = url.split('/course-thumbnails/')
    return urlParts.length === 2 ? urlParts[1] : null
  },

  /**
   * Generate thumbnail URL dengan transformasi (jika diperlukan)
   *
   * @param fileName - Nama file
   * @param options - Opsi transformasi (width, height, dll)
   * @returns URL dengan transformasi
   */
  getThumbnailUrl(fileName: string, options?: { width?: number; height?: number }): string {
    if (options) {
      const { data } = supabaseStorage.storage.from('course-thumbnails').getPublicUrl(fileName, {
        transform: {
          width: options.width,
          height: options.height,
        },
      })
      return data.publicUrl
    }

    const { data } = supabaseStorage.storage.from('course-thumbnails').getPublicUrl(fileName)
    return data.publicUrl
  },
}
