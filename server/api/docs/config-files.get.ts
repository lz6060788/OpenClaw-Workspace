// server/api/docs/config-files.get.ts
import { readdir } from 'fs/promises'
import { join } from 'path'
import { resolveWorkspace } from '~/server/utils/docs'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const agentId = query.agentId as string | undefined

  const workspacePath = await resolveWorkspace(agentId)

  try {
    const files = await readdir(workspacePath)
    const mdFiles = files
      .filter(file => file.endsWith('.md'))
      .sort()
    return mdFiles
  } catch {
    return []
  }
})
