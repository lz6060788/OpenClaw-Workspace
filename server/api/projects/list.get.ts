// server/api/projects/list.get.ts
import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { execSync } from 'child_process'
import { config } from '~/server/utils/config'
import { db } from '~/server/utils/db'
import { getProjectsDir } from '~/server/utils/projects'

const CACHE_FILE = join(process.cwd(), '.cache', 'github-repos.json')
const CACHE_TTL = 10 * 60 * 1000 // 10 分钟缓存

interface RepoInfo {
  id: number
  name: string
  full_name: string
  owner: string
  description: string | null
  default_branch: string
  branches: string[]
  private: boolean
  html_url: string
  updated_at: string
}

interface CacheData {
  repos: RepoInfo[]
  timestamp: number
}

// 确保目录存在
async function ensureDir(path: string) {
  try {
    await mkdir(dirname(path), { recursive: true })
  } catch {}
}

// 获取 GitHub API 数据
async function fetchGitHubRepos(): Promise<RepoInfo[]> {
  // Try to get token from database first
  const token = await config.github.getToken() || process.env.GITHUB_TOKEN

  if (!token) {
    throw new Error('GITHUB_TOKEN is not configured in database or environment')
  }
  
  const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100&affiliation=owner', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'OpenClaw-Workspace'
    }
  })
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }
  
  const data = await response.json() as any[]
  
  // 获取每个仓库的分支信息
  const repos: RepoInfo[] = await Promise.all(
    data.map(async (repo) => {
      let branches: string[] = [repo.default_branch]
      
      try {
        const branchResponse = await fetch(`https://api.github.com/repos/${repo.full_name}/branches?per_page=10`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'OpenClaw-Workspace'
          }
        })
        
        if (branchResponse.ok) {
          const branchData = await branchResponse.json() as any[]
          branches = branchData.map((b: any) => b.name).slice(0, 5) // 最多取 5 个分支
        }
      } catch {
        // 分支信息获取失败，使用默认分支
      }
      
      return {
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        owner: repo.owner.login,
        description: repo.description,
        default_branch: repo.default_branch,
        branches,
        private: repo.private,
        html_url: repo.html_url,
        updated_at: repo.updated_at
      }
    })
  )
  
  return repos
}

// 读取缓存
async function getCache(): Promise<CacheData | null> {
  try {
    const content = await readFile(CACHE_FILE, 'utf-8')
    return JSON.parse(content)
  } catch {
    return null
  }
}

// 写入缓存
async function setCache(data: CacheData): Promise<void> {
  await ensureDir(CACHE_FILE)
  await writeFile(CACHE_FILE, JSON.stringify(data, null, 2))
}

// 检查本地是否存在
async function checkLocalExists(fullName: string, projectsDir: string): Promise<boolean> {
  const localPath = join(projectsDir, fullName)
  try {
    execSync(`git -C "${localPath}" rev-parse --git-dir`, { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const forceRefresh = query.refresh === 'true'

  // Get projects directory from database
  const PROJECTS_DIR = await getProjectsDir()

  // 确保项目目录存在
  try {
    await ensureDir(PROJECTS_DIR)
  } catch {}
  
  // 尝试获取缓存
  const cache = await getCache()
  const now = Date.now()
  
  let repos: RepoInfo[]
  
  if (!forceRefresh && cache && (now - cache.timestamp) < CACHE_TTL) {
    repos = cache.repos
  } else {
    // 重新获取
    try {
      repos = await fetchGitHubRepos()
      await setCache({ repos, timestamp: now })
    } catch (error) {
      // 如果缓存可用，返回缓存数据
      if (cache) {
        repos = cache.repos
      } else {
        throw error
      }
    }
  }
  
  // 检查本地是否存在，并从数据库获取 openclawAgentId
  const projectsDir = await getProjectsDir()
  const results = await Promise.all(repos.map(async repo => {
    let openclawAgentId: string | null = null
    try {
      const dbProject = await db.project.findByGithubId(repo.id)
      openclawAgentId = dbProject?.openclawAgentId || null
    } catch {}

    return {
      ...repo,
      localExists: await checkLocalExists(repo.full_name, projectsDir),
      openclawAgentId
    }
  }))
  return results
})
