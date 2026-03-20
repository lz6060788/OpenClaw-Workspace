# 项目架构设计

> 创建日期: 2026-03-20
> 版本: v1.0

---

## 1. 技术栈

| 层级 | 技术选型 |
|------|----------|
| 前端框架 | Nuxt 3 (Vue 3 + Pinia) |
| 状态管理 | Pinia |
| UI 组件 | 待定 |
| 后端 | Nuxt API Routes (Nitro) |
| 数据库 | SQLite |
| ORM | Prisma |
| 部署 | Docker Compose |

---

## 2. 架构图

```
┌─────────────────────────────────────────────────┐
│                  Nuxt 3 App                     │
├─────────────────────────────────────────────────┤
│  前端层 (Vue 3 + Pinia)                         │
│  - 页面/组件                                    │
│  - 状态管理                                     │
├─────────────────────────────────────────────────┤
│  API 层 (Nitro Server Routes)                  │
│  - /api/tasks/*      任务管理                   │
│  - /api/github/*     GitHub 集成                │
│  - /api/cron/*       定时任务                   │
│  - /api/monitor/*    监控数据                   │
│  - /api/docs/*       文档管理                   │
├─────────────────────────────────────────────────┤
│  数据层 (Prisma + SQLite)                       │
│  - Task, Stage, Step                            │
│  - CronJob, CronRun                            │
│  - Repository, Deployment                      │
│  - ...                                          │
├─────────────────────────────────────────────────┤
│  外部集成                                        │
│  - OpenClaw Gateway (WebSocket)                │
│  - GitHub API                                   │
│  - 飞书 API                                     │
│  - Docker Engine API                            │
└─────────────────────────────────────────────────┘
```

---

## 3. 目录结构

```
openclaw-dashboard/
├── nuxt.config.ts         # Nuxt 配置
├── package.json
├── prisma/
│   └── schema.prisma      # 数据库模型
├── server/
│   ├── api/               # API 路由
│   │   ├── tasks/
│   │   ├── github/
│   │   ├── cron/
│   │   └── ...
│   ├── services/          # 业务逻辑
│   └── utils/             # 工具函数
├── pages/                 # 页面 (SPA)
├── components/            # Vue 组件
├── composables/           # 组合式函数
├── stores/                # Pinia stores
└── public/                # 静态资源
```

---

## 4. 注意事项

- **禁用 SSR**：Nuxt 配置中设置 `ssr: false`
- **SPA 模式**：使用 `nitro.prerender` 或客户端路由
- **数据库文件**：存储在工作目录内
