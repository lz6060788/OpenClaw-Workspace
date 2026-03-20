# 任务分发系统 - 详细设计

> 创建日期: 2026-03-20
> 版本: v1.0
> 状态: 讨论中

---

## 1. 系统概述

任务分发系统是一个多弹窗任务管理 UI，建立在 OpenClaw 多会话能力之上。

## 2. 核心功能

| 功能 | 说明 |
|------|------|
| 多弹窗并行 | 同时打开多个任务弹窗，每个弹窗独立运行，同屏观察 |
| 独立上下文 | 每个任务有独立的会话上下文，互不干扰 |
| 任务状态监控 | 实时显示执行状态、进度、输出 |
| 任务清单 | 动态任务清单，支持分级结构 |

## 3. 任务生命周期

```
创建 → 初始化 → 执行中 → 暂停/继续 → 完成
                        ↘ 失败
```

## 4. 任务清单设计

### 4.1 触发机制

- **自动触发**：Agent 根据对话复杂度判断，复杂任务自动生成
- **手动触发**：用户主动输入命令创建

### 4.2 分级结构

```
阶段 1: 需求分析
  └─ 步骤 1.1: 分析现有代码
  └─ 步骤 1.2: 确定技术方案

阶段 2: 开发实现
  └─ 步骤 2.1: 创建分支
  └─ 步骤 2.2: 编写代码
```

### 4.3 状态同步

- Agent 每完成一个步骤 → 自动更新清单状态
- 用户可查看整体进度
- 状态持久化存储

## 5. 持久化存储

文件路径: `/workspace/tasks/{task-id}/`

```
tasks/{task-id}/
├── config.json      # 任务配置
├── state.json       # 任务状态
├── checklist.json   # 任务清单
├── output.log       # 输出日志
└── artifacts/      # 中间结果/文件
```

## 6. 数据模型

```typescript
interface Task {
  id: string;
  name: string;
  status: 'pending' | 'initializing' | 'running' | 'paused' | 'completed' | 'failed';
  sessionId: string;      // 对应的 OpenClaw 会话
  createdAt: Date;
  updatedAt: Date;
  stages: Stage[];
}

interface Stage {
  id: string;
  name: string;
  steps: Step[];
}

interface Step {
  id: string;
  content: string;
  completed: boolean;
}
```

## 7. 待确认问题

- [ ] 暂停/恢复功能是否需要
- [ ] 失败重试机制
- [ ] 任务超时设置

---

## 8. 讨论记录

### 2026-03-20 讨论要点

1. **多对话框形式**：确定使用多弹窗，非标签页，可同屏观察多个任务
2. **任务清单**：Agent 自动生成 + 手动触发，分级结构，状态持久化
3. **与 OpenClaw 关系**：该模块是 UI 层，建立在 Gateway 多会话能力之上
