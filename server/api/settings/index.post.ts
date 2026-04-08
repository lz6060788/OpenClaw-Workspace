// server/api/settings/index.post.ts
import { db } from '~/server/utils/db'
import { encrypt, isEncryptionAvailable, initEncryptionKey } from '~/server/utils/encryption'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { category, settings } = body

    if (!category || !settings) {
      throw createError({
        statusCode: 400,
        message: 'Category and settings are required',
      })
    }

    if (typeof settings !== 'object' || Array.isArray(settings)) {
      throw createError({
        statusCode: 400,
        message: 'Settings must be an object',
      })
    }

    const results = {
      updated: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Define field configurations for each category
    const categoryFields: Record<string, Record<string, any>> = {
      openclaw: {
        OPENCLAW_API_KEY: { type: 'string', isSensitive: true },
        OPENCLAW_API_ENDPOINT: { type: 'string', defaultValue: 'http://127.0.0.1:18789' },
        OPENCLAW_TIMEOUT: { type: 'number', defaultValue: 30000 },
        OPENCLAW_DEBUG: { type: 'boolean', defaultValue: false },
      },
      vercel: {
        VERCEL_TOKEN: { type: 'string', isSensitive: true },
        VERCEL_TEAM_ID: { type: 'string', defaultValue: '' },
        VERCEL_FRAMEWORK: { type: 'string', defaultValue: 'vite' },
        VERCEL_AUTO_DEPLOY: { type: 'boolean', defaultValue: true },
      },
      github: {
        GITHUB_TOKEN: { type: 'string', isSensitive: true },
        GITHUB_USERNAME: { type: 'string', defaultValue: '' },
        GITHUB_DEFAULT_BRANCH: { type: 'string', defaultValue: 'main' },
        GITHUB_AUTO_SYNC: { type: 'boolean', defaultValue: true },
        GITHUB_PROJECTS_PATH: { type: 'string', defaultValue: '' },
      },
      system: {
        ENCRYPTION_KEY: { type: 'string', isSensitive: true, description: '加密密钥，用于保护敏感配置（Token 等）。首次配置后不可更改，否则已加密的数据将无法解密。' },
      },
    }

    const fieldConfig = categoryFields[category] || {}

    for (const [key, value] of Object.entries(settings)) {
      try {
        const config = fieldConfig[key] || { type: inferType(value) }
        const isSensitive = config.isSensitive || false

        // Skip masked sensitive values (contains ****) — user didn't change them
        if (isSensitive && typeof value === 'string' && value.includes('****')) {
          continue
        }

        // Convert value to string based on type
        let stringValue: string
        switch (config.type) {
          case 'number':
            stringValue = String(Number(value))
            break
          case 'boolean':
            stringValue = String(Boolean(value))
            break
          case 'json':
            stringValue = typeof value === 'string' ? value : JSON.stringify(value)
            break
          default:
            stringValue = String(value)
        }

        // Encrypt sensitive values if encryption is available
        // Exception: ENCRYPTION_KEY itself is stored as plain text
        const isEncryptionKey = key === 'ENCRYPTION_KEY'
        let storeValue = stringValue
        let isEncrypted = false
        if (isSensitive && !isEncryptionKey && stringValue && isEncryptionAvailable()) {
          storeValue = encrypt(stringValue)
          isEncrypted = true
        }

        await db.setting.upsert(key, {
          value: storeValue,
          type: config.type,
          category,
          description: config.description || null,
          isSensitive,
          isEncrypted,
          defaultValue: config.defaultValue ? String(config.defaultValue) : null,
        })

        // Refresh encryption key cache after saving ENCRYPTION_KEY
        if (isEncryptionKey) {
          await initEncryptionKey()
        }

        results.updated++
      } catch (error: any) {
        results.failed++
        results.errors.push(`${key}: ${error.message}`)
      }
    }

    return {
      success: true,
      message: `Settings updated: ${results.updated}`,
      results,
    }
  } catch (error: any) {
    console.error('Save settings error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to save settings',
    })
  }
})

// Helper function to infer type from value
function inferType(value: any): string {
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'object') return 'json'
  return 'string'
}
