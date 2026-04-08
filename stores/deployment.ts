// stores/deployment.ts
import { defineStore } from 'pinia'

export interface Deployment {
  id: number
  projectId: number
  vercelDeployId: string
  status: 'queued' | 'building' | 'ready' | 'error' | 'cancelled' | 'deactivated'
  url: string | null
  production: boolean
  createdAt: Date
  updatedAt: Date
  completedAt?: Date | null
  duration?: number | null
  buildLogs?: string | null
  errorMessage?: string | null
}

export interface DeploymentRequest {
  projectId: number
  branch?: string
  production?: boolean
}

export const useDeploymentStore = defineStore('deployment', {
  state: () => ({
    deployments: [] as Deployment[],
    currentDeployment: null as Deployment | null,
    pollingIntervals: {} as Record<number, ReturnType<typeof setInterval>>,
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    // 获取项目中正在进行的部署
    activeDeployments: (state) => (projectId: number) => {
      return state.deployments
        .filter(d => d.projectId === projectId && ['queued', 'building'].includes(d.status))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    },

    // 获取项目的部署历史
    projectDeployments: (state) => (projectId: number) => {
      return state.deployments
        .filter(d => d.projectId === projectId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    },

    // 获取最新的项目部署
    latestDeployment: (state) => (projectId: number) => {
      return state.deployments
        .filter(d => d.projectId === projectId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
    },

    // 检查是否正在轮询
    isPolling: (state) => (projectId: number) => {
      return !!state.pollingIntervals[projectId]
    },
  },

  actions: {
    // 设置部署列表
    setDeployments(deployments: Deployment[]) {
      this.deployments = deployments
    },

    // 添加或更新部署
    upsertDeployment(deployment: Deployment) {
      const index = this.deployments.findIndex(d => d.id === deployment.id)
      if (index !== -1) {
        this.deployments[index] = deployment
      } else {
        this.deployments.push(deployment)
      }

      // 如果是当前部署，也更新
      if (this.currentDeployment?.id === deployment.id) {
        this.currentDeployment = deployment
      }
    },

    // 设置当前部署
    setCurrentDeployment(deployment: Deployment | null) {
      this.currentDeployment = deployment
    },

    // 触发新部署
    async triggerDeployment(request: DeploymentRequest) {
      this.isLoading = true
      this.error = null

      try {
        const response = await $fetch<{
          success: boolean
          deploymentId: number
          vercelDeploymentId: string
          status: string
          url: string | null
        }>('/api/vercel/deploy', {
          method: 'POST',
          body: request,
        })

        if (response.success) {
          // 创建本地部署对象
          const deployment: Deployment = {
            id: response.deploymentId,
            projectId: request.projectId,
            vercelDeployId: response.vercelDeploymentId,
            status: response.status as any,
            url: response.url,
            production: request.production || false,
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          this.upsertDeployment(deployment)
          this.setCurrentDeployment(deployment)

          // 开始轮询部署状态
          this.startPolling(request.projectId)

          return deployment
        } else {
          throw new Error('Failed to trigger deployment')
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to trigger deployment'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // 获取部署状态
    async fetchDeploymentStatus(projectId: number) {
      try {
        const response = await $fetch<{
          status: string
          url: string | null
          latestDeployment: {
            id: number
            vercelDeployId: string
            status: string
            createdAt: string
            completedAt?: string
            url: string | null
            production: boolean
          }
        }>(`/api/vercel/status/${projectId}`)

        if (response.latestDeployment) {
          const deployment: Deployment = {
            ...response.latestDeployment,
            createdAt: new Date(response.latestDeployment.createdAt),
            completedAt: response.latestDeployment.completedAt
              ? new Date(response.latestDeployment.completedAt)
              : undefined,
            projectId,
          }

          this.upsertDeployment(deployment)

          // 如果部署完成或失败，停止轮询
          if (['READY', 'ERROR', 'CANCELLED', 'CANCELED', 'DEACTIVATED', 'ready', 'error', 'cancelled', 'canceled', 'deactivated'].includes(deployment.status)) {
            this.stopPolling(projectId)
          }

          return deployment
        }

        return null
      } catch (error) {
        console.error('Failed to fetch deployment status:', error)
        return null
      }
    },

    // 开始轮询部署状态
    startPolling(projectId: number) {
      // 如果已经在轮询，不重复开始
      if (this.pollingIntervals[projectId]) {
        return
      }

      // 立即获取一次状态
      this.fetchDeploymentStatus(projectId)

      // 每5秒轮询一次
      this.pollingIntervals[projectId] = setInterval(async () => {
        const deployment = await this.fetchDeploymentStatus(projectId)

        // 如果部署完成或失败，停止轮询
        if (deployment && ['ready', 'error', 'cancelled', 'deactivated'].includes(deployment.status)) {
          this.stopPolling(projectId)
        }
      }, 5000)
    },

    // 停止轮询
    stopPolling(projectId: number) {
      if (this.pollingIntervals[projectId]) {
        clearInterval(this.pollingIntervals[projectId])
        delete this.pollingIntervals[projectId]
      }
    },

    // 停止所有轮询
    stopAllPolling() {
      Object.values(this.pollingIntervals).forEach(interval => clearInterval(interval))
      this.pollingIntervals = {}
    },

    // 清除错误
    clearError() {
      this.error = null
    },
  },
})
