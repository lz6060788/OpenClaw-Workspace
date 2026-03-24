<!-- components/base/AppIcon.vue -->
<template>
  <UIcon 
    :name="iconName" 
    :size="sizeMap[props.size]"
    :color="props.color"
    @click="handleClick"
  />
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
  xs: 'xs',
  sm: 'sm', 
  md: 'md',
  lg: 'lg',
  xl: 'xl'
}

// 转换为 Nuxt UI 图标名称格式
const iconName = computed(() => {
  const name = props.name
    .replace(/^i-/, '')
    .replace(/^lucide-/, '')
  return `lucide:${name}`
})

const handleClick = () => {
  emit('click')
}
</script>
