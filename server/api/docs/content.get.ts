// server/api/docs/content.get.ts
import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const doc = query.doc as string

  if (!doc) {
    throw createError({
      statusCode: 400,
      message: 'Doc parameter is required'
    })
  }

  let filePath: string

  if (doc.startsWith('skills/')) {
    // Skills 文档
    const skillName = doc.replace('skills/', '')
    const openclawPath = join(process.env.HOME || '', '.nvm/versions/node')
    const nodeVersions = await readdir(openclawPath)

    for (const version of nodeVersions) {
      const skillDocPath = join(openclawPath, version, 'lib/node_modules/openclaw/skills', skillName, 'SKILL.md')
      try {
        const content = await readFile(skillDocPath, 'utf-8')
        return content
      } catch {
        // 继续尝试下一个版本
      }
    }

    throw createError({ statusCode: 404, message: 'Skill documentation not found' })
  } else if (doc.startsWith('memory/')) {
    // Memory 文件
    const fileName = doc.replace('memory/', '')
    const workspacePath = join(process.env.HOME || '', '.openclaw/workspace')
    filePath = join(workspacePath, 'memory', fileName)
  } else {
    // 配置文件
    const workspacePath = join(process.env.HOME || '', '.openclaw/workspace')
    filePath = join(workspacePath, doc)
  }

  try {
    const content = await readFile(filePath, 'utf-8')
    return content
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw createError({ statusCode: 404, message: 'Document not found' })
    }
    throw createError({ statusCode: 500, message: 'Failed to read document' })
  }
})
