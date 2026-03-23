<!-- components/base/AppCard.vue -->
<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="app-card-header">
      <slot name="header" />
    </div>
    <div class="app-card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="app-card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  variant: {
    type: String as PropType<'default' | 'bordered' | 'elevated'>,
    default: 'default'
  },
  padding: {
    type: String as PropType<'none' | 'sm' | 'md' | 'lg'>,
    default: 'md'
  },
  hoverable: Boolean,
  clickable: Boolean
})

const cardClasses = computed(() => {
  const classes = ['app-card', `app-card-${props.variant}`]

  if (props.padding !== 'none') {
    classes.push(`app-card-padding-${props.padding}`)
  }

  if (props.hoverable) {
    classes.push('app-card-hoverable')
  }

  if (props.clickable) {
    classes.push('app-card-clickable')
  }

  return classes.join(' ')
})
</script>

<style scoped>
.app-card {
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all 0.2s ease-out;
}

.app-card-default {
  background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.app-card-bordered {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.app-card-elevated {
  background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
  box-shadow: var(--shadow-xl), 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.app-card-padding-sm {
  padding: var(--spacing-4);
}

.app-card-padding-md {
  padding: var(--spacing-6);
}

.app-card-padding-lg {
  padding: var(--spacing-8);
}

.app-card-hoverable:hover {
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: var(--shadow-lg), 0 0 20px rgba(59, 130, 246, 0.1);
}

.app-card-clickable {
  cursor: pointer;
}

.app-card-clickable:hover {
  transform: translateY(-2px);
}

.app-card-header {
  padding: var(--spacing-5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.app-card-body {
  padding: var(--spacing-5);
}

.app-card-footer {
  padding: var(--spacing-5);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
