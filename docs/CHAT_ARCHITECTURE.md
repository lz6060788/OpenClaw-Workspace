# 聊天系统架构设计

## 需求分析

### 当前问题
1. 所有项目共用一个 `messages` 数组
2. 切换项目时看到的是其他项目的对话历史
3. 没有项目选择限制，可以随意发送消息

### 期望行为
1. 每个项目有独立的对话历史
2. 切换项目时自动加载该项目的会话
3. 未选择项目时禁用对话功能
4. 支持多项目并行开发

## 技术方案

### 方案选择：前端状态管理 + 本地持久化

**理由**：
- ✅ 实现快速，无需后端改动
- ✅ localStorage 自动持久化，刷新不丢失
- ✅ 符合当前架构，前端已有 Pinia
- ✅ 数据隔离清晰，按 projectId 组织
- ✅ 未来可扩展为服务端存储

## 架构设计

### 数据模型

```typescript
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatSession {
  projectId: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}
```

### 状态管理 (Pinia Store)

**Store**: `stores/chat.ts`

**核心功能**：
1. **会话管理**：按 projectId 存储多个独立会话
2. **自动创建**：访问不存在的项目会话时自动创建
3. **消息操作**：添加消息、清空会话
4. **持久化**：使用 localStorage 自动保存

**Getters**：
- `getCurrentSession(projectId)`: 获取指定项目的会话

**Actions**：
- `addMessage(projectId, message)`: 向指定项目添加消息
- `clearSession(projectId)`: 清空指定项目的会话

### 组件集成

**ChatPanel.vue 改动**：

1. **响应式会话加载**
   ```typescript
   const messages = computed(() => {
     if (!currentProject.value) return []
     const session = chatStore.getCurrentSession(currentProject.value.id)
     return session?.messages || []
   })
   ```

2. **项目切换处理**
   - 监听 `currentProject` 变化
   - 自动加载对应项目的会话历史
   - 滚动到最新消息

3. **发送消息**
   - 检查项目是否选中（未选中则禁用）
   - 消息保存到对应项目的会话中
   - 更新会话时间戳

4. **UI 状态**
   - 未选择项目时禁用输入框和发送按钮
   - 显示提示信息："请先选择一个项目"

## 实现步骤

### 1. 创建 Chat Store
- 文件：`stores/chat.ts`
- 实现会话管理逻辑
- 集成 localStorage 持久化

### 2. 修改 ChatPanel 组件
- 文件：`components/dev/ChatPanel.vue`
- 集成 chatStore
- 修改消息获取逻辑为 computed
- 添加项目切换监听
- 实现禁用状态

### 3. UI 优化
- 禁用状态下的视觉反馈
- 提示信息优化
- 空状态处理

## 架构优势

1. **数据隔离**：每个项目独立的会话对象
2. **自动持久化**：localStorage 存储所有会话
3. **响应式更新**：Pinia + Vue computed 自动同步
4. **可扩展性**：预留接口，未来可迁移到数据库

## 未来扩展

### 服务端存储方案
当需要跨设备同步或长期保存时：

1. **后端 API**
   - `GET /api/chat/sessions`: 获取所有会话列表
   - `GET /api/chat/sessions/:projectId`: 获取指定项目会话
   - `POST /api/chat/sessions/:projectId/messages`: 添加消息
   - `DELETE /api/chat/sessions/:projectId`: 清空会话

2. **数据库设计**
   ```sql
   CREATE TABLE chat_sessions (
     id VARCHAR(36) PRIMARY KEY,
     project_id VARCHAR(255) NOT NULL,
     user_id VARCHAR(255),
     created_at TIMESTAMP,
     updated_at TIMESTAMP,
     INDEX idx_project_user (project_id, user_id)
   );

   CREATE TABLE chat_messages (
     id VARCHAR(36) PRIMARY KEY,
     session_id VARCHAR(36) NOT NULL,
     role ENUM('user', 'assistant'),
     content TEXT,
     timestamp TIMESTAMP,
     INDEX idx_session (session_id),
     FOREIGN KEY (session_id) REFERENCES chat_sessions(id)
   );
   ```

3. **Store 迁移**
   - 添加 `syncMode` 配置（local/remote）
   - 实现双向同步逻辑
   - 保持接口兼容性

## 预期效果

- ✅ 项目A的对话不会出现在项目B中
- ✅ 切换项目时立即加载对应历史
- ✅ 未选择项目时无法发送消息
- ✅ 刷新页面后所有会话保持
- ✅ 支持多项目并行开发
