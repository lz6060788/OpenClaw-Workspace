<!-- components/dev/ChatPanel.vue -->
<template>
  <div class="flex flex-col h-full bg-zinc-900">
    <!-- 顶部标题栏 -->
    <div class="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/5 bg-zinc-800/30 backdrop-blur-sm min-h-[56px]">
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <div class="relative">
          <Icon name="message-square" size="md" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
          <div
            class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-800 transition-colors"
            :class="statusColor"
            :title="`OpenClaw 网关: ${connectionStatus}`"
          />
        </div>
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="text-sm text-zinc-500 hidden md:inline">GitHub 项目</span>
          <Icon name="chevron-right" size="xs" icon-color="rgb(63 63 70)" />
          <span class="text-sm text-zinc-400 truncate">{{ currentProjectName || '对话' }}</span>
        </div>
      </div>
      <div class="flex items-center gap-1">
        <el-dropdown trigger="click" @command="handleCommand">
          <Icon name="command" size="sm" variant="subtle" background="outlined" title="指令菜单" clickable />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="cmd in commandList" :key="cmd.value" :command="cmd.value" :divided="cmd.divided">
                <div class="flex items-center gap-2">
                  <span class="text-zinc-400">{{ cmd.icon }}</span>
                  <div>
                    <div class="text-sm text-zinc-200">{{ cmd.label }}</div>
                    <div v-if="cmd.description" class="text-xs text-zinc-500">{{ cmd.description }}</div>
                  </div>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
          <Icon name="download" size="sm" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
          <span>在项目列表中点击下载图标</span>
        </div>
        <div class="flex items-center gap-3 px-4 py-3 bg-zinc-800/50 rounded-xl border border-white/5">
          <Icon name="folder-git-2" size="sm" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
          <span>等待克隆完成后即可开始开发</span>
        </div>
      </div>
    </div>

    <!-- 消息区域 -->
    <div v-else class="flex-1 overflow-y-auto p-4 flex flex-col" ref="messagesContainer">
      <!-- 欢迎空状态（未选择项目） -->
      <div v-if="!currentProject" class="flex-1 flex flex-col items-center justify-center text-center p-6">
        <div class="w-20 h-20 flex-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20 mb-6">
          <span class="text-4xl">🦞</span>
        </div>
        <h2 class="text-xl font-semibold text-zinc-100 mb-2">你好！我是你的开发助手</h2>
        <p class="text-sm text-zinc-500 mb-6 max-w-md">请先在左侧侧边栏选择一个 GitHub 项目，然后我们就可以开始开发了。</p>
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3 px-4 py-3 bg-zinc-800/50 rounded-xl border border-white/5">
            <Icon name="folder-git-2" size="sm" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
            <span class="text-sm text-zinc-400">选择一个已克隆的项目</span>
          </div>
          <div class="flex items-center gap-3 px-4 py-3 bg-zinc-800/50 rounded-xl border border-white/5">
            <Icon name="download" size="sm" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
            <span class="text-sm text-zinc-400">或从 GitHub 克隆新项目</span>
          </div>
        </div>
      </div>

      <!-- 欢迎空状态（已选择项目但无消息） -->
      <div v-else-if="currentProject && messages.length === 0" class="flex-1 flex flex-col items-center justify-center text-center p-6">
        <div class="w-16 h-16 flex-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/20 mb-5">
          <span class="text-2xl">🦞</span>
        </div>
        <h2 class="text-xl font-semibold text-zinc-100 mb-2">开始开发 {{ currentProject.name }}</h2>
        <p class="text-sm text-zinc-500 mb-6 max-w-md">我可以帮你创建文件、修改代码、添加功能或修复 Bug。试着告诉我你想做什么：</p>
        <div class="flex flex-wrap gap-2 justify-center">
          <div class="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg border border-white/5">
            <Icon name="file-plus" size="xs" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
            <span class="text-sm text-zinc-400">创建新文件</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg border border-white/5">
            <Icon name="edit-3" size="xs" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
            <span class="text-sm text-zinc-400">修改代码</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg border border-white/5">
            <Icon name="zap" size="xs" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
            <span class="text-sm text-zinc-400">添加功能</span>
          </div>
          <div class="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 rounded-lg border border-white/5">
            <Icon name="bug" size="xs" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
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
      <!-- 未选择项目时的提示 -->
      <div v-if="isChatDisabled" class="flex items-center gap-2 px-4 py-3 bg-zinc-800/50 rounded-2xl border border-white/5">
        <Icon name="info" size="sm" variant="subtle" background="tinted" icon-color="rgb(251 191 36)" />
        <span class="text-sm text-zinc-500">请先在左侧选择一个项目</span>
      </div>

      <!-- 输入框 -->
      <div v-else class="flex items-center gap-2 bg-zinc-900/50 rounded-2xl border border-white/10 p-2 transition-all duration-200 focus-within:border-amber-500/30 focus-within:bg-zinc-900/80">
        <input
          v-model="input"
          type="text"
          placeholder="输入指令给 OpenClaw..."
          :disabled="isLoading"
          @keyup.enter="sendMessage"
          class="flex-1 bg-transparent border-none text-zinc-100 text-sm placeholder:text-zinc-600 outline-none px-2"
        />
        <Icon
          :name="isLoading ? 'loader-2' : 'send'"
          size="md"
          variant="primary"
          background="filled"
          :disabled="!input.trim() || isLoading"
          :loading="isLoading"
          @click="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjectStore } from '~/stores/project'
