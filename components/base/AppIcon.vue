<!-- components/base/AppIcon.vue -->
<template>
  <span
    class="app-icon inline-flex items-center justify-center relative select-none shrink-0"
    :class="[
      sizeClass,
      roundedClass,
      {
        'cursor-pointer': clickable && !disabled,
        'opacity-50 pointer-events-none': disabled,
        'transition-all duration-200': clickable
      },
      hoverClass,
      activeClass
    ]"
    :title="title"
  >
    <!-- 背景层 -->
    <div
      v-if="hasBackground"
      class="absolute inset-0 rounded-lg transition-all duration-200 -z-10 box-border"
      :class="[backgroundClass, backgroundHoverClass]"
    />

    <!-- 图标 -->
    <UIcon
      :name="iconName"
      class="flex-shrink-0 relative z-10 transition-all duration-200"
      :class="[iconSizeClass, iconHoverClass]"
      :style="{ color: computedColor }"
    />

    <!-- 标签文本 -->
    <span
      v-if="label"
      class="ml-2 text-sm font-medium transition-colors duration-200"
      :class="labelClass"
    >
      {{ label }}
    </span>

    <!-- 加载遮罩 -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center rounded-lg bg-zinc-900/70 backdrop-blur-sm z-20"
    >
      <UIcon name="lucide:loader-2" class="w-4 h-4 animate-spin" style="color: rgb(251 191 36)" />
    </div>
  </span>
</template>

<script setup lang="ts">
interface Props {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'ghost' | 'primary' | 'secondary' | 'danger' | 'success' | 'subtle'
  background?: 'filled' | 'tinted' | 'outlined' | 'none'
  disabled?: boolean
  loading?: boolean
  clickable?: boolean
  iconColor?: string
  rounded?: boolean
  title?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'ghost',
  background: 'none',
  disabled: false,
  loading: false,
  clickable: false,
  rounded: false,
  title: '',
  label: ''
})

// 图标名称
const iconName = computed(() => {
  const name = props.name
    .replace(/^i-/, '')
    .replace(/^lucide-/, '')
  return `lucide:${name}`
})

// 尺寸类
const sizeClass = computed(() => {
  const map = {
    xs: 'w-8 h-8 p-1.5',
    sm: 'w-9 h-9 p-2',
    md: 'w-10 h-10 p-2.5',
    lg: 'w-11 h-11 p-2.5',
    xl: 'w-12 h-12 p-3'
  }
  return map[props.size]
})

const iconSizeClass = computed(() => {
  const map = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5',
    xl: 'w-5.5 h-5.5'
  }
  return map[props.size]
})

const roundedClass = computed(() => {
  return props.rounded ? 'rounded-full' : 'rounded-lg'
})

// 计算颜色
const computedColor = computed(() => {
  if (props.disabled) return '#71717a'
  if (props.iconColor) return props.iconColor

  const colors = {
    ghost: '#71717a',
    primary: '#f59e0b',
    secondary: '#a1a1aa',
    danger: '#f87171',
    success: '#34d399',
    subtle: '#71717a'
  }
  return colors[props.variant] || colors.ghost
})

// 是否有背景
const hasBackground = computed(() => props.background !== 'none')

// 背景类
const backgroundClass = computed(() => {
  if (props.variant === 'primary') {
    if (props.background === 'filled') return 'bg-gradient-to-br from-amber-400 to-amber-600'
    if (props.background === 'tinted') return 'bg-amber-500/10'
    if (props.background === 'outlined') return 'bg-zinc-900/50'
  }

  if (props.variant === 'danger' && props.background === 'tinted') {
    return 'bg-red-500/10'
  }

  if (props.variant === 'success' && props.background === 'tinted') {
    return 'bg-emerald-500/10'
  }

  // 默认 ghost 背景
  if (props.background === 'filled') return 'bg-zinc-800/50'
  if (props.background === 'tinted') return 'bg-zinc-800/30'
  if (props.background === 'outlined') return 'bg-zinc-900/50'

  return ''
})

// 悬浮态背景类
const backgroundHoverClass = computed(() => {
  if (!props.clickable || props.disabled) return ''

  if (props.variant === 'primary') {
    if (props.background === 'filled') return 'group-hover:shadow-lg group-hover:shadow-amber-500/20'
    if (props.background === 'tinted') return 'group-hover:bg-amber-500/20'
    if (props.background === 'outlined') return 'group-hover:bg-amber-500/10'
  }

  if (props.variant === 'danger' && props.background === 'tinted') {
    return 'group-hover:bg-red-500/20'
  }

  if (props.variant === 'success' && props.background === 'tinted') {
    return 'group-hover:bg-emerald-500/20'
  }

  // 默认 ghost 背景
  if (props.background === 'filled') return 'group-hover:bg-zinc-700/50'
  if (props.background === 'tinted') return 'group-hover:bg-zinc-700/30'
  if (props.background === 'outlined') return 'group-hover:bg-zinc-700/50'

  return 'group-hover:bg-white/5'
})

// 悬浮态容器类
const hoverClass = computed(() => {
  if (!props.clickable || props.disabled) return ''
  return 'hover:scale-105 active:scale-95 group'
})

// 点击态
const activeClass = computed(() => {
  if (!props.clickable || props.disabled) return ''
  return 'active:scale-95'
})

// 图标悬浮态
const iconHoverClass = computed(() => {
  if (!props.clickable || props.disabled) return ''
  return 'group-hover:scale-110'
})

// 标签样式
const labelClass = computed(() => {
  if (props.disabled) return 'text-zinc-600'
  if (props.variant === 'primary') return 'text-amber-400'
  if (props.variant === 'danger') return 'text-red-400'
  if (props.variant === 'success') return 'text-emerald-400'
  return 'text-zinc-400 group-hover:text-zinc-300'
})
</script>

<style scoped>
.app-icon {
  align-items: center;
  justify-content: center;
}
</style>
