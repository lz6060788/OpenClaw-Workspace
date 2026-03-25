<!-- components/dev/CodeEditor.vue -->
<template>
  <div class="flex flex-col h-full bg-zinc-900/50">
    <!-- 编辑器头部 -->
    <div class="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 bg-zinc-800/50">
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <AppIcon name="file-code" size="sm" icon-color="rgb(96 165 250)" />
        <span class="text-sm font-medium text-zinc-100 truncate">
          {{ projectStore.currentFile || '未选择文件' }}
        </span>
        <span v-if="!editMode" class="text-xs text-zinc-500">(只读)</span>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-if="projectStore.currentFile && !editMode"
          @click="toggleEditMode"
          class="text-xs text-amber-400 hover:text-amber-300 transition-colors px-2 py-1 rounded hover:bg-amber-500/10"
        >
          {{ loadingEditor ? '加载中...' : '编辑模式' }}
        </button>
        <AppButton
          v-if="editMode && hasChanges"
          variant="primary"
          size="sm"
          icon="save"
          @click="saveFile"
        >
          保存
        </AppButton>
        <button
          v-if="editMode"
          @click="exitEditMode"
          class="text-xs text-zinc-400 hover:text-zinc-300 transition-colors px-2 py-1 rounded hover:bg-white/5"
        >
          退出编辑
        </button>
      </div>
    </div>

    <!-- 编辑器主体 -->
    <div class="flex-1 overflow-hidden relative">
      <!-- 未选择文件 -->
      <div v-if="!projectStore.currentFile" class="flex flex-col items-center justify-center h-full text-zinc-500">
        <AppIcon name="file-search" size="xl" icon-color="rgb(82 82 83)" />
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
import AppIcon from '~/components/base/AppIcon.vue'
import AppButton from '~/components/base/AppButton.vue'

const projectStore = useProjectStore()
const editorContainer = ref<HTMLElement>()
const editMode = ref(false)
const loadingEditor = ref(false)
const editorInstance = ref<any>(null)
const editorContent = ref('')
const isUpdatingFromEditor = ref(false)
const updateTimer = ref<any>(null)

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

const toggleEditMode = async () => {
  if (editMode.value || loadingEditor.value) return

  // 检查文件大小
  if (projectStore.fileContent && projectStore.fileContent.length > 500 * 1024) {
    alert('文件过大（超过500KB），建议使用其他编辑器')
    return
  }

  loadingEditor.value = true

  try {
    // 动态导入 Monaco
    const monaco = await import('monaco-editor')

    if (!editorContainer.value) return

    // 清空容器
    editorContainer.value.innerHTML = ''

    // 配置禁用所有 worker
    ;(self as any).MonacoEnvironment = {
      getWorker: function (_: any, label: string) {
        // 返回空的 worker，禁用所有语言服务
        return new Worker(URL.createObjectURL(new Blob([''], { type: 'text/javascript' })))
      }
    }

    // 创建编辑器
    editorInstance.value = monaco.editor.create(editorContainer.value, {
      value: projectStore.fileContent || '',
      language: language.value,
      theme: 'vs-dark',
      fontSize: 14,
      lineHeight: 22,
      fontFamily: "'JetBrains Mono', 'Consolas', monospace",
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      tabSize: 2,
      wordWrap: 'off',
      lineNumbers: 'on',
      // 完全禁用智能提示
      quickSuggestions: false,
      suggestOnTriggerCharacters: false,
      acceptSuggestionOnEnter: 'off',
      tabCompletion: 'off',
    })

    // 防抖监听内容变化 - 避免频繁更新导致卡死
    editorInstance.value.onDidChangeModelContent(() => {
      if (!editorInstance.value || isUpdatingFromEditor.value) return

      // 清除之前的定时器
      if (updateTimer.value) {
        clearTimeout(updateTimer.value)
      }

      // 防抖更新，100ms 后执行
      updateTimer.value = setTimeout(() => {
        const newContent = editorInstance.value.getValue()

        // 只有内容真正变化时才更新
        if (newContent !== editorContent.value) {
          isUpdatingFromEditor.value = true
          editorContent.value = newContent
          console.log('CodeEditor: content updated, length:', newContent.length)

          // 下一个事件循环重置标志
          nextTick(() => {
            isUpdatingFromEditor.value = false
          })
        }
      }, 100)
    })

    editorContent.value = projectStore.fileContent || ''
    editMode.value = true

    console.log('CodeEditor: edit mode enabled')
  } catch (error) {
    console.error('CodeEditor: failed to enable edit mode', error)
  } finally {
    loadingEditor.value = false
  }
}

const exitEditMode = () => {
  // 清理定时器
  if (updateTimer.value) {
    clearTimeout(updateTimer.value)
    updateTimer.value = null
  }

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
  isUpdatingFromEditor.value = false
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

// 切换文件时退出编辑模式
watch(() => projectStore.currentFile, (newFile, oldFile) => {
  if (newFile !== oldFile) {
    console.log('CodeEditor: file changed from', oldFile, 'to', newFile)
    exitEditMode()
  }
})

// 组件卸载时清理
onUnmounted(() => {
  exitEditMode()
})
</script>
