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
          variant="ghost"
          size="sm"
          icon="refresh-cw"
          @click="refresh"
        >
          刷新
        </el-button>
        <el-button
          v-if="docsStore.currentDoc && hasChanges"
          variant="primary"
          size="sm"
          icon="save"
          @click="saveDoc"
        >
          保存
        </el-button>
      </div>
    </div>
    <div class="editor-body">
      <div v-if="!docsStore.currentDoc" class="empty-state">
        <Icon name="book-open" size="xl" class="empty-icon" />
        <p>选择左侧文档进行编辑</p>
      </div>
      <div v-else ref="editorContainer" class="monaco-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDocsStore } from '~/stores/docs'
import * as Icons from '@element-plus/icons-vue'


const docsStore = useDocsStore()
const editorContainer = ref<HTMLElement>()
const editorInstance = ref<any>(null)
const content = ref('')

const hasChanges = computed(() => {
  return content.value !== docsStore.originalContent
})

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  wordWrap: 'on',
  scrollBeyondLastLine: false,
  automaticLayout: true,
  theme: 'vs-dark',
}

// 初始化 Monaco Editor
onMounted(async () => {
  const monaco = await import('monaco-editor/esm/vs/editor/editor.main')
  if (editorContainer.value) {
    editorInstance.value = monaco.editor.create(editorContainer.value, {
      value: '',
      language: 'markdown',
      theme: 'vs-dark',
      ...editorOptions,
      automaticLayout: true,
    })
  }
})

// 监听文档变化
watch(() => docsStore.currentDoc, async () => {
  if (!docsStore.currentDoc) {
    content.value = ''
    if (editorInstance.value) {
      editorInstance.value.setValue('')
    }
    return
  }

  try {
    const docContent = await $fetch(`/api/docs/content?doc=${encodeURIComponent(docsStore.currentDoc)}`) as string
    if (docContent !== null) {
      content.value = docContent
      docsStore.setDocContent(docContent)
      if (editorInstance.value) {
        editorInstance.value.setValue(docContent)
      }
    }
  } catch (e) {
    console.error('Failed to load doc:', e)
    content.value = '加载失败'
    if (editorInstance.value) {
      editorInstance.value.setValue('加载失败')
    }
  }
})

const saveDoc = async () => {
  if (!docsStore.currentDoc) return

  try {
    await $fetch('/api/docs/save', {
      method: 'POST',
      body: {
        doc: docsStore.currentDoc,
        content: content.value
      }
    })
    docsStore.setDocContent(content.value)
  } catch (e) {
    console.error('Failed to save doc:', e)
  }
}

const refresh = async () => {
  if (!docsStore.currentDoc) return

  try {
    const docContent = await $fetch(`/api/docs/content?doc=${encodeURIComponent(docsStore.currentDoc)}`) as string
    if (docContent !== null) {
      content.value = docContent
      docsStore.setDocContent(docContent)
      if (editorInstance.value) {
        editorInstance.value.setValue(docContent)
      }
    }
  } catch (e) {
    console.error('Failed to refresh doc:', e)
  }
}
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

.monaco-container {
  height: 100%;
}
</style>
