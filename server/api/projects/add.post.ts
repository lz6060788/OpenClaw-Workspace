// server/api/projects/add.post.ts
import { mkdir } from 'fs/promises'
import { join } from 'path'

const PROJECTS_DIR = join(process.cwd(), 'github-projects')

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name } = body

  if (!name || typeof name !== 'string') {
    throw createError({
      statusCode: 400,
      message: 'Project name is required'
    })
  }

  // 验证项目名称
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    throw createError({
      statusCode: 400,
      message: 'Project name can only contain letters, numbers, hyphens and underscores'
    })
  }

  const projectPath = join(PROJECTS_DIR, name)

  try {
    await mkdir(projectPath, { recursive: true })
    return { success: true, path: projectPath }
  } catch (error: any) {
    if (error.code === 'EEXIST') {
      throw createError({
        statusCode: 409,
        message: 'Project already exists'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to create project'
    })
  }
})
