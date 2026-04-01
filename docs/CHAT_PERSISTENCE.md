# 聊天会话持久化架构

## 功能概述

聊天会话现在支持**服务端持久化存储**，实现以下功能：

1. ✅ **跨设备同步**：在不同设备上访问相同的聊天记录
2. ✅ **离线消息**：关闭页面后重新打开，能看到所有历史消息
3. ✅ **多端一致**：所有设备看到相同的对话内容

## 架构设计

### 数据存储

**存储位置**：`/data/openclaw-chat/`（可通过环境变量 `CHAT_DATA_DIR` 配置）

**文件格式**：每个项目一个 JSON 文件
```
/data/openclaw-chat/
├── {projectId1}.json
├── {projectId2}.json
└── {projectId3}.json
```

**数据结构**：
```json
{
  "projectId": "12345",
  "messages": [
    {
      "role": "user",
      "content": "你好",
      "timestamp": "2026-03-31T10:00:00.000Z"
    },
    {
      "role": "assistant",
      "content": "你好！有什么我可以帮你的？",
      "timestamp": "2026-03-31T10:00:01.000Z"
    }
  ],
  "createdAt": "2026-03-31T10:00:00.000Z",
  "updatedAt": "2026-03-31T10:00:01.000Z"
}
```

### API 接口

#### 1. 获取指定项目的会话历史
```
GET /api/chat/sessions/{projectId}
```

**响应**：
```json
{
  "projectId": "12345",
  "messages": [...],
  "createdAt": "2026-03-31T10:00:00.000Z",
  "updatedAt": "2026-03-31T10:00:01.000Z"
}
```

#### 2. 保存消息到会话
```
POST /api/chat/sessions/{projectId}
Content-Type: application/json

{
  "message": {
    "role": "user",
    "content": "你好",
    "timestamp": "2026-03-31T10:00:00.000Z"
  }
}
```

**响应**：
```json
{
  "success": true,
  "session": {...}
}
```

#### 3. 获取所有会话列表
```
GET /api/chat/sessions
```

**响应**：
```json
[
  {
    "projectId": "12345",
    "messages": [...],
    "createdAt": "2026-03-31T10:00:00.000Z",
    "updatedAt": "2026-03-31T10:00:01.000Z"
  },
  ...
]
```

### Store 方法

#### 新增方法

```typescript
// 从服务端加载指定项目的会话
await chatStore.fetchSession(projectId)

// 从服务端加载所有会话
await chatStore.fetchAllSessions()

// 保存消息到服务端（内部方法，自动调用）
await chatStore.saveMessageToServer(projectId, message)
```

#### 更新的方法

```typescript
// addMessage 现在会自动同步到服务端
chatStore.addMessage(projectId, message)
```

### 数据流

#### 添加消息流程
1. 用户发送消息
2. `chatStore.addMessage()` 添加到本地状态
3. 立即更新 UI（本地优先）
4. 异步调用 `saveMessageToServer()` 保存到服务端
5. 同时保存到 localStorage（本地缓存）

#### 加载会话流程
1. 用户选择项目
2. 从 localStorage 快速加载（如果有缓存）
3. 异步从服务端拉取最新数据
4. 合并服务端数据，更新 UI

### 环境变量配置

```bash
# 聊天数据存储目录
CHAT_DATA_DIR=/data/openclaw-chat
```

## 数据同步策略

### 当前实现（单向同步）

- **写入**：每次添加消息时自动保存到服务端
- **读取**：页面加载时从服务端拉取最新数据
- **本地缓存**：localStorage 作为快速缓存

### 未来扩展

1. **实时同步**：使用 WebSocket 或 SSE 推送新消息
   - 当其他设备添加消息时，实时推送到当前设备
   - 实现真正的多端同步

2. **冲突解决**：处理多端同时编辑的冲突
   - 使用时间戳或版本号
   - 最后写入优先或合并策略

3. **增量同步**：只同步变更的消息
   - 减少网络传输
   - 提升同步效率

## 测试

### 测试 API

```bash
# 获取所有会话
curl http://localhost:3000/api/chat/sessions

# 获取指定项目会话
curl http://localhost:3000/api/chat/sessions/12345

# 添加消息
curl -X POST http://localhost:3000/api/chat/sessions/12345 \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "role": "user",
      "content": "测试消息",
      "timestamp": "2026-03-31T10:00:00.000Z"
    }
  }'
```

### 测试跨设备同步

1. 设备 A：发送消息
2. 设备 B：刷新页面，应该能看到设备 A 的消息
3. 验证消息内容、时间戳、顺序是否一致

## 监控与维护

### 检查数据目录

```bash
# 查看所有会话文件
ls -lh /data/openclaw-chat/

# 查看会话数量
ls /data/openclaw-chat/ | wc -l

# 查看数据大小
du -sh /data/openclaw-chat/
```

### 数据备份

```bash
# 备份所有聊天数据
tar -czf chat-backup-$(date +%Y%m%d).tar.gz /data/openclaw-chat/
```

### 数据清理

```bash
# 清理超过 30 天的会话（手动）
find /data/openclaw-chat/ -name "*.json" -mtime +30 -delete
```

## 故障排查

### 问题：消息没有保存到服务端

**检查**：
1. 查看浏览器控制台是否有错误
2. 检查网络请求是否成功
3. 查看服务端日志

### 问题：跨设备不同步

**检查**：
1. 确认两个设备访问的是同一个服务端
2. 检查项目 ID 是否一致
3. 手动刷新页面，强制从服务端拉取

### 问题：数据目录权限

**解决**：
```bash
# 确保数据目录存在且有写权限
mkdir -p /data/openclaw-chat
chmod 755 /data/openclaw-chat
```

## 性能考虑

### 当前实现

- ✅ 文件存储：简单可靠
- ✅ 按项目分文件：易于管理
- ✅ 异步保存：不阻塞 UI

### 优化建议

1. **大量消息**：考虑分页加载或虚拟滚动
2. **频繁写入**：使用批处理减少磁盘 I/O
3. **并发访问**：添加文件锁机制
4. **数据迁移**：未来可迁移到数据库（SQLite/PostgreSQL）
