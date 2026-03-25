<!-- components/dev/ChatPanel.vue -->
<template>
  <div class="chat-panel">
    <!-- 顶部标题栏 - 压缩高度 + 面包屑 + 操作按钮 -->
    <div class="panel-header">
      <div class="header-left">
        <AppIcon name="message-square" size="sm" class="header-icon" />
        <div class="breadcrumb">
          <span class="breadcrumb-item">GitHub 项目</span>
          <AppIcon name="chevron-right" size="xs" class="breadcrumb-sep" />
          <span class="breadcrumb-item active">{{ currentProjectName || '对话' }}</span>
        </div>
      </div>
      <div class="header-right">
        <button class="header-action-btn" title="新建对话">
          <AppIcon name="plus" size="sm" />
        </button>
        <button class="header-action-btn" title="历史记录">
          <AppIcon name="history" size="sm" />
        </button>
        <button class="header-action-btn" title="清空对话">
          <AppIcon name="trash-2" size="sm" />
        </button>
      </div>
    </div>

    <!-- 消息区域 -->
    <div class="panel-messages scrollbar-hover" ref="messagesContainer">
      <!-- 欢迎空状态卡片 -->
      <div v-if="messages.length === 0" class="welcome-card">
        <div class="welcome-icon">🦞</div>
        <h2 class="welcome-title">你好！我是你的开发助手</h2>
        <p class="welcome-desc">选择一个 GitHub 项目开始开发</p>
        <div class="welcome-features">
          <div class="feature-item">
            <AppIcon name="file-plus" size="sm" />
            <span>创建新文件</span>
          </div>
          <div class="feature-item">
            <AppIcon name="edit-3" size="sm" />
            <span>修改代码</span>
          </div>
          <div class="feature-item">
            <AppIcon name="zap" size="sm" />
            <span>添加功能</span>
          </div>
          <div class="feature-item">
            <AppIcon name="bug" size="sm" />
            <span>修复 Bug</span>
          </div>
        </div>
      </div>

      <TransitionGroup v-else name="message" tag="div" class="messages-list">
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

    <!-- 底部输入区域 - 统一操作台 -->
    <div class="panel-input">
      <div class="input-container">
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
  </div>
</template>

<script setup lang="ts">
import AppIcon from '~/components/base/AppIcon.vue'
import AppButton from '~/components/base/AppButton.vue'
import AppInput from '~/components/base/AppInput.vue'
import { useProjectStore } from '~/stores/project'

const projectStore = useProjectStore()
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
  background: var(--bg-primary);
}

/* 顶部标题栏 - 压缩高度 + 视觉底边 */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-2) var(--spacing-4);
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
  min-height: 48px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.header-icon {
  color: var(--color-primary);
}

/* 面包屑导航 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.breadcrumb-item {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.breadcrumb-item.active {
  color: var(--text-primary);
  font-weight: 500;
}

.breadcrumb-sep {
  color: var(--text-tertiary);
}

/* 右侧操作按钮 */
.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.header-action-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-unified);
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease-out;
}

.header-action-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  border-color: var(--border-subtle);
}

/* 消息区域 */
.panel-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

/* 欢迎空状态卡片 */
.welcome-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-8);
}

.welcome-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  border-radius: var(--radius-xl);
  font-size: 2rem;
  margin-bottom: var(--spacing-4);
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
}

.welcome-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}

.welcome-desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-6);
}

.welcome-features {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  justify-content: center;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  background: var(--bg-secondary);
  border-radius: var(--radius-unified);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  border: 1px solid var(--border-subtle);
}

.feature-item :deep(svg) {
  color: var(--color-primary);
}

/* 消息气泡 */
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
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-unified);
  border: 1px solid var(--border-subtle);
}

.message.user .message-content {
  background: var(--color-primary);
  color: #000;
  border-color: var(--color-primary);
}

.message.assistant .message-content {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.message-text {
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: var(--text-sm);
}

.message-time {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-top: var(--spacing-1);
  display: block;
}

/* 底部输入区域 - 统一操作台 */
.panel-input {
  padding: var(--spacing-3) var(--spacing-4);
  border-top: 1px solid var(--border-subtle);
  background: var(--bg-secondary);
}

.input-container {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  padding: var(--spacing-2);
  transition: border-color 0.2s ease-out;
}

.input-container:focus-within {
  border-color: var(--color-primary);
}

.input-wrapper {
  display: flex;
  gap: var(--spacing-2);
  align-items: center;
}

.input-wrapper :deep(input) {
  background: transparent;
  border: none;
  color: var(--text-primary);
}

.input-wrapper :deep(input)::placeholder {
  color: var(--text-tertiary);
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
