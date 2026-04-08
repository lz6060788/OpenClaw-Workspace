<!-- components/layout/DevSidebar.vue -->
<template>
  <aside class="h-full flex flex-col">
    <div class="flex items-center justify-between gap-3 p-4 border-b border-white/5">
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <Icon name="folder-git-2" size="md" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
        <div class="min-w-0 flex-1">
          <h2 class="text-sm font-semibold text-zinc-100 leading-tight">GitHub 项目</h2>
          <p class="text-xs text-zinc-500 leading-tight">{{ projects.length }} 个仓库</p>
        </div>
      </div>
      <Icon
        name="refresh-cw"
        size="sm"
        variant="subtle"
        background="outlined"
        :loading="loading"
        clickable
        title="刷新"
        @click="refreshProjects"
      />
    </div>

    <div class="flex-1 overflow-y-auto p-2 space-y-1">
      <div
        v-for="project in projects"
        :key="project.id"
        class="group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/5 relative"
        :class="{ 'bg-amber-500/10': currentProject?.full_name === project.full_name }"
        @click="selectProject(project)"
      >
        <!-- 选中指示条 -->
        <div
          v-if="currentProject?.full_name === project.full_name"
          class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-amber-400 to-amber-600 rounded-r-full"
        />

        <div class="flex-shrink-0">
          <span
            class="block w-2 h-2 rounded-full ring-2 ring-transparent transition-all"
            :class="project.localExists
              ? 'bg-emerald-400 ring-emerald-400/20'
              : 'bg-zinc-600 ring-zinc-600/20'"
            :title="project.localExists ? '本地已存在' : '本地不存在'"
          />
        </div>

        <div class="flex-1 min-w-0 pr-3 flex flex-col gap-0.5">
          <span class="text-sm font-medium text-zinc-200 truncate group-hover:text-zinc-100 transition-colors">
            {{ project.name }}
          </span>
          <span v-if="project.branches && project.branches.length" class="text-xs text-zinc-600">
            {{ formatBranches(project.branches, project.default_branch) }}
          </span>
        </div>

        <!-- 操作按钮组 -->
        <div class="flex items-center gap-1">
          <!-- Vercel 配置按钮 -->
          <Icon
            v-if="project.localExists"
            name="cloud"
            size="xs"
            variant="subtle"
            background="outlined"
            :class="[
              'opacity-0 group-hover:opacity-100 transition-opacity',
              project.vercelProjectId ? 'text-emerald-400' : 'text-zinc-500'
            ]"
            :title="project.vercelProjectId ? '已链接 Vercel' : '配置 Vercel'"
            clickable
            @click.stop="openVercelConfig(project)"
          />

          <!-- 部署状态指示器 -->
          <div
            v-if="project.latestDeploy && ['queued', 'building'].includes(project.latestDeploy.status)"
            class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20"
          >
            <Icon name="loader-2" size="xs" icon-color="rgb(59 130 246)" :loading="true" />
            <span class="text-xs text-blue-400">{{ getDeployStatusText(project.latestDeploy.status) }}</span>
          </div>

          <!-- 部署成功指示器 -->
          <div
            v-else-if="project.latestDeploy?.status === 'ready'"
            class="flex items-center gap-1"
            :title="`最新部署: ${formatTime(project.latestDeploy.completedAt)}`"
          >
            <Icon name="check-circle-2" size="xs" icon-color="rgb(52 211 153)" />
          </div>

          <!-- 部署失败指示器 -->
          <div
            v-else-if="project.latestDeploy?.status === 'error'"
            class="flex items-center gap-1"
            :title="`部署失败: ${project.latestDeploy.errorMessage || '未知错误'}`"
          >
            <Icon name="x-circle" size="xs" icon-color="rgb(239 68 68)" />
          </div>

          <Icon
            :name="cloning === project.full_name ? 'loader-2' : (project.localExists ? 'download' : 'plus')"
            size="sm"
            variant="subtle"
            background="outlined"
            :class="cloning === project.full_name ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : ''"
            :loading="cloning === project.full_name"
            clickable
            @click.stop="cloneProject(project)"
          />
        </div>
      </div>

      <div v-if="projects.length === 0 && !loading" class="flex flex-col items-center gap-4 p-8 text-center">
        <div class="w-12 h-12 flex-center rounded-xl bg-zinc-800/50 border border-white/5">
          <Icon name="folder-open" size="lg" icon-color="rgb(82 82 83)" />
        </div>
        <div class="space-y-1">
          <p class="text-sm font-medium text-zinc-400">暂无仓库</p>
          <p class="text-xs text-zinc-600">在 GitHub 创建仓库后会自动显示</p>
        </div>
      </div>

      <div v-if="loading && projects.length === 0" class="flex flex-col items-center gap-4 p-8 text-center">
        <div class="w-12 h-12 flex-center rounded-xl bg-zinc-800/50 border border-white/5">
          <Icon name="loader-2" size="lg" icon-color="rgb(251 191 36)" />
        </div>
        <p class="text-sm text-zinc-500">加载中...</p>
      </div>
    </div>

    <!-- Settings Button -->
    <div class="p-3 border-t border-white/5">
      <NuxtLink
        to="/settings"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/5 text-zinc-400 hover:text-zinc-200"
      >
        <Icon name="settings" size="sm" icon-color="rgb(115 115 115)" />
        <span class="text-sm font-medium">系统设置</span>
      </NuxtLink>
    </div>

    <!-- Vercel 配置对话框 -->
    <VercelConfigDialog
      v-model="showVercelConfig"
      :project="selectedProject"
      @configured="onVercelConfigured"
    />
  </aside>
