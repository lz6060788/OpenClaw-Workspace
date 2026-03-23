<!-- components/layout/DevSidebar.vue -->
<template>
  <aside class="dev-sidebar">
    <div class="sidebar-header">
      <div class="header-content">
        <AppIcon name="folder-git-2" size="md" />
        <div>
          <h2 class="sidebar-title">GitHub 项目</h2>
          <p class="sidebar-subtitle">{{ projectStore.projects.length }} 个项目</p>
        </div>
      </div>
      <AppButton
        variant="ghost"
        size="sm"
        icon="plus"
        @click="showAddDialog = true"
      >
        添加
      </AppButton>
    </div>

    <div class="sidebar-content">
      <div
        v-for="project in projectStore.projects"
        :key="project.name"
        class="project-item"
        :class="{ active: projectStore.currentProject?.name === project.name }"
        @click="selectProject(project)"
      >
        <AppIcon :name="projectStore.currentProject?.name === project.name ? 'folder-open' : 'folder'" size="sm" />
        <div class="project-info">
          <span class="project-name">{{ project.name }}</span>
        </div>
        <div v-if="projectStore.currentProject?.name === project.name" class="project-indicator" />
      </div>

      <div v-if="projectStore.projects.length === 0" class="empty-state">
        <AppIcon name="folder-open" size="lg" class="empty-icon" />
        <p class="empty-text">暂无项目</p>
        <AppButton variant="primary" size="sm" @click="showAddDialog = true">
          创建第一个项目
        </AppButton>
      </div>
    </div>

    <!-- 添加项目对话框 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAddDialog" class="modal-overlay" @click.self="showAddDialog = false">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">添加项目</h3>
              <button class="modal-close" @click="showAddDialog = false">
                <AppIcon name="x" size="sm" />
              </button>
            </div>
            <div class="modal-body">
              <AppInput
                v-model="newProjectName"
                label="项目名称"
                placeholder="my-awesome-project"
                hint="项目将创建在 github-projects 目录下"
              />
            </div>
            <div class="modal-footer">
              <AppButton variant="ghost" @click="showAddDialog = false">
                取消
              </AppButton>
              <AppButton :disabled="!newProjectName" @click="addProject">
                创建
              </AppButton>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </aside>
</template>

<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import AppIcon from '~/components/base/AppIcon.vue'
import AppButton from '~/components/base/AppButton.vue'
import AppInput from '~/components/base/AppInput.vue'

const projectStore = useProjectStore()
const showAddDialog = ref(false)
const newProjectName = ref('')

const selectProject = (project: any) => {
  projectStore.setCurrentProject(project)
}

const addProject = async () => {
  if (!newProjectName.value.trim()) return

  try {
    await $fetch('/api/projects/add', {
      method: 'POST',
      body: { name: newProjectName.value }
    })
    showAddDialog.value = false
    newProjectName.value = ''
    await loadProjects()
  } catch (e: any) {
    const errorMessage = e.data?.message || '添加项目失败'
    alert(errorMessage)
  }
}

const loadProjects = async () => {
  try {
    const data = await $fetch('/api/projects/list') as any[]
    if (data) {
      projectStore.setProjects(data)
    }
  } catch (e) {
    console.error('Failed to load projects:', e)
  }
}

onMounted(() => {
  loadProjects()
})
</script>

<style scoped>
.dev-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: var(--spacing-5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-3);
}

.sidebar-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: #f1f5f9;
}

.sidebar-subtitle {
  font-size: var(--text-xs);
  color: rgba(241, 245, 249, 0.5);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-3);
}

.project-item {
  position: relative;
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
  color: #60a5fa;
}

.project-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 2rem;
  background: linear-gradient(180deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 0 2px 2px 0;
}

.project-name {
  font-size: var(--text-sm);
  font-weight: 500;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-6);
  text-align: center;
}

.empty-icon {
  opacity: 0.3;
}

.empty-text {
  font-size: var(--text-sm);
  color: rgba(241, 245, 249, 0.5);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
}

.modal-content {
  background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-2xl);
  width: 100%;
  max-width: 28rem;
  margin: var(--spacing-4);
  box-shadow: var(--shadow-2xl);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  font-size: var(--text-lg);
  font-weight: 600;
}

.modal-close {
  padding: var(--spacing-1);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s ease-out;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: var(--spacing-5);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
  padding: var(--spacing-5);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Modal 动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(-10px);
}
</style>
