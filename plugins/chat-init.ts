// plugins/chat-init.ts
/**
 * Chat Store 初始化插件
 * 在 Pinia 安装后恢复聊天会话数据
 */
import { useChatStore } from '~/stores/chat'

export default defineNuxtPlugin(() => {
  // 只在客户端执行
  if (import.meta.client) {
    // 使用 nextTick 确保在 Pinia 初始化后执行
    nextTick(() => {
      const chatStore = useChatStore()
      chatStore._hydrate()
    })
  }
})
