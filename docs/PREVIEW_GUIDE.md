# 预览功能使用指南

## 功能概述

预览面板允许你在开发页面右侧实时查看项目运行效果，无需切换到新标签页。OpenClaw Workspace 使用 **Vercel 自动部署** 方案，实现云端预览和部署。

## Vercel 预览方案

### 核心特性

- **云端自动部署**：推送代码到 GitHub 后自动触发 Vercel 构建
- **预览 URL**：每次提交生成唯一的预览链接
- **实时状态**：查看部署状态（构建中、就绪、错误等）
- **生产部署**：支持一键部署到生产环境

### 架构流程

```
代码提交 → GitHub Webhook → Nuxt API → Vercel API → 创建部署 → 生成预览 URL
```

## 链接 Vercel 项目

### 步骤

1. **准备 Vercel Token**
   - 访问 https://vercel.com/account/tokens
   - 创建新的 Access Token
   - 在环境变量中设置 `VERCEL_TOKEN`

2. **在项目设置中链接 Vercel**
   - 打开项目设置面板
   - 输入 Vercel Project ID
   - 配置构建设置（可选）

3. **配置构建设置**（可选）

| 设置项 | 说明 | 默认值 |
|--------|------|--------|
| Build Command | 构建命令 | `npm run build` |
| Output Directory | 输出目录 | `.next` 或 `dist` |
| Install Command | 安装命令 | `npm install` |
| Framework | 框架类型 | 自动检测 |

### 获取 Vercel Project ID

1. 访问 Vercel 项目设置
2. 在 General 页面找到 Project ID
3. 复制并粘贴到 OpenClaw Workspace

## 预览功能

### 自动部署

- 推送代码到 GitHub 后，Vercel 自动开始构建
- 预览面板显示部署状态
- 构建完成后自动显示预览 URL

### 部署状态

| 状态 | 说明 |
|------|------|
| Queued | 部署已排队，等待构建 |
| Building | 正在构建中 |
| Ready | 构建成功，预览可用 |
| Error | 构建失败，查看错误信息 |
| Cancelled | 部署已取消 |
| Deactivated | 部署已停用 |

### 预览 URL

- **预览部署**：`https://{project}-{git-branch}-{random}.vercel.app`
- **生产部署**：`https://{project}.vercel.app` 或自定义域名

## 使用流程示例

### 1. 链接 Vercel 项目

```
项目设置 → Vercel 配置 → 输入 Project ID → 保存
```

### 2. 配置构建设置（可选）

```
项目设置 → 构建配置 → 设置 Build Command → 保存
```

### 3. 推送代码触发部署

```
在对话中：创建新组件并提交
OpenClaw：代码已推送到 GitHub
系统：自动触发 Vercel 部署
预览面板：显示构建状态 → 完成后显示预览链接
```

### 4. 查看预览

- 右侧预览面板显示部署状态
- 构建完成后点击预览 URL
- 在新标签页中打开预览

## 技术实现

### 数据结构

```typescript
interface Project {
  // Vercel 配置
  vercelProjectId?: string | null
  vercelUrl?: string | null
  vercelTeamId?: string | null

  // 构建配置
  buildCommand?: string | null
  outputDirectory?: string | null
  installCommand?: string | null
  framework?: string | null
}

interface Deployment {
  id: number
  vercelDeployId: string
  status: 'queued' | 'building' | 'ready' | 'error' | 'cancelled' | 'deactivated'
  url: string | null
  production: boolean
  createdAt: Date
  completedAt?: Date | null
  duration?: number | null
  errorMessage?: string | null
}
```

### API 端点

```typescript
// 创建 Vercel 部署
POST /api/vercel/deploy

// 获取部署状态
GET /api/vercel/deployments?projectId={projectId}

// 取消部署
DELETE /api/vercel/deploy/{deployId}
```

## 常用框架默认配置

| 框架 | Build Command | Output Directory |
|------|---------------|------------------|
| Next.js | `npm run build` | `.next` |
| Nuxt | `npm run build` | `.output/public` |
| Vite | `npm run build` | `dist` |
| Vue CLI | `npm run build` | `dist` |
| Create React App | `npm run build` | `build` |

## 注意事项

1. **GitHub Token**：需要有效的 GitHub Token 来推送代码
2. **Vercel Token**：需要 Vercel Access Token 来创建部署
3. **构建时间**：大型项目构建可能需要几分钟
4. **部署限制**：Vercel 免费计划有构建次数限制
5. **环境变量**：如需环境变量，在 Vercel 项目设置中配置

## 故障排查

### 部署卡在 Building 状态

**检查**：
1. Vercel Dashboard 查看构建日志
2. 确认 Build Command 正确
3. 检查是否有构建错误

### 部署失败（Error 状态）

**解决**：
1. 查看错误信息
2. 检查代码是否有语法错误
3. 确认依赖是否正确安装
4. 查看 Vercel 构建日志

### 预览 URL 无法访问

**检查**：
1. 确认部署状态为 Ready
2. 检查 URL 是否正确
3. 等待 DNS 生效（新部署可能需要几秒）
4. 尝试清除浏览器缓存

### GitHub Webhook 不触发

**检查**：
1. 确认 GitHub Token 有效
2. 检查 Vercel Token 权限
3. 查看 Nuxt API 日志
4. 确认 Webhook 配置正确

## 环境变量配置

在 `.env` 文件中配置：

```bash
# GitHub Token（用于推送代码）
GITHUB_TOKEN=your_github_token_here

# Vercel Token（用于创建部署）
VERCEL_TOKEN=your_vercel_token_here

# Vercel Team ID（可选，用于团队账户）
VERCEL_TEAM_ID=your_vercel_team_id_here

# Vercel Webhook Secret（可选，用于验证 Webhook）
VERCEL_WEBHOOK_SECRET=your_webhook_secret_here
```

## 未来扩展

- [ ] 支持多环境部署（staging、production）
- [ ] 自动回滚功能
- [ ] 部署历史查看
- [ ] 构建日志实时查看
- [ ] 自定义域名配置
