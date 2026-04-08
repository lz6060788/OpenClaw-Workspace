/**
 * POST /api/auth/change-password
 *
 * Change current user's password
 */

import crypto from 'crypto'
import { db } from '~/server/utils/db'

// Hash function matching the auth handler
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'openclaw-salt').digest('hex')
}

export default defineEventHandler(async (event) => {
  // Get current user from session cookie
  const sessionToken = getCookie(event, 'next-auth.session-token') || getCookie(event, '__Secure-next-auth.session-token')

  if (!sessionToken) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const session = await db.session.findByToken(sessionToken)
  if (!session || new Date(session.expiresAt) < new Date()) {
    throw createError({ statusCode: 401, statusMessage: 'Session expired' })
  }

  const user = await db.user.findById(session.userId)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'User not found' })
  }

  const body = await readBody(event)
  const { currentPassword, newPassword } = body

  // Validate input
  if (!currentPassword || !newPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Current password and new password are required'
    })
  }

  // Validate new password strength
  if (newPassword.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'New password must be at least 8 characters'
    })
  }

  // Verify current password
  const hashedCurrentPassword = hashPassword(currentPassword)
  const isValid = hashedCurrentPassword === user.password

  if (!isValid) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Current password is incorrect'
    })
  }

  // Hash new password
  const hashedNewPassword = hashPassword(newPassword)

  // Update password
  await db.user.update(user.id, {
    password: hashedNewPassword
  })

  return {
    success: true,
    message: 'Password changed successfully'
  }
})
