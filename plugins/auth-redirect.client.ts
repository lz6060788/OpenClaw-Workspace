/**
 * Client-side plugin to register auth middleware globally
 * Ensures unauthenticated users are redirected to login
 */
import authMiddleware from '~/middleware/auth.global'

export default defineNuxtPlugin(() => {
  addRouteMiddleware('auth', authMiddleware, { global: true })
})
