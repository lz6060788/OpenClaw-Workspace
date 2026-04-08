// server/api/projects/[name]/save.post.ts
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { getProjectsDir } from '~/server/utils/projects'

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  const body = await readBody(event)
  const { path, content } = body

  if (!path || content === undefined) {
    throw createError({
      statusCode: 400,
      message: 'File path and content are required'
    })
  }

  const PROJECTS_DIR = await getProjectsDir()
  const filePath = join(PROJECTS_DIR, name!, path)

  try {
    await writeFile(filePath, content, 'utf-8')
    return { success: true }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to save file' })
  }
})
