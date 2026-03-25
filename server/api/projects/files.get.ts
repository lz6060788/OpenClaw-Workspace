// server/api/projects/files.get.ts
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

const PROJECTS_DIR = join(process.cwd(), 'github-projects')

// 目录黑名单
const DIR_BLACKLIST = new Set([
  'node_modules',
  '.git',
  '.idea',
  '.vscode',
  'dist',
  'build',
  '.output',
  '.nuxt',
  'coverage',
  '.next',
  '.turbo',
  'tmp',
  'temp'
])

// 文件黑名单（按扩展名）
const FILE_EXT_BLACKLIST = new Set([
  '.log',
  '.lock',
  '.pid',
  '.DS_Store'
])

async function getFileTree(dir: string, relativePath = ''): Promise<any[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const result = []

  for (const entry of entries) {
    // 跳过黑名单目录
    if (DIR_BLACKLIST.has(entry.name)) continue

    // 跳过隐藏文件（除了特定配置文件）
    if (entry.name.startsWith('.') && !['.env', '.gitignore', '.npmrc', '.nvmrc', '.editorconfig'].includes(entry.name)) {
      continue
    }

    const fullPath = join(dir, entry.name)
    const relPath = relativePath ? join(relativePath, entry.name) : entry.name

    try {
      const stats = await stat(fullPath)
      const ext = entry.name.includes('.') ? '.' + entry.name.split('.').pop() : ''

      // 跳过黑名单文件类型
      if (!entry.isDirectory() && FILE_EXT_BLACKLIST.has(ext)) continue

      if (entry.isDirectory()) {
        result.push({
          name: entry.name,
          path: relPath.replace(/\\/g, '/'),
          isDirectory: true,
          // 不再预加载子项，改为懒加载
          children: []
        })
      } else {
        result.push({
          name: entry.name,
          path: relPath.replace(/\\/g, '/'),
          isDirectory: false,
          size: stats.size
        })
      }
    } catch (error) {
      // 跳过无法访问的文件
      continue
    }
  }

  return result.sort((a, b) => {
    // 目录排在前面
    if (a.isDirectory && !b.isDirectory) return -1
    if (!a.isDirectory && b.isDirectory) return 1
    return a.name.localeCompare(b.name, 'zh-CN')
  })
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const project = query.project as string
  const path = (query.path as string || '').replace(/^\//, '')

  if (!project) {
    throw createError({ statusCode: 400, message: 'Project parameter is required' })
  }

  const projectPath = join(PROJECTS_DIR, project, path)

  try {
    const files = await getFileTree(projectPath, path)
    return files
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw createError({ statusCode: 404, message: 'Directory not found' })
    }
    throw createError({ statusCode: 500, message: 'Failed to read directory' })
  }
})