import { useChatStore, type ChatMessage } from '~/stores/chat'
import type { OpenClawHttpClient } from '~/utils/openclaw-http'

const projectStore = useProjectStore()
const chatStore = useChatStore()

const currentProject = computed(() => projectStore.currentProject)
const currentProjectName = computed(() => projectStore.currentProject?.name || '')

// 获取 OpenClaw 客户端
const { $openclaw } = useNuxtApp() as { $openclaw: OpenClawHttpClient }

// 从 store 获取当前项目的消息（只读，不会创建会话）
const messages = computed(() => {
  if (!currentProject.value) return []
  const session = chatStore.getSession(currentProject.value.id)
  return session?.messages || []
})

const input = ref('')
const isLoading = ref(false)
const connectionStatus = ref<'disconnected' | 'connecting' | 'connected'>('disconnected')
const messagesContainer = ref<HTMLElement>()

// OpenClaw 指令列表
const commandList = [
  {
    value: '/clear',
    label: '/clear',
    description: '清空当前会话',
    icon: '🗑️',
    divided: false
  },
  {
    value: '/compact',
    label: '/compact',
    description: '压缩对话上下文',
    icon: '📦',
    divided: false
  },
  {
    value: '/commit',
    label: '/commit',
    description: '创建 Git 提交',
    icon: '✅',
    divided: true
  },
  {
    value: '/help',
    label: '/help',
    description: '查看帮助信息',
    icon: '❓',
    divided: false
  }
]

// 处理指令选择
const handleCommand = (command: string) => {
  if (command === '/clear') {
    // 清空当前会话
    if (currentProject.value) {
      chatStore.clearSession(currentProject.value.id)
    }
  } else {
    // 将指令填充到输入框
    input.value = command + ' '
  }

  // 聚焦到输入框
  nextTick(() => {
    const inputElement = document.querySelector('input[placeholder*="输入指令"]') as HTMLInputElement
    inputElement?.focus()
  })
}

// 是否禁用聊天功能（未选择项目时）
const isChatDisabled = computed(() => !currentProject.value)

// 测试连接
const testConnection = async () => {
  try {
    const connected = await $openclaw.testConnection()
    connectionStatus.value = connected ? 'connected' : 'disconnected'
  } catch (error) {
    connectionStatus.value = 'disconnected'
  }
}

// 定期检查连接状态
let statusCheckInterval: NodeJS.Timeout | null = null

onMounted(() => {
  testConnection()
  statusCheckInterval = setInterval(() => {
    testConnection()
  }, 10000) // 每 10 秒检查一次
})

onUnmounted(() => {
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval)
  }
})

const sendMessage = async () => {
  if (!currentProject.value || !input.value.trim() || isLoading.value) return

  const userMessage = input.value
  input.value = ''

  const projectId = currentProject.value.id

  // 添加用户消息到 store
  chatStore.addMessage(projectId, {
    role: 'user',
    content: userMessage,
    timestamp: new Date()
  })

  isLoading.value = true

  // 添加一个空的助手消息，用于流式更新
  const assistantMessage: ChatMessage = {
    role: 'assistant',
    content: '',
    timestamp: new Date()
  }
  chatStore.addMessage(projectId, assistantMessage)

  try {
    // 构建消息前缀（包含项目信息）
    const fullMessage = `项目: ${currentProject.value.name}\n\n${userMessage}`

    await $openclaw.sendMessage(
      fullMessage,
      (delta: string) => {
        // 流式更新最后一条消息
        const session = chatStore.getSession(projectId)
        if (session && session.messages.length > 0) {
          const lastMessage = session.messages[session.messages.length - 1]
          if (lastMessage.role === 'assistant') {
            lastMessage.content += delta
          }
        }
      }
    )
  } catch (error: any) {
    console.error('[ChatPanel] Send error:', error)

    // 更新助手消息为错误信息
    chatStore.updateLastMessage(projectId, `❌ 发送失败: ${error.message || '未知错误'}`)
  } finally {
    isLoading.value = false
  }
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

// 监听消息变化，自动滚动到底部
watch(() => messages.value.length, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}, { immediate: true })

// 监听项目切换，滚动到最新消息
watch(() => currentProject.value?.id, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
})

// 连接状态指示器颜色
const statusColor = computed(() => {
  switch (connectionStatus.value) {
    case 'connected':
      return 'bg-green-500'
    case 'connecting':
      return 'bg-yellow-500'
    default:
      return 'bg-red-500'
  }
})
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
