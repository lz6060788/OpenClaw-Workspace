// server/api/docs/skills.get.ts
import { readdir } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  const openclawPath = join(process.env.HOME || '', '.nvm/versions/node')

  try {
    // 查找所有 Node 版本下的 OpenClaw skills
    const nodeVersions = await readdir(openclawPath)
    const skills = new Set<string>()

    for (const version of nodeVersions) {
      const skillsPath = join(openclawPath, version, 'lib/node_modules/openclaw/skills')
      try {
        const skillDirs = await readdir(skillsPath)
        for (const skill of skillDirs) {
          // 跳过隐藏文件和系统文件
          if (!skill.startsWith('.') && skill !== 'node_modules') {
            skills.add(skill)
          }
        }
      } catch {
        // 目录不存在，跳过
      }
    }

    return Array.from(skills).sort()
  } catch (error) {
    return []
  }
})
