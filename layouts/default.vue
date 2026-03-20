<script setup lang="ts">
const colorMode = useColorMode()
const route = useRoute()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

// 简化导航 - 只保留核心功能
const links = [
  { label: '任务', to: '/tasks', icon: 'lucide:list-todo' },
  { label: '设置', to: '/settings', icon: 'lucide:settings' },
]
</script>

<template>
  <UApp>
    <div class="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <!-- 左侧导航 -->
      <aside class="w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <!-- Logo -->
        <div class="h-14 flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-2">
            <UIcon name="lucide:claw" class="w-8 h-8 text-primary-500" />
            <span class="font-semibold text-lg">OpenClaw</span>
          </div>
        </div>
        
        <!-- 导航 -->
        <nav class="flex-1 p-2">
          <UVerticalNavigation :links="links" />
        </nav>
        
        <!-- 底部 -->
        <div class="p-3 border-t border-gray-200 dark:border-gray-700">
          <UButton :icon="isDark ? 'lucide:sun' : 'lucide:moon'" variant="ghost" size="sm" @click="isDark = !isDark" />
        </div>
      </aside>
      
      <!-- 主内容 -->
      <main class="flex-1 flex flex-col min-w-0">
        <header class="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
          <h1 class="text-xl font-semibold">{{ route.meta.title || '任务' }}</h1>
        </header>
        <div class="flex-1 p-6 overflow-auto">
          <slot />
        </div>
      </main>
    </div>
  </UApp>
</template>
