// server/api/settings/migrate.post.ts
import { db } from '~/server/utils/db'
import { encrypt } from '~/server/utils/encryption'

/**
 * Migrate environment variables to database settings
 * This endpoint helps transition from env-based config to database-based config
 */

// Define environment variables to migrate for each category
const migrationConfig = {
  openclaw: [
    { key: 'OPENCLAW_API_KEY', type: 'string', isSensitive: true },
    { key: 'OPENCLAW_API_ENDPOINT', type: 'string', defaultValue: 'http://127.0.0.1:18789' },
    { key: 'OPENCLAW_TIMEOUT', type: 'number', defaultValue: '30000' },
    { key: 'OPENCLAW_DEBUG', type: 'boolean', defaultValue: 'false' },
  ],
  vercel: [
    { key: 'VERCEL_TOKEN', type: 'string', isSensitive: true },
    { key: 'VERCEL_TEAM_ID', type: 'string', defaultValue: '' },
    { key: 'VERCEL_FRAMEWORK', type: 'string', defaultValue: 'vite' },
    { key: 'VERCEL_AUTO_DEPLOY', type: 'boolean', defaultValue: 'true' },
  ],
  github: [
    { key: 'GITHUB_TOKEN', type: 'string', isSensitive: true },
    { key: 'GITHUB_USERNAME', type: 'string', defaultValue: '' },
    { key: 'GITHUB_DEFAULT_BRANCH', type: 'string', defaultValue: 'main' },
    { key: 'GITHUB_AUTO_SYNC', type: 'boolean', defaultValue: 'true' },
  ],
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event).catch(() => ({}))
    const { categories = Object.keys(migrationConfig), dryRun = false } = body || {}

    const results = {
      migrated: 0,
      skipped: 0,
      errors: [] as string[],
      details: [] as Array<{ key: string; category: string; action: string }>,
    }

    for (const category of categories) {
      const config = migrationConfig[category as keyof typeof migrationConfig]
      if (!config) {
        results.errors.push(`Invalid category: ${category}`)
        continue
      }

      for (const settingDef of config) {
        try {
          const envValue = process.env[settingDef.key]

          if (!envValue) {
            // Use default value if env var is not set
            if (settingDef.defaultValue) {
              results.details.push({
                key: settingDef.key,
                category,
                action: 'skipped (using default)',
              })
              results.skipped++

              // Still create with default value if it doesn't exist
              const existing = await db.setting.findByKey(settingDef.key)
              if (!existing && !dryRun) {
                await db.setting.upsert(settingDef.key, {
                  value: settingDef.defaultValue,
                  type: settingDef.type,
                  category,
                  description: null,
                  isSensitive: settingDef.isSensitive || false,
                  isEncrypted: false, // Default values don't need encryption
                  defaultValue: settingDef.defaultValue,
                })
              }
            } else {
              results.details.push({
                key: settingDef.key,
                category,
                action: 'skipped (no value)',
              })
              results.skipped++
            }
            continue
          }

          // Check if setting already exists
          const existing = await db.setting.findByKey(settingDef.key)

          if (existing) {
            results.details.push({
              key: settingDef.key,
              category,
              action: 'skipped (already exists)',
            })
            results.skipped++
            continue
          }

          if (!dryRun) {
            // Encrypt sensitive values
            let value = envValue
            let isEncrypted = false

            if (settingDef.isSensitive) {
              try {
                value = encrypt(envValue)
                isEncrypted = true
              } catch (error) {
                results.errors.push(`${settingDef.key}: encryption failed`)
                continue
              }
            }

            // Create setting in database
            await db.setting.upsert(settingDef.key, {
              value,
              type: settingDef.type,
              category,
              description: null,
              isSensitive: settingDef.isSensitive || false,
              isEncrypted,
              defaultValue: settingDef.defaultValue || null,
            })

            results.details.push({
              key: settingDef.key,
              category,
              action: 'migrated',
            })
            results.migrated++
          } else {
            results.details.push({
              key: settingDef.key,
              category,
              action: 'would migrate (dry run)',
            })
            results.migrated++
          }
        } catch (error: any) {
          results.errors.push(`${settingDef.key}: ${error.message}`)
        }
      }
    }

    return {
      success: true,
      message: dryRun
        ? `Dry run complete: ${results.migrated} would be migrated, ${results.skipped} skipped`
        : `Migration complete: ${results.migrated} migrated, ${results.skipped} skipped`,
      results,
    }
  } catch (error: any) {
    console.error('Migration error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Migration failed',
    })
  }
})
