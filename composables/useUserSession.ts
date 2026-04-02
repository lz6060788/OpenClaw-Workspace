/**
 * Composable for user session management
 * Provides convenient access to authentication state and methods
 */

export const useUserSession = () => {
  const { data, signIn, signOut, session, status, tokens, clearToken, lastRefreshedAt } = useAuth()

  const loggedIn = computed(() => status.value === 'authenticated')
  const user = computed(() => data.value?.user || null)

  /**
   * Login with username and password
   */
  const login = async (username: string, password: string) => {
    return await signIn('credentials', { username, password })
  }

  /**
   * Logout current user
   */
  const logout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  /**
   * Refresh session
   */
  const refresh = async () => {
    await fetchSession()
  }

  return {
    // State
    status,
    session,
    tokens,
    lastRefreshedAt,
    loggedIn,
    user,
    // Methods
    login,
    logout,
    refresh,
    signIn,
    signOut,
    clearToken
  }
}
