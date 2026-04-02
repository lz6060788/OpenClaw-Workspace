/**
 * Auth utilities and session adapter
 */

import { db } from './db'
import type { User } from '@prisma/client'
import { nanoid } from 'nanoid'

// Session adapter for database storage
export const databaseAdapter = {
  async createSession(session: {
    userId: number
    expiresAt: Date
  }) {
    const token = nanoid(32)
    const result = await db.session.create({
      userId: session.userId,
      token,
      expiresAt: session.expiresAt
    })
    return {
      token: result.token,
      userId: result.userId.toString(),
      expires: result.expiresAt
    }
  },

  async getSessionAndUser(sessionToken: string) {
    const session = await db.session.findByToken(sessionToken)
    if (!session || session.expiresAt < new Date()) {
      return null
    }
    return {
      session: {
        token: session.token,
        userId: session.userId.toString(),
        expires: session.expiresAt
      },
      user: {
        id: session.user.id.toString(),
        username: session.user.username
      }
    }
  },

  async updateSession(session: { token: string; expires: Date }) {
    // SQLite doesn't support updating all fields at once easily
    // This is a simplified implementation
    return session
  },

  async deleteSession(sessionToken: string) {
    await db.session.deleteByToken(sessionToken)
  }
}

// Helper to get current user from session
export async function getCurrentUser(sessionToken: string) {
  if (!sessionToken) return null

  const result = await databaseAdapter.getSessionAndUser(sessionToken)
  return result?.user || null
}
