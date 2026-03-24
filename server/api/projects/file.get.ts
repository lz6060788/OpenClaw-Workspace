// server/api/projects/file.get.ts
import { readFile } from 'fs/promises'
import { join } from 'path'

const PROJECTS_DIR = join(process.cwd(), 'github-projects')

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const project = query.project as string
  const path = query.path as string

  if (!project || !path) {
    throw createError({
      statusCode: 400,
      message: 'Project and path parameters are required'
    })
  }

  const filePath = join(PROJECTS_DIR, project, path)

  try {
    const content = await readFile(filePath, 'utf-8')
    return content
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw createError({ statusCode: 404, message: 'File not found' })
    }
    if (error.code === 'EISDIR') {
      throw createError({ statusCode: 400, message: 'Path is a directory' })
    }
    throw createError({ statusCode: 500, message: 'Failed to read file' })
  }
})
