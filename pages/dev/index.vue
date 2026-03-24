<!-- pages/dev/index.vue -->
<template>
  <div class="dev-page">
    <!-- 主内容区 -->
    <div class="dev-main">
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
.dev-page {
  display: flex;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.dev-main {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
}

.dev-chat {
  flex: 1;
  min-width: 0;
}

/* 工具面板 */
.dev-panels {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background: rgba(15, 23, 42, 0.95);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease-out;
  overflow: hidden;
}

.dev-panels.panels-open {
  width: 400px;
}

.panel-tabs {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-2) var(--spacing-3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.5);
}

.panel-tabs button {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: var(--spacing-2) var(--spacing-3);
  border-radius: var(--radius-md);
  background: transparent;
  border: none;
  color: rgba(241, 245, 249, 0.6);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all 0.15s ease-out;
}

.panel-tabs button:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #f1f5f9;
}

.panel-tabs button.active {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.tab-label {
  display: none;
}

.panel-close {
  margin-left: auto;
}

.panel-content {
  flex: 1;
  overflow: hidden;
}

/* 浮动工具栏 */
.floating-toolbar {
  position: absolute;
  right: var(--spacing-4);
  bottom: var(--spacing-4);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  transition: all 0.2s ease-out;
  z-index: 10;
}

.floating-toolbar:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .dev-panels.panels-open {
    width: 100%;
    left: 0;
  }
}
</style>
