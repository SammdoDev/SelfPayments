import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('sb-access-token')
  const path = req.nextUrl.pathname

  if (path.startsWith('/api')) {
    if (process.env.NODE_ENV === 'production') {
      return new NextResponse('Access denied', { status: 403 })
    }
  }

  if (path === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    } else {
      return NextResponse.redirect(new URL('/auth/signIn', req.url))
    }
  }

  if (path.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/auth/signIn', req.url))
  }

  if (path.startsWith('/auth/signIn') && token) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/signIn', '/api/:path*'],
}
