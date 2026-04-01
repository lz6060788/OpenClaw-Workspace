// stores/chat.ts
/**
 * 聊天会话管理 Store
 * 为每个项目提供独立的对话历史和上下文
 */

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatSession {
  projectId: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

interface ChatState {
  sessions: Record<string, ChatSession>
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    sessions: {}
  }),

  getters: {
    /**
     * 获取指定项目的会话（只读）
     * 不会自动创建，如果不存在返回 null
     */
    getSession: (state) => (projectId: string): ChatSession | null => {
      if (!projectId) return null
      return state.sessions[projectId] || null
    },

    /**
     * 检查指定项目的会话是否存在
     */
    hasSession: (state) => (projectId: string): boolean => {
      return !!projectId && !!state.sessions[projectId]
    },

    /**
     * 获取所有会话列表
     */
    allSessions: (state): ChatSession[] => {
      return Object.values(state.sessions).sort((a, b) =>
        b.updatedAt.getTime() - a.updatedAt.getTime()
      )
    },

    /**
     * 获取指定项目的消息数量
     */
    messageCount: (state) => (projectId: string): number => {
      return state.sessions[projectId]?.messages.length || 0
    }
  },

  actions: {
    /**
     * 获取或创建指定项目的会话
     */
    getOrCreateSession(projectId: string): ChatSession {
      if (!this.sessions[projectId]) {
        this.sessions[projectId] = {
          projectId,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
        this._persist()
      }
      return this.sessions[projectId]
    },

    /**
     * 向指定项目添加消息
     */
    addMessage(projectId: string, message: ChatMessage) {
      const session = this.getOrCreateSession(projectId)
      session.messages.push(message)
      session.updatedAt = new Date()
      this._persist()

      // 异步保存到服务端
      this.saveMessageToServer(projectId, message)
    },

    /**
     * 更新指定项目的最后一条消息
     * 用于流式响应时的实时更新
     */
    updateLastMessage(projectId: string, content: string) {
      const session = this.sessions[projectId]
      if (session && session.messages.length > 0) {
        const lastMessage = session.messages[session.messages.length - 1]
        if (lastMessage.role === 'assistant') {
          lastMessage.content = content
          session.updatedAt = new Date()
          this._persist()
        }
      }
    },

    /**
     * 清空指定项目的会话
     */
    clearSession(projectId: string) {
      if (this.sessions[projectId]) {
        this.sessions[projectId] = {
          projectId,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
        this._persist()
      }
    },

    /**
     * 删除指定项目的会话
     */
    deleteSession(projectId: string) {
      delete this.sessions[projectId]
      this._persist()
    },

    /**
     * 从服务端加载指定项目的会话
     */
    async fetchSession(projectId: string): Promise<void> {
      try {
        const response = await fetch(`/api/chat/sessions/${projectId}`)
        if (response.ok) {
          const data = await response.json()
          this.sessions[projectId] = {
            ...data,
            createdAt: new Date(data.createdAt),
            updatedAt: new Date(data.updatedAt),
            messages: data.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }
          this._persist()
        }
      } catch (error) {
        console.error('[ChatStore] 从服务端加载会话失败:', error)
      }
    },

    /**
     * 从服务端加载所有会话
     */
    async fetchAllSessions(): Promise<void> {
      try {
        const response = await fetch('/api/chat/sessions')
        if (response.ok) {
          const sessions = await response.json()
          sessions.forEach((session: any) => {
            this.sessions[session.projectId] = {
              ...session,
              createdAt: new Date(session.createdAt),
              updatedAt: new Date(session.updatedAt),
              messages: session.messages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              }))
            }
          })
          this._persist()
        }
      } catch (error) {
        console.error('[ChatStore] 从服务端加载所有会话失败:', error)
      }
    },

    /**
     * 保存消息到服务端
     */
    async saveMessageToServer(projectId: string, message: ChatMessage): Promise<void> {
      try {
        await fetch(`/api/chat/sessions/${projectId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        })
      } catch (error) {
        console.error('[ChatStore] 保存消息到服务端失败:', error)
      }
    },

    /**
     * 持久化到 localStorage
     */
    _persist() {
      if (process.client) {
        try {
          const data = JSON.stringify(this.sessions, (key, value) => {
            // 将 Date 对象转换为字符串
            if (value instanceof Date) {
              return value.toISOString()
            }
            return value
          })
          localStorage.setItem('openclaw-chat-sessions', data)
        } catch (error) {
          console.error('[ChatStore] 持久化失败:', error)
        }
      }
    },

    /**
     * 从 localStorage 恢复
     */
    _hydrate() {
      if (process.client) {
        try {
          const data = localStorage.getItem('openclaw-chat-sessions')
          if (data) {
            const parsed = JSON.parse(data)
            // 将字符串转换回 Date 对象
            this.sessions = Object.fromEntries(
              Object.entries(parsed).map(([projectId, session]: [string, any]) => [
                projectId,
                {
                  ...session,
                  createdAt: new Date(session.createdAt),
                  updatedAt: new Date(session.updatedAt),
                  messages: session.messages.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                  }))
                }
              ])
            )
          }
        } catch (error) {
          console.error('[ChatStore] 恢复失败:', error)
        }
      }
    }
  }
})
