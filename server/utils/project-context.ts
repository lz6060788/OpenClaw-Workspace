import { join } from 'path'
import { getProjectsDir } from './projects'

export interface ProjectContextData {
  projectName: string
  localPath: string
  gitUrl: string
  defaultBranch: string
  isPrivate: boolean
  description?: string | null
  framework?: string | null
  agentId: string
}

export function buildProjectContext(ctx: ProjectContextData): string {
  const lines = [
    '你正在协助用户开发一个 GitHub 项目，以下是项目信息：',
    '',
    `- 项目名称: ${ctx.projectName}`,
    `- Git 地址: ${ctx.gitUrl}`,
    `- 本地路径: ${ctx.localPath}`,
    `- 默认分支: ${ctx.defaultBranch}`,
    `- 可见性: ${ctx.isPrivate ? '私有仓库' : '公开仓库'}`,
  ]

  if (ctx.description) lines.push(`- 项目描述: ${ctx.description}`)
  if (ctx.framework) lines.push(`- 技术框架: ${ctx.framework}`)
  lines.push(`- 当前 Agent: ${ctx.agentId}`)

  return lines.join('\n')
}

export async function getProjectLocalPath(owner: string, name: string): Promise<string> {
  const projectsDir = await getProjectsDir()
  return join(projectsDir, owner, name)
}
