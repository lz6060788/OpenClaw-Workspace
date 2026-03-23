// server/api/projects/list.get.ts
import { readdir } from 'fs/promises'
import { join } from 'path'

const PROJECTS_DIR = join(process.cwd(), 'github-projects')

export default defineEventHandler(async () => {
  try {
    await readdir(PROJECTS_DIR, { recursive: true })
  } catch {
    // 目录不存在，创建它
    const { mkdir } = await import('fs/promises')
    await mkdir(PROJECTS_DIR, { recursive: true })
  }

  try {
    const entries = await readdir(PROJECTS_DIR, { withFileTypes: true })
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => ({
        name: entry.name,
        path: join(PROJECTS_DIR, entry.name),
      }))
  } catch (error) {
    return []
  }
})
