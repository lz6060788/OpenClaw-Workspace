// server/api/settings/export.get.ts
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const categories = query.categories?.toString().split(',') || ['openclaw', 'vercel', 'github']
    const includeSensitive = query.sensitive === 'true'

    // Fetch settings by categories
    const settings = await db.setting.findAll({
      category: { in: categories },
    })

    // Filter out sensitive settings if requested
    const filteredSettings = settings.map(setting => {
      if (setting.isSensitive && !includeSensitive) {
        return {
          key: setting.key,
          value: '***REDACTED***',
          type: setting.type,
          category: setting.category,
          description: setting.description,
          defaultValue: setting.defaultValue,
        }
      }
      return {
        key: setting.key,
        value: setting.value,
        type: setting.type,
        category: setting.category,
        description: setting.description,
        defaultValue: setting.defaultValue,
      }
    })

    // Add metadata
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      categories,
      includeSensitive,
      settings: filteredSettings,
    }

    return exportData
  } catch (error) {
    console.error('Export settings error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to export settings',
    })
  }
})
