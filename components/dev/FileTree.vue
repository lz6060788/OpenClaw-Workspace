<!-- components/dev/FileTree.vue -->
<template>
  <div class="flex flex-col h-full">
    <div class="p-3 border-b border-gray-700 font-semibold">
      文件
    </div>
    <div class="flex-1 overflow-y-auto p-2">
      <div v-if="!projectStore.currentProject" class="text-gray-500 text-center py-4 text-sm">
        请先选择项目
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
</template>

<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import TreeNode from '~/components/dev/TreeNode.vue'

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
