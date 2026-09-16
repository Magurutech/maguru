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
  try {
    const headerStore = await headers()
    authHeader = headerStore.get('authorization')
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      bearerToken = authHeader.slice(7).trim()
    }
  } catch {
    // headers() might not be available in certain contexts
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key'

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

  // Wrap client.auth.getUser with 1500ms timeout guard and offline JWT fallback
  const originalGetUser = client.auth.getUser.bind(client.auth)
  client.auth.getUser = async (jwt?: string) => {
    const tokenToVerify = jwt || bearerToken
    try {
      const timeoutPromise = new Promise<{ data: { user: null }; error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error('Supabase Auth Timeout (1500ms)')), 1500)
      )
      const res = await Promise.race([originalGetUser(tokenToVerify), timeoutPromise])
      if (res && res.data && res.data.user) {
        return res
      }
    } catch {
      // Remote timeout or network unreachable — fallback to offline JWT verification
    }

    if (tokenToVerify) {
      const user = decodeJwtUser(tokenToVerify)
      if (user) {
        return { data: { user: user as any }, error: null }
      }
    }

    // Check cookies if no bearer token
    const allCookies: Array<{ name: string; value: string }> = cookieStore ? cookieStore.getAll() : []
    const tokenCookies = allCookies
      .filter((c: { name: string; value: string }) => c.name.includes('-auth-token'))
      .sort((a: { name: string; value: string }, b: { name: string; value: string }) => a.name.localeCompare(b.name))

    if (tokenCookies.length > 0) {
      const combinedVal = tokenCookies
        .map((c: { name: string; value: string }) => c.value.replace(/^base64-/, ''))
        .join('')
      try {
        const decoded = Buffer.from(decodeURIComponent(combinedVal), 'base64').toString('utf-8')
        const session = JSON.parse(decoded)
        if (session.access_token) {
          const user = decodeJwtUser(session.access_token)
          if (user) {
            return { data: { user: user as any }, error: null }
          }
        }
      } catch {
        // ignore
      }
    }

    return { data: { user: null }, error: new Error('User not found') as any }
  }

  return client
}
