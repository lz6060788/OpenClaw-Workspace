<!-- components/dev/ChatPanel.vue -->
<template>
  <div class="flex flex-col h-full bg-zinc-900">
    <!-- 顶部标题栏 -->
    <div class="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 bg-zinc-800/30 backdrop-blur-sm min-h-[56px]">
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <AppIcon name="message-square" size="md" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="text-sm text-zinc-500 hidden md:inline">GitHub 项目</span>
          <AppIcon name="chevron-right" size="xs" icon-color="rgb(63 63 70)" />
          <span class="text-sm text-zinc-400 truncate">{{ currentProjectName || '对话' }}</span>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <AppIcon name="plus" size="sm" variant="subtle" background="outlined" clickable title="新建对话" />
        <AppIcon name="history" size="sm" variant="subtle" background="outlined" clickable title="历史记录" class="hidden md:flex" />
        <AppIcon name="trash-2" size="sm" variant="danger" background="outlined" clickable title="清空对话" />
      </div>
    </div>

    <!-- 项目未克隆空状态 -->
    <div v-if="currentProject && !currentProject.localExists" class="flex-1 flex flex-col items-center justify-center text-center p-6">
      <div class="w-20 h-20 flex-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20 mb-6">
        <span class="text-4xl">📦</span>
      </div>
      <h2 class="text-xl font-semibold text-zinc-100 mb-2">项目未克隆到本地</h2>
      <p class="text-sm text-zinc-500 mb-6 max-w-sm">该项目还未克隆到本地工作区。请在左侧侧边栏点击下载按钮将项目克隆到本地。</p>
      <div class="flex flex-col gap-3 text-sm text-zinc-400">
        <div class="flex items-center gap-3 px-4 py-3 bg-zinc-800/50 rounded-xl border border-white/5">
          <AppIcon name="download" size="sm" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
          <span>在项目列表中点击下载图标</span>
        </div>
        <div class="flex items-center gap-3 px-4 py-3 bg-zinc-800/50 rounded-xl border border-white/5">
          <AppIcon name="folder-git-2" size="sm" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
          <span>等待克隆完成后即可开始开发</span>
        </div>
      </div>
    </div>

    <!-- 消息区域 -->
    <div v-else class="flex-1 overflow-y-auto p-4 flex flex-col" ref="messagesContainer">
      <!-- 欢迎空状态 -->
      <div v-if="messages.length === 0" class="flex-1 flex flex-col items-center justify-center text-center p-6">
        <div class="w-16 h-16 flex-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20 mb-5">
          <span class="text-2xl">🦞</span>
        </div>
        <h2 class="text-xl font-semibold text-zinc-100 mb-2">你好！我是你的开发助手</h2>
        <p class="text-sm text-zinc-500 mb-6">选择一个 GitHub 项目开始开发</p>
        <div class="flex flex-wrap gap-2 justify-center">
          <div class="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg border border-white/5">
            <AppIcon name="file-plus" size="xs" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
            <span class="text-sm text-zinc-400">创建新文件</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg border border-white/5">
            <AppIcon name="edit-3" size="xs" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
            <span class="text-sm text-zinc-400">修改代码</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg border border-white/5">
            <AppIcon name="zap" size="xs" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
            <span class="text-sm text-zinc-400">添加功能</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg border border-white/5">
            <AppIcon name="bug" size="xs" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
            <span class="text-sm text-zinc-400">修复 Bug</span>
          </div>
        </div>
      </div>

      <!-- 消息列表 -->
      <TransitionGroup v-else name="message" tag="div" class="flex flex-col gap-4">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="flex flex-col max-w-85 md:max-w-[80%]"
          :class="msg.role === 'user' ? 'items-end self-end' : 'items-start self-start'"
        >
          <div
            class="px-4 py-3 rounded-2xl"
            :class="msg.role === 'user'
              ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20'
              : 'bg-zinc-800/80 border border-white/5 text-zinc-200'"
          >
            <p class="whitespace-pre-wrap leading-relaxed text-sm">{{ msg.content }}</p>
            <span class="text-xs opacity-70 mt-1 block">{{ formatTime(msg.timestamp) }}</span>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- 底部输入区域 -->
    <div class="p-4 border-t border-white/5 bg-zinc-800/30 backdrop-blur-sm">
      <div class="flex items-center gap-2 bg-zinc-900/50 rounded-2xl border border-white/10 p-2 transition-all duration-200 focus-within:border-amber-500/30 focus-within:bg-zinc-900/80">
        <input
          v-model="input"
          type="text"
          placeholder="输入指令给 OpenClaw..."
          :disabled="isLoading"
          @keyup.enter="sendMessage"
          class="flex-1 bg-transparent border-none text-zinc-100 text-sm placeholder:text-zinc-600 outline-none px-2"
        />
        <AppIcon
          :name="isLoading ? 'loader-2' : 'send'"
          size="md"
          variant="primary"
          background="filled"
          :disabled="!input.trim() || isLoading"
          :loading="isLoading"
          clickable
          @click="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import AppIcon from '~/components/base/AppIcon.vue'

const projectStore = useProjectStore()
const currentProject = computed(() => projectStore.currentProject)
const currentProjectName = computed(() => projectStore.currentProject?.name || '')

const messages = ref([
  {
    role: 'assistant',
    content: '你好！我是你的开发助手。选择一个 GitHub 项目开始开发吧。\n\n你可以让我：\n• 创建新文件\n• 修改现有代码\n• 添加新功能\n• 修复 Bug\n• 代码审查',
    timestamp: new Date()
  }
])

const input = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement>()

const sendMessage = async () => {
  if (!input.value.trim() || isLoading.value) return

  const userMessage = input.value
  input.value = ''

  messages.value.push({
    role: 'user',
    content: userMessage,
    timestamp: new Date()
  })

  isLoading.value = true

  setTimeout(() => {
    messages.value.push({
      role: 'assistant',
      content: `收到指令: ${userMessage}\n\n[这里将显示 OpenClaw 的执行结果]`,
      timestamp: new Date()
    })
    isLoading.value = false

    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }, 500)
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

watch(() => messages.value.length, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}, { immediate: true })
</script>

<style scoped>
.message-enter-active {
  transition: all 0.3s ease-out;
}
.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>
