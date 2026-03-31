<!-- components/dev/PreviewPanel.vue -->
<template>
  <div class="preview-panel flex flex-col h-full bg-zinc-900/50">
    <div v-if="previewUrl" class="flex-1 relative">
      <iframe
        :src="previewUrl"
        class="w-full h-full border-none bg-white preview-iframe"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
      <el-button
        class="absolute bottom-4 right-4 refresh-button"
        type="info"
        circle
        :icon="IconsRefresh"
        title="刷新"
        @click="refresh"
      />
    </div>
    <div v-else class="flex flex-col items-center justify-center h-full p-8 text-center">
      <Icon name="monitor" size="xl" icon-color="rgb(82 82 83)" />
      <h4 class="text-lg font-semibold text-zinc-200 mt-4 mb-2">未启动预览</h4>
      <p class="text-sm text-zinc-500 mb-6">启动开发服务器后，这里会显示实时预览</p>
      <div class="p-4 bg-zinc-800/30 rounded-xl border border-white/5 text-left">
        <p class="text-xs text-zinc-500 mb-3">尝试在对话中说：</p>
        <code class="block px-3 py-2 bg-zinc-950/50 rounded-lg font-mono text-sm text-amber-400 mb-2">"启动 dev 服务器"</code>
        <code class="block px-3 py-2 bg-zinc-950/50 rounded-lg font-mono text-sm text-amber-400">"npm run dev"</code>
      </div>
    </div>
  </div>
</template>

<style scoped>
.refresh-button {
  background: rgb(24 24 27 / 0.9);
  border-color: rgb(255 255 255 / 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.refresh-button:hover {
  background: rgb(39 39 42);
  border-color: rgb(255 255 255 / 0.15);
  transform: scale(1.05);
}

.refresh-button:active {
  transform: scale(0.95);
}
</style>

<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue'

const IconsRefresh = Icons.Refresh

const previewUrl = ref('')

const refresh = () => {
  const iframe = document.querySelector('.preview-iframe') as HTMLIFrameElement
  if (iframe) {
    iframe.src = iframe.src
  }
}
</script>
