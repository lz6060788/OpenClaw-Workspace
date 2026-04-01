// server/api/chat/sessions/[projectId].get.ts
/**
 * 获取指定项目的聊天会话历史
 */
export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'projectId')
  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: 'Project ID is required'
    })
  }

  const dataDir = useRuntimeConfig().chatDataDir || '/tmp/openclaw-chat-data'
  const sessionFile = `${dataDir}/${projectId}.json`

  try {
    // 确保数据目录存在
    await ensureDir(dataDir)

    // 读取会话文件
    const data = await readFile(sessionFile, 'utf-8')
    return JSON.parse(data)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // 文件不存在，返回空会话
      return {
        projectId,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    }
    throw createError({
      statusCode: 500,
      message: `Failed to read session: ${error.message}`
    })
  }
})

// 辅助函数：确保目录存在
async function ensureDir(dir: string) {
  const { mkdir } = await import('fs/promises')
  try {
    await mkdir(dir, { recursive: true })
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error
    }
  }
}

// 辅助函数：读取文件
async function readFile(path: string, encoding: string) {
  const { readFile } = await import('fs/promises')
  return readFile(path, encoding)
}
