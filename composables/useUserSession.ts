/**
 * Composable for user session management
 * Provides convenient access to authentication state and methods
 * Updated to use custom auth backend instead of @sidebase/nuxt-auth
 */

export const useUserSession = () => {
  const authState = useAuthState()

  const status = computed(() => authState.isAuthenticated.value ? 'authenticated' : 'unauthenticated')
  const session = computed(() => authState.data.value)
  const loggedIn = authState.isAuthenticated
  const user = authState.user

  /**
   * Login with username and password
   */
  const login = async (username: string, password: string) => {
    return await authState.signIn(username, password)
  }

  /**
   * Logout current user
   */
  const logout = async () => {
    await authState.signOut()
    await navigateTo('/login')
  }

  /**
   * Refresh session
   */
  const refresh = async () => {
    await authState.getSession()
  }

  return {
    // State
    status,
    session,
    loggedIn,
    user,
    loading: authState.loading,
    error: authState.error,
    // Methods
    login,
    logout,
    refresh,
    signIn: authState.signIn,
    signOut: authState.signOut,
    getSession: authState.getSession
  }
}
