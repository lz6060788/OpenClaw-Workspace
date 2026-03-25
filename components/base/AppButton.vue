<!-- components/base/AppButton.vue -->
<template>
  <button
    class="app-button inline-flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <AppIcon v-if="loading" name="loader-2" :size="iconSize" :icon-color="loadingColor" />
    <AppIcon v-else-if="icon && iconPosition === 'left'" :name="icon" :size="iconSize" :variant="iconVariant" :background="iconBackground" :icon-color="iconColor" />
    <span v-if="$slots.default" class="whitespace-nowrap">
      <slot />
    </span>
    <AppIcon v-else-if="icon && iconPosition === 'right'" :name="icon" :size="iconSize" :variant="iconVariant" :background="iconBackground" :icon-color="iconColor" />
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
  fullWidth: Boolean,
  iconColor: String
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

const iconVariant = computed(() => {
  if (props.variant === 'primary') return 'ghost'
  if (props.variant === 'danger') return 'danger'
  return 'subtle'
})

const iconBackground = computed(() => {
  return 'none'
})

const loadingColor = computed(() => {
  if (props.variant === 'primary') return '#ffffff'
  return 'rgb(251 191 36)'
})

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped>
.app-button {
  font-weight: 500;
  border-radius: var(--radius-lg);
}

.app-button:focus-visible {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
}

/* 尺寸 */
.app-button-xs {
  padding: 0.375rem 0.75rem;
  font-size: var(--text-xs);
  height: 2rem;
}

.app-button-sm {
  padding: 0.5rem 1rem;
  font-size: var(--text-sm);
  height: 2.25rem;
}

.app-button-md {
  padding: 0.625rem 1.25rem;
  font-size: var(--text-sm);
  height: 2.5rem;
}

.app-button-lg {
  padding: 0.75rem 1.5rem;
  font-size: var(--text-base);
  height: 2.75rem;
}

/* 变体 */
.app-button-primary {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #000;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.app-button-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.app-button-secondary {
  background: rgba(39, 39, 42, 0.5);
  color: #d4d4d8;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.app-button-secondary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
}

.app-button-ghost {
  background: transparent;
  color: #a1a1aa;
}

.app-button-ghost:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.05);
  color: #d4d4d8;
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
