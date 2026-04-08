// server/api/projects/save.post.ts
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { getProjectsDir } from '~/server/utils/projects'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { project, path, content } = body

  if (!project || !path) {
    throw createError({
      statusCode: 400,
      message: 'Project and path parameters are required'
    })
  }

  const PROJECTS_DIR = await getProjectsDir()
  const filePath = join(PROJECTS_DIR, project, path)

  try {
    await writeFile(filePath, content, 'utf-8')
    return { success: true }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: error.message || 'Failed to save file' })
  }
})
