<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const links = [
  { label: '任务分发', to: '/tasks', icon: 'lucide:list-todo' },
  { label: 'GitHub', to: '/github', icon: 'lucide:github' },
  { label: '定时任务', to: '/cron', icon: 'lucide:clock' },
  { label: '监控', to: '/monitor', icon: 'lucide:activity' },
  { label: '文档', to: '/docs', icon: 'lucide:book-open' },
  { label: 'Skills', to: '/skills', icon: 'lucide:sparkles' },
  { label: 'Agents', to: '/agents', icon: 'lucide:bot' },
]
</script>

<template>
  <UApp>
    <UDashboardLayout>
      <!-- 左侧导航 -->
      <template #sidebar>
        <UDashboardSidebar>
          <template #header>
            <div class="flex items-center gap-2 px-2">
              <UIcon name="lucide:claw" class="w-8 h-8 text-primary" />
              <span class="font-semibold">OpenClaw</span>
            </div>
          </template>
          
          <UDashboardSidebarLinks :links="links" />
          
          <template #footer>
            <div class="flex items-center justify-between px-2">
              <UColorModeButton v-model="isDark" />
              <span class="text-xs text-neutral-500">v1.0</span>
            </div>
          </template>
        </UDashboardSidebar>
      </template>
      
      <!-- 顶部导航 -->
      <template #header>
        <UDashboardNavbar title="工作台" />
      </template>
      
      <!-- 主内容区 -->
      <div class="p-4">
        <slot />
      </div>
    </UDashboardLayout>
  </UApp>
</template>
