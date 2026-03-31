<!-- pages/dev/index.vue -->
<template>
  <div class="flex h-full overflow-hidden bg-zinc-900">
    <!-- AI对话主区域 -->
    <ChatPanel class="flex-1 min-w-0 flex flex-col" />

    <!-- Element Plus Drawer 抽屉 -->
    <el-drawer
      v-model="panelsOpen"
      direction="rtl"
      :size="720"
      class="dev-drawer"
    >
      <template #header>
        <el-tabs v-model="activeTab" class="drawer-tabs">
          <el-tab-pane label="文件" name="files">
            <template #label>
              <span class="flex items-center gap-1.5">
                <el-icon><IconsFolder /></el-icon>
                <span>文件</span>
              </span>
            </template>
          </el-tab-pane>
          <el-tab-pane label="预览" name="preview">
            <template #label>
              <span class="flex items-center gap-1.5">
                <el-icon><IconsView /></el-icon>
                <span>预览</span>
              </span>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>

      <FileArea v-if="activeTab === 'files'" class="h-full" />
      <PreviewPanel v-else-if="activeTab === 'preview'" class="h-full" />
    </el-drawer>

    <!-- 浮动工具按钮 -->
    <Transition name="fab-slide">
      <el-button
        v-if="!panelsOpen"
        type="primary"
        size="large"
        circle
        class="absolute z-10 fab-button"
        :class="[
          'top-1/2 -translate-y-1/2',
          'right-4'
        ]"
        @click="panelsOpen = true"
      >
        <el-icon><IconsMenu /></el-icon>
      </el-button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import ChatPanel from '~/components/dev/ChatPanel.vue'
import PreviewPanel from '~/components/dev/PreviewPanel.vue'
import FileArea from '~/components/dev/FileArea.vue'
import * as Icons from '@element-plus/icons-vue'

const panelsOpen = ref(false)
const activeTab = ref('files')

// 解构图标组件以便在模板中使用
const IconsFolder = Icons.Folder
const IconsView = Icons.View
const IconsMenu = Icons.Menu
</script>

<style scoped>
:deep(.dev-drawer) {
  background: rgb(24 24 27 / 0.95);
  backdrop-filter: blur(20px);
}

:deep(.dev-drawer .el-drawer__header) {
  margin-bottom: 0;
  padding: 0;
  border-bottom: 1px solid rgb(255 255 255 / 0.05);
  background: rgb(39 39 42 / 0.5);
}

:deep(.dev-drawer .el-drawer__body) {
  padding: 0;
  overflow: hidden;
}

:deep(.drawer-tabs .el-tabs__header) {
  margin: 0;
  padding: 0 16px;
  background: transparent;
}

:deep(.drawer-tabs .el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.drawer-tabs .el-tabs__item) {
  color: rgb(161 161 170);
  font-weight: 500;
}

:deep(.drawer-tabs .el-tabs__item.is-active) {
  color: rgb(251 191 36);
}

:deep(.drawer-tabs .el-tabs__active-bar) {
  background-color: rgb(251 191 36);
}

.fab-button {
  background: linear-gradient(to bottom right, rgb(251 191 36), rgb(217 119 6));
  border: none;
  box-shadow: 0 10px 15px -3px rgb(251 191 36 / 0.2);
  transition: all 0.3s ease;
}

.fab-button:hover {
  box-shadow: 0 20px 25px -5px rgb(251 191 36 / 0.3);
  transform: scale(1.05);
}

.fab-button:active {
  transform: scale(0.95);
}

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
