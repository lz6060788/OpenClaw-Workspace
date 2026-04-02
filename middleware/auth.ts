/**
 * Authentication middleware
 * Protects routes by checking if user is authenticated
 */

export default defineNuxtRouteMiddleware((to) => {
  // Skip auth check for login page and public routes
  const publicRoutes = ['/login', '/api/auth']
  const isPublicRoute = publicRoutes.some(route => to.path.startsWith(route))

  if (isPublicRoute) {
    return
  }

  // Check if user is authenticated
  const { loggedIn, fetchSession, status } = useAuth()

  // If status is not determined yet, fetch session
  if (status.value === 'unauthenticated') {
    // User is not logged in, redirect to login
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  // Fetch session to verify authentication
  if (!loggedIn.value) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }
})
