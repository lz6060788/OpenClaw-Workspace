<!-- components/base/AppIcon.vue -->
<template>
  <span class="app-icon" :class="sizeClass">
    <span v-if="!isLoaded" class="icon-placeholder"></span>
    <i v-else :class="iconClass" @click="handleClick"></i>
  </span>
</template>

<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: String as PropType<'xs' | 'sm' | 'md' | 'lg' | 'xl'>,
    default: 'md'
  },
  color: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<{
  click: []
}>()

const sizeMap = {
  xs: 'w-3 h-3 text-xs',
  sm: 'w-4 h-4 text-sm',
  md: 'w-5 h-5 text-base',
  lg: 'w-6 h-6 text-lg',
  xl: 'w-7 h-7 text-xl'
}

const sizeClass = computed(() => sizeMap[props.size])

// 使用 UnoCSS 图标预设
const iconClass = computed(() => {
  const baseIcon = props.name.startsWith('i-') ? props.name : `i-lucide-${props.name}`
  return props.color ? `${baseIcon} text-${props.color}` : baseIcon
})

const isLoaded = ref(true)

const handleClick = () => {
  emit('click')
}
</script>

<style scoped>
.app-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.icon-placeholder {
  width: 1em;
  height: 1em;
  background: currentColor;
  border-radius: 50%;
  opacity: 0.2;
}
</style>
