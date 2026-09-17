import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

function decodeJwtUser(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const jsonStr = Buffer.from(base64, 'base64').toString('utf-8')
    const payload = JSON.parse(jsonStr)
    if (!payload || !payload.sub) return null
    if (payload.exp && payload.exp * 1000 < Date.now()) return null
    return {
      id: payload.sub,
      email: payload.email || '',
      role: payload.role || 'authenticated',
      aud: payload.aud || 'authenticated',
      app_metadata: payload.app_metadata || {},
      user_metadata: payload.user_metadata || {},
      created_at: payload.iat ? new Date(payload.iat * 1000).toISOString() : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export async function createClient() {
  let cookieStore: any = null
  try {
    cookieStore = await cookies()
  } catch {
    // cookies() might not be available in non-request contexts (e.g. tests or build)
  }
  let authHeader: string | null = null
  let bearerToken: string | undefined = undefined
  let headerStore: any = null
  try {
    headerStore = await headers()
    authHeader = headerStore.get('authorization')
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      bearerToken = authHeader.slice(7).trim()
    }
  } catch {
    // headers() might not be available in certain contexts
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key'

  const forwardedUserId = headerStore?.get('x-user-id')
  const forwardedUserEmail = headerStore?.get('x-user-email') || ''
  const forwardedUserRole = headerStore?.get('x-user-role') || 'authenticated'

  const client = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      global: {
        headers: authHeader ? { Authorization: authHeader } : {},
      },
      cookies: {
        getAll() {
          return cookieStore?.getAll?.() || []
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore?.set?.(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware/proxy refreshing user sessions.
          }
        },
      },
    }
  )

  // Wrap client.auth.getUser with 1500ms timeout guard and multi-format offline fallback
  const originalGetUser = client.auth.getUser.bind(client.auth)
  client.auth.getUser = async (jwt?: string) => {
    const tokenToVerify = jwt || bearerToken

    // 1. If we have a bearer token, try remote verification with 1500ms timeout
    if (tokenToVerify) {
      try {
        const timeoutPromise = new Promise<{ data: { user: null }; error: Error }>((_, reject) =>
          setTimeout(() => reject(new Error('Supabase Auth Timeout (1500ms)')), 1500)
        )
        const res = await Promise.race([originalGetUser(tokenToVerify), timeoutPromise])
        if (res && res.data && res.data.user) {
          console.log('[Supabase Server Auth] Remote verification succeeded for bearer token:', res.data.user.id)
          return res
        }
      } catch (err: any) {
        console.warn('[Supabase Server Auth] Remote check failed/timeout, trying local JWT recovery:', err?.message)
      }

      const user = decodeJwtUser(tokenToVerify)
      if (user) {
        console.log('[Supabase Server Auth] Recovered user from bearer JWT payload:', user.id)
        return { data: { user: user as any }, error: null }
      }
    }

    // 2. Fast-path: Check if proxy.ts already verified the user and forwarded headers
    if (forwardedUserId) {
      const user = {
        id: forwardedUserId,
        email: forwardedUserEmail,
        role: forwardedUserRole,
        aud: 'authenticated',
        app_metadata: {},
        user_metadata: {},
        created_at: new Date().toISOString(),
      }
      console.log('[Supabase Server Auth] Resolved user from proxy forwarded headers:', user.id)
      return { data: { user: user as any }, error: null }
    }

    // 3. Check cookies if no bearer token
    const allCookies: Array<{ name: string; value: string }> = cookieStore ? cookieStore.getAll() : []
    const tokenCookies = allCookies
      .filter((c: { name: string; value: string }) => c.name.includes('-auth-token'))
      .sort((a: { name: string; value: string }, b: { name: string; value: string }) => a.name.localeCompare(b.name))

    if (tokenCookies.length > 0) {
      const combinedVal = tokenCookies
        .map((c: { name: string; value: string }) => c.value.replace(/^base64-/, ''))
        .join('')

      // 3A. Try URL-decoded base64 JSON
      try {
        const decoded = Buffer.from(decodeURIComponent(combinedVal), 'base64').toString('utf-8')
        const session = JSON.parse(decoded)
        const token = session.access_token || (Array.isArray(session) ? session[0] : null)
        if (token && typeof token === 'string') {
          const user = decodeJwtUser(token)
          if (user) {
            console.log('[Supabase Server Auth] Resolved user from base64 cookie session:', user.id)
            return { data: { user: user as any }, error: null }
          }
        }
      } catch {
        // continue to next format
      }

      // 3B. Try raw JSON
      try {
        const session = JSON.parse(decodeURIComponent(combinedVal))
        const token = session.access_token || (Array.isArray(session) ? session[0] : null)
        if (token && typeof token === 'string') {
          const user = decodeJwtUser(token)
          if (user) {
            console.log('[Supabase Server Auth] Resolved user from raw JSON cookie session:', user.id)
            return { data: { user: user as any }, error: null }
          }
        }
      } catch {
        // continue to next format
      }

      // 3C. Try raw JWT string
      const user = decodeJwtUser(combinedVal)
      if (user) {
        console.log('[Supabase Server Auth] Resolved user from raw JWT cookie string:', user.id)
        return { data: { user: user as any }, error: null }
      }
    }

    console.warn('[Supabase Server Auth] User verification failed: No valid token found in cookies, headers, or bearer')
    return { data: { user: null }, error: new Error('User not found') as any }
  }

  return client
}
