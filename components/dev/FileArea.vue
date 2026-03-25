<!-- components/dev/FileArea.vue -->
<template>
  <div class="flex flex-col h-full">
    <!-- 无项目时的空状态 -->
    <div v-if="!projectStore.currentProject" class="flex flex-col items-center justify-center h-full p-8 text-center">
      <AppIcon name="folder-open" size="xl" variant="subtle" background="outlined" icon-color="rgb(82 82 83)" />
      <h4 class="text-lg font-semibold text-zinc-200 mt-4 mb-2">未选择项目</h4>
      <p class="text-sm text-zinc-500">请先选择一个 GitHub 项目</p>
    </div>

    <!-- 有项目时显示文件树和编辑器 -->
    <div v-else class="flex-1 flex flex-col md:flex-row overflow-hidden">
      <!-- 文件树 -->
      <div class="w-full md:w-72 h-[35%] md:h-full md:min-h-0 border-r border-white/5 bg-zinc-900/50 flex flex-col">
        <div class="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-zinc-800/30">
          <AppIcon name="folder" size="sm" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
          <span class="text-sm font-medium text-zinc-300">文件树</span>
        </div>
        <div class="flex-1 overflow-y-auto">
          <div v-if="loading" class="flex flex-col items-center gap-3 p-8 text-zinc-500">
            <AppIcon name="loader-2" size="lg" :loading="true" icon-color="rgb(251 191 36)" />
            <span class="text-sm">加载中...</span>
          </div>
          <div v-else-if="fileTree.length === 0" class="flex flex-col items-center gap-3 p-8 text-zinc-500">
            <AppIcon name="folder-open" size="lg" icon-color="rgb(82 82 83)" />
            <span class="text-sm">空目录</span>
          </div>
          <div v-else class="p-2">
            <TreeNode
              v-for="item in fileTree"
              :key="item.path"
              :node="item"
              :project-path="projectStore.currentProject?.full_name || ''"
              @select="selectFile"
            />
          </div>
        </div>
      </div>

      <!-- 代码编辑器 -->
      <div class="flex-1 h-[65%] md:h-full min-h-0 overflow-hidden">
        <CodeEditor />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import TreeNode from '~/components/dev/TreeNode.vue'
import CodeEditor from '~/components/dev/CodeEditor.vue'
import AppIcon from '~/components/base/AppIcon.vue'

const projectStore = useProjectStore()
const fileTree = ref([])
const loading = ref(false)
const loadingFile = ref<string | null>(null)

const loadFiles = async () => {
  if (!projectStore.currentProject) return

  loading.value = true
  fileTree.value = []

  try {
    const data = await $fetch('/api/projects/files', {
      query: { project: projectStore.currentProject.full_name }
    }) as any[]
    if (data) {
      fileTree.value = data
    }
  } catch (e) {
    console.error('Failed to load files:', e)
  } finally {
    loading.value = false
  }
}

const selectFile = async (file: any) => {
  // 防止重复加载同一个文件
  if (loadingFile.value === file.path) {
    console.log('FileArea: file already loading, skipping', file.path)
    return
  }

  // 如果点击的是当前已选中的文件，不重复加载
  if (projectStore.currentFile === file.path && projectStore.fileContent) {
    console.log('FileArea: file already selected, skipping', file.path)
    return
  }

  console.log('FileArea: selectFile called with', file)
  console.log('FileArea: project', projectStore.currentProject?.full_name)
  console.log('FileArea: file path', file.path)

  projectStore.setCurrentFile(file.path)
  loadingFile.value = file.path

  try {
    const startTime = Date.now()
    const apiUrl = `/api/projects/file?project=${projectStore.currentProject.full_name}&path=${file.path}`
    console.log('FileArea: fetching from', apiUrl)

    const response = await $fetch(apiUrl) as any

    const endTime = Date.now()
    console.log('FileArea: fetch took', endTime - startTime, 'ms')
    console.log('FileArea: response type', typeof response)
    console.log('FileArea: response length', response?.length)
    console.log('FileArea: response preview', typeof response === 'string' ? response.substring(0, 200) : JSON.stringify(response).substring(0, 200))

    if (response !== null && response !== undefined) {
      projectStore.setFileContent(String(response))
      console.log('FileArea: set file content to store, length', String(response).length)
    } else {
      console.warn('FileArea: received null/empty response')
    }
  } catch (e: any) {
    console.error('FileArea: Failed to load file', e)
    console.error('FileArea: error message', e.message)
    console.error('FileArea: error stack', e.stack)
  } finally {
    loadingFile.value = null
  }
}

watch(() => projectStore.currentProject, loadFiles, { immediate: true })
</script>
