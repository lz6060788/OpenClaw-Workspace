<!-- components/layout/DocsSidebar.vue -->
<template>
  <aside class="docs-sidebar">
    <div class="sidebar-header">
      <Icon name="book-open" size="md" />
      <div>
        <h2 class="sidebar-title">OpenClaw 文档</h2>
      </div>
    </div>

    <div class="sidebar-content">
      <!-- 配置文件 -->
      <div class="sidebar-section">
        <button class="section-header" @click="toggleSection('config')">
          <Icon :name="isExpanded.config ? 'chevron-down' : 'chevron-right'" size="xs" />
          <span>配置文件</span>
        </button>
        <Transition name="collapse">
          <div v-if="isExpanded.config" class="section-content">
            <div
              v-for="file in docsStore.configFiles"
              :key="file"
              class="file-item"
              :class="{ active: docsStore.currentDoc === file }"
              @click="selectDoc(file)"
            >
              <Icon name="file" size="xs" />
              <span>{{ file }}</span>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Skills -->
      <div class="sidebar-section">
        <button class="section-header" @click="toggleSection('skills')">
          <Icon :name="isExpanded.skills ? 'chevron-down' : 'chevron-right'" size="xs" />
          <span>Skills</span>
        </button>
        <Transition name="collapse">
          <div v-if="isExpanded.skills" class="section-content">
            <div
              v-for="skill in docsStore.skills"
              :key="skill"
              class="file-item"
              :class="{ active: docsStore.currentDoc === `skills/${skill}` }"
              @click="selectDoc(`skills/${skill}`)"
            >
              <Icon name="sparkles" size="xs" />
              <span>{{ skill }}</span>
            </div>
            <div v-if="docsStore.skills.length === 0" class="loading-state">
              加载中...
            </div>
          </div>
        </Transition>
      </div>

      <!-- Memory -->
      <div class="sidebar-section">
        <button class="section-header" @click="toggleSection('memory')">
          <Icon :name="isExpanded.memory ? 'chevron-down' : 'chevron-right'" size="xs" />
          <span>Memory</span>
        </button>
        <Transition name="collapse">
          <div v-if="isExpanded.memory" class="section-content">
            <div
              v-for="file in docsStore.memoryFiles"
              :key="file"
              class="file-item"
              :class="{ active: docsStore.currentDoc === `memory/${file}` }"
              @click="selectDoc(`memory/${file}`)"
            >
              <Icon name="calendar" size="xs" />
              <span>{{ file.replace('.md', '') }}</span>
            </div>
            <div v-if="docsStore.memoryFiles.length === 0" class="loading-state">
              加载中...
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useDocsStore } from '~/stores/docs'
import * as Icons from '@element-plus/icons-vue'

const emit = defineEmits(['select'])

const docsStore = useDocsStore()

const isExpanded = reactive({
  config: true,
  skills: true,
  memory: true,
})

const toggleSection = (section: keyof typeof isExpanded) => {
  isExpanded[section] = !isExpanded[section]
}

const selectDoc = (doc: string) => {
  docsStore.setCurrentDoc(doc)
  emit('select', doc)
}

// 加载 Skills 和 Memory 文件列表
onMounted(async () => {
  try {
    const skills = await $fetch('/api/docs/skills') as string[]
    if (skills) {
      docsStore.setSkills(skills)
    }
  } catch (e) {
    console.error('Failed to load skills:', e)
  }

  try {
    const memoryFiles = await $fetch('/api/docs/memory') as string[]
    if (memoryFiles) {
      docsStore.setMemoryFiles(memoryFiles)
    }
  } catch (e) {
    console.error('Failed to load memory files:', e)
  }
})
</script>

<style scoped>
.docs-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-title {
  font-size: var(--text-base);
  font-weight: 600;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-3);
}

.sidebar-section {
  margin-bottom: var(--spacing-4);
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  width: 100%;
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: background-color 0.15s ease-out;
  color: #f1f5f9;
  font-size: var(--text-sm);
  font-weight: 500;
}

.section-header:hover {
  background: rgba(255, 255, 255, 0.05);
}

.section-content {
  padding-left: var(--spacing-4);
}

.file-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s ease-out;
  font-size: var(--text-sm);
  color: rgba(241, 245, 249, 0.7);
}

.file-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #f1f5f9;
}

.file-item.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  color: #60a5fa;
}

.loading-state {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--text-xs);
  color: rgba(241, 245, 249, 0.4);
}

/* 折叠动画 */
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.2s ease-out;
  overflow: hidden;
}

.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
