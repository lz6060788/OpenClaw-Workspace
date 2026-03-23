<!-- components/dev/PreviewPanel.vue -->
<template>
  <div class="preview-panel">
    <div v-if="previewUrl" class="iframe-wrapper">
      <iframe
        :src="previewUrl"
        class="preview-iframe"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
      <button class="refresh-button" @click="refresh" title="刷新">
        <AppIcon name="refresh-cw" size="sm" />
      </button>
    </div>
    <div v-else class="empty-state">
      <AppIcon name="monitor" size="xl" class="empty-icon" />
      <h4>未启动预览</h4>
      <p>启动开发服务器后，这里会显示实时预览</p>
      <div class="empty-hints">
        <p>尝试在对话中说：</p>
        <code>"启动 dev 服务器"</code>
        <code>"npm run dev"</code>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '~/components/base/AppIcon.vue'

const previewUrl = ref('')

const refresh = () => {
  const iframe = document.querySelector('.preview-iframe')
  if (iframe) {
    iframe.src = iframe.src
  }
}

// TODO: 监听项目状态，自动显示预览
// 例如：当检测到 3000 端口时，设置 previewUrl.value = '/api/dev/3000/'
</script>

<style scoped>
.preview-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(15, 23, 42, 0.3);
}

.iframe-wrapper {
  flex: 1;
  position: relative;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.refresh-button {
  position: absolute;
  bottom: var(--spacing-4);
  right: var(--spacing-4);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: rgba(241, 245, 249, 0.7);
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}

.refresh-button:hover {
  background: rgba(30, 41, 59, 0.9);
  color: #f1f5f9;
  transform: scale(1.1);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: var(--spacing-8);
  text-align: center;
}

.empty-icon {
  opacity: 0.2;
  margin-bottom: var(--spacing-4);
}

.empty-state h4 {
  font-size: var(--text-lg);
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: var(--spacing-2);
}

.empty-state > p {
  color: rgba(241, 245, 249, 0.5);
  margin-bottom: var(--spacing-4);
}

.empty-hints {
  padding: var(--spacing-4);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--radius-lg);
  text-align: left;
}

.empty-hints p {
  font-size: var(--text-sm);
  color: rgba(241, 245, 249, 0.5);
  margin-bottom: var(--spacing-2);
}

.empty-hints code {
  display: block;
  padding: var(--spacing-2) var(--spacing-3);
  margin-top: var(--spacing-2);
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-md);
  font-family: monospace;
  font-size: var(--text-sm);
  color: #60a5fa;
}
</style>
