// server/api/projects/[name]/save.post.ts
import { writeFile } from 'fs/promises'
import { join } from 'path'

const PROJECTS_DIR = join(process.cwd(), 'github-projects')

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

  const filePath = join(PROJECTS_DIR, name!, path)

  try {
    await writeFile(filePath, content, 'utf-8')
    return { success: true }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to save file' })
  }
})
