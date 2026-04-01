<!-- components/docs/PropsTable.vue -->
<template>
  <div class="props-table">
    <h3 class="props-table-title">Props</h3>
    <div class="props-table-container">
      <table>
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>默认值</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prop in props" :key="prop.name">
            <td class="prop-name">
              <code>{{ prop.name }}</code>
              <span v-if="prop.required" class="prop-required">*</span>
            </td>
            <td class="prop-type">
              <code>{{ prop.type }}</code>
            </td>
            <td class="prop-default">
              <code>{{ prop.default || '-' }}</code>
            </td>
            <td class="prop-description">{{ prop.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PropInfo {
  name: string
  type: string
  default?: string
  description: string
  required?: boolean
}

defineProps<{
  props: PropInfo[]
  title?: string
}>()
</script>

<style scoped>
.props-table {
  margin-bottom: 2rem;
}

.props-table-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 1rem 0;
}

.props-table-container {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.props-table table {
  width: 100%;
  border-collapse: collapse;
}

.props-table th {
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: var(--text-xs);
  font-weight: 600;
  color: rgba(241, 245, 249, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.props-table td {
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: var(--text-sm);
  color: rgba(241, 245, 249, 0.8);
}

.props-table code {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: var(--text-xs);
  color: #f59e0b;
}

.prop-name {
  font-weight: 500;
  color: #f1f5f9;
}

.prop-required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.prop-type code {
  color: #22c55e;
}

.prop-default code {
  color: rgba(241, 245, 249, 0.5);
}

.prop-description {
  line-height: 1.5;
}
</style>
