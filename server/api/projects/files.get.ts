// server/api/projects/files.get.ts
import { readdir } from 'fs/promises'
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
  const query = getQuery(event)
  const project = query.project as string

  if (!project) {
    throw createError({ statusCode: 400, message: 'Project parameter is required' })
  }

  const projectPath = join(PROJECTS_DIR, project)

  try {
    return await getFileTree(projectPath)
  } catch (error) {
    throw createError({ statusCode: 404, message: 'Project not found' })
  }
})
