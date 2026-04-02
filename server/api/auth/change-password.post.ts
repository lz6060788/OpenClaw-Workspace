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
  // Get current user from session
  const session = await getUserSession(event)

  if (!session?.user?.id) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
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

  // Get user from database
  const userId = parseInt(session.user.id)
  const user = await db.user.findById(userId)

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
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
  await db.user.update(userId, {
    password: hashedNewPassword
  })

  return {
    success: true,
    message: 'Password changed successfully'
  }
})
