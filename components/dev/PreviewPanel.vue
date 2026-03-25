<!-- components/dev/PreviewPanel.vue -->
<template>
  <div class="preview-panel flex flex-col h-full bg-zinc-900/50">
    <div v-if="previewUrl" class="flex-1 relative">
      <iframe
        :src="previewUrl"
        class="w-full h-full border-none bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
      <button
        class="absolute bottom-4 right-4 w-10 h-10 flex-center rounded-full bg-zinc-900/90 border border-white/10 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 backdrop-blur-sm transition-all active:scale-95"
        title="刷新"
        @click="refresh"
      >
        <AppIcon name="refresh-cw" size="sm" />
      </button>
    </div>
    <div v-else class="flex flex-col items-center justify-center h-full p-8 text-center">
      <AppIcon name="monitor" size="xl" icon-color="rgb(82 82 83)" />
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

<script setup lang="ts">
import AppIcon from '~/components/base/AppIcon.vue'

const previewUrl = ref('')

const refresh = () => {
  const iframe = document.querySelector('.preview-iframe') as HTMLIFrameElement
  if (iframe) {
    iframe.src = iframe.src
  }
}
</script>
