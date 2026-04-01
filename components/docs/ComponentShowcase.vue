<!-- components/docs/ComponentShowcase.vue -->
<template>
  <div class="component-showcase">
    <div class="component-showcase-header">
      <h2 class="component-showcase-title">{{ title }}</h2>
      <p v-if="description" class="component-showcase-description">{{ description }}</p>
    </div>

    <div class="component-showcase-preview">
      <div class="component-showcase-demo">
        <slot />
      </div>
      
      <div class="component-showcase-actions">
        <el-button
          variant="ghost"
          size="sm"
          icon="copy"
          @click="copyCode"
        >
          {{ copyButtonText }}
        </el-button>
      </div>
    </div>

    <div v-if="code" class="component-showcase-code">
      <pre><code>{{ code }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">


const props = defineProps<{
  title: string
  description?: string
  code?: string
}>()

const copyButtonText = ref('复制代码')

const copyCode = async () => {
  if (props.code) {
    await navigator.clipboard.writeText(props.code)
    copyButtonText.value = '已复制!'
    setTimeout(() => {
      copyButtonText.value = '复制代码'
    }, 2000)
  }
}
</script>

<style scoped>
.component-showcase {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  margin-bottom: 2rem;
}

.component-showcase-header {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.component-showcase-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: #f1f5f9;
  margin: 0;
}

.component-showcase-description {
  font-size: var(--text-sm);
  color: rgba(241, 245, 249, 0.6);
  margin: 0;
}

.component-showcase-preview {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.component-showcase-demo {
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  min-height: 100px;
}

.component-showcase-actions {
  display: flex;
  justify-content: flex-end;
}

.component-showcase-code {
  position: relative;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.component-showcase-code pre {
  margin: 0;
  padding: 1rem;
  overflow-x: auto;
}

.component-showcase-code code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: var(--text-sm);
  color: #e2e8f0;
  line-height: 1.6;
}
</style>
