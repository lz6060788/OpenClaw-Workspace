// server/api/projects/[name]/file.get.ts
import { readFile } from 'fs/promises'
import { join } from 'path'
import { getProjectsDir } from '~/server/utils/projects'

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  const query = getQuery(event)
  const path = query.path as string

  if (!path) {
    throw createError({
      statusCode: 400,
      message: 'File path is required'
    })
  }

  const PROJECTS_DIR = await getProjectsDir()
  const filePath = join(PROJECTS_DIR, name!, path)

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
