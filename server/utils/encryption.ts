// server/utils/encryption.ts
import crypto from 'crypto'

/**
 * Encryption utility for sensitive settings
 * Uses AES-256-GCM for authenticated encryption
 */

const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16

/**
 * Get or generate encryption key from environment
 */
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY || process.env.OPENCLAW_ENCRYPTION_KEY

  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is required for sensitive data encryption')
  }

  // Use HKDF to derive a proper key from the environment variable
  return crypto.pbkdf2Sync(key, 'openclaw-settings', 100000, KEY_LENGTH, 'sha256')
}

/**
 * Encrypt sensitive data
 * @param plaintext - The data to encrypt
 * @returns Encrypted string with IV and auth tag
 */
export function encrypt(plaintext: string): string {
  try {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(plaintext, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag()

    // Format: iv:authTag:encrypted
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
  } catch (error) {
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Decrypt sensitive data
 * @param encrypted - The encrypted string
 * @returns Decrypted plaintext
 */
export function decrypt(encrypted: string): string {
  try {
    const key = getEncryptionKey()
    const parts = encrypted.split(':')

    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format')
    }

    const iv = Buffer.from(parts[0], 'hex')
    const authTag = Buffer.from(parts[1], 'hex')
    const ciphertext = parts[2]

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Check if encryption is available
 * @returns true if encryption key is configured
 */
export function isEncryptionAvailable(): boolean {
  try {
    getEncryptionKey()
    return true
  } catch {
    return false
  }
}

/**
 * Encrypt object fields that are marked as sensitive
 * @param obj - Object to encrypt
 * @param sensitiveFields - Array of field names to encrypt
 * @returns Object with encrypted values
 */
export function encryptObject<T extends Record<string, any>>(
  obj: T,
  sensitiveFields: (keyof T)[]
): T {
  const result = { ...obj }

  for (const field of sensitiveFields) {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = encrypt(result[field] as string) as T[keyof T]
    }
  }

  return result
}

/**
 * Decrypt object fields that were encrypted
 * @param obj - Object to decrypt
 * @param encryptedFields - Array of field names to decrypt
 * @returns Object with decrypted values
 */
export function decryptObject<T extends Record<string, any>>(
  obj: T,
  encryptedFields: (keyof T)[]
): T {
  const result = { ...obj }

  for (const field of encryptedFields) {
    if (result[field] && typeof result[field] === 'string') {
      try {
        result[field] = decrypt(result[field] as string) as T[keyof T]
      } catch {
        // If decryption fails, keep the original value
        // This handles cases where data isn't actually encrypted
      }
    }
  }

  return result
}
