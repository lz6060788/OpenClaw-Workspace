// stores/project.ts
import { defineStore } from 'pinia'

export interface Project {
  id: number
  name: string
  full_name: string
  owner: string
  description: string | null
  default_branch: string
  branches: string[]
  private: boolean
  localExists: boolean

  // Vercel 配置
  vercelProjectId?: string | null
  vercelUrl?: string | null
  vercelTeamId?: string | null

  // OpenClaw 配置
  openclawAgentId?: string | null

  // 构建配置
  buildCommand?: string | null
  outputDirectory?: string | null
  installCommand?: string | null
  framework?: string | null

  // 元数据
  lastSyncAt?: Date
  lastDeployAt?: Date
  latestDeploy?: Deployment
}

export interface Deployment {
  id: number
  vercelDeployId: string
  status: 'queued' | 'building' | 'ready' | 'error' | 'cancelled' | 'deactivated'
  url: string | null
  production: boolean
  createdAt: Date
  completedAt?: Date | null
  duration?: number | null
  errorMessage?: string | null
}

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [] as Project[],
    currentProject: null as Project | null,
    files: [] as any[],
    currentFile: null as string | null,
    fileContent: '',
  }),

  getters: {
    // 获取已链接Vercel的项目
    vercelLinkedProjects: (state) => {
      return state.projects.filter(p => p.vercelProjectId)
    },

    // 获取未链接Vercel的项目
    unlinkedProjects: (state) => {
      return state.projects.filter(p => !p.vercelProjectId)
    },

    // 检查当前项目是否正在部署
    isDeploying: (state) => {
      return state.currentProject?.latestDeploy?.status === 'building' ||
             state.currentProject?.latestDeploy?.status === 'queued'
    },
  },

  actions: {
    setProjects(projects: Project[]) {
      this.projects = projects
    },

    setCurrentProject(project: Project | null) {
      this.currentProject = project
      // 切换项目时清空文件相关状态
      this.currentFile = null
      this.fileContent = ''
      this.files = []
    },

    setFiles(files: any[]) {
      this.files = files
    },

    setCurrentFile(file: string | null) {
      this.currentFile = file
    },

    setFileContent(content: string) {
      this.fileContent = content
    },

    // 更新项目的Vercel配置
    updateVercelConfig(projectId: number, config: {
      vercelProjectId?: string
      vercelUrl?: string
      openclawAgentId?: string
      buildCommand?: string
      outputDirectory?: string
      installCommand?: string
      framework?: string
    }) {
      const project = this.projects.find(p => p.id === projectId)
      if (project) {
        Object.assign(project, config)
      }

      // 如果是当前项目，也更新当前项目
      if (this.currentProject?.id === projectId) {
        Object.assign(this.currentProject, config)
      }
    },

    // 更新项目的最新部署信息
    updateLatestDeploy(projectId: number, deploy: Deployment) {
      const project = this.projects.find(p => p.id === projectId)
      if (project) {
        project.latestDeploy = deploy
      }

      // 如果是当前项目，也更新当前项目
      if (this.currentProject?.id === projectId) {
        this.currentProject.latestDeploy = deploy
      }
    },

    // 移除项目
    removeProject(projectId: number) {
      const index = this.projects.findIndex(p => p.id === projectId)
      if (index !== -1) {
        this.projects.splice(index, 1)
      }

      // 如果是当前项目，清空当前项目
      if (this.currentProject?.id === projectId) {
        this.currentProject = null
        this.currentFile = null
        this.fileContent = ''
        this.files = []
      }
    },
  },
})
