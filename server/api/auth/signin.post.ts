/**
 * Sign in endpoint
 * Authenticates user with username/password and creates a session
 */

import crypto from 'crypto'
import { db } from '~/server/utils/db'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password } = body

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and password are required'
    })
  }

  // Hash password to compare
  function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password + 'openclaw-salt').digest('hex')
  }

  // Find user
  const user = await db.user.findByUsername(username)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid username or password'
    })
  }

  // Verify password
  const hashedPassword = hashPassword(password)
  if (hashedPassword !== user.password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid username or password'
    })
  }

  // Create session token
  const sessionToken = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  // Create session in database
  await db.session.create({
    userId: user.id,
    token: sessionToken,
    expiresAt
  })

  // Set session cookie
  const isSecure = process.env.NODE_ENV === 'production'
  const cookieName = isSecure ? '__Secure-next-auth.session-token' : 'next-auth.session-token'

  setCookie(event, cookieName, sessionToken, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    expires: expiresAt,
    path: '/'
  })

  // Return user data
  return {
    user: {
      id: user.id.toString(),
      username: user.username,
    },
    expires: expiresAt.toISOString()
  }
})
