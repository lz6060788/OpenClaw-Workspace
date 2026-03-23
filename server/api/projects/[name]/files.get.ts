// server/api/projects/[name]/files.get.ts
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

const PROJECTS_DIR = join(process.cwd(), 'github-projects')

async function getFileTree(dir: string, relativePath = ''): Promise<any[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const result = []

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    if (entry.name === 'node_modules') continue
    if (entry.name === '.git') continue

    const fullPath = join(dir, entry.name)
    const relPath = join(relativePath, entry.name)

    if (entry.isDirectory()) {
      result.push({
        name: entry.name,
        path: relPath,
        isDirectory: true,
        children: await getFileTree(fullPath, relPath)
      })
    } else {
      result.push({
        name: entry.name,
        path: relPath,
        isDirectory: false
      })
    }
  }

  return result
}

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  const projectPath = join(PROJECTS_DIR, name!)

  try {
    return await getFileTree(projectPath)
  } catch (error) {
    throw createError({ statusCode: 404, message: 'Project not found' })
  }
})
