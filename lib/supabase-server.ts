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

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY is not defined. ' +
      'Make sure to add it to your .env file. ' +
      'Get it from Supabase Dashboard → Settings → API → service_role key.',
  )
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)
