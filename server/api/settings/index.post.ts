// server/api/settings/index.post.ts
import { db } from '~/server/utils/db'

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
        OPENCLAW_API_ENDPOINT: { type: 'string', defaultValue: 'https://api.openclaw.dev' },
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
      },
    }

    const fieldConfig = categoryFields[category] || {}

    for (const [key, value] of Object.entries(settings)) {
      try {
        const config = fieldConfig[key] || { type: inferType(value) }

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

        await db.setting.upsert(key, {
          value: stringValue,
          type: config.type,
          category,
          description: config.description || null,
          isSensitive: config.isSensitive || false,
          isEncrypted: config.isSensitive || false,
          defaultValue: config.defaultValue ? String(config.defaultValue) : null,
        })

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
