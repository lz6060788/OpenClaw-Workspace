<!-- components/dev/CodeEditor.vue -->
<template>
  <div class="flex flex-col h-full bg-zinc-900/50">
    <!-- 编辑器头部 -->
    <div class="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 bg-zinc-800/50">
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <el-icon :size="16" color="rgb(96 165 250)">
          <IconsDocumentCopy />
        </el-icon>
        <span class="text-sm font-medium text-zinc-100 truncate">
          {{ projectStore.currentFile || '未选择文件' }}
        </span>
        <span v-if="!editMode" class="text-xs text-zinc-500">(只读)</span>
      </div>
      <div class="flex items-center gap-2">
        <el-button
          v-if="projectStore.currentFile && !editMode"
          :loading="loadingEditor"
          type="warning"
          size="small"
          text
          @click="toggleEditMode"
        >
          {{ loadingEditor ? '加载中...' : '编辑模式' }}
        </el-button>
        <el-button
          v-if="editMode && hasChanges"
          type="primary"
          size="small"
          :icon="IconsCheck"
          @click="saveFile"
        >
          保存
        </el-button>
        <el-button
          v-if="editMode"
          size="small"
          text
          @click="exitEditMode"
        >
          退出编辑
        </el-button>
      </div>
    </div>

    <!-- 编辑器主体 -->
    <div class="flex-1 overflow-hidden relative">
      <!-- 未选择文件 -->
      <div v-if="!projectStore.currentFile" class="flex flex-col items-center justify-center h-full text-zinc-500">
        <el-icon :size="48" color="rgb(82 82 83)">
          <IconsSearch />
        </el-icon>
        <p class="text-sm mt-3">选择文件查看内容</p>
      </div>

      <!-- 只读模式 -->
      <div v-else-if="!editMode" class="h-full overflow-auto p-4">
        <pre
          v-if="projectStore.fileContent"
          class="text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap break-words font-mono"
        >{{ projectStore.fileContent }}</pre>
        <div v-else class="text-zinc-500">加载中...</div>
      </div>

      <!-- 编辑模式 - Monaco Editor -->
      <div v-show="editMode" ref="editorContainer" class="h-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import * as Icons from '@element-plus/icons-vue'

const IconsCheck = Icons.Check
const IconsDocumentCopy = Icons.DocumentCopy
const IconsSearch = Icons.Search

const projectStore = useProjectStore()
const colorMode = useColorMode()
const editorContainer = ref<HTMLElement>()
const editMode = ref(false)
const loadingEditor = ref(false)
const editorInstance = shallowRef<any>(null)
const editorContent = ref('')

const hasChanges = computed(() => {
  return editorContent.value !== projectStore.fileContent
})

const language = computed(() => {
  if (!projectStore.currentFile) return 'plaintext'
  const ext = projectStore.currentFile.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    ts: 'typescript',
    js: 'javascript',
    vue: 'vue',
    md: 'markdown',
    json: 'json',
    css: 'css',
    scss: 'scss',
    html: 'html',
    xml: 'xml',
    txt: 'plaintext',
  }
  return map[ext || ''] || 'plaintext'
})

const monacoTheme = computed(() => {
  return colorMode.value === 'dark' ? 'vs-dark' : 'vs'
})

const toggleEditMode = async () => {
  if (editMode.value || loadingEditor.value) return

  // 检查文件大小
  if (projectStore.fileContent && projectStore.fileContent.length > 500 * 1024) {
    alert('文件过大（超过500KB），建议使用其他编辑器')
    return
  }

  loadingEditor.value = true

  try {
    const monaco = await import('monaco-editor')

    editMode.value = true
    await nextTick()

    if (!editorContainer.value) {
      editMode.value = false
      return
    }

    editorInstance.value = monaco.editor.create(editorContainer.value, {
      value: projectStore.fileContent || '',
      language: language.value,
      theme: monacoTheme.value,
      fontSize: 14,
      lineHeight: 22,
      fontFamily: "'JetBrains Mono', 'Consolas', monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'off',
      lineNumbers: 'on',
      quickSuggestions: false,
      suggestOnTriggerCharacters: false,
      acceptSuggestionOnEnter: 'off',
      tabCompletion: 'off',
      semanticHighlighting: { enabled: false },
      largeFileOptimizations: true,
    })

    editorInstance.value.onDidChangeModelContent(() => {
      if (!editorInstance.value) return
      editorContent.value = editorInstance.value.getValue()
    })

    editorContent.value = projectStore.fileContent || ''
  } catch (error) {
    console.error('CodeEditor: failed to enable edit mode', error)
    editMode.value = false
  } finally {
    loadingEditor.value = false
  }
}

const exitEditMode = () => {
  if (editorInstance.value) {
    try {
      editorInstance.value.dispose()
    } catch (e) {
      console.error('CodeEditor: dispose error', e)
    }
    editorInstance.value = null
  }

  editMode.value = false
  editorContent.value = ''
}

const saveFile = async () => {
  if (!projectStore.currentProject || !projectStore.currentFile) return

  try {
    await $fetch('/api/projects/save', {
      method: 'POST',
      body: {
        project: projectStore.currentProject.full_name,
        path: projectStore.currentFile,
        content: editorContent.value
      }
    })
    projectStore.setFileContent(editorContent.value)
  } catch (e) {
    console.error('Failed to save file:', e)
  }
}

watch(() => colorMode.value, async () => {
  if (!editorInstance.value) return
  const monaco = await import('monaco-editor')
  monaco.editor.setTheme(monacoTheme.value)
})

watch(() => projectStore.currentFile, (newFile, oldFile) => {
  if (newFile !== oldFile) {
    exitEditMode()
  }
})

onUnmounted(() => {
  exitEditMode()
})
</script>
