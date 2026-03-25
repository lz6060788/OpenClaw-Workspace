<!-- pages/dev/index.vue -->
<template>
  <div class="flex h-full overflow-hidden relative bg-zinc-900">
    <!-- AI对话主区域 -->
    <ChatPanel class="flex-1 min-w-0 flex flex-col" />

    <!-- 可展开的工具面板 -->
    <div
      class="absolute top-0 right-0 bottom-0 bg-zinc-800/95 backdrop-blur-xl border-l border-white/5 flex flex-col overflow-hidden transition-all duration-300 ease-out z-20"
      :class="{ 'w-0': !panelsOpen, 'w-full md:w-[720px]': panelsOpen }"
    >
      <!-- 面板头部 - Tabs样式 -->
      <div v-show="panelsOpen" class="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-zinc-800/50">
        <!-- Tab按钮 -->
        <div class="flex items-center gap-1">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="relative px-4 py-2 text-sm font-medium transition-all duration-200 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:transition-all after:duration-200"
            :class="activeTab === tab.key
              ? 'text-amber-400 after:bg-amber-400'
              : 'text-zinc-500 hover:text-zinc-400 after:bg-transparent'"
            @click="activeTab = tab.key"
          >
            <span class="hidden md:inline">{{ tab.label }}</span>
            <AppIcon :name="tab.icon" size="xs" class="md:hidden" :icon-color="activeTab === tab.key ? 'rgb(251 191 36)' : ''" />
          </button>
        </div>
        <AppIcon
          name="x"
          size="sm"
          variant="subtle"
          clickable
          class="ml-auto"
          @click="panelsOpen = false"
        />
      </div>

      <div class="flex-1 overflow-hidden">
        <FileArea v-if="activeTab === 'files'" class="h-full" />
        <PreviewPanel v-else-if="activeTab === 'preview'" class="h-full" />
      </div>
    </div>

    <!-- 浮动工具按钮 -->
    <Transition name="fab-slide">
      <AppIcon
        v-if="!panelsOpen"
        name="layers"
        size="lg"
        variant="primary"
        background="filled"
        clickable
        class="absolute z-10 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30"
        :class="[
          'top-1/2 -translate-y-1/2',
          'right-4'
        ]"
        title="打开工具面板"
        @click="panelsOpen = true"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import ChatPanel from '~/components/dev/ChatPanel.vue'
import PreviewPanel from '~/components/dev/PreviewPanel.vue'
import FileArea from '~/components/dev/FileArea.vue'
import AppIcon from '~/components/base/AppIcon.vue'

const panelsOpen = ref(false)
const activeTab = ref('files')

const tabs = [
  { key: 'files', label: '文件', icon: 'folder' },
  { key: 'preview', label: '预览', icon: 'eye' }
]
</script>

<style scoped>
.fab-slide-enter-active,
.fab-slide-leave-active {
  transition: all 0.3s ease-out;
}

.fab-slide-enter-from,
.fab-slide-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.8);
}
</style>
