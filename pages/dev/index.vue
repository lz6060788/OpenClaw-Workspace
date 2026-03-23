<!-- pages/dev/index.vue -->
<template>
  <div class="dev-page">
    <!-- 可收起的侧边栏 -->
    <Transition name="slide">
      <DevSidebar v-show="sidebarOpen" class="dev-sidebar" />
    </Transition>

    <!-- 主内容区 -->
    <div class="dev-main">
      <!-- 侧边栏切换按钮 -->
      <button class="sidebar-toggle" @click="toggleSidebar">
        <AppIcon :name="sidebarOpen ? 'chevron-left' : 'chevron-right'" size="sm" />
      </button>

      <!-- AI对话主区域 -->
      <ChatPanel class="dev-chat" />

      <!-- 可展开的工具面板 -->
      <div class="dev-panels" :class="{ 'panels-open': panelsOpen }">
        <div class="panel-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            <AppIcon :name="tab.icon" size="xs" />
            <span class="tab-label">{{ tab.label }}</span>
          </button>
          <button class="panel-close" @click="panelsOpen = false">
            <AppIcon name="x" size="xs" />
          </button>
        </div>

        <div class="panel-content">
          <FileArea v-if="activeTab === 'files'" />
          <PreviewPanel v-else-if="activeTab === 'preview'" />
        </div>
      </div>

      <!-- 浮动工具栏（打开面板） -->
      <button v-if="!panelsOpen" class="floating-toolbar" @click="panelsOpen = true">
        <AppIcon name="layers" size="sm" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DevSidebar from '~/components/layout/DevSidebar.vue'
import ChatPanel from '~/components/dev/ChatPanel.vue'
import PreviewPanel from '~/components/dev/PreviewPanel.vue'
import FileArea from '~/components/dev/FileArea.vue'
import AppIcon from '~/components/base/AppIcon.vue'

const sidebarOpen = ref(true)
const panelsOpen = ref(false)
const activeTab = ref('files')

const tabs = [
  { key: 'files', label: '文件', icon: 'folder' },
  { key: 'preview', label: '预览', icon: 'eye' }
]

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// 移动端自动收起侧边栏
onMounted(() => {
  if (window.innerWidth < 768) {
    sidebarOpen.value = false
  }
})
</script>

<style scoped>
.dev-page {
  display: flex;
  height: 100%;
  overflow: hidden;
  position: relative;
}

/* 侧边栏 */
.dev-sidebar {
  width: 280px;
  flex-shrink: 0;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* 侧边栏动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* 主内容区 */
.dev-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* 侧边栏切换按钮 */
.sidebar-toggle {
  position: absolute;
  top: var(--spacing-4);
  left: var(--spacing-3);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: rgba(241, 245, 249, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}

.sidebar-toggle:hover {
  background: rgba(30, 41, 59, 0.9);
  color: #f1f5f9;
}

/* AI对话主区域 */
.dev-chat {
  flex: 1;
  overflow: hidden;
}

/* 可展开工具面板 */
.dev-panels {
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  max-width: 800px;
  height: 100%;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 20;
  display: flex;
  flex-direction: column;
}

.dev-panels.panels-open {
  transform: translateX(0);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
}

/* 面板标签栏 */
.panel-tabs {
  display: flex;
  align-items: center;
  padding: var(--spacing-2);
  background: rgba(15, 23, 42, 0.8);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: var(--spacing-1);
}

.panel-tabs button {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  background: transparent;
  border: none;
  color: rgba(241, 245, 249, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: var(--text-sm);
}

.panel-tabs button:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #f1f5f9;
}

.panel-tabs button.active {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.panel-close {
  margin-left: auto;
}

.tab-label {
  font-size: var(--text-sm);
}

/* 面板内容 */
.panel-content {
  flex: 1;
  overflow: hidden;
}

/* 浮动工具栏 */
.floating-toolbar {
  position: absolute;
  bottom: var(--spacing-6);
  right: var(--spacing-4);
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  transition: all 0.2s ease;
  z-index: 15;
}

.floating-toolbar:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
}

/* 平板适配 */
@media (max-width: 1024px) {
  .dev-panels {
    width: 80%;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .dev-sidebar {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 30;
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
  }

  .dev-panels {
    width: 100%;
    max-width: none;
  }

  .sidebar-toggle {
    top: var(--spacing-3);
    left: var(--spacing-2);
  }

  .floating-toolbar {
    bottom: var(--spacing-4);
    right: var(--spacing-3);
    width: 3.5rem;
    height: 3.5rem;
  }

  .tab-label {
    display: none;
  }
}
</style>
