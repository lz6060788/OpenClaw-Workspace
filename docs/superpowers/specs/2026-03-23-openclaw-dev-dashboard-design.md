# OpenClaw 个人开发后台 - 设计方案

## 1. 项目概述

- **项目名称**：OpenClaw Workspace (OpenClaw 个人开发后台)
- **目标**：通过对话方式调度 OpenClaw 进行 GitHub 项目开发，同时集中管理 OpenClaw 相关文档
- **项目目录**：`~/.openclaw/workspace/github-projects`
- **技术栈**：Nuxt 3 + Vue 3 + TypeScript + Tailwind CSS + Monaco Editor

## 2. 整体布局

### 2.1 三栏布局结构

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  一级侧边栏 (80px)    │  二级侧边栏 (220px)        │  主区域 (flex: 1)        │
│  ┌───────────────┐    │  ┌─────────────────────┐  │  ┌───────────────────┐  │
│  │               │    │  │                     │  │  │                   │  │
│  │  💻 开发      │ ──→│  │ 【开发功能】        │  │  │  开发模式页面     │  │
│  │               │    │  │   项目列表          │  │  │  - 对话区域       │  │
│  │  📄 文档      │ ──→│  │   - project A ●     │  │  │  - 效果展示区     │  │
│  │               │    │  │   - project B       │  │  │  - 文件区域       │  │
│  │               │    │  │   - project C       │  │  │                   │  │
│  │               │    │  │ [+ 添加项目]        │  │  │                   │  │
│  └───────────────┘    │  └─────────────────────┘  │  └───────────────────┘  │
│                       │                            │                         │
│                       │  (切换到文档时)           │  (切换到文档时)         │
│                       │  ┌─────────────────────┐  │  ┌───────────────────┐  │
│                       │  │ 【文档功能】        │  │  │  文档页面         │  │
│                       │  │   📁 配置文件       │  │  │  - Monaco Editor  │  │
│                       │  │   📁 Skills         │  │  │  - 保存/取消按钮  │  │
│                       │  │   📁 Memory         │  │  │                   │  │
│                       │  └─────────────────────┘  │  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 页面缓存

- 使用 Vue 的 `<keep-alive>` 缓存主区域页面
- 切换一级侧边栏时，主区域组件切换但状态保留
- 避免对话历史、文件编辑状态等因切换而丢失

## 3. 功能1：GitHub 项目开发

### 3.1 项目管理

- **项目目录**：`~/.openclaw/workspace/github-projects`
- **添加项目**：在二级侧边栏点击"+ 添加项目"，输入 GitHub 仓库 URL 或选择本地目录
- **项目列表**：显示项目名称，选中项目高亮
- **项目操作**：右键菜单（刷新、删除、打开终端）

### 3.2 对话区域

- **位置**：主区域上半部分 (50% 高度)
- **功能**：
  - 发送文本指令
  - 显示对话历史（用户消息 + AI 回复）
  - 支持代码块高亮
  - 复制消息内容
- **交互**：通过 OpenClaw 网关执行指令，返回结果

### 3.3 效果展示区

- **位置**：主区域右上部分 (50% 宽度)
- **功能**：
  - iframe 内嵌预览
  - 空白状态提示"未启动预览"
  - 刷新按钮
- **访问方式**：通过后端代理 `/dev/:port/:path`
  - 例如：`/dev/3000/` → 转发到 `127.0.0.1:3000/`
  - 例如：`/dev/5173/api/users` → 转发到 `127.0.0.1:5173/api/users`

### 3.4 文件区域

- **位置**：主区域下半部分
- **布局**：文件树 (30%) + 代码编辑器 (70%)
- **文件树**：
  - 显示项目目录结构
  - 支持展开/折叠
  - 点击文件加载内容到编辑器
  - 新建文件/文件夹功能
- **代码编辑器**：
  - 使用 Monaco Editor
  - 语法高亮（根据文件类型）
  - 保存文件按钮
  - 只读模式（查看他人修改时）

### 3.5 前端预览代理 - 技术实现

