<!-- components/dev/ChatPanel.vue -->
<template>
  <div class="chat-panel">
    <div class="panel-header">
      <div class="header-left">
        <AppIcon name="message-square" size="md" />
        <div>
          <h3 class="panel-title">对话</h3>
          <p class="panel-subtitle">与 OpenClaw AI 对话</p>
        </div>
      </div>
      <div class="header-right">
        <AppButton variant="ghost" size="sm" icon="more-vertical" />
      </div>
    </div>

    <div class="panel-messages" ref="messagesContainer">
      <TransitionGroup name="message" tag="div" class="messages-list">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="message"
          :class="msg.role"
        >
          <div class="message-content">
            <p class="message-text">{{ msg.content }}</p>
            <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <div class="panel-input">
      <div class="input-wrapper">
        <AppInput
          v-model="input"
          placeholder="输入指令给 OpenClaw..."
          :disabled="isLoading"
          @keyup.enter="sendMessage"
        />
        <AppButton
          icon="send"
          :loading="isLoading"
          :disabled="!input.trim()"
          @click="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '~/components/base/AppIcon.vue'
import AppButton from '~/components/base/AppButton.vue'
import AppInput from '~/components/base/AppInput.vue'

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

  // TODO: 调用 OpenClaw 网关执行指令
  setTimeout(() => {
    messages.value.push({
      role: 'assistant',
      content: `收到指令: ${userMessage}\n\n[这里将显示 OpenClaw 的执行结果]`,
      timestamp: new Date()
    })
    isLoading.value = false

    // 滚动到底部
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

// 自动滚动到底部
watch(() => messages.value.length, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}, { immediate: true })
</script>

<style scoped>
.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(15, 23, 42, 0.3);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4) var(--spacing-5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.5);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.panel-title {
  font-size: var(--text-base);
  font-weight: 600;
}

.panel-subtitle {
  font-size: var(--text-xs);
  color: rgba(241, 245, 249, 0.5);
}

.panel-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-4);
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  animation: messageIn 0.3s ease-out;
}

.message.user {
  align-self: flex-end;
}

.message.assistant {
  align-self: flex-start;
}

.message-content {
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
}

.message.user .message-content {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-bottom-right-radius: var(--radius-md);
}

.message.assistant .message-content {
  background: rgba(30, 41, 59, 0.8);
  color: #f1f5f9;
  border-bottom-left-radius: var(--radius-md);
}

.message-text {
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: var(--text-sm);
}

.message-time {
  font-size: var(--text-xs);
  opacity: 0.6;
  margin-top: var(--spacing-1);
  display: block;
}

.panel-input {
  padding: var(--spacing-4);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.5);
}

.input-wrapper {
  display: flex;
  gap: var(--spacing-3);
}

/* 消息动画 */
.message-enter-active {
  transition: all 0.3s ease-out;
}

.message-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>
