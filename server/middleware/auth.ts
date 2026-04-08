/**
 * Server-side auth middleware
 * Redirects unauthenticated users to login page during SSR
 */
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const path = event.path

  // Skip for API routes, static assets, and login page
  if (
    path.startsWith('/api/') ||
    path.startsWith('/_nuxt/') ||
    path.startsWith('/login') ||
    path === '/favicon.ico' ||
    path.match(/\.\w+$/) // static files
  ) {
    return
  }

  // Get session token from cookie
  const sessionToken =
    getCookie(event, 'next-auth.session-token') ||
    getCookie(event, '__Secure-next-auth.session-token')

  if (!sessionToken) {
    // No session cookie, redirect to login
    return sendRedirect(event, `/login?redirect=${encodeURIComponent(path)}`, 302)
  }

  // Verify session is valid
  try {
    const session = await db.session.findByToken(sessionToken)
    if (!session || new Date(session.expiresAt) < new Date()) {
      return sendRedirect(event, `/login?redirect=${encodeURIComponent(path)}`, 302)
    }
  } catch {
    return sendRedirect(event, `/login?redirect=${encodeURIComponent(path)}`, 302)
  }
})
