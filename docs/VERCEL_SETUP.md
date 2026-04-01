# Vercel 集成配置指南

## 概述

OpenClaw Workspace 使用 **Vercel 自动部署** 方案实现项目预览和部署。推送代码到 GitHub 后，系统自动触发 Vercel 构建，生成预览 URL。

## 功能特性

- **自动部署**：推送代码到 GitHub 后自动触发构建
- **预览 URL**：每次提交生成唯一的预览链接
- **实时状态**：查看部署状态（构建中、就绪、错误等）
- **生产部署**：支持一键部署到生产环境
- **构建设置**：自定义构建命令、输出目录等

## 前置要求

### 1. Vercel 账户

- 注册 Vercel 账户：https://vercel.com
- 连接 GitHub 账户到 Vercel

### 2. Vercel Access Token

1. 访问 https://vercel.com/account/tokens
2. 点击 "Create Token"
3. 输入 Token 名称（如 "OpenClaw Workspace"）
4. 选择作用域（建议选择 "Full Account"）
5. 复制生成的 Token

### 3. GitHub Token（已有）

确保你的 GitHub Token 有以下权限：
- `repo` - 完整仓库访问权限
- `workflow` - GitHub Actions 权限

## 环境变量配置

在 `.env` 文件中添加：

```bash
# Vercel Access Token
VERCEL_TOKEN=your_vercel_token_here

# Vercel Team ID（可选，用于团队账户）
VERCEL_TEAM_ID=your_vercel_team_id_here

# GitHub Token（用于推送代码）
GITHUB_TOKEN=your_github_token_here
```

## 链接 Vercel 项目

### 步骤 1：获取 Vercel Project ID

1. 访问 Vercel Dashboard：https://vercel.com/dashboard
2. 选择或创建项目
3. 进入项目设置（Settings → General）
4. 复制 "Project ID"

### 步骤 2：在 OpenClaw Workspace 中配置

1. 打开项目设置面板
2. 在 "Vercel 配置" 部分输入：
   - **Vercel Project ID**：步骤 1 中复制的 ID
   - **Vercel Team ID**（可选）：如果是团队账户
3. 点击 "保存"

### 步骤 3：配置构建设置（可选）

在项目设置中配置以下选项：

| 设置项 | 说明 | 默认值 |
|--------|------|--------|
| Build Command | 构建命令 | `npm run build` |
| Output Directory | 输出目录 | 自动检测 |
| Install Command | 安装命令 | `npm install` |
| Framework | 框架类型 | 自动检测 |

**常用框架配置示例**：

```bash
# Next.js
Build Command: npm run build
Output Directory: .next

# Nuxt
Build Command: npm run build
Output Directory: .output/public

# Vite
Build Command: npm run build
Output Directory: dist

# Vue CLI
Build Command: npm run build
Output Directory: dist
```

## 部署流程

### 自动部署流程

```
1. 在 OpenClaw Workspace 中编辑代码
2. 提交代码到 GitHub
3. GitHub Webhook 触发 Nuxt API
4. Nuxt API 调用 Vercel API
5. Vercel 开始构建项目
6. 构建完成后生成预览 URL
7. 预览面板显示部署状态和 URL
```

### 部署状态说明

| 状态 | 图标 | 说明 |
|------|------|------|
| Queued | ⏳ | 部署已排队，等待构建 |
| Building | 🔨 | 正在构建中 |
| Ready | ✅ | 构建成功，预览可用 |
| Error | ❌ | 构建失败，查看错误信息 |
| Cancelled | ⏹️ | 部署已取消 |
| Deactivated | 🚫 | 部署已停用 |

## API 端点

### 创建部署

```typescript
POST /api/vercel/deploy
Content-Type: application/json

{
  "projectId": 1,
  "branch": "main",
  "production": false
}
```

### 获取部署列表

```typescript
GET /api/vercel/deployments?projectId={projectId}
```

### 取消部署

```typescript
DELETE /api/vercel/deploy/{deployId}
```

### 获取部署状态

```typescript
GET /api/vercel/deploy/{deployId}/status
```

## 故障排查

### 部署卡在 Building 状态

**原因**：
- 构建时间较长（大型项目正常现象）
- 构建配置错误

**解决**：
1. 访问 Vercel Dashboard 查看构建日志
2. 确认 Build Command 正确
3. 检查是否有依赖安装错误

### 部署失败（Error 状态）

**常见原因**：
- 代码语法错误
- 依赖版本冲突
- 环境变量缺失
- 构建超时

**解决**：
1. 查看 Vercel 构建日志
2. 检查代码是否有语法错误
3. 确认所有依赖正确安装
4. 在 Vercel 项目设置中配置环境变量

### GitHub Webhook 不触发

**检查**：
1. 确认 GitHub Token 有效
2. 检查 Vercel Token 权限
3. 查看 Nuxt API 日志
4. 确认网络连接正常

### 预览 URL 无法访问

**检查**：
1. 确认部署状态为 Ready
2. 检查 URL 是否正确
3. 等待 DNS 生效（新部署可能需要几秒）
4. 尝试清除浏览器缓存

## 高级配置

### 自定义域名

在 Vercel 项目设置中配置自定义域名：

1. 访问 Vercel 项目设置
2. 进入 "Domains" 页面
3. 添加自定义域名
4. 配置 DNS 记录

### 环境变量

在 Vercel 项目中配置环境变量：

1. 访问 Vercel 项目设置
2. 进入 "Environment Variables" 页面
3. 添加环境变量
4. 选择适用的环境（Production、Preview、Development）

### 构建缓存

Vercel 默认缓存 `node_modules` 和构建产物。如需清理缓存：

1. 访问 Vercel Dashboard
2. 进入项目设置
3. 选择 "Git" → "Ignored Build Step"
4. 或使用 "Redeploy" 功能

## 团队协作

### Team ID 配置

如果使用 Vercel 团队账户：

1. 访问 Vercel Team 设置
2. 复制 Team ID
3. 在 `.env` 文件中设置 `VERCEL_TEAM_ID`
4. 在项目配置中输入 Team ID

### 权限管理

确保 Vercel Token 有以下权限：
- 读取项目信息
- 创建部署
- 查看部署状态
- 取消部署

## 最佳实践

1. **使用分支策略**：
   - `main` 分支 → 生产部署
   - `develop` 分支 → 预览部署
   - `feature/*` 分支 → 预览部署

2. **配置构建设置**：
   - 明确指定 Build Command
   - 设置合适的 Output Directory
   - 配置正确的 Framework

3. **监控构建时间**：
   - 优化依赖安装速度
   - 使用构建缓存
   - 避免不必要的构建步骤

4. **环境变量管理**：
   - 在 Vercel 中配置生产环境变量
   - 在 `.env` 中配置开发环境变量
   - 不要在代码中硬编码敏感信息

## 相关文档

- [Vercel 官方文档](https://vercel.com/docs)
- [Vercel API 文档](https://vercel.com/docs/rest-api)
- [预览功能使用指南](./PREVIEW_GUIDE.md)
- [环境变量配置](../.env.example)

## 支持

如有问题，请：
1. 查看本文档的故障排查部分
2. 访问 [Vercel 文档](https://vercel.com/docs)
3. 在项目仓库提 Issue
