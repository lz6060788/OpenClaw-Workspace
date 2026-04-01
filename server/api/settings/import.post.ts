// server/api/settings/import.post.ts
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { config, merge = true, validate = true } = body

    // Validate import data structure
    if (!config || typeof config !== 'object') {
      throw createError({
        statusCode: 400,
        message: 'Invalid import data format',
      })
    }

    // If validate option is enabled, check settings structure
    if (validate && config.settings) {
      for (const setting of config.settings) {
        if (!setting.key || !setting.value || !setting.type || !setting.category) {
          throw createError({
            statusCode: 400,
            message: `Invalid setting structure: missing required fields`,
          })
        }

        // Validate category
        const validCategories = ['openclaw', 'vercel', 'github']
        if (!validCategories.includes(setting.category)) {
          throw createError({
            statusCode: 400,
            message: `Invalid category: ${setting.category}`,
          })
        }

        // Validate type
        const validTypes = ['string', 'number', 'boolean', 'json']
        if (!validTypes.includes(setting.type)) {
          throw createError({
            statusCode: 400,
            message: `Invalid type: ${setting.type}`,
          })
        }
      }
    }

    // Process import
    const settingsToImport = config.settings || []
    const results = {
      imported: 0,
      updated: 0,
      failed: 0,
      errors: [] as string[],
    }

    for (const setting of settingsToImport) {
      try {
        const existing = await db.setting.findByKey(setting.key)

        if (existing && !merge) {
          // Skip if not in merge mode and setting exists
          continue
        }

        await db.setting.upsert(setting.key, {
          value: setting.value,
          type: setting.type,
          category: setting.category,
          description: setting.description || null,
          isSensitive: setting.isSensitive || false,
          isEncrypted: setting.isSensitive || false, // Auto-encrypt sensitive settings
          defaultValue: setting.defaultValue || null,
        })

        if (existing) {
          results.updated++
        } else {
          results.imported++
        }
      } catch (error: any) {
        results.failed++
        results.errors.push(`${setting.key}: ${error.message}`)
      }
    }

    return {
      success: true,
      message: `Settings imported: ${results.imported} new, ${results.updated} updated`,
      results,
    }
  } catch (error: any) {
    console.error('Import settings error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to import settings',
    })
  }
})
