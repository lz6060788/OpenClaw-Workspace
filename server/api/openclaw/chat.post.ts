// server/api/openclaw/chat.post.ts
import { config as dbConfig } from '~/server/utils/config'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const gatewayUrl = await dbConfig.openclaw.getGatewayUrl()
  const gatewayToken = await dbConfig.openclaw.getGatewayToken()
  const globalAgentId = await dbConfig.openclaw.getAgentId()

  try {
    const body = await readBody(event)
    const { projectId, projectName, messages, stream } = body

    // 按项目解析 Agent ID：项目级覆盖 > 全局配置
    let agentId = globalAgentId
    if (projectId) {
      const project = await db.project.findById(Number(projectId))
      if (project?.openclawAgentId) {
        agentId = project.openclawAgentId
      }
    }

    // 使用项目名称作为 user 字段实现会话隔离
    const user = projectName || (projectId ? String(projectId) : 'workspace')

    const response = await $fetch.raw(`${gatewayUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gatewayToken}`,
        'x-openclaw-agent-id': agentId
      },
      body: {
        model: `openclaw:${agentId}`,
        messages: messages || [],
        stream: stream || false,
        user
      },
      responseType: stream ? 'stream' : 'json'
    })

    // 如果是流式响应，直接转发
    if (stream) {
      setHeader(event, 'Content-Type', 'text/event-stream')
      setHeader(event, 'Cache-Control', 'no-cache')
      setHeader(event, 'Connection', 'keep-alive')
      return response
    }

    return response._data
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'OpenClaw gateway error'
    })
  }
})
