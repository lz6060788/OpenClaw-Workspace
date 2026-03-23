<!-- components/base/AppButton.vue -->
<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <AppIcon v-if="loading" name="loader-2" size="sm" class="animate-spin" />
    <AppIcon v-else-if="icon && iconPosition === 'left'" :name="icon" :size="iconSize" />
    <span v-if="$slots.default" :class="{ 'opacity-0': loading }">
      <slot />
    </span>
    <AppIcon v-else-if="icon && iconPosition === 'right'" :name="icon" :size="iconSize" />
  </button>
</template>

<script setup lang="ts">
import AppIcon from './AppIcon.vue'

const props = defineProps({
  variant: {
    type: String as PropType<'primary' | 'secondary' | 'ghost' | 'danger'>,
    default: 'primary'
  },
  size: {
    type: String as PropType<'xs' | 'sm' | 'md' | 'lg'>,
    default: 'md'
  },
  icon: String,
  iconPosition: {
    type: String as PropType<'left' | 'right'>,
    default: 'left'
  },
  disabled: Boolean,
  loading: Boolean,
  fullWidth: Boolean
})

const emit = defineEmits<{
  click: []
}>()

const buttonClasses = computed(() => {
  const classes = ['app-button', `app-button-${props.variant}`, `app-button-${props.size}`]

  if (props.fullWidth) {
    classes.push('app-button-full-width')
  }

  if (props.disabled) {
    classes.push('app-button-disabled')
  }

  if (props.loading) {
    classes.push('app-button-loading')
  }

  return classes.join(' ')
})

const iconSize = computed(() => {
  const sizeMap = { xs: 'xs', sm: 'sm', md: 'sm', lg: 'md' }
  return sizeMap[props.size] || 'sm'
})

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease-out;
  border-radius: var(--radius-lg);
  font-weight: 500;
}

.app-button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* 尺寸 */
.app-button-xs {
  padding: 0.375rem 0.75rem;
  font-size: var(--text-xs);
}

.app-button-sm {
  padding: 0.5rem 1rem;
  font-size: var(--text-sm);
}

.app-button-md {
  padding: 0.625rem 1.25rem;
  font-size: var(--text-sm);
}

.app-button-lg {
  padding: 0.75rem 1.5rem;
  font-size: var(--text-base);
}

/* 变体 */
.app-button-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.app-button-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

.app-button-secondary {
  background: #334155;
  color: white;
}

.app-button-secondary:hover:not(:disabled) {
  background: #475569;
}

.app-button-ghost {
  background: transparent;
  color: #f1f5f9;
}

.app-button-ghost:hover:not(:disabled) {
  background: rgba(241, 245, 249, 0.1);
}

.app-button-danger {
  background: #ef4444;
  color: white;
}

.app-button-danger:hover:not(:disabled) {
  background: #dc2626;
}

/* 状态 */
.app-button-full-width {
  width: 100%;
}

.app-button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app-button-loading {
  pointer-events: none;
}
</style>
