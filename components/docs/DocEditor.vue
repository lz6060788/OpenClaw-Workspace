<!-- components/docs/DocEditor.vue -->
<template>
  <div class="doc-editor">
    <div class="editor-header">
      <div class="doc-info">
        <Icon name="file-text" size="sm" color="purple-400" />
        <span class="doc-name">{{ docsStore.currentDoc || '选择文档' }}</span>
      </div>
      <div class="header-actions">
        <el-button
          v-if="docsStore.currentDoc && hasChanges"
          type="primary"
          size="small"
          @click="saveDoc"
        >
          保存
        </el-button>
        <el-button
          v-if="docsStore.currentDoc"
          size="small"
          text
          @click="refresh"
        >
          刷新
        </el-button>
      </div>
    </div>
    <div class="editor-body">
      <!-- 未选择文件 -->
      <div v-if="!docsStore.currentDoc" class="empty-state">
        <Icon name="book-open" size="xl" class="empty-icon" />
        <p>选择左侧文档进行编辑</p>
      </div>

      <!-- Markdown 编辑器 -->
      <div v-else class="md-editor-wrap">
        <MdEditor
          v-model="editorContent"
          :preview="true"
          theme="dark"
          language="zh-CN"
          :toolbarsExclude="['github', 'htmlPreview', 'catalog', 'save']"
          @onSave="saveDoc"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useDocsStore } from '~/stores/docs'

const docsStore = useDocsStore()
const editorContent = ref('')

const hasChanges = computed(() => {
  return editorContent.value !== docsStore.originalContent
})

// 构建 API URL，附带 agentId
const buildContentUrl = (doc: string) => {
  const params = new URLSearchParams({ doc })
  if (docsStore.selectedAgent) {
    params.set('agentId', docsStore.selectedAgent)
  }
  return `/api/docs/content?${params.toString()}`
}

// 加载文档内容
const loadDoc = async () => {
  if (!docsStore.currentDoc) return

  try {
    const docContent = await $fetch(buildContentUrl(docsStore.currentDoc)) as string
    if (docContent !== null) {
      docsStore.setDocContent(docContent)
      editorContent.value = docContent
    }
  } catch (e) {
    console.error('Failed to load doc:', e)
    docsStore.setDocContent('加载失败')
    editorContent.value = '加载失败'
  }
}

// 保存文档
const saveDoc = async () => {
  if (!docsStore.currentDoc) return

  try {
    await $fetch('/api/docs/save', {
      method: 'POST',
      body: {
        doc: docsStore.currentDoc,
        content: editorContent.value,
        agentId: docsStore.selectedAgent || undefined,
      }
    })
    docsStore.setDocContent(editorContent.value)
  } catch (e) {
    console.error('Failed to save doc:', e)
  }
}

// 刷新文档
const refresh = async () => {
  await loadDoc()
}

// 切换文档时加载新内容
watch(() => docsStore.currentDoc, (newDoc) => {
  if (newDoc) {
    loadDoc()
  } else {
    editorContent.value = ''
  }
})
</script>

<style scoped>
.doc-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(15, 23, 42, 0.3);
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-3) var(--spacing-4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.5);
}

.doc-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.doc-name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: #f1f5f9;
}

.header-actions {
  display: flex;
  gap: var(--spacing-2);
}

.editor-body {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgba(241, 245, 249, 0.4);
}

.empty-icon {
  opacity: 0.3;
  margin-bottom: var(--spacing-3);
}

.md-editor-wrap {
  height: 100%;
}

.md-editor-wrap :deep(.md-editor) {
  height: 100%;
  border: none;
}
</style>
