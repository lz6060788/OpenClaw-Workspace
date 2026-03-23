// server/api/docs/memory.get.ts
import { readdir } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  const workspacePath = join(process.env.HOME || '', '.openclaw/workspace')
  const memoryPath = join(workspacePath, 'memory')

  try {
    const files = await readdir(memoryPath)
    return files
      .filter(file => file.endsWith('.md'))
      .sort()
      .reverse()
  } catch (error) {
    return []
  }
})
