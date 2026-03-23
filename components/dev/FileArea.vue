<!-- components/dev/FileArea.vue -->
<template>
  <div class="file-area">
    <!-- 无项目时的空状态 -->
    <div v-if="!projectStore.currentProject" class="empty-state">
      <AppIcon name="folder-open" size="xl" class="empty-icon" />
      <h4>未选择项目</h4>
      <p>请先在左侧选择一个 GitHub 项目</p>
    </div>

    <!-- 有项目时显示文件树和编辑器 -->
    <div v-else class="file-content">
      <!-- 文件树 -->
      <div class="file-tree-panel">
        <div class="panel-header">
          <AppIcon name="folder" size="sm" />
          <span class="panel-title">文件树</span>
        </div>
        <div class="panel-content">
          <div v-if="fileTree.length === 0" class="loading-state">
            <AppIcon name="loader-2" size="md" class="spin" />
            <span>加载中...</span>
          </div>
          <div v-else class="file-tree">
            <TreeNode
              v-for="item in fileTree"
              :key="item.path"
              :node="item"
              @select="selectFile"
            />
          </div>
        </div>
      </div>

      <!-- 代码编辑器 -->
      <div class="file-editor-panel">
        <CodeEditor />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import AppIcon from '~/components/base/AppIcon.vue'
import TreeNode from '~/components/dev/TreeNode.vue'
import CodeEditor from '~/components/dev/CodeEditor.vue'

const projectStore = useProjectStore()
const fileTree = ref([])

const loadFiles = async () => {
  if (!projectStore.currentProject) return

  try {
    const data = await $fetch(`/api/projects/${projectStore.currentProject.name}/files`) as any[]
    if (data) {
      fileTree.value = data
    }
  } catch (e) {
    console.error('Failed to load files:', e)
  }
}

const selectFile = async (file: any) => {
  projectStore.setCurrentFile(file.path)

  try {
    const content = await $fetch(`/api/projects/${projectStore.currentProject.name}/file?path=${encodeURIComponent(file.path)}`) as string
    if (content !== null) {
      projectStore.setFileContent(content)
    }
  } catch (e) {
    console.error('Failed to load file:', e)
  }
}

watch(() => projectStore.currentProject, loadFiles)
</script>

<style scoped>
.file-area {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--spacing-8);
  text-align: center;
  color: rgba(241, 245, 249, 0.5);
}

.empty-icon {
  opacity: 0.2;
  margin-bottom: var(--spacing-4);
}

.empty-state h4 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: var(--spacing-2);
}

.empty-state p {
  font-size: var(--text-sm);
  color: rgba(241, 245, 249, 0.5);
}

.file-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.file-tree-panel {
  width: 280px;
  flex-shrink: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.3);
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.5);
}

.panel-title {
  font-size: var(--text-sm);
  font-weight: 500;
  color: #f1f5f9;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-8);
  color: rgba(241, 245, 249, 0.4);
  font-size: var(--text-sm);
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.file-tree {
  padding: var(--spacing-2);
}

.file-editor-panel {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .file-content {
    flex-direction: column;
  }

  .file-tree-panel {
    width: 100%;
    height: 40%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .file-editor-panel {
    height: 60%;
  }
}
</style>
