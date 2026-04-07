/**
 * Sign out endpoint
 * Deletes the current session
 */

import { db } from '~/server/utils/db'

export default eventHandler(async (event) => {
  // Get session token from cookie
  const sessionToken = getCookie(event, 'next-auth.session-token') || getCookie(event, '__Secure-next-auth.session-token')

  if (sessionToken) {
    // Delete session from database
    await db.session.deleteByToken(sessionToken)

    // Remove session cookie
    const isSecure = process.env.NODE_ENV === 'production'
    const cookieName = isSecure ? '__Secure-next-auth.session-token' : 'next-auth.session-token'

    deleteCookie(event, cookieName, {
      path: '/'
    })
  }

  return { success: true }
})
