// server/api/docs/save.post.ts
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { resolveWorkspace } from '~/server/utils/docs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { doc, content, agentId } = body

  if (!doc || content === undefined) {
    throw createError({
      statusCode: 400,
      message: 'Doc and content are required'
    })
  }

  let filePath: string
  const workspacePath = await resolveWorkspace(agentId)

  if (doc.startsWith('memory/')) {
    const fileName = doc.replace('memory/', '')
    filePath = join(workspacePath, 'memory', fileName)
  } else {
    filePath = join(workspacePath, doc)
  }

  try {
    await writeFile(filePath, content, 'utf-8')
    return { success: true }
  } catch (error: any) {
    throw createError({ statusCode: 500, message: 'Failed to save document' })
  }
})
