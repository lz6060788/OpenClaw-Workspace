// server/api/docs/agents.get.ts
import { getAgentList } from '~/server/utils/docs'

export default defineEventHandler(async () => {
  return await getAgentList()
})