</template>

<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import { ElMessage } from 'element-plus'
import VercelConfigDialog from '~/components/dev/VercelConfigDialog.vue'

interface Project {
  id: number
  name: string
  full_name: string
  owner: string
  description: string | null
  default_branch: string
  branches: string[]
  private: boolean
  localExists: boolean
  vercelProjectId?: string | null
  vercelUrl?: string | null
  openclawAgentId?: string | null
  latestDeploy?: {
    status: string
    completedAt?: Date
    errorMessage?: string
  }
}

const projectStore = useProjectStore()
const projects = ref<Project[]>([])
const loading = ref(false)
const cloning = ref<string | null>(null)
const showVercelConfig = ref(false)
const selectedProject = ref<Project | null>(null)

const loadProjects = async (refresh = false) => {
  loading.value = true
  try {
    const data = await $fetch<Project[]>(`/api/projects/list?refresh=${refresh}`)
    projects.value = data
  } catch (error) {
    console.error('加载项目失败:', error)
  } finally {
    loading.value = false
  }
}

const refreshProjects = () => {
  loadProjects(true)
}

const cloneProject = async (project: Project) => {
  cloning.value = project.full_name
  try {
    const response = await $fetch('/api/projects/clone', {
      method: 'POST',
      body: {
        fullName: project.full_name,
        owner: project.owner,
        name: project.name
      }
    }) as any

    if (response.success) {
      ElMessage.success(response.message || '操作成功')
      await loadProjects()
    }
  } catch (error: any) {
    const message = error.data?.message || error.message || '操作失败'

    // Check if error is about missing path configuration
    if (message.includes('未配置') || message.includes('not configured')) {
      ElMessage({
        type: 'warning',
        message: '请先在系统设置中配置 GitHub 项目路径',
        duration: 5000,
        showClose: true
      })
      // Optionally redirect to settings page
      setTimeout(() => {
        navigateTo('/settings?tab=system')
      }, 2000)
    } else {
      ElMessage.error(message)
    }
  } finally {
    cloning.value = null
  }
}

const selectProject = (project: Project) => {
  projectStore.setCurrentProject(project)
}

const openVercelConfig = (project: Project) => {
  selectedProject.value = project
  showVercelConfig.value = true
}

const onVercelConfigured = (updatedProject: any) => {
  // Match by githubId (returned by API) or by id (GitHub ID from frontend)
  const matchId = updatedProject.githubId || updatedProject.id
  const index = projects.value.findIndex(p => p.id === matchId)
  if (index !== -1) {
    // Merge config fields into existing project object (preserve GitHub API fields)
    projects.value[index] = {
      ...projects.value[index],
      vercelProjectId: updatedProject.vercelProjectId,
      vercelUrl: updatedProject.vercelUrl,
      openclawAgentId: updatedProject.openclawAgentId,
      buildCommand: updatedProject.buildCommand,
      outputDirectory: updatedProject.outputDirectory,
      installCommand: updatedProject.installCommand,
      framework: updatedProject.framework,
    }
  }

  // Update current project in store
  if (projectStore.currentProject?.id === matchId) {
    projectStore.setCurrentProject(projects.value[index])
  }

  ElMessage.success('Vercel 配置已更新')
}

const formatBranches = (branches: string[], defaultBranch: string): string => {
  if (!branches || branches.length === 0) return ''
  const otherCount = branches.length - 1
  if (otherCount <= 0) return defaultBranch
  return `${defaultBranch} +${otherCount}`
}

const getDeployStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    queued: '队列中',
    building: '构建中',
    ready: '完成',
    error: '失败',
    cancelled: '取消',
    deactivated: '停用'
  }
  return statusMap[status] || status
}

const formatTime = (date?: Date): string => {
  if (!date) return ''
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

const currentProject = computed(() => projectStore.currentProject)

onMounted(() => {
  loadProjects()
})
</script>
