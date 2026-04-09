// server/api/openclaw/chat.post.ts
import { config as dbConfig } from '~/server/utils/config'
import { db } from '~/server/utils/db'
import { buildProjectContext, getProjectLocalPath } from '~/server/utils/project-context'

export default defineEventHandler(async (event) => {
  const gatewayUrl = await dbConfig.openclaw.getGatewayUrl()
  const gatewayToken = await dbConfig.openclaw.getGatewayToken()
  const globalAgentId = await dbConfig.openclaw.getAgentId()

  try {
    const body = await readBody(event)
    const { projectId, projectName, messages, stream } = body

    // 按项目解析 Agent ID：项目级覆盖 > 全局配置
    let agentId = globalAgentId
    let projectContextMessage = ''

    if (projectId) {
      const project = await db.project.findByGithubId(Number(projectId))
      if (project?.openclawAgentId) {
        agentId = project.openclawAgentId
      }

      // 构建项目上下文 system 消息
      if (project) {
        const localPath = await getProjectLocalPath(project.owner, project.name)
        projectContextMessage = buildProjectContext({
          projectName: project.fullName,
          localPath,
          gitUrl: `https://github.com/${project.fullName}`,
          defaultBranch: project.defaultBranch,
          isPrivate: project.isPrivate,
          description: project.description,
          framework: project.framework,
          agentId,
        })
      }
    }

    // 使用项目名称作为 user 字段实现会话隔离
    const user = projectName || (projectId ? String(projectId) : 'workspace')

    // 构建最终消息数组：如果有项目上下文，在最前面插入 system 消息
    const finalMessages = messages || []
    if (projectContextMessage && !finalMessages.some((m: any) => m.role === 'system')) {
      finalMessages.unshift({ role: 'system', content: projectContextMessage })
    }

    const response = await $fetch.raw(`${gatewayUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gatewayToken}`,
        'x-openclaw-agent-id': agentId
      },
      body: {
        model: `openclaw:${agentId}`,
        messages: finalMessages,
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
