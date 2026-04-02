// server/api/projects/clone.post.ts
import { mkdir } from 'fs/promises'
import { join } from 'path'
import { execSync } from 'child_process'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { fullName, owner, name } = body

  if (!fullName || !owner || !name) {
    throw createError({
      statusCode: 400,
      message: '缺少必要参数'
    })
  }

  // Get GitHub projects path from database
  const pathSetting = await db.setting.findByKey('GITHUB_PROJECTS_PATH')
  const PROJECTS_DIR = pathSetting?.value || join(process.cwd(), 'github-projects')

  if (!pathSetting?.value) {
    throw createError({
      statusCode: 400,
      message: 'GitHub 项目路径未配置，请在设置中配置'
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

