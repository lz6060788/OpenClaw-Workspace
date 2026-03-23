# OpenClaw Workspace - 文档索引

> 更新时间: 2026-03-24 02:30
> 维护者: OpenClaw Team

---

## 📑 文档目录

本文档索引提供了 OpenClaw Workspace 项目中所有重要文档的快速导航。

---

## 📘 核心文档

### [项目需求文档](./docs/requirements.md)
**路径**: `docs/requirements.md`
**创建时间**: 2026-03-20
**最后更新**: 2026-03-20
**说明**: 定义了 OpenClaw Dashboard 的完整功能需求，包括任务分发系统、GitHub 项目面板、定时任务、监控系统等 7 大核心模块，以及优先级排序和技术架构建议。

### [项目实现记录](./docs/implementation.md)
**路径**: `docs/implementation.md`
**创建时间**: 2026-03-20
**最后更新**: 2026-03-20
**说明**: 记录了项目的初始化过程、技术栈选择（Nuxt 3 + Nuxt UI）、主题系统实现、目录结构，以及待实现功能模块的优先级列表。

### [项目状态报告](./docs/status-report.md)
**路径**: `docs/status-report.md`
**创建时间**: 2026-03-20
**最后更新**: 2026-03-20
**说明**: 提供了项目当前进度的快照，包括已完成功能、项目架构、任务系统数据模型、API 端点和技术栈信息。

---

## 🏗️ 设计文档

### [项目架构设计](./docs/design/architecture.md)
**路径**: `docs/design/architecture.md`
**创建时间**: 2026-03-20
**最后更新**: 2026-03-20
**说明**: 详细描述了技术栈选择、架构图、目录结构，以及禁用 SSR、SPA 模式、数据库文件存储等注意事项。

### [任务分发系统设计](./docs/design/task-distribution.md)
**路径**: `docs/design/task-distribution.md`
**创建时间**: 2026-03-20
**最后更新**: 2026-03-20
**说明**: 任务分发系统的详细设计，包括多弹窗并行、独立上下文、任务状态监控、任务清单设计、持久化存储方案、数据模型定义和讨论记录。

---

## 🚀 Superpowers 文档

### [开发后台设计规范](./docs/superpowers/specs/2026-03-23-openclaw-dev-dashboard-design.md)
**路径**: `docs/superpowers/specs/2026-03-23-openclaw-dev-dashboard-design.md`
**创建时间**: 2026-03-23
**最后更新**: 2026-03-23
**说明**: OpenClaw 个人开发后台的详细设计规范，包括项目目标、功能模块（开发模式、文档模式、任务模式）、UI/UX 设计原则、技术架构和数据流设计。

### [开发后台实施计划](./docs/superpowers/plans/2026-03-23-openclaw-dev-dashboard-plan.md)
**路径**: `docs/superpowers/plans/2026-03-23-openclaw-dev-dashboard-plan.md`
**创建时间**: 2026-03-23
**最后更新**: 2026-03-23
**说明**: 开发后台的详细实施计划，包含开发环境搭建、核心功能实现步骤、组件设计、API 设计、测试计划和部署流程。

---

## 📂 项目文件说明

### 配置文件
- `nuxt.config.ts` - Nuxt 3 配置文件（UnoCSS、设计系统、模块配置）
- `package.json` - 项目依赖和脚本
- `tsconfig.json` - TypeScript 配置

### 目录结构
```
OpenClaw-Workspace/
├── components/          # Vue 组件
│   ├── base/           # 基础组件（AppIcon, AppButton, AppCard, AppInput）
│   ├── dev/            # 开发模式组件
│   └── layout/         # 布局组件
├── pages/              # 页面路由
│   ├── dev/            # 开发模式
│   └── docs/           # 文档模式
├── server/             # 服务端 API
│   └── api/            # API 路由
├── stores/             # Pinia 状态管理
├── assets/             # 静态资源
│   └── css/            # 样式文件
└── layouts/            # 页面布局
```

---

## 🔧 技术栈

- **前端框架**: Nuxt 3 (Vue 3)
- **状态管理**: Pinia
- **样式方案**: UnoCSS + 自定义设计系统
- **图标库**: Lucide Icons (via UnoCSS preset-icons)
- **无头组件**: @headlessui/vue
- **代码编辑器**: Monaco Editor
- **部署**: Docker + Traefik

---

## 🌐 访问地址

- **开发环境**: https://dev.theirises.cn
- **本地开发**: http://localhost:3000
- **API 端点**: `/api/*`

---

## 📝 更新日志

### 2026-03-24
- ✅ 完成基于 AI 助手的界面设计
- ✅ 实现响应式布局（桌面/平板/手机）
- ✅ 添加可收起侧边栏和浮动工具栏
- ✅ 创建设计系统和基础组件库

### 2026-03-23
- ✅ 重新设计项目定位为 AI 助手界面
- ✅ 移除任务系统相关代码
- ✅ 创建新的设计文档

### 2026-03-20
- ✅ 项目初始化
- ✅ 创建需求文档和设计文档
- ✅ 搭建基础框架

---

## 🔗 相关链接

- [Nuxt 3 文档](https://nuxt.com)
- [UnoCSS 文档](https://unocss.dev)
- [Lucide Icons](https://lucide.dev)
- [Monaco Editor](https://microsoft.github.io/monaco-editor)

---

*本文档由 OpenClaw Team 维护，最后更新于 2026-03-24*
