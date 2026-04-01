// server/api/chat/sessions/index.get.ts
/**
 * 获取所有聊天会话列表
 */
import { config } from '~/server/utils/config'

export default defineEventHandler(async (event) => {
  const dataDir = await config.openclaw.getChatDataDir()

  try {
    // 确保目录存在
    await ensureDir(dataDir)

    // 读取目录中的所有会话文件
    const { readdir } = await import('fs/promises')
    const files = await readdir(dataDir)
    const sessionFiles = files.filter(f => f.endsWith('.json'))

    // 读取所有会话
    const sessions = []
    for (const file of sessionFiles) {
      try {
        const { readFile } = await import('fs/promises')
        const data = await readFile(`${dataDir}/${file}`, 'utf-8')
        sessions.push(JSON.parse(data))
      } catch (error) {
        console.error(`Failed to read session file ${file}:`, error)
      }
    }

    // 按更新时间排序
    sessions.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )

    return sessions
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: `Failed to list sessions: ${error.message}`
    })
  }
})

async function ensureDir(dir: string) {
  const { mkdir } = await import('fs/promises')
  try {
    await mkdir(dir, { recursive: true })
  } catch (error: any) {
    if (error.code !== 'EEXIST') throw error
  }
}
