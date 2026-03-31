<!-- components/dev/TreeNode.vue -->
<template>
  <div>
    <div
      class="flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-all duration-150 text-zinc-300 text-sm hover:bg-white/5 hover:text-zinc-100"
      :class="{ 'bg-blue-500/15 text-blue-400': isSelected }"
      @click="handleClick"
    >
      <!-- 展开/折叠图标 -->
      <Icon
        v-if="node.isDirectory"
        :name="isExpanded ? 'chevron-down' : 'chevron-right'"
        size="xs"
        icon-color="rgb(115 115 125)"
        class="shrink-0"
      />
      <span v-else class="w-3.5 shrink-0"></span>

      <!-- 文件/文件夹图标 -->
      <Icon
        :name="node.isDirectory ? (isExpanded ? 'folder-open' : 'folder') : 'file'"
        size="xs"
        :icon-color="node.isDirectory ? 'rgb(251 191 36)' : 'rgb(115 115 125)'"
      />

      <!-- 名称 -->
      <span class="flex-1 truncate">{{ node.name }}</span>

      <!-- Loading指示器 -->
      <Icon
        v-if="loading"
        name="loader-2"
        size="xs"
        :loading="true"
        icon-color="rgb(251 191 36)"
      />
    </div>

    <!-- 子节点 -->
    <Transition name="expand">
      <div v-if="isExpanded && (node.children?.length || hasLoaded)" class="pl-4">
        <TreeNode
          v-for="child in node.children"
          :key="child.path"
          :node="child"
          @select="$emit('select', $event)"
        />
        <div v-if="hasLoaded && node.children?.length === 0" class="text-xs text-zinc-600 py-2 px-3">
          空目录
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import * as Icons from '@element-plus/icons-vue'

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  projectPath: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select'])

const projectStore = useProjectStore()
const isExpanded = ref(false)
const loading = ref(false)
const hasLoaded = ref(false)

// 从 projectStore 获取当前选中状态
const isSelected = computed(() => {
  return projectStore.currentFile === props.node.path
})

const handleClick = async () => {
  if (props.node.isDirectory) {
    // 如果已经展开则折叠，否则展开
    if (isExpanded.value) {
      isExpanded.value = false
    } else {
      // 如果还没有加载过子项，则加载
      if (!hasLoaded.value && props.node.children?.length === 0) {
        await loadChildren()
      }
      isExpanded.value = true
    }
  } else {
    // 文件点击：总是触发选择事件
    emit('select', props.node)
  }
}

const loadChildren = async () => {
  loading.value = true
  try {
    const data = await $fetch('/api/projects/files', {
      query: {
        project: props.projectPath,
        path: props.node.path
      }
    }) as any[]

    if (data) {
      props.node.children = data
    }
    hasLoaded.value = true
  } catch (error) {
    console.error('Failed to load children:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease-out;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
