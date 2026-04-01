// server/api/openclaw/chat.post.ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const gatewayUrl = config.openclawGatewayUrl || 'http://127.0.0.1:18789'
  const gatewayToken = config.openclawGatewayToken || ''
  const agentId = config.openclawAgentId || 'main'

  try {
    const body = await readBody(event)

    const response = await $fetch.raw(`${gatewayUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gatewayToken}`,
        'x-openclaw-agent-id': agentId
      },
      body: {
        model: `openclaw:${agentId}`,
        messages: body.messages || [],
        stream: body.stream || false,
        user: 'workspace'
      },
      responseType: body.stream ? 'stream' : 'json'
    })

    // 如果是流式响应，直接转发
    if (body.stream) {
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
