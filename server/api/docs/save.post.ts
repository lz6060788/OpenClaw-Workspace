// server/api/docs/save.post.ts
import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { doc, content } = body

  if (!doc || content === undefined) {
    throw createError({
      statusCode: 400,
      message: 'Doc and content are required'
    })
  }

  let filePath: string

  if (doc.startsWith('memory/')) {
    const fileName = doc.replace('memory/', '')
    const workspacePath = join(process.env.HOME || '', '.openclaw/workspace')
    filePath = join(workspacePath, 'memory', fileName)
  } else {
    const workspacePath = join(process.env.HOME || '', '.openclaw/workspace')
    filePath = join(workspacePath, doc)
  }

  try {
    await writeFile(filePath, content, 'utf-8')
    return { success: true }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to save document' })
  }
})
