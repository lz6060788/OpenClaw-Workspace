<!-- layouts/default.vue -->
<template>
  <div class="flex h-screen overflow-hidden bg-zinc-900 text-zinc-50">
    <!-- 桌面端一级侧边栏 -->
    <aside
      class="hidden md:flex flex-col items-center p-3 bg-zinc-800/50 border-r border-white/5 w-16 transition-all duration-300 relative z-10 backdrop-blur-sm"
      :class="{ 'w-12': sidebarCollapsed }"
    >
      <div class="mb-4">
        <div class="w-10 h-10 flex-center bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer">
          <span class="text-lg">🦞</span>
        </div>
      </div>

      <nav class="flex-1 flex flex-col gap-2">
        <NuxtLink
          to="/dev"
          class="group flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all duration-200"
          :class="route.path.startsWith('/dev')
            ? 'bg-amber-500/10 text-amber-400'
            : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'"
        >
          <el-icon :size="16" :color="route.path.startsWith('/dev') ? 'rgb(251 191 36)' : ''">
            <IconsDocument />
          </el-icon>
          <span class="text-[10px] font-medium">开发</span>
        </NuxtLink>
        <NuxtLink
          to="/docs"
          class="group flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all duration-200"
          :class="route.path.startsWith('/docs')
            ? 'bg-amber-500/10 text-amber-400'
            : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'"
        >
          <el-icon :size="16" :color="route.path.startsWith('/docs') ? 'rgb(251 191 36)' : ''">
            <IconsDocument />
          </el-icon>
          <span class="text-[10px] font-medium">文档</span>
        </NuxtLink>
        <NuxtLink
          to="/settings"
          class="group flex flex-col items-center gap-1.5 p-2.5 rounded-xl transition-all duration-200"
          :class="route.path.startsWith('/settings')
            ? 'bg-amber-500/10 text-amber-400'
            : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'"
        >
          <el-icon :size="16" :color="route.path.startsWith('/settings') ? 'rgb(251 191 36)' : ''">
            <IconsSetting />
          </el-icon>
          <span class="text-[10px] font-medium">设置</span>
        </NuxtLink>
      </nav>

      <el-icon
        :size="16"
        class="cursor-pointer hover:scale-110 transition-transform p-2"
        :title="sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'"
        @click="sidebarCollapsed = !sidebarCollapsed"
      >
        <IconsArrowLeft v-if="!sidebarCollapsed" />
        <IconsArrowRight v-else />
      </el-icon>
    </aside>

    <!-- 桌面端二级侧边栏 -->
    <aside
      class="hidden md:flex flex-col bg-zinc-800/30 border-r border-white/5 overflow-hidden transition-all duration-300 backdrop-blur-sm"
      :class="{ 'w-0': sidebarCollapsed, 'w-64': !sidebarCollapsed }"
    >
      <!-- Dev 侧边栏 -->
      <DevSidebar v-if="route.path.startsWith('/dev')" />
      <!-- Docs 侧边栏 -->
      <DocsSidebar v-else-if="route.path.startsWith('/docs')" />
      <!-- Settings 侧边栏 -->
      <div v-else-if="route.path.startsWith('/settings')" class="p-4">
        <h2 class="text-sm font-semibold text-zinc-100">系统设置</h2>
        <p class="text-xs text-zinc-500 mt-1">配置 OpenClaw Workspace</p>
      </div>
    </aside>

    <!-- 主区域 -->
    <main class="flex-1 overflow-hidden bg-zinc-900 flex flex-col min-w-0">
      <!-- 顶部导航栏 -->
      <header class="h-14 px-4 md:px-5 border-b border-white/5 bg-zinc-900/90 backdrop-blur-xl flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0">
          <span class="md:hidden text-lg">🦞</span>
          <div class="min-w-0">
            <p class="text-xs text-zinc-500 leading-tight">OpenClaw Workspace</p>
            <h1 class="text-sm md:text-base text-zinc-100 font-semibold truncate">{{ pageTitle }}</h1>
          </div>
        </div>

        <el-button
          :icon="colorMode.value === 'dark' ? IconsMoon : IconsSunny"
          :title="`切换主题（当前：${themeLabel}）`"
          text
          @click="toggleTheme"
        >
          <span class="text-xs font-medium">{{ themeLabel }}</span>
        </el-button>
      </header>

      <div class="w-full flex-1 overflow-hidden flex flex-col min-w-0">
        <KeepAlive>
          <NuxtPage />
        </KeepAlive>
      </div>
    </main>

    <!-- 移动端底部导航 -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 h-[calc(56px+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] bg-zinc-800/90 border-t border-white/5 z-40 flex items-center justify-around px-safe-left px-safe-right backdrop-blur-lg">
      <NuxtLink
        to="/dev"
        class="flex-1 flex flex-col items-center gap-1 p-2 text-zinc-500 active:text-amber-400 transition-colors"
        :class="{ 'text-amber-400': route.path.startsWith('/dev') }"
        @click="mobileDrawerOpen = false"
      >
        <el-icon :size="16" :color="route.path.startsWith('/dev') ? 'rgb(251 191 36)' : ''">
          <IconsDocument />
        </el-icon>
        <span class="text-[10px] font-medium">开发</span>
      </NuxtLink>

      <button
        class="flex-1 flex flex-col items-center gap-1 p-2 text-zinc-500 active:text-amber-400 transition-all active:scale-95"
        :class="{ 'text-zinc-200 bg-white/5': mobileDrawerOpen }"
        @click="mobileDrawerOpen = !mobileDrawerOpen"
      >
        <el-icon :size="16">
          <IconsClose v-if="mobileDrawerOpen" />
          <IconsMenu v-else />
        </el-icon>
        <span class="text-[10px] font-medium">{{ mobileDrawerOpen ? '关闭' : '菜单' }}</span>
      </button>

      <NuxtLink
        to="/docs"
        class="flex-1 flex flex-col items-center gap-1 p-2 text-zinc-500 active:text-amber-400 transition-colors"
        :class="{ 'text-amber-400': route.path.startsWith('/docs') }"
        @click="mobileDrawerOpen = false"
      >
        <el-icon :size="16" :color="route.path.startsWith('/docs') ? 'rgb(251 191 36)' : ''">
          <IconsDocument />
        </el-icon>
        <span class="text-[10px] font-medium">文档</span>
      </NuxtLink>

      <NuxtLink
        to="/settings"
        class="flex-1 flex flex-col items-center gap-1 p-2 text-zinc-500 active:text-amber-400 transition-colors"
        :class="{ 'text-amber-400': route.path.startsWith('/settings') }"
        @click="mobileDrawerOpen = false"
      >
        <el-icon :size="16" :color="route.path.startsWith('/settings') ? 'rgb(251 191 36)' : ''">
          <IconsSetting />
        </el-icon>
        <span class="text-[10px] font-medium">设置</span>
      </NuxtLink>
    </nav>

    <!-- 移动端抽屉遮罩 -->
    <Teleport to="body">
      <div
        v-if="mobileDrawerOpen"
        class="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        :class="{ 'opacity-100': mobileDrawerOpen, 'opacity-0 pointer-events-none': !mobileDrawerOpen }"
        @click="mobileDrawerOpen = false"
      />

      <!-- 移动端抽屉侧边栏 -->
      <aside
        class="md:hidden fixed top-0 left-0 bottom-[calc(56px+env(safe-area-inset-bottom))] w-80 max-w-[90vw] bg-zinc-800/95 backdrop-blur-xl z-[51] overflow-hidden flex flex-col pt-safe-top transition-transform duration-300 ease-out"
        :class="{ 'translate-x-0': mobileDrawerOpen, '-translate-x-full': !mobileDrawerOpen }"
      >
        <div class="sticky top-0 z-10 p-4 border-b border-white/5 bg-zinc-800/80 backdrop-blur-xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 flex-center bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg">
              <span class="text-lg">🦞</span>
            </div>
            <div>
              <h2 class="text-base font-semibold text-zinc-100 leading-tight">OpenClaw</h2>
              <p class="text-xs text-zinc-500 leading-tight">Workspace</p>
            </div>
          </div>
          <el-icon :size="16" class="cursor-pointer" @click="mobileDrawerOpen = false">
            <IconsClose />
          </el-icon>
        </div>

        <div class="flex-1 overflow-y-auto p-3">
          <!-- Dev 侧边栏 -->
          <DevSidebar v-if="route.path.startsWith('/dev')" />
          <!-- Docs 侧边栏 -->
          <DocsSidebar v-else-if="route.path.startsWith('/docs')" />
          <!-- Settings 占位 -->
          <div v-else-if="route.path.startsWith('/settings')" class="p-4">
            <h2 class="text-sm font-semibold text-zinc-100">系统设置</h2>
            <p class="text-xs text-zinc-500 mt-1">配置 OpenClaw Workspace</p>
          </div>
        </div>
      </aside>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue'
import DevSidebar from '~/components/layout/DevSidebar.vue'
import DocsSidebar from '~/components/layout/DocsSidebar.vue'

const IconsMoon = Icons.Moon
const IconsSunny = Icons.Sunny
const IconsDocument = Icons.DocumentCopy
const IconsSetting = Icons.Setting
const IconsArrowLeft = Icons.ArrowLeft
const IconsArrowRight = Icons.ArrowRight
const IconsClose = Icons.Close
const IconsMenu = Icons.Menu

const route = useRoute()
const colorMode = useColorMode()
const sidebarCollapsed = ref(false)
const mobileDrawerOpen = ref(false)

const pageTitle = computed(() => {
  if (route.path.startsWith('/docs')) return '文档中心'
  if (route.path.startsWith('/dev')) return '开发工作台'
  if (route.path.startsWith('/settings')) return '系统设置'
  return '工作区'
})

const themeLabel = computed(() => {
  return colorMode.value === 'dark' ? '深色' : '浅色'
})

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

watch(() => route.path, () => {
  mobileDrawerOpen.value = false
})

if (process.client) {
  sidebarCollapsed.value = false
}
</script>