```typescript
// server/api/dev/[...path].ts
export default defineEventHandler(async (event) => {
  const port = getRouterParam(event, 'port')
  const path = getRouterParam(event, 'path') || ''

  if (!port || isNaN(parseInt(port))) {
    throw createError({ statusCode: 400, message: 'Invalid port' })
  }

  const targetUrl = `http://127.0.0.1:${port}/${path}`

  // 代理请求
  const proxyResponse = await $fetch(targetUrl, {
    responseType: 'arrayBuffer',
    headers: {
      ...getRequestHeaders(event),
      host: 'localhost',
    },
  })

  // 设置响应头
  setHeader(event, 'Content-Type', proxyResponse.headers.get('content-type'))
  setHeader(event, 'Access-Control-Allow-Origin', '*')

  return proxyResponse
})
```

## 4. 功能2：OpenClaw 文档管理

### 4.1 文档分类

- **配置文件**：
  - AGENTS.md
  - SOUL.md
  - USER.md
  - TOOLS.md
  - IDENTITY.md
  - HEARTBEAT.md
- **Skills**：所有 `~/.nvm/versions/node/*/lib/node_modules/openclaw/skills/*/SKILL.md`
- **Memory**：memory/ 目录下的所有 .md 文件

### 4.2 二级侧边栏结构

```
📁 配置文件
   ├── AGENTS.md
   ├── SOUL.md
   ├── USER.md
   ├── TOOLS.md
   ├── IDENTITY.md
   └── HEARTBEAT.md

📁 Skills
   ├── brainstorming
   ├── coding-agent
   ├── feishu-doc
   ├── healthcheck
   └── ...

📁 Memory
   ├── 2026-03-23.md
   ├── 2026-03-22.md
   └── ...
```

### 4.3 主区域 - 文档编辑器

- **Monaco Editor**：支持 Markdown 语法高亮
- **操作按钮**：
  - 保存：写入文件
  - 取消：放弃修改
  - 刷新：重新加载文件
- **只读模式**：对于某些系统文件可设为只读

## 5. UI 设计规范 (参考 ui-ux-pro-max)

### 5.1 视觉风格

- **主题**：深色主题 (Dark Mode)
- **风格**：专业开发者工具风格，简洁高效

### 5.2 色彩系统

- **主色**：#3B82F6 (蓝色)
- **背景色**：#0F172A (深蓝黑)
- **侧边栏背景**：#1E293B
- **卡片背景**：#334155
- **文字颜色**：#F1F5F9 (浅灰白)
- **边框颜色**：#475569

### 5.3 间距系统

- 基础间距：4px
- 组件内边距：12px / 16px
- 区块间距：24px
- 侧边栏宽度：80px (一级) / 220px (二级)

### 5.4 组件状态

- **正常**：默认样式
- **Hover**：背景色变亮 10%
- **Active/选中**：主色高亮 + 左边框指示器
- **Disabled**：透明度 50%
- **Loading**：骨架屏或 spinner

### 5.5 交互设计

- 侧边栏切换：平滑过渡动画
- 文件树展开：渐进式动画
- 消息气泡：渐入动画
- 按钮点击：涟漪效果

## 6. 技术实现要点

### 6.1 Nuxt 布局

```vue
<!-- layouts/default.vue -->
<template>
  <div class="flex h-screen bg-gray-900">
    <!-- 一级侧边栏 -->
    <aside class="w-20 bg-gray-800 flex flex-col">
      <NuxtLink to="/dev" class="nav-item">💻</NuxtLink>
      <NuxtLink to="/docs" class="nav-item">📄</NuxtLink>
    </aside>

    <!-- 二级侧边栏 -->
    <aside class="w-56 bg-gray-800 border-r border-gray-700">
      <KeepAlive>
        <component :is="sidebarComponent" />
      </KeepAlive>
    </aside>

    <!-- 主区域 -->
    <main class="flex-1 overflow-hidden">
      <NuxtPage keep-alive />
    </main>
  </div>
</template>
```

### 6.2 状态管理

- 使用 Pinia 管理：
  - 当前选中的功能模块
  - 当前选中的项目
  - 项目列表缓存
  - 对话历史
  - 当前打开的文件

## 7. 后续迭代

- [ ] 项目导入导出功能
- [ ] 多标签页同时编辑多个文件
- [ ] Git 操作可视化（分支图、提交历史）
- [ ] 终端模拟器集成
- [ ] 插件系统

---

**版本**：1.0  
**日期**：2026-03-23  
**状态**：待用户审核
