// server/api/openclaw/agents.get.ts
import { config as dbConfig } from '~/server/utils/config'

export default defineEventHandler(async (event) => {
  const gatewayUrl = await dbConfig.openclaw.getGatewayUrl()
  const gatewayToken = await dbConfig.openclaw.getGatewayToken()

  try {
    // OpenClaw Gateway uses OpenAI-compatible /v1/models API
    // Model IDs are in format "openclaw/<agent_id>"
    const response = await $fetch<{ data: Array<{ id: string; object: string; owned_by: string }> }>(
      `${gatewayUrl}/v1/models`,
      {
        headers: {
          'Authorization': `Bearer ${gatewayToken}`,
        }
      }
    )

    const agents = (response.data || [])
      .filter((model) => model.id.startsWith('openclaw/'))
      .map((model) => {
        const agentId = model.id.replace('openclaw/', '')
        return {
          value: agentId,
          label: agentId
        }
      })

    return { success: true, agents }
  } catch (error: any) {
    console.warn('Failed to fetch agent list from gateway:', error.message)
    return { success: false, agents: [], error: error.message }
  }
})
