/**
 * Get current session endpoint
 * Checks if user is authenticated via session token
 */

import { db } from '~/server/utils/db'

export default eventHandler(async (event) => {
  // Get session token from cookie
  const sessionToken = getCookie(event, 'next-auth.session-token') || getCookie(event, '__Secure-next-auth.session-token')

  if (!sessionToken) {
    return null
  }

  // Find valid session
  const session = await db.session.findByToken(sessionToken)

  if (!session || new Date(session.expiresAt) < new Date()) {
    return null
  }

  // Get user data
  const user = await db.user.findById(session.userId)

  if (!user) {
    return null
  }

  // Return session data
  return {
    user: {
      id: user.id.toString(),
      username: user.username,
    },
    expires: session.expiresAt.toISOString()
  }
})
