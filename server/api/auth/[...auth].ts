/**
 * Auth handler for Nuxt Auth
 * This file handles all authentication-related requests
 */

import crypto from 'crypto'
import { db } from '~/server/utils/db'
import { NuxtAuthHandler } from '#auth'

// Hash function matching the init script
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'openclaw-salt').digest('hex')
}

// Credentials provider configuration
export default NuxtAuthHandler({
  providers: [
    {
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'admin' },
        password: { label: 'Password', type: 'password', placeholder: '••••••••' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Missing username or password'
          })
        }

        // Find user by username
        const user = await db.user.findByUsername(credentials.username as string)

        if (!user) {
          throw createError({
            statusCode: 401,
            statusMessage: 'Invalid username or password'
          })
        }

        // Verify password
        const hashedPassword = hashPassword(credentials.password as string)
        const isValid = hashedPassword === user.password

        if (!isValid) {
          throw createError({
            statusCode: 401,
            statusMessage: 'Invalid username or password'
          })
        }

        // Return user object (excluding password)
        return {
          id: user.id.toString(),
          username: user.username,
        }
      }
    }
  ],
  session: {
    strategy: 'database',
    maxAge: 604800, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
})


