/**
 * POST /api/settings/github-path/validate
 *
 * Validate GitHub projects path
 */

import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  const { path } = await readBody(event)

  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Path is required'
    })
  }

  // Resolve to absolute path
  const absolutePath = resolve(path)

  // Check if path exists
  const exists = existsSync(absolutePath)

  if (!exists) {
    // Try to create the directory
    try {
      await mkdir(absolutePath, { recursive: true })
      return {
        valid: true,
        path: absolutePath,
        message: 'Directory created successfully'
      }
    } catch (error: any) {
      return {
        valid: false,
        path: absolutePath,
        message: `Cannot create directory: ${error.message}`
      }
    }
  }

  // Check if path is a directory
  const stat = await import('fs/promises').then(m => m.stat(absolutePath))
  if (!stat.isDirectory()) {
    return {
      valid: false,
      path: absolutePath,
      message: 'Path is not a directory'
    }
  }

  // Check if directory is writable
  try {
    const testFile = resolve(absolutePath, '.write-test')
    await import('fs/promises').then(m => m.writeFile(testFile, 'test'))
    await import('fs/promises').then(m => m.unlink(testFile))
  } catch (error: any) {
    return {
      valid: false,
      path: absolutePath,
      message: `Directory is not writable: ${error.message}`
    }
  }

  return {
    valid: true,
    path: absolutePath,
    message: 'Path is valid'
  }
})
