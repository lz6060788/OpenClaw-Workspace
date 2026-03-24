<!-- components/layout/DevSidebar.vue -->
<template>
  <aside class="dev-sidebar">
    <div class="sidebar-header">
      <div class="header-content">
        <AppIcon name="lucide:folder-git-2" class="header-icon" />
        <div>
          <h2 class="sidebar-title">GitHub 项目</h2>
          <p class="sidebar-subtitle">{{ projects.length }} 个仓库</p>
        </div>
      </div>
      <div class="header-actions">
        <button 
          class="icon-btn" 
          :class="{ spinning: loading }"
          title="刷新"
          @click="refreshProjects"
        >
          <AppIcon name="lucide:refresh-cw" />
        </button>
      </div>
    </div>

    <div class="sidebar-content">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-item"
        :class="{ active: currentProject?.full_name === project.full_name }"
        @click="selectProject(project)"
      >
        <div class="project-status">
          <span 
            class="status-dot" 
            :class="{ exists: project.localExists }"
            :title="project.localExists ? '本地已存在' : '本地不存在'"
          />
        </div>
        <div class="project-info">
          <span class="project-name">{{ project.name }}</span>
          <span class="project-branch" v-if="project.branches && project.branches.length">
            {{ formatBranches(project.branches, project.default_branch) }}
          </span>
        </div>
        <button 
          class="action-btn"
          :class="{ loading: cloning === project.full_name }"
          :title="project.localExists ? '更新项目' : '克隆到本地'"
          @click.stop="cloneProject(project)"
        >
          <AppIcon v-if="cloning === project.full_name" name="lucide:loader-2" class="spin" />
          <AppIcon v-else :name="project.localExists ? 'lucide:download' : 'lucide:plus'" />
        </button>
      </div>

      <div v-if="projects.length === 0 && !loading" class="empty-state">
        <AppIcon name="lucide:folder-open" class="empty-icon" />
        <p class="empty-text">暂无仓库</p>
        <p class="empty-hint">在 GitHub 创建仓库后会自动显示</p>
      </div>

      <div v-if="loading && projects.length === 0" class="loading-state">
        <AppIcon name="lucide:loader-2" class="spin" />
        <p>加载中...</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useProjectStore } from '~/stores/project'

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

// 加载项目列表
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

// 刷新项目列表
const refreshProjects = () => {
  loadProjects(true)
}

// 克隆/更新项目
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
    // 刷新状态
    await loadProjects()
  } catch (error: any) {
    alert(error.message || '操作失败')
  } finally {
    cloning.value = null
  }
}

// 选择项目
const selectProject = (project: Project) => {
  projectStore.setCurrentProject(project)
}

// 格式化分支显示
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

<style scoped>
.dev-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(30, 41, 59, 0.5);
}

.sidebar-header {
  padding: var(--spacing-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-2);
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.header-icon {
  width: 20px;
  height: 20px;
  color: #60a5fa;
}

.sidebar-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: #f1f5f9;
  line-height: 1.3;
}

.sidebar-subtitle {
  font-size: var(--text-xs);
  color: rgba(241, 245, 249, 0.5);
  line-height: 1.3;
}

.header-actions {
  display: flex;
  gap: var(--spacing-1);
}

.icon-btn {
  padding: var(--spacing-1);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s ease-out;
  background: transparent;
  border: none;
  color: rgba(241, 245, 249, 0.5);
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
}

.icon-btn.spinning {
  animation: spin 1s linear infinite;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-2);
}

.project-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.15s ease-out;
}

.project-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.project-item.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
}

.project-status {
  flex-shrink: 0;
}

.status-dot {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.8);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.status-dot.exists {
  background: rgba(34, 197, 94, 0.8);
  border-color: rgba(34, 197, 94, 0.3);
}

.project-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.project-name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-branch {
  font-size: var(--text-xs);
  color: rgba(241, 245, 249, 0.4);
}

.action-btn {
  flex-shrink: 0;
  padding: var(--spacing-1);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s ease-out;
  background: transparent;
  border: none;
  color: rgba(241, 245, 249, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.action-btn.loading {
  color: #60a5fa;
}

.empty-state,
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-8) var(--spacing-4);
  text-align: center;
  color: rgba(241, 245, 249, 0.5);
}

.empty-icon {
  width: 32px;
  height: 32px;
  opacity: 0.3;
}

.empty-text {
  font-size: var(--text-sm);
}

.empty-hint {
  font-size: var(--text-xs);
  opacity: 0.7;
}
</style>
