<!-- components/layout/DocsSidebar.vue -->
<template>
  <aside class="docs-sidebar">
    <div class="sidebar-header">
      <Icon name="book-open" size="md" />
      <div>
        <h2 class="sidebar-title">OpenClaw 文档</h2>
      </div>
    </div>

    <!-- Agent 选择器 -->
    <div class="agent-selector">
      <el-select
        v-model="docsStore.selectedAgent"
        placeholder="选择 Agent"
        filterable
        size="default"
        @change="onAgentChange"
      >
        <el-option
          v-for="agent in docsStore.agentList"
          :key="agent.id"
          :label="agent.id"
          :value="agent.id"
        />
      </el-select>
    </div>

    <div class="sidebar-content">
      <el-tree
        :data="treeData"
        node-key="doc"
        default-expand-all
        highlight-current
        :props="{ label: 'label', children: 'children' }"
        @node-click="onNodeClick"
      >
        <template #default="{ node, data }">
          <span class="tree-node" :class="{ 'is-leaf': !data.children }">
            <el-icon v-if="data.icon" class="tree-node-icon"><component :is="data.icon" /></el-icon>
            <span>{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useDocsStore } from '~/stores/docs'
import * as Icons from '@element-plus/icons-vue'
import { Document, MagicStick, Memo } from '@element-plus/icons-vue'

const emit = defineEmits(['select'])

const docsStore = useDocsStore()

const treeData = computed(() => [
  {
    label: '配置文件',
    icon: Document,
    children: docsStore.configFiles.map(f => ({ label: f, doc: f })),
  },
  {
    label: 'Skills',
    icon: MagicStick,
    children: docsStore.skills.map(s => ({ label: s, doc: `skills/${s}` })),
  },
  {
    label: 'Memory',
    icon: Memo,
    children: docsStore.memoryFiles.map(f => ({ label: f.replace('.md', ''), doc: `memory/${f}` })),
  },
])

const onNodeClick = (data: any) => {
  if (data.doc) {
    docsStore.setCurrentDoc(data.doc)
    emit('select', data.doc)
  }
}

const loadFileLists = async () => {
  const agentId = docsStore.selectedAgent || undefined
  try {
    const [configFiles, skills, memoryFiles] = await Promise.all([
      $fetch('/api/docs/config-files', { params: { agentId } }) as Promise<string[]>,
      $fetch('/api/docs/skills') as Promise<string[]>,
      $fetch('/api/docs/memory', { params: { agentId } }) as Promise<string[]>,
    ])
    docsStore.setConfigFiles(configFiles || [])
    docsStore.setSkills(skills || [])
    docsStore.setMemoryFiles(memoryFiles || [])
  } catch (e) {
    console.error('Failed to load file lists:', e)
  }
}

const onAgentChange = () => {
  docsStore.setCurrentDoc('')
  loadFileLists()
}

onMounted(async () => {
  // 加载 agent 列表
  try {
    const agents = await $fetch('/api/docs/agents') as { id: string, workspace: string }[]
    docsStore.setAgentList(agents || [])
    if (agents.length > 0 && !docsStore.selectedAgent) {
      docsStore.setSelectedAgent(agents[0].id)
    }
  } catch (e) {
    console.error('Failed to load agents:', e)
  }

  await loadFileLists()
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

.agent-selector {
  padding: var(--spacing-3) var(--spacing-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.agent-selector :deep(.el-select) {
  width: 100%;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-3);
}

.sidebar-content :deep(.el-tree) {
  background: transparent;
  color: rgba(241, 245, 249, 0.7);
  --el-tree-node-hover-bg-color: rgba(255, 255, 255, 0.05);
}

.sidebar-content :deep(.el-tree-node__content) {
  height: 32px;
  border-radius: var(--radius-md);
}

.sidebar-content :deep(.el-tree-node.is-current > .el-tree-node__content) {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  color: #60a5fa;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-sm);
}

.tree-node-icon {
  font-size: 14px;
}

.tree-node.is-leaf {
  color: rgba(241, 245, 249, 0.7);
}
</style>
