// server/api/projects/clone.post.ts
import { mkdir } from 'fs/promises'
import { join } from 'path'
import { execSync } from 'child_process'

const PROJECTS_DIR = join(process.cwd(), 'github-projects')

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { fullName, owner, name } = body
  
  if (!fullName || !owner || !name) {
    throw createError({
      statusCode: 400,
      message: '缺少必要参数'
    })
  }
  
  const localPath = join(PROJECTS_DIR, fullName)
  const gitUrl = `https://github.com/${fullName}.git`
  
  try {
    // 确保目录存在
    await mkdir(PROJECTS_DIR, { recursive: true })
    
    // 检查是否已存在
    try {
      execSync(`git -C "${localPath}" rev-parse --git-dir`, { stdio: 'ignore' })
      // 已存在，执行 pull
      execSync(`git -C "${localPath}" pull origin main`, { 
        stdio: 'pipe',
        encoding: 'utf-8'
      })
      return { success: true, action: 'pull', message: '项目更新成功' }
    } catch {
      // 不存在，执行 clone
      execSync(`git clone "${gitUrl}" "${localPath}"`, { 
        stdio: 'pipe',
        encoding: 'utf-8'
      })
      return { success: true, action: 'clone', message: '项目克隆成功' }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || '操作失败'
    })
  }
})
