import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Admin Client untuk Server-Side Operations
 *
 * @description
 * Client ini menggunakan Service Role Key yang memiliki admin privileges.
 * HANYA boleh digunakan di server-side (API routes, server actions, server components).
 * TIDAK BOLEH di-import di client components karena bypasses semua RLS policies.
 *
 * Use cases:
 * - Upload files dari API routes (bypasses RLS)
 * - Delete files dari API routes
 * - Admin operations yang butuh full access
 * - Server-side operations yang perlu bypass RLS
 *
 * Security:
 * - Service Role Key HARUS disimpan di server environment variables
 * - JANGAN include di NEXT_PUBLIC_* variables
 * - JANGAN import file ini di client components
 * - JANGAN kirim ke client-side
 *
 * @example
 * ```typescript
 * // ✅ CORRECT: Di API route (server-side)
 * import { supabaseAdmin } from '@/lib/supabase-admin'
 *
 * export async function POST(req: Request) {
 *   const { data, error } = await supabaseAdmin.storage
 *     .from('bucket')
 *     .upload('file.png', buffer)
 * }
 * ```
 *
 * @example
 * ```typescript
 * // ❌ WRONG: Di client component
 * 'use client'
 * import { supabaseAdmin } from '@/lib/supabase-admin' // ERROR!
 * ```
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-role-key-for-build'

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)
