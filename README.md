# OpenClaw Workspace - 项目文档

> **OpenClaw 个人开发后台** - AI 驱动的开发工作台
> 更新时间: 2026-03-24

---

## 📖 项目简介

OpenClaw Workspace 是一个以 **AI 对话为核心** 的个人开发后台，提供智能代码辅助、项目管理和文档编辑功能。

### 核心特性
- 🤖 **AI 对话界面** - 与 OpenClaw AI 实时对话，获取开发帮助
- 📁 **GitHub 项目管理** - 浏览、编辑 GitHub 仓库代码
- 📄 **文档编辑器** - 编辑 OpenClaw 配置文件、Skills、Memory
- 🖥️ **实时预览** - 预览本地开发服务器的运行效果
- 📱 **响应式设计** - 完美支持桌面、平板、手机

---

## 🚀 快速开始

### 开发环境要求

- **Node.js**: >= 18.0.0
- **pnpm**: >= 8.0.0（推荐）或 npm >= 9.0.0
- **Git**: 用于版本控制

### 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install
```

### 启动开发服务器

```bash
# 启动开发服务器（默认端口 3000）
pnpm dev

# 或指定端口
pnpm dev -- --port 3000
```

访问: http://localhost:3000

### 生产构建

```bash
# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

---

## 🔧 开发指南

### 开发模式

项目支持两种模式：

#### 1. 开发模式 (`/dev`)
主要工作区，包含：
- AI 对话面板
- GitHub 项目管理
- 代码编辑器（Monaco Editor）
- 实时预览

#### 2. 文档模式 (`/docs`)
文档编辑区，包含：
- OpenClaw 配置文件编辑
- Skills 管理
- Memory 文件编辑

### 代码规范

#### 组件命名
- 基础组件: `App{ComponentName}.vue`（如 `AppButton.vue`）
- 功能组件: `{Feature}{ComponentName}.vue`（如 `ChatPanel.vue`）
- 布局组件: 布放于 `components/layout/` 目录

#### 样式规范
- 使用 UnoCSS 原子类进行样式开发
- 复杂样式使用 `<style scoped>` 块
- 引用 CSS 变量: `var(--spacing-4)`, `var(--text-sm)` 等

#### API 路由
- 服务端 API 放置于 `server/api/` 目录
- 使用文件名作为路由路径
- 例如: `server/api/projects/list.get.ts` → `/api/projects/list`

### 状态管理

使用 Pinia 进行状态管理，现有 Store：
- `stores/project.ts` - GitHub 项目状态
- `stores/docs.ts` - 文档编辑状态
- `stores/app.ts` - 应用全局状态

---

## ✅ 验证测试

### 本地验证

1. **启动开发服务器**
   ```bash
   pnpm dev
   ```

2. **访问应用**
   - 打开浏览器访问 http://localhost:3000
   - 检查页面是否正常加载
   - 测试侧边栏切换功能
   - 测试浮动工具栏

3. **测试核心功能**
   - 创建/选择 GitHub 项目
   - 与 AI 对话
   - 编辑文件
   - 查看预览

### 构建验证

```bash
# 1. 清理构建缓存
rm -rf .nuxt .output

# 2. 执行构建
pnpm build

# 3. 检查构建输出
ls -la .output/public/

# 4. 预览构建结果
pnpm preview
```

### 代码检查

```bash
# TypeScript 类型检查
npx vue-tsc --noEmit

# 检查未使用的依赖
npx depcheck
```

---

## 📦 部署指南

### Docker 部署

#### 1. 创建 Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
```

#### 2. 构建镜像

```bash
docker build -t openclaw-workspace .
```

#### 3. 运行容器

```bash
docker run -d -p 3000:3000 --name openclaw-workspace openclaw-workspace
```

### Docker Compose 部署

```yaml
version: '3.8'
services:
  openclaw-workspace:
    build: .
    ports:
      - "3000:3000"
    environment:
      - HOST=0.0.0.0
      - PORT=3000
    restart: unless-stopped
```

### Traefik 集成

在 Traefik 配置中添加：

```yaml
http:
  routers:
    openclaw-workspace:
      rule: "Host(`dev.theirises.cn`)"
      service: "openclaw-workspace"
      entryPoints:
        - "websecure"
      tls:
        certResolver: "letsencrypt"

  services:
    openclaw-workspace:
      loadBalancer:
        servers:
          - url: "http://localhost:3000"
```

---

## ⚠️ 避免事项

### ❌ 不要做的事

1. **不要直接修改 `node_modules`**
   - 所有依赖通过 `pnpm install/npm install` 安装
   - 修改依赖会导致版本不一致问题

2. **不要在组件中使用全局样式**
   - 使用 `<style scoped>` 限制样式作用域
   - 避免样式污染其他组件

3. **不要硬编码 API 地址**
   - 使用相对路径调用 API
   - 生产环境的 API 地址通过环境变量配置

4. **不要在 `watch` 中直接修改被监听的值**
   - 会导致无限循环
   - 使用 `computed` 或 `nextTick` 处理

5. **不要在 `onMounted` 中进行长时间异步操作**
   - 会阻塞组件渲染
   - 使用 `Suspense` 或加载状态处理

6. **不要在客户端直接访问服务端私有 API**
   - 所有服务端逻辑通过 API 路由暴露
   - 遵循 RESTful 规范

7. **不要忽略 TypeScript 类型错误**
   - 类型检查能提前发现问题
   - 使用 `any` 类型会失去类型安全

### ✅ 推荐做法

1. **使用 UnoCSS 原子类**
   - 提高开发效率
   - 减少样式文件体积

2. **使用 Pinia 管理状态**
   - 集中式状态管理
   - 更好的类型推导

3. **使用 `<script setup>` 语法**
   - 更简洁的代码
   - 更好的性能

4. **使用 `defineProps` 和 `defineEmits`**
   - 更好的类型推导
   - 编译时优化

5. **使用环境变量管理配置**
   - 创建 `.env` 文件
   - 使用 `runtimeConfig` 访问

---

## 🛠️ 故障排查

### 常见问题

#### 1. 端口被占用
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

#### 2. 依赖安装失败
```bash
# 清理缓存
rm -rf node_modules .pnpm-store
pnpm install
```

#### 3. 构建失败
```bash
# 清理构建目录
rm -rf .nuxt .output

# 重新构建
pnpm build
```

#### 4. 样式不生效
- 检查 UnoCSS 配置是否正确
- 确认原子类拼写正确
- 查看浏览器控制台是否有错误

---

## 📚 项目文档

### Superpowers 文档

#### [开发后台设计规范](./docs/superpowers/specs/2026-03-23-openclaw-dev-dashboard-design.md)
**创建时间**: 2026-03-23
**说明**: 详细的设计规范，包括项目目标、功能模块、UI/UX 设计原则、技术架构和数据流设计。

#### [开发后台实施计划](./docs/superpowers/plans/2026-03-23-openclaw-dev-dashboard-plan.md)
**创建时间**: 2026-03-23
**说明**: 详细的实施计划，包含开发环境搭建、核心功能实现步骤、组件设计、API 设计和测试计划。

---

## 🔗 相关链接

- **Nuxt 3**: https://nuxt.com
- **UnoCSS**: https://unocss.dev
- **Pinia**: https://pinia.vuejs.org
- **Monaco Editor**: https://microsoft.github.io/monaco-editor
- **Lucide Icons**: https://lucide.dev

---

## 📝 许可证

MIT License

---

*最后更新: 2026-03-24*

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
