// server/utils/config.ts
import { db } from './db'
import { decrypt, isEncryptionAvailable } from './encryption'

/**
 * Configuration access layer
 * Provides unified access to settings with caching and fallback to environment variables
 */

interface ConfigOptions {
  useCache?: boolean
  fallbackToEnv?: boolean
  decryptSensitive?: boolean
}

// Simple in-memory cache
const cache = new Map<string, { value: any; expires: number }>()
const CACHE_TTL = 60 * 1000 // 1 minute

/**
 * Get a configuration value by key
 * @param key - Configuration key
 * @param defaultValue - Default value if not found
 * @param options - Configuration options
 * @returns Configuration value
 */
export async function getConfig<T = any>(
  key: string,
  defaultValue?: T,
  options: ConfigOptions = {}
): Promise<T | undefined> {
  const {
    useCache = true,
    fallbackToEnv = true,
    decryptSensitive = true,
  } = options

  // Check cache first
  if (useCache) {
    const cached = cache.get(key)
    if (cached && cached.expires > Date.now()) {
      return cached.value as T
    }
  }

  try {
    // Try to get from database
    const setting = await db.setting.findByKey(key)

    if (setting) {
      let value: any = setting.value

      // Decrypt sensitive values if requested
      if (setting.isEncrypted && decryptSensitive) {
        if (!isEncryptionAvailable()) {
          console.warn(`Cannot decrypt ${key}: encryption key not available`)
          return defaultValue
        }
        value = decrypt(setting.value)
      }

      // Convert value based on type
      switch (setting.type) {
        case 'number':
          value = Number(value)
          break
        case 'boolean':
          value = value === 'true'
          break
        case 'json':
          try {
            value = JSON.parse(value)
          } catch {
            // Keep as string if JSON parsing fails
          }
          break
      }

      // Cache the value
      if (useCache) {
        cache.set(key, {
          value,
          expires: Date.now() + CACHE_TTL,
        })
      }

      return value as T
    }
  } catch (error) {
    console.error(`Error getting config ${key}:`, error)
  }

  // Fallback to environment variable
  if (fallbackToEnv) {
    const envValue = process.env[key]
    if (envValue !== undefined) {
      return envValue as T
    }
  }

  return defaultValue
}

/**
 * Get multiple configuration values by keys
 * @param keys - Array of configuration keys
 * @param options - Configuration options
 * @returns Object with key-value pairs
 */
export async function getConfigs(
  keys: string[],
  options: ConfigOptions = {}
): Promise<Record<string, any>> {
  const result: Record<string, any> = {}

  for (const key of keys) {
    result[key] = await getConfig(key, undefined, options)
  }

  return result
}

/**
 * Get all configuration values for a category
 * @param category - Configuration category
 * @param options - Configuration options
 * @returns Object with key-value pairs
 */
export async function getConfigByCategory(
  category: string,
  options: ConfigOptions = {}
): Promise<Record<string, any>> {
  const settings = await db.setting.findByCategory(category)
  const result: Record<string, any> = {}

  for (const setting of settings) {
    let value: any = setting.value

    // Decrypt sensitive values if requested
    if (setting.isEncrypted && options.decryptSensitive !== false) {
      if (isEncryptionAvailable()) {
        try {
          value = decrypt(setting.value)
        } catch (error) {
          console.error(`Failed to decrypt ${setting.key}:`, error)
          value = setting.value
        }
      } else {
        console.warn(`Cannot decrypt ${setting.key}: encryption key not available`)
        value = '***ENCRYPTED***'
      }
    }

    // Convert value based on type
    switch (setting.type) {
      case 'number':
        value = Number(value)
        break
      case 'boolean':
        value = value === 'true'
        break
      case 'json':
        try {
          value = JSON.parse(value)
        } catch {
          // Keep as string if JSON parsing fails
        }
        break
    }

    result[setting.key] = value
  }

  return result
}

/**
 * Clear configuration cache
 * @param key - Optional key to clear, clears all if not provided
 */
export function clearConfigCache(key?: string): void {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}

/**
 * Preload configurations into cache
 * @param category - Optional category to preload
 */
export async function preloadConfig(category?: string): Promise<void> {
  try {
    if (category) {
      await getConfigByCategory(category, { useCache: true })
    } else {
      const settings = await db.setting.findAll()
      for (const setting of settings) {
        await getConfig(setting.key, undefined, { useCache: true })
      }
    }
  } catch (error) {
    console.error('Error preloading config:', error)
  }
}

/**
 * Configuration getter helpers for common categories
 */
export const config = {
  // OpenClaw configuration
  openclaw: {
    getApiKey: () => getConfig<string>('OPENCLAW_API_KEY', ''),
    getApiEndpoint: () => getConfig<string>('OPENCLAW_API_ENDPOINT', 'http://127.0.0.1:18789'),
    getTimeout: () => getConfig<number>('OPENCLAW_TIMEOUT', 30000),
    isDebug: () => getConfig<boolean>('OPENCLAW_DEBUG', false),
    getGatewayUrl: () => getConfig<string>('OPENCLAW_GATEWAY_URL', 'http://127.0.0.1:18789'),
    getGatewayToken: () => getConfig<string>('OPENCLAW_GATEWAY_TOKEN', ''),
    getAgentId: () => getConfig<string>('OPENCLAW_AGENT_ID', 'main'),
    getChatDataDir: () => getConfig<string>('CHAT_DATA_DIR', '/data/openclaw-chat'),
    getAll: () => getConfigByCategory('openclaw'),
  },

  // Vercel configuration
  vercel: {
    getToken: () => getConfig<string>('VERCEL_TOKEN', ''),
    getTeamId: () => getConfig<string>('VERCEL_TEAM_ID', ''),
    getWebhookSecret: () => getConfig<string>('VERCEL_WEBHOOK_SECRET', ''),
    getFramework: () => getConfig<string>('VERCEL_FRAMEWORK', 'vite'),
    isAutoDeploy: () => getConfig<boolean>('VERCEL_AUTO_DEPLOY', true),
    getAll: () => getConfigByCategory('vercel'),
  },

  // GitHub configuration
  github: {
    getToken: () => getConfig<string>('GITHUB_TOKEN', ''),
    getUsername: () => getConfig<string>('GITHUB_USERNAME', ''),
    getDefaultBranch: () => getConfig<string>('GITHUB_DEFAULT_BRANCH', 'main'),
    isAutoSync: () => getConfig<boolean>('GITHUB_AUTO_SYNC', true),
    getAll: () => getConfigByCategory('github'),
  },
}

export default config
