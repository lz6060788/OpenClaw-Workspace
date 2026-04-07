// server/api/settings/reset.post.ts
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { category } = body

    if (!category) {
      throw createError({
        statusCode: 400,
        message: 'Category is required',
      })
    }

    // Define default values for each category
    const defaultValues: Record<string, Record<string, string>> = {
      openclaw: {
        OPENCLAW_API_KEY: '',
        OPENCLAW_API_ENDPOINT: 'http://127.0.0.1:18789',
        OPENCLAW_TIMEOUT: '30000',
        OPENCLAW_DEBUG: 'false',
      },
      vercel: {
        VERCEL_TOKEN: '',
        VERCEL_TEAM_ID: '',
        VERCEL_FRAMEWORK: 'vite',
        VERCEL_AUTO_DEPLOY: 'true',
      },
      github: {
        GITHUB_TOKEN: '',
        GITHUB_USERNAME: '',
        GITHUB_DEFAULT_BRANCH: 'main',
        GITHUB_AUTO_SYNC: 'true',
      },
    }

    const defaults = defaultValues[category]
    if (!defaults) {
      throw createError({
        statusCode: 400,
        message: `Unknown category: ${category}`,
      })
    }

    const results = {
      reset: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const [key, value] of Object.entries(defaults)) {
      try {
        const existing = await db.setting.findByKey(key)
        if (existing) {
          await db.setting.upsert(key, {
            value,
            type: existing.type,
            category,
            description: existing.description,
            isSensitive: existing.isSensitive,
            isEncrypted: false, // Reset values are not sensitive
            defaultValue: existing.defaultValue,
          })
          results.reset++
        }
      } catch (error: any) {
        results.failed++
        results.errors.push(`${key}: ${error.message}`)
      }
    }

    return {
      success: true,
      message: `Reset ${results.reset} settings to default values`,
      results,
    }
  } catch (error: any) {
    console.error('Reset settings error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to reset settings',
    })
  }
})
