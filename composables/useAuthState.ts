/**
 * Custom auth composable to replace @sidebase/nuxt-auth
 * Manages authentication state with custom backend endpoints
 */

export const useAuthState = () => {
  // Session state
  const data = useState<any | null>('auth-session', () => null)
  const loading = ref(false)
  const error = ref<any>(null)

  /**
   * Get current session from server
   */
  const getSession = async () => {
    try {
      loading.value = true
      error.value = null
      const session = await $fetch('/api/auth/session')
      data.value = session
      return session
    } catch (e) {
      error.value = e
      data.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign in with username and password
   */
  const signIn = async (username: string, password: string) => {
    try {
      loading.value = true
      error.value = null
      const response = await $fetch('/api/auth/signin', {
        method: 'POST',
        body: { username, password }
      })
      data.value = response
      return response
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * Sign out
   */
  const signOut = async () => {
    try {
      loading.value = true
      error.value = null
      await $fetch('/api/auth/signout', {
        method: 'POST'
      })
      data.value = null
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = computed(() => !!data.value?.user)

  /**
   * Get current user
   */
  const user = computed(() => data.value?.user || null)

  return {
    data,
    loading,
    error,
    getSession,
    signIn,
    signOut,
    isAuthenticated,
    user
  }
}
