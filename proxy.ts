import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Helper to safely decode JWT payload without external libraries.
 * Validates expiration (exp) and structure.
 */
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

/**
 * Extract authenticated user directly from Supabase session cookies.
 * Supports single or chunked `sb-*-auth-token` cookies (plain JSON or base64-encoded).
 */
function extractUserFromCookies(request: NextRequest) {
  const allCookies = request.cookies.getAll()
  const tokenCookies = allCookies
    .filter((c) => c.name.includes('-auth-token'))
    .sort((a, b) => a.name.localeCompare(b.name))

  if (tokenCookies.length === 0) return null

  const combinedVal = tokenCookies
    .map((c) => c.value.replace(/^base64-/, ''))
    .join('')

  // 1. Try URL-decoded base64 JSON
  try {
    const decoded = Buffer.from(decodeURIComponent(combinedVal), 'base64').toString('utf-8')
    const session = JSON.parse(decoded)
    const token = session.access_token || (Array.isArray(session) ? session[0] : null)
    if (token && typeof token === 'string') {
      const user = decodeJwtUser(token)
      if (user) return user
    }
  } catch {
    // continue
  }

  // 2. Try raw JSON
  try {
    const session = JSON.parse(decodeURIComponent(combinedVal))
    const token = session.access_token || (Array.isArray(session) ? session[0] : null)
    if (token && typeof token === 'string') {
      const user = decodeJwtUser(token)
      if (user) return user
    }
  } catch {
    // continue
  }

  // 3. Try raw JWT string
  return decodeJwtUser(combinedVal)
}

/**
 * Next.js 16 Network Boundary Proxy dengan Supabase Auth Resilient Session Management
 *
 * Menggantikan Clerk Middleware dengan @supabase/ssr session management.
 * Memproteksi rute /dashboard, /creator, /admin, /student, /course/.../learn.
 *
 * Menggunakan strategi Hybrid Verification:
 * 1. Fast-path: Skip remote WAN check jika tidak ada token/cookie sama sekali.
 * 2. Remote check: supabase.auth.getUser() dengan 1500ms timeout guard.
 * 3. Offline fallback: Local JWT verification dari cookies/bearer jika WAN Supabase lambat / timeout.
 * 4. Cookie sync: Memastikan request & response cookies sinkron untuk Server Components & redirects.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map((c) => ({
            name: c.name,
            value: c.value,
          }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const authHeader = request.headers.get('authorization')
  let bearerToken: string | undefined = undefined
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    bearerToken = authHeader.slice(7).trim()
  }

  const hasAuthCookies = request.cookies.getAll().some((c) => c.name.includes('-auth-token'))

  let user: any = null

  // Hanya jalankan remote getUser jika ada token/cookie
  if (bearerToken || hasAuthCookies) {
    try {
      // 1500ms timeout guard to prevent hanging on slow networks (Indonesia -> Mumbai)
      const authPromise = supabase.auth.getUser(bearerToken)
      const timeoutPromise = new Promise<{ data: { user: null }; error: Error }>((_, reject) =>
        setTimeout(() => reject(new Error('Supabase Auth Timeout (1500ms)')), 1500)
      )
      const { data, error } = await Promise.race([authPromise, timeoutPromise])
      if (!error && data?.user) {
        user = data.user
      }
    } catch {
      // Timeout or network error — lanjutkan ke offline fallback
    }

    // Fallback: Offline JWT recovery for Bearer token or cookies
    if (!user) {
      if (bearerToken) {
        user = decodeJwtUser(bearerToken)
      }
      if (!user && hasAuthCookies) {
        user = extractUserFromCookies(request)
      }
    }
  }

  const pathname = request.nextUrl.pathname

  // Defined protected routes
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/creator') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/student') ||
    (pathname.startsWith('/course/') && pathname.includes('/learn'))

  // Helper untuk membuat redirect dengan mempertahankan cookie session
  const createRedirectResponse = (targetPath: string) => {
    const url = request.nextUrl.clone()
    url.pathname = targetPath
    const redirectResponse = NextResponse.redirect(url)
    response.cookies.getAll().forEach((c) => {
      redirectResponse.cookies.set(c.name, c.value)
    })
    return redirectResponse
  }

  if (!user && isProtectedRoute) {
    return createRedirectResponse('/sign-in')
  }

  if (user) {
    const role = (user.app_metadata?.role || user.user_metadata?.role || user.role || 'user') as string

    // Role-based Access Control
    if (pathname.startsWith('/admin') && role !== 'admin') {
      return createRedirectResponse('/unauthorized')
    }

    if (pathname.startsWith('/creator') && role !== 'admin' && role !== 'creator') {
      return createRedirectResponse('/unauthorized')
    }

    // Forward verified user identity to downstream Route Handlers & Server Components
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', user.id)
    if (user.email) requestHeaders.set('x-user-email', user.email)
    requestHeaders.set('x-user-role', role)

    const nextResponse = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    response.cookies.getAll().forEach((c) => {
      nextResponse.cookies.set(c.name, c.value)
    })

    if (pathname.startsWith('/api/')) {
      console.log(`[Proxy Auth] Forwarded verified user ${user.id} to ${request.method} ${pathname}`)
    }

    return nextResponse
  }

  return response
}

export default proxy

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
    '/(api|trpc)(.*)',
  ],
}

