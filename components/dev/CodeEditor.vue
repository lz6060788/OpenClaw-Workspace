<!-- components/dev/CodeEditor.vue -->
<template>
  <div class="code-editor">
    <div class="editor-header">
      <div class="file-info">
        <UIcon name="lucide:file-code" size="sm" class="text-blue-400" />
        <span class="file-name">
          {{ projectStore.currentFile || '未选择文件' }}
        </span>
      </div>
      <AppButton
        v-if="projectStore.currentFile && hasChanges"
        variant="primary"
        size="sm"
        icon="save"
        @click="saveFile"
      >
        保存
      </AppButton>
    </div>
    <div class="editor-body">
      <div v-if="!projectStore.currentFile" class="empty-state">
        <UIcon name="lucide:file-search" size="xl" class="empty-icon" />
        <p>选择文件查看内容</p>
      </div>
      <div v-else ref="editorContainer" class="monaco-container"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import { UIcon as AppIcon } from '~/components/base/AppIcon.vue'
import AppButton from '~/components/base/AppButton.vue'

const projectStore = useProjectStore()
const editorContainer = ref<HTMLElement>()
const editorInstance = ref<any>(null)
const content = ref('')

const hasChanges = computed(() => {
  return content.value !== projectStore.fileContent
})

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  scrollBeyondLastLine: false,
  automaticLayout: true,
  theme: 'vs-dark',
}

const language = computed(() => {
  if (!projectStore.currentFile) return 'plaintext'
  const ext = projectStore.currentFile.split('.').pop()
  const map: Record<string, string> = {
    ts: 'typescript',
    js: 'javascript',
    vue: 'vue',
    md: 'markdown',
    json: 'json',
    css: 'css',
    scss: 'scss',
    html: 'html',
  }
  return map[ext || ''] || 'plaintext'
})

const saveFile = async () => {
  if (!projectStore.currentProject || !projectStore.currentFile) return

  try {
    await $fetch('/api/projects/save', {
      method: 'POST',
      body: {
        project: projectStore.currentProject.full_name,
        path: projectStore.currentFile,
        content: content.value
      }
    })
    // 更新 store 中的内容
    projectStore.setFileContent(content.value)
  } catch (e) {
    console.error('Failed to save file:', e)
  }
}

// 初始化 Monaco Editor
onMounted(async () => {
  const monaco = await import('monaco-editor/esm/vs/editor/editor.main')
  if (editorContainer.value) {
    editorInstance.value = monaco.editor.create(editorContainer.value, {
      value: '',
      language: 'plaintext',
      theme: 'vs-dark',
      ...editorOptions,
      automaticLayout: true,
    })
  }
})

// 监听文件变化
watch(() => projectStore.fileContent, (newVal) => {
  content.value = newVal
  if (editorInstance.value) {
    editorInstance.value.setValue(newVal)
  }
})

// 监听当前文件变化，更新语言
watch(() => projectStore.currentFile, () => {
  if (editorInstance.value) {
    const monaco = window.monaco
    if (monaco) {
      const model = editorInstance.value.getModel()
      if (model) {
        monaco.editor.setModelLanguage(model, language.value)
      }
    }
  }
})

// 监听编辑器内容变化
watch(content, (newVal) => {
  // 这里不需要做任何事，因为内容已经在 content 中
})
</script>

<style scoped>
.code-editor {
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

.file-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.file-name {
  font-size: var(--text-sm);
  font-weight: 500;
  color: #f1f5f9;
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
