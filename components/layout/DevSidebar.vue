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
  </aside>
</template>

<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import * as Icons from '@element-plus/icons-vue'

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
}

const projectStore = useProjectStore()
const projects = ref<Project[]>([])
const loading = ref(false)
const cloning = ref<string | null>(null)

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
    await $fetch('/api/projects/clone', {
      method: 'POST',
      body: {
        fullName: project.full_name,
        owner: project.owner,
        name: project.name
      }
    })
    await loadProjects()
  } catch (error: any) {
    alert(error.message || '操作失败')
  } finally {
    cloning.value = null
  }
}

const selectProject = (project: Project) => {
  projectStore.setCurrentProject(project)
}

const formatBranches = (branches: string[], defaultBranch: string): string => {
  if (!branches || branches.length === 0) return ''
  const otherCount = branches.length - 1
  if (otherCount <= 0) return defaultBranch
  return `${defaultBranch} +${otherCount}`
}

const currentProject = computed(() => projectStore.currentProject)

onMounted(() => {
  loadProjects()
})
</script>
