<!-- pages/docs/index.vue -->
<template>
  <div class="docs-page">
    <DocsSidebar @select="handleSelectDoc" />
    <DocEditor class="docs-editor" />
  </div>
</template>

<script setup lang="ts">
import DocsSidebar from '~/components/layout/DocsSidebar.vue'
import DocEditor from '~/components/docs/DocEditor.vue'

const handleSelectDoc = (doc: string) => {
  // DocEditor 组件会通过 docsStore 自动响应
}
</script>

<style scoped>
.docs-page {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.docs-editor {
  flex: 1;
}
</style>
