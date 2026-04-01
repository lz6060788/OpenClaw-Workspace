// server/api/settings/index.get.ts
import { db } from '~/server/utils/db'
import { decrypt } from '~/server/utils/encryption'

/**
 * Mask sensitive value for display
 * Format: first 4 chars + **** + last 4 chars
 */
function maskSensitiveValue(value: string): string {
  if (value.length <= 8) {
    return '****'
  }
  return `${value.substring(0, 4)}****${value.substring(value.length - 4)}`
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const category = query.category?.toString()

    if (category) {
      // Get settings by category
      const settings = await db.setting.findByCategory(category)

      // Convert array to key-value object with proper handling
      const settingsObject: Record<string, any> = {}
      for (const setting of settings) {
        let value = setting.value

        // Handle encrypted sensitive data
        if (setting.isEncrypted && setting.isSensitive) {
          try {
            value = decrypt(setting.value)
          } catch (error) {
            // If decryption fails, keep the encrypted value
            console.warn(`Failed to decrypt ${setting.key}, using encrypted value`)
          }
        }

        // Mask sensitive values for display
        if (setting.isSensitive) {
          value = maskSensitiveValue(String(value))
        } else {
          // Convert non-sensitive values based on type
          switch (setting.type) {
            case 'number':
              value = Number(value)
              break
            case 'boolean':
              value = value === 'true'
              break
            case 'json':
              try {
                value = JSON.parse(String(value))
              } catch {
                value = String(value)
              }
              break
            default:
              value = String(value)
          }
        }

        settingsObject[setting.key] = value
      }

      return {
        success: true,
        settings: settingsObject,
      }
    } else {
      // Get all settings and group by category
      const allSettings = await db.setting.findAll()

      // Group by category
      const groupedSettings: Record<string, Record<string, any>> = {
        openclaw: {},
        vercel: {},
        github: {},
      }

      for (const setting of allSettings) {
        let value = setting.value

        // Handle encrypted sensitive data
        if (setting.isEncrypted && setting.isSensitive) {
          try {
            value = decrypt(setting.value)
          } catch (error) {
            console.warn(`Failed to decrypt ${setting.key}, using encrypted value`)
          }
        }

        // Mask sensitive values for display
        if (setting.isSensitive) {
          value = maskSensitiveValue(String(value))
        } else {
          // Convert non-sensitive values based on type
          switch (setting.type) {
            case 'number':
              value = Number(value)
              break
            case 'boolean':
              value = value === 'true'
              break
            case 'json':
              try {
                value = JSON.parse(String(value))
              } catch {
                value = String(value)
              }
              break
            default:
              value = String(value)
          }
        }

        // Add to appropriate category
        if (groupedSettings[setting.category]) {
          groupedSettings[setting.category][setting.key] = value
        }
      }

      return {
        success: true,
        settings: groupedSettings,
      }
    }
  } catch (error) {
    console.error('Get settings error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get settings',
    })
  }
})
