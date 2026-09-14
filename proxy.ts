import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js 16 Network Boundary Proxy dengan Supabase Auth
 *
 * Menggantikan Clerk Middleware dengan @supabase/ssr session management.
 * Memproteksi rute /dashboard, /creator, /admin, /student, /course/.../learn.
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

  let user: any = null
  try {
    // 1000ms timeout guard to prevent hanging on slow networks
    const authPromise = supabase.auth.getUser(bearerToken)
    const timeoutPromise = new Promise<{ data: { user: null }; error: Error }>((_, reject) =>
      setTimeout(() => reject(new Error('Supabase Auth Timeout (1000ms)')), 1000)
    )
    const { data, error } = await Promise.race([authPromise, timeoutPromise])
    if (!error && data?.user) {
      user = data.user
    }
  } catch (err) {
    // Timeout or network error
  }

  // Fallback: Offline JWT recovery for Bearer token or cookies
  if (!user && bearerToken) {
    try {
      const parts = bearerToken.split('.')
      if (parts.length >= 2) {
        const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8'))
        if (payload?.sub && (!payload.exp || payload.exp * 1000 > Date.now())) {
          user = {
            id: payload.sub,
            email: payload.email || '',
            role: payload.role || 'authenticated',
            aud: payload.aud || 'authenticated',
          }
        }
      }
    } catch {
      // ...
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

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  if (user) {
    const role = (user.app_metadata?.role || user.user_metadata?.role || 'user') as string

    // Role-based Access Control
    if (pathname.startsWith('/admin') && role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }

    if (pathname.startsWith('/creator') && role !== 'admin' && role !== 'creator') {
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }
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
