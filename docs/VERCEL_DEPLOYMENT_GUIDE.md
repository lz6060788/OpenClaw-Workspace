# Vercel 部署配置完整指南

## 目录

- [功能概述](#功能概述)
- [配置弹窗详解](#配置弹窗详解)
  - [Vercel 项目标签页](#1-vercel-项目标签页)
  - [构建设置标签页](#2-构建设置标签页)
  - [部署历史标签页](#3-部署历史标签页)
- [部署流程](#部署流程)
- [预览功能](#预览功能)
- [常见问题](#常见问题)

---

## 功能概述

OpenClaw Workspace 集成了 **Vercel 自动部署**功能，让你可以：

- ✅ **一键部署**：配置完成后，点击按钮即可触发部署
- ✅ **实时预览**：在预览面板中实时查看部署状态和预览 URL
- ✅ **历史记录**：查看所有部署历史，包括成功/失败状态
- ✅ **自动构建**：推送代码到 GitHub 后自动触发 Vercel 构建
- ✅ **多项目支持**：每个 GitHub 项目可以链接到不同的 Vercel 项目

### 前置要求

1. **Vercel 账户**：访问 [vercel.com](https://vercel.com) 注册
2. **Vercel Access Token**：
   - 访问 https://vercel.com/account/tokens
   - 点击 "Create Token"
   - 选择作用域（建议选择 "Full Account"）
   - 复制生成的 Token
3. **环境变量配置**：
   ```bash
   # 在 .env 文件中配置
   VERCEL_TOKEN=your_vercel_token_here
   VERCEL_TEAM_ID=your_vercel_team_id_here  # 可选，团队账户需要
   ```

---

## 配置弹窗详解

点击项目列表中的 **Vercel 图标** 即可打开配置弹窗。弹窗包含三个标签页：

### 1. Vercel 项目标签页

这个标签页用于选择或创建 Vercel 项目，建立 GitHub 项目与 Vercel 项目的关联。

#### 1.1 选择 Vercel 项目

**字段说明**：
- **下拉选择框**：显示你的 Vercel 账户下的所有项目
- **可搜索**：支持输入项目名称快速筛选
- **框架标签**：每个项目右侧显示其框架类型（如 Next.js、Vite 等）

**操作步骤**：
1. 打开配置弹窗后，系统会自动加载你的 Vercel 项目列表
2. 在下拉框中选择要关联的 Vercel 项目
3. 选择后，"部署 URL" 字段会自动填充

**何时使用**：
- 你已经在 Vercel 上创建了项目，需要链接到 GitHub 项目
- 想要更换当前项目链接的 Vercel 项目

#### 1.2 创建新项目

**字段说明**：
- **输入框**：输入新 Vercel 项目的名称
- **创建按钮**：点击后创建新项目并自动关联

**操作步骤**：
1. 在输入框中输入项目名称（如：`my-awesome-project`）
2. 点击 "创建" 按钮
3. 系统会在 Vercel 上创建新项目，并自动关联到当前 GitHub 项目

**何时使用**：
- 还没有在 Vercel 上创建项目
- 想要为当前 GitHub 项目创建新的 Vercel 项目

**注意事项**：
- 项目名称必须符合 Vercel 的命名规则（小写字母、数字、连字符）
- 项目名称在你的账户中必须唯一

#### 1.3 部署 URL

**字段说明**：
- **输入框**：显示 Vercel 项目的部署 URL
- **自动填充**：选择 Vercel 项目后自动填充
- **手动输入**：也可以手动输入或修改 URL
- **打开按钮**：点击后在浏览器中打开 Vercel 项目

**URL 格式**：
```
https://your-project-name.vercel.app
```

**何时修改**：
- 自定义域名的情况
- Vercel 项目的 URL 发生变化

---

### 2. 构建设置标签页

这个标签页用于配置项目的构建参数，告诉 Vercel 如何构建你的项目。

#### 2.1 框架预设

**字段说明**：
- **下拉选择**：选择项目使用的框架
- **可选值**：
  - `Vite`：基于 Vite 的项目
  - `Next.js`：Next.js 框架
  - `Nuxt`：Nuxt 框架
  - `React`：React 项目
  - `Vue`：Vue 项目
  - `Angular`：Angular 项目
  - `Svelte`：Svelte 项目
  - `其他`：其他框架或自定义配置

**作用**：
- 帮助 Vercel 自动推断构建设置
- 不同的框架有不同的默认构建命令和输出目录

**如何选择**：
- 根据你的项目技术栈选择对应的框架
- 如果不确定，可以选择 "其他"，Vercel 会尝试自动检测

#### 2.2 安装命令

**字段说明**：
- **默认值**：`npm install`
- **作用**：告诉 Vercel 在构建前如何安装依赖
- **使用默认值按钮**：一键恢复为 `npm install`

**常用配置**：
```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# 指定 npm 版本
npm ci

# 使用锁文件
npm ci --legacy-peer-deps
```

**何时修改**：
- 使用 pnpm 或 yarn 而不是 npm
- 需要特殊的安装参数（如 `--legacy-peer-deps`）
- 项目有特殊的依赖安装需求

**注意事项**：
- 确保 Vercel 构建环境中支持你使用的包管理器
- pnpm 需要在 Vercel 项目设置中启用

#### 2.3 构建命令

**字段说明**：
- **默认值**：`npm run build`
- **作用**：告诉 Vercel 如何构建你的项目
- **使用默认值按钮**：一键恢复为 `npm run build`

**常用配置**：
```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# Next.js
next build

# Nuxt
npm run build

# Vite
npm run build

# 自定义构建脚本
npm run build:prod
npm run generate
```

**如何确定**：
查看你的 `package.json` 文件中的 `scripts` 字段：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

这个例子中，构建命令应该是 `npm run build`。

#### 2.4 输出目录

**字段说明**：
- **默认值**：`dist`
- **作用**：告诉 Vercel 构建产物在哪个目录
- **使用默认值按钮**：一键恢复为 `dist`

**常用配置**：
```bash
# Vite
dist

# Next.js
.next

# Nuxt
.output/public

# Vue CLI
dist

# Angular
dist/browser

# Svelte
public
```

**如何确定**：
查看项目构建后生成的目录，通常是：
- Vite 项目：`dist/`
- Next.js 项目：`.next/`
- Nuxt 项目：`.output/public/`
- 或者在构建配置文件（如 `vite.config.ts`）中查看 `build.outDir` 配置

**框架参考表**：

| 框架 | 安装命令 | 构建命令 | 输出目录 |
|------|---------|---------|---------|
| Vite | `npm install` | `npm run build` | `dist` |
| Next.js | `npm install` | `next build` | `.next` |
| Nuxt 3 | `npm install` | `npm run build` | `.output/public` |
| Vue CLI | `npm install` | `npm run build` | `dist` |
| React (CRA) | `npm install` | `npm run build` | `build` |
| Angular | `npm install` | `npm run build` | `dist/browser` |
| Svelte | `npm install` | `npm run build` | `public` |

---

### 3. 部署历史标签页

这个标签页显示项目的所有部署记录，包括部署状态、URL、错误信息等。

#### 3.1 部署状态

**状态类型**：

| 状态 | 图标 | 颜色 | 说明 |
|------|------|------|------|
| **队列中** (queued) | ⏳ | 蓝色 | 部署已排队，等待构建开始 |
| **构建中** (building) | 🔨 | 黄色 | 正在构建项目 |
| **成功** (ready) | ✅ | 绿色 | 构建成功，预览可用 |
| **失败** (error) | ❌ | 红色 | 构建失败，查看错误信息 |
| **取消** (cancelled) | ⏹️ | 灰色 | 部署已取消 |
| **停用** (deactivated) | 🚫 | 灰色 | 部署已停用 |

#### 3.2 部署信息

每个部署记录显示以下信息：

**时间戳**：
- 显示部署创建时间
- 格式：`2026-04-01 16:30`

**部署状态标签**：
- 颜色编码的状态标签
- 一眼看出部署是否成功

**生产环境标签**：
- 如果是生产部署，会显示橙色的 "生产环境" 标签
- 预览部署不显示此标签

**预览 URL**：
- 蓝色链接，点击在新标签页中打开
- 格式：`https://your-project.vercel.app`
- 只有成功的部署才显示 URL

**错误信息**：
- 红色文本显示构建错误
- 帮助快速定位问题

**构建耗时**：
- 显示构建花费的时间（秒）
- 格式：`耗时: 45秒`

#### 3.3 交互操作

**加载部署历史**：
- 切换到 "部署历史" 标签页时自动加载
- 显示加载动画

**刷新部署历史**：
- 关闭并重新打开配置弹窗
- 最新的部署会显示在顶部

**点击 URL**：
- 点击预览 URL 会在新标签页中打开
- 方便快速查看部署结果

---

## 部署流程

### 自动部署流程

```
┌─────────────────────────────────────────────────────────┐
│ 1. 在 OpenClaw Workspace 中编辑代码                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 2. 提交代码到 GitHub                                      │
│    - git add .                                           │
│    - git commit -m "feat: new feature"                   │
│    - git push origin main                                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 3. GitHub Webhook 触发 Vercel（可选）                     │
│    - 如果在 Vercel 中配置了 GitHub 集成                   │
│    - 自动触发部署                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 4. Vercel 开始构建                                        │
│    - 运行安装命令（installCommand）                       │
│    - 运行构建命令（buildCommand）                         │
│    - 输出到指定目录（outputDirectory）                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 5. 构建完成                                               │
│    - 成功：生成预览 URL                                    │
│    - 失败：显示错误信息                                    │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│ 6. 预览面板显示部署状态                                    │
│    - 实时更新状态（队列中 → 构建中 → 成功/失败）            │
│    - 显示预览 URL                                         │
└─────────────────────────────────────────────────────────┘
```

### 手动触发部署

**方式 1：在配置弹窗中触发**

1. 打开项目的 Vercel 配置弹窗
2. 切换到 "部署历史" 标签页
3. 点击左下角的 "测试部署" 按钮
4. 确认部署提示
5. 查看部署历史中的新部署记录

**方式 2：通过 API 触发**

```bash
curl -X POST http://localhost:3000/api/vercel/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": 1,
    "branch": "main",
    "production": false
  }'
```

**参数说明**：
- `projectId`：项目的数据库 ID
- `branch`：要部署的分支（默认：项目的 `defaultBranch`）
- `production`：是否为生产部署（默认：`false`）

---

## 预览功能

### 预览面板布局

预览面板位于编辑器右侧，提供以下功能：

#### 1. 部署状态栏

**位置**：预览面板顶部

**显示内容**：
- **部署状态图标**：
  - 🔄 构建中：蓝色旋转图标
  - ✅ 成功：绿色对勾
  - ❌ 失败：红色叉号
- **状态文本**：显示当前状态（如 "构建中"、"成功"）
- **预览 URL**：蓝色链接，点击打开
- **复制 URL 按钮**：快速复制预览 URL
- **刷新按钮**：手动刷新部署状态
- **Vercel 按钮**：在 Vercel 中打开项目

#### 2. 预览区域

**位置**：预览面板主体

**功能**：
- 使用 iframe 嵌入 Vercel 部署的预览
- 实时显示网站内容
- 支持完整交互（点击、滚动等）
- 右下角有刷新按钮，手动刷新预览

**样式**：
- 白色背景
- 全尺寸显示
- 无边框设计

#### 3. 未配置提示

当项目未配置 Vercel 时，显示提示界面：

**内容**：
- 云图标
- 提示文字："未配置 Vercel"
- 说明文字："配置 Vercel 项目后，这里会显示部署预览"
- "配置 Vercel" 按钮

### 部署状态实时更新

**轮询机制**：
- 构建中时，每 5 秒自动刷新一次状态
- 构建成功或失败后停止轮询
- 自动清理定时器，避免资源浪费

**Webhook 通知**（可选）：
- 配置 Vercel Webhook 后，Vercel 会在部署状态变化时主动通知
- 实现真正的实时更新
- 需要 `VERCEL_WEBHOOK_SECRET` 环境变量

### 预览 URL 格式

**生产部署**：
```
https://your-project-name.vercel.app
```

**预览部署**：
```
https://your-commit-hash.your-project-name.vercel.app
```

**分支部署**（如果配置了）：
```
https://your-branch-name.your-project-name.vercel.app
```

---

## 常见问题

### Q1: 为什么看不到 Vercel 项目列表？

**可能原因**：
1. VERCEL_TOKEN 环境变量未设置或无效
2. 网络连接问题
3. Vercel API 暂时不可用

**解决方案**：
1. 检查 `.env` 文件中的 `VERCEL_TOKEN`
2. 尝试点击 "刷新项目列表" 按钮
3. 检查网络连接
4. 查看 Vercel Token 是否有足够的权限

### Q2: 部署一直卡在 "构建中" 状态

**可能原因**：
1. 构建时间较长（大型项目正常现象）
2. 构建配置错误
3. 依赖安装失败

**解决方案**：
1. 耐心等待，大型项目可能需要 5-10 分钟
2. 访问 Vercel Dashboard 查看构建日志
3. 检查构建设置是否正确
4. 确认所有依赖都能正常安装

### Q3: 部署失败，显示错误信息

**常见错误**：

**错误 1：依赖安装失败**
```
Error: Cannot find module 'xxx'
```
**解决**：检查 `package.json`，确保所有依赖都正确列出

**错误 2：构建超时**
```
Error: Build timed out after 10 minutes
```
**解决**：优化构建时间，或联系 Vercel 支持增加超时时间

**错误 3：环境变量缺失**
```
Error: API_KEY is not defined
```
**解决**：在 Vercel 项目设置中配置环境变量

### Q4: 预览 URL 打开显示 404

**可能原因**：
1. 构建失败
2. 输出目录配置错误
3. 路由配置问题

**解决方案**：
1. 检查部署历史，确认构建是否成功
2. 验证 "输出目录" 设置是否正确
3. 检查项目的路由配置（如 Vue Router、React Router）

### Q5: 如何配置自定义域名？

**步骤**：
1. 访问 Vercel 项目设置
2. 进入 "Domains" 页面
3. 添加自定义域名
4. 配置 DNS 记录
5. 等待 DNS 生效

**注意**：自定义域名配置需要在 Vercel Dashboard 中完成，不在 OpenClaw Workspace 中。

### Q6: 如何部署到生产环境？

**当前版本**：
- 点击 "测试部署" 默认创建预览部署
- 生产部署需要通过 Vercel Dashboard 手动触发

**未来版本**：
- 将支持在配置弹窗中选择部署目标（预览/生产）

### Q7: 多人协作时如何配置？

**团队账户**：
1. 配置 `VERCEL_TEAM_ID` 环境变量
2. 所有团队成员使用相同的 Vercel Token
3. 项目会自动关联到团队账户

**权限管理**：
- 确保每个团队成员都有 Vercel 项目的访问权限
- Token 需要有足够的权限（读取项目、创建部署）

### Q8: 如何查看构建日志？

**方式 1：在 Vercel Dashboard 中查看**
1. 打开 Vercel 项目
2. 进入 "Deployments" 页面
3. 点击具体的部署
4. 查看 "Build Logs"

**方式 2：通过 API 获取**
```bash
curl https://api.vercel.com/v13/deployments/{deploymentId} \
  -H "Authorization: Bearer {VERCEL_TOKEN}"
```

### Q9: 如何取消正在进行的部署？

**方式 1：在 Vercel Dashboard 中取消**
1. 打开部署详情页
2. 点击 "Cancel Deployment" 按钮

**方式 2：通过 API 取消**
```bash
curl -X PATCH https://api.vercel.com/v13/deployments/{deploymentId} \
  -H "Authorization: Bearer {VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"state":"canceled"}'
```

### Q10: 构建时间过长怎么办？

**优化建议**：

1. **使用构建缓存**
   - Vercel 默认缓存 `node_modules`
   - 避免清除缓存

2. **优化依赖安装**
   - 使用 `npm ci` 而不是 `npm install`
   - 考虑使用 pnpm（更快的安装速度）

3. **并行化构建**
   - 使用多线程构建工具
   - 分离构建步骤

4. **减少构建产物**
   - 删除不必要的文件
   - 使用 Tree Shaking
   - 压缩资源

5. **考虑使用 Vercel Edge**
   - 适合轻量级应用
   - 更快的冷启动

---

## 技术实现

### 数据库模型

**GitHubProject 表**：
```prisma
model GitHubProject {
  id               Int       @id @default(autoincrement())
  vercelProjectId  String?   @unique  // Vercel 项目 ID
  vercelUrl        String?            // 部署 URL
  buildCommand     String?   @default("npm run build")
  outputDirectory  String?   @default("dist")
  installCommand   String?   @default("npm install")
  framework        String?            // 框架类型
  lastDeployAt     DateTime?           // 最后部署时间
  deployments      Deployment[]
}
```

**Deployment 表**：
```prisma
model Deployment {
  id              Int      @id @default(autoincrement())
  projectId       Int
  vercelDeployId  String   @unique  // Vercel 部署 ID
  status          String             // queued, building, ready, error
  url             String?            // 预览 URL
  production      Boolean  @default(false)
  createdAt       DateTime @default(now())
  completedAt     DateTime?
  duration        Int?               // 构建耗时（秒）
  errorMessage    String?            // 错误信息
}
```

### API 端点

**获取 Vercel 项目列表**：
```http
GET /api/vercel/projects
```

**创建 Vercel 项目**：
```http
POST /api/vercel/projects
Content-Type: application/json

{
  "name": "my-project"
}
```

**触发部署**：
```http
POST /api/vercel/deploy
Content-Type: application/json

{
  "projectId": 1,
  "branch": "main",
  "production": false
}
```

**获取部署状态**：
```http
GET /api/vercel/status/{projectId}
```

**保存项目配置**：
```http
POST /api/projects/configure
Content-Type: application/json

{
  "projectId": 1,
  "vercelProjectId": "prj_xxx",
  "vercelUrl": "https://my-project.vercel.app",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

---

## 相关文档

- [Vercel 官方文档](https://vercel.com/docs)
- [Vercel API 文档](https://vercel.com/docs/rest-api)
- [环境变量配置](../.env.example)
- [Vercel 设置指南](./VERCEL_SETUP.md)

---

## 更新日志

### v1.0.0 (2026-04-01)
- ✅ 初始版本发布
- ✅ 支持链接 Vercel 项目
- ✅ 支持配置构建设置
- ✅ 支持手动触发部署
- ✅ 支持查看部署历史
- ✅ 支持实时预览

---

## 联系与反馈

如有问题或建议，请：
1. 查看本文档的常见问题部分
2. 在项目仓库提 Issue
3. 联系技术支持
