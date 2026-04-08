/**
 * Auth middleware - registered via plugins/auth.ts
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = ['/login', '/api/']
  if (publicRoutes.some(r => to.path.startsWith(r))) return

  try {
    const session = await $fetch('/api/auth/session')
    if (!session?.user) {
      return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
    }
  } catch {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
