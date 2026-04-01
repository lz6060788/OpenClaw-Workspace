// server/api/chat/sessions/[projectId].post.ts
/**
 * 保存消息到指定项目的聊天会话
 */
import { config } from '~/server/utils/config'

export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'projectId')
  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: 'Project ID is required'
    })
  }

  const body = await readBody(event)
  const { message } = body

  if (!message) {
    throw createError({
      statusCode: 400,
      message: 'Message is required'
    })
  }

  const dataDir = await config.openclaw.getChatDataDir()
  const sessionFile = `${dataDir}/${projectId}.json`

  try {
    // 确保数据目录存在
    await ensureDir(dataDir)

    // 读取现有会话或创建新会话
    let session
    try {
      const data = await readFile(sessionFile, 'utf-8')
      session = JSON.parse(data)
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // 创建新会话
        session = {
          projectId,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      } else {
        throw error
      }
    }

    // 添加消息
    session.messages.push(message)
    session.updatedAt = new Date().toISOString()

    // 保存会话
    await writeFile(sessionFile, JSON.stringify(session, null, 2), 'utf-8')

    return { success: true, session }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Failed to save message: ${error.message}`
    })
  }
})

// 辅助函数
async function ensureDir(dir: string) {
  const { mkdir } = await import('fs/promises')
  try {
    await mkdir(dir, { recursive: true })
  } catch (error: any) {
    if (error.code !== 'EEXIST') throw error
  }
}

async function readFile(path: string, encoding: string) {
  const { readFile } = await import('fs/promises')
  return readFile(path, encoding)
}

async function writeFile(path: string, data: string, encoding: string) {
  const { writeFile } = await import('fs/promises')
  return writeFile(path, data, encoding)
}
