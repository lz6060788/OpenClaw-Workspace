<!-- components/dev/TreeNode.vue -->
<template>
  <div>
    <div
      class="tree-node"
      :class="{ 'is-selected': isSelected, 'is-directory': node.isDirectory }"
      @click="handleClick"
    >
      <AppIcon
        :name="node.isDirectory ? (isExpanded ? 'folder-open' : 'folder') : 'file'"
        size="xs"
        :color="node.isDirectory ? '' : 'gray-400'"
      />
      <span class="tree-node-name">{{ node.name }}</span>
    </div>
    <Transition name="expand">
      <div v-if="isExpanded && node.children" class="tree-node-children">
        <TreeNode
          v-for="child in node.children"
          :key="child.path"
          :node="child"
          @select="$emit('select', $event)"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '~/components/base/AppIcon.vue'

const props = defineProps({
  node: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

const isExpanded = ref(false)
const isSelected = ref(false)

const handleClick = () => {
  if (props.node.isDirectory) {
    isExpanded.value = !isExpanded.value
  } else {
    isSelected.value = true
    emit('select', props.node)
  }
}
</script>

<style scoped>
.tree-node {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.15s ease-out;
  color: rgba(241, 245, 249, 0.7);
  font-size: var(--text-sm);
}

.tree-node:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #f1f5f9;
}

.tree-node.is-selected {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  color: #60a5fa;
}

.tree-node-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-node-children {
  padding-left: var(--spacing-4);
}

/* Expand animation */
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
