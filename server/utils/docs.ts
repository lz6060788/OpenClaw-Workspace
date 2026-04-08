// server/utils/docs.ts
import { readFile } from 'fs/promises'
import { join } from 'path'

interface AgentInfo {
  id: string
  workspace: string
}

// 读取 openclaw.json 中 agent 列表
export async function getAgentList(): Promise<AgentInfo[]> {
  const configPath = join(process.env.HOME || '', '.openclaw/openclaw.json')
  try {
    const raw = await readFile(configPath, 'utf-8')
    const config = JSON.parse(raw)
    const defaultWorkspace = config.agents?.defaults?.workspace || join(process.env.HOME || '', '.openclaw/workspace')
    const agentList = config.agents?.list || []
    return agentList.map((agent: any) => ({
      id: agent.id,
      workspace: agent.workspace || defaultWorkspace,
    }))
  } catch {
    return [{ id: 'main', workspace: join(process.env.HOME || '', '.openclaw/workspace') }]
  }
}

// 根据 agentId 解析工作空间路径
export async function resolveWorkspace(agentId?: string): Promise<string> {
  if (!agentId) {
    // 默认使用 main agent 的 workspace
    const agents = await getAgentList()
    const main = agents.find(a => a.id === 'main')
    return main?.workspace || join(process.env.HOME || '', '.openclaw/workspace')
  }
  const agents = await getAgentList()
  const agent = agents.find(a => a.id === agentId)
  return agent?.workspace || join(process.env.HOME || '', '.openclaw/workspace')
}
