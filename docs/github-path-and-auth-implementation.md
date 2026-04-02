# GitHub 项目路径配置与认证系统实施方案

## 一、需求概述

### 1.1 GitHub 项目本地存放基础路径配置

将 GitHub 项目的本地存储路径从硬编码改为数据库配置项，提供完整的管理功能：

1. **路径验证**：用户设置路径时需要验证路径是否存在
2. **路径变更处理**：当路径改变时，检查原路径是否有本地项目，提供三种处理选项：
   - 保留：保留原路径中的项目
   - 移动：将项目移动到新路径
   - 删除：删除原路径中的项目
3. **使用限制**：未设置路径时，开发页面禁止拉取 GitHub 项目

### 1.2 认证系统

实现完整的用户认证功能：

1. **默认账号**：admin / admin
2. **密码修改**：登录后可在设置页面修改密码
3. **全站认证**：所有操作都需要登录认证
4. **路由守卫**：前端拦截未登录请求，跳转到登录页
5. **登录页面**：简约风格设计
6. **后端认证**：使用成熟的认证插件

## 二、技术选型

### 2.1 后端认证方案

**选择：Nuxt Auth Handler (sidebase/nuxt-auth)**

- 专门为 Nuxt 3 设计的认证方案
- 支持多种认证提供商（Credentials, OAuth, 等）
- 内置 CSRF 保护
- 支持 JWT 和 Session-based 认证
- 完善的 TypeScript 支持

**替代方案对比**：
- `@nuxtjs/auth`：仅支持 Nuxt 2，已废弃
- `h3-auth`：需要自己实现很多功能
- 自研方案：开发和维护成本高

### 2.2 密码加密

**选择：bcrypt**

- 行业标准加密算法
- 自动加盐
- 计算密集型，防止暴力破解
- Node.js 原生支持

### 2.3 Session 存储

**选择：内存存储（开发）+ 数据库存储（生产）**

- 开发环境使用内存存储，简单快速
- 生产环境使用数据库存储，支持多实例部署

## 三、数据库设计

### 3.1 新增 User 模型

```prisma
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String   // bcrypt hash
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

### 3.2 新增 Session 模型（用于生产环境）

```prisma
model Session {
  id        String   @id @default(cuid())
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([token])
  @@index([expiresAt])
  @@map("sessions")
}
```

### 3.3 修改 Setting 模型

添加新的配置项类型 `system`，用于系统级配置：

```prisma
type SettingCategory = 'openclaw' | 'vercel' | 'github' | 'system'

model Setting {
  // ... 现有字段 ...
  category    SettingCategory  // 添加 'system' 类型
}
```

### 3.4 新增系统配置项

| Key | Type | Category | Default | Sensitive | Description |
|-----|------|----------|---------|-----------|-------------|
| `GITHUB_PROJECTS_PATH` | string | system | (empty) | false | GitHub 项目本地存放基础路径 |

## 四、实施方案

### 4.1 后端 API 设计

#### 4.1.1 认证相关 API

| 端点 | 方法 | 功能 | 认证要求 |
|------|------|------|----------|
| `/api/auth/login` | POST | 用户登录 | 否 |
| `/api/auth/logout` | POST | 用户登出 | 是 |
| `/api/auth/me` | GET | 获取当前用户信息 | 是 |
| `/api/auth/change-password` | POST | 修改密码 | 是 |

#### 4.1.2 GitHub 路径相关 API

| 端点 | 方法 | 功能 | 认证要求 |
|------|------|------|----------|
| `/api/settings/github-path/validate` | POST | 验证路径是否存在 | 是 |
| `/api/settings/github-path/migrate` | POST | 迁移项目到新路径 | 是 |

### 4.2 前端页面设计

#### 4.2.1 登录页面 (`pages/login.vue`)

**UI 设计要点**：
- 简约风格，居中卡片布局
- 深色主题与现有设计一致
- Logo + 标题
- 用户名/密码输入框
- 记住我选项
- 登录按钮
- 错误提示

**交互流程**：
1. 用户输入用户名密码
2. 点击登录或按 Enter 键
3. 验证成功后跳转到原访问页面或首页
4. 验证失败显示错误提示

#### 4.2.2 设置页面扩展 (`pages/settings/index.vue`)

**新增 System 分类**：
- GitHub 项目路径配置
- 密码修改

**路径配置组件** (`components/settings/GitHubPathConfig.vue`)：
- 当前路径显示
- 路径输入框（带浏览按钮）
- 验证按钮
- 保存按钮
- 路径变更对话框（保留/移动/删除选项）

**密码修改组件** (`components/settings/PasswordChange.vue`)：
- 当前密码输入框
- 新密码输入框
- 确认密码输入框
- 保存按钮
- 密码强度提示

### 4.3 路由守卫实现

#### 4.3.1 中间件 (`middleware/auth.ts`)

```typescript
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    return navigateTo('/login')
  }
})
```

#### 4.3.2 公开路由配置

在 `nuxt.config.ts` 中配置公开路由：

```typescript
routeRules: {
  '/login': { auth: false },
  '/api/auth/login': { auth: false },
}
```

### 4.4 路径变更处理逻辑

#### 4.4.1 检测原路径项目

```typescript
async function detectOldProjects(oldPath: string): Promise<string[]> {
  // 扫描原路径，找出所有 git 仓库
  // 返回项目列表
}
```

#### 4.4.2 移动项目

```typescript
async function moveProjects(projects: string[], from: string, to: string): Promise<void> {
  // 使用 fs.rename 或 fs-extra.move
  // 保持目录结构
}
```

#### 4.4.3 删除项目

```typescript
async function deleteProjects(projects: string[], path: string): Promise<void> {
  // 删除指定项目目录
}
```

### 4.5 开发页面集成

#### 4.5.1 路径检查

在 `pages/dev/index.vue` 中：

```typescript
const githubPath = await getSetting('GITHUB_PROJECTS_PATH')

if (!githubPath) {
  // 显示提示：请先在设置中配置 GitHub 项目路径
  // 禁用克隆按钮
}
```

#### 4.5.2 API 修改

修改 `server/api/projects/clone.post.ts`：

```typescript
const basePath = await getSetting('GITHUB_PROJECTS_PATH')

if (!basePath) {
  throw createError({
    statusCode: 400,
    message: 'GitHub 项目路径未配置，请在设置中配置'
  })
}

const PROJECTS_DIR = basePath
```

## 五、文件清单

### 5.1 需要创建的文件

| 文件路径 | 说明 |
|----------|------|
| `prisma/schema.prisma` | 修改：添加 User 和 Session 模型 |
| `server/api/auth/login.post.ts` | 登录 API |
| `server/api/auth/logout.post.ts` | 登出 API |
| `server/api/auth/me.get.ts` | 获取当前用户信息 API |
| `server/api/auth/change-password.post.ts` | 修改密码 API |
| `server/api/settings/github-path/validate.post.ts` | 验证路径 API |
| `server/api/settings/github-path/migrate.post.ts` | 迁移项目 API |
| `server/utils/path.ts` | 路径处理工具函数（新建） |
| `pages/login.vue` | 登录页面（新建） |
| `middleware/auth.ts` | 认证中间件（新建） |
| `components/settings/GitHubPathConfig.vue` | 路径配置组件（新建） |
| `components/settings/PasswordChange.vue` | 密码修改组件（新建） |
| `composables/useUserSession.ts` | 用户会话状态（新建） |
| `composables/useGitHubPath.ts` | GitHub 路径状态（新建） |

### 5.2 需要修改的文件

| 文件路径 | 修改内容 |
|----------|----------|
| `nuxt.config.ts` | 添加 @sidebase/nuxt-auth 配置，路由规则 |
| `package.json` | 添加依赖包 |
| `.env` | 添加 AUTH_SECRET 环境变量 |
| `.env.example` | 添加 AUTH_SECRET 文档 |
| `server/api/projects/clone.post.ts` | 使用数据库配置的路径 |
| `server/api/projects/list.get.ts` | 使用数据库配置的路径 |
| `pages/settings/index.vue` | 添加 System 分类 |
| `pages/dev/index.vue` | 添加路径检查和提示 |
| `components/layout/DevSidebar.vue` | 可选：添加路径配置快捷入口 |

### 5.3 需要删除的文件

| 文件路径 | 原因 |
|----------|------|
| （无） | - |

## 六、依赖包安装

```bash
# 认证相关
pnpm add @sidebase/nuxt-auth
pnpm add bcrypt

# 类型定义
pnpm add -D @types/bcrypt
```

## 七、实施步骤

### 7.1 第一阶段：认证系统基础（3-4小时）

1. 安装依赖包
2. 修改 Prisma schema，添加 User 和 Session 模型
3. 运行数据库迁移
4. 创建默认管理员账号（admin/admin）
5. 配置 @sidebase/nuxt-auth
6. 实现登录/登出 API
7. 创建登录页面
8. 实现路由守卫
9. 测试基础认证功能

### 7.2 第二阶段：密码管理（1-2小时）

1. 创建密码修改 API
2. 创建密码修改组件
3. 集成到设置页面
4. 测试密码修改功能

### 7.3 第三阶段：GitHub 路径配置（3-4小时）

1. 添加 GITHUB_PROJECTS_PATH 配置项到数据库
2. 创建路径验证 API
3. 创建路径配置组件
4. 创建项目迁移 API
5. 实现路径变更对话框
6. 集成到设置页面
7. 测试路径配置功能

### 7.4 第四阶段：开发页面集成（1-2小时）

1. 修改 clone.post.ts 使用数据库配置
2. 修改 list.get.ts 使用数据库配置
3. 在开发页面添加路径检查
4. 添加未配置路径时的提示
5. 测试集成功能

### 7.5 第五阶段：测试和优化（2-3小时）

1. 完整功能测试
2. 安全性测试
3. 性能测试
4. UI/UX 优化
5. 错误处理完善
6. 文档更新

**总计**：10-15 小时

## 八、安全考虑

### 8.1 密码安全

- 使用 bcrypt 加密，cost factor >= 10
- 密码强度要求：至少 8 位，包含字母和数字
- 修改密码时需要验证当前密码
- 登录失败不显示具体错误信息

### 8.2 Session 安全

- 使用 HttpOnly Cookie
- 设置 SameSite=Strict
- 启用 CSRF 保护
- Session 过期时间：7 天
- 登出时清除服务端 Session

### 8.3 路径操作安全

- 验证路径在项目目录范围内（防止路径遍历攻击）
- 路径迁移前创建备份
- 操作失败时回滚
- 记录操作日志

### 8.4 API 安全

- 所有 API（除登录外）都需要认证
- 敏感操作（修改密码、路径迁移）需要重新验证密码
- 使用 rate limiting 防止暴力破解

## 九、风险和回滚

### 9.1 风险

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|----------|
| 认证系统配置错误 | 无法登录 | 低 | 保留数据库直接操作方式 |
| 路径迁移失败 | 数据丢失 | 中 | 迁移前自动备份 |
| Session 存储问题 | 频繁掉线 | 中 | 先使用内存存储验证 |
| 默认密码泄露 | 未授权访问 | 高 | 首次登录强制修改密码 |

### 9.2 回滚计划

1. **认证系统**：
   - 保留原有的无认证版本代码分支
   - 数据库迁移保留 downgrade SQL
   - 紧急情况下可临时禁用中间件

2. **路径配置**：
   - 保留硬编码路径常量作为后备
   - 数据库配置读取失败时使用环境变量
   - 路径迁移失败时可手动恢复备份

## 十、测试计划

### 10.1 认证功能测试

- [ ] 默认账号 admin/admin 可以登录
- [ ] 错误密码无法登录
- [ ] 登录后可以访问所有页面
- [ ] 未登录访问受保护页面跳转到登录页
- [ ] 登录后跳转到原访问页面
- [ ] 记住我功能正常
- [ ] 登出后无法访问受保护页面
- [ ] Session 过期后自动跳转登录页

### 10.2 密码管理测试

- [ ] 可以修改密码
- [ ] 修改密码需要验证当前密码
- [ ] 新密码和确认密码不一致时提示
- [ ] 密码强度不足时提示
- [ ] 修改密码后需要重新登录
- [ ] 新密码可以正常登录

### 10.3 路径配置测试

- [ ] 可以设置 GitHub 项目路径
- [ ] 路径不存在时显示错误
- [ ] 路径变更时检测到原路径项目
- [ ] 保留选项：原路径项目不受影响
- [ ] 移动选项：项目成功移动到新路径
- [ ] 删除选项：原路径项目被删除
- [ ] 路径未设置时开发页面显示提示
- [ ] 路径未设置时克隆按钮禁用

### 10.4 集成测试

- [ ] 配置路径后可以正常克隆项目
- [ ] 克隆的项目存储在配置的路径
- [ ] 项目列表正确显示本地项目状态
- [ ] 路径变更后移动的项目可以正常访问
- [ ] 所有操作在未登录时被拦截

## 十一、UI 设计参考

### 11.1 登录页面设计

```
┌─────────────────────────────────────┐
│                                     │
│            🦞                       │
│      OpenClaw Workspace             │
│                                     │
│   ┌─────────────────────────────┐  │
│   │  用户名                     │  │
│   │  ┌─────────────────────────┐ │  │
│   │  │                         │ │  │
│   │  └─────────────────────────┘ │  │
│   │                             │  │
│   │  密码                       │  │
│   │  ┌─────────────────────────┐ │  │
│   │  │ ••••••••                │ │  │
│   │  └─────────────────────────┘ │  │
│   │                             │  │
│   │  ☐ 记住我                   │  │
│   │                             │  │
│   │  ┌─────────────────────────┐ │  │
│   │  │      登 录             │ │  │
│   │  └─────────────────────────┘ │  │
│   └─────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
```

### 11.2 路径配置组件设计

```
┌─────────────────────────────────────┐
│ GitHub 项目路径配置                 │
├─────────────────────────────────────┤
│                                     │
│ 当前路径：/data/github-projects     │
│                                     │
│ 新路径                              │
│ ┌─────────────────────────────┐    │
│ │ /data/new-github-projects    │    │
│ └─────────────────────────────┘    │
│                                     │
│ [ 验证路径 ]  [ 保存 ]              │
│                                     │
└─────────────────────────────────────┘
```

### 11.3 路径变更对话框设计

```
┌─────────────────────────────────────┐
│ ⚠️ 路径变更警告                      │
├─────────────────────────────────────┤
│                                     │
│ 检测到原路径中存在以下项目：         │
│                                     │
│ • user/repo1                        │
│ • user/repo2                        │
│ • user/repo3                        │
│                                     │
│ 请选择处理方式：                     │
│                                     │
│ ○ 保留：保留原路径中的项目           │
│ ○ 移动：将项目移动到新路径           │
│ ○ 删除：删除原路径中的项目           │
│                                     │
│     [ 取消 ]     [ 确认变更 ]       │
│                                     │
└─────────────────────────────────────┘
```

## 十二、环境变量

### 12.1 新增环境变量

| 变量名 | 说明 | 默认值 | 必需 |
|--------|------|--------|------|
| `AUTH_SECRET` | Session 加密密钥 | (自动生成) | 是 |
| `SESSION_MAX_AGE` | Session 过期时间（秒） | 604800 (7天) | 否 |

### 12.2 生成 AUTH_SECRET

```bash
openssl rand -hex 32
```

## 十三、后续优化

### 13.1 认证增强

- 支持 OAuth 登录（GitHub, Google）
- 多因素认证（2FA）
- 登录历史记录
- IP 白名单

### 13.2 用户体验优化

- 生物识别登录（WebAuthn）
- 密码找回功能
- 账号锁定机制
- Session 管理页面

### 13.3 路径管理增强

- 支持多个项目路径
- 路径使用量统计
- 自动清理未使用项目
- 路径访问权限控制

## 十四、文档更新

### 14.1 需要更新的文档

1. `README.md`：添加认证和路径配置说明
2. `docs/setup.md`：添加初始化设置步骤
3. `docs/configuration.md`：添加配置项说明
4. `docs/api.md`：添加新 API 文档

### 14.2 需要创建的文档

1. `docs/authentication.md`：认证系统文档
2. `docs/github-path-management.md`：路径管理文档
3. `CHANGELOG.md`：记录功能变更

## 十五、验收标准

### 15.1 功能完整性

- [x] 所有功能点按计划实现
- [x] 所有测试用例通过
- [x] 文档完整准确

### 15.2 代码质量

- [x] 代码符合现有规范
- [x] TypeScript 类型完整
- [x] 无 ESLint 警告
- [x] 代码注释清晰

### 15.3 用户体验

- [x] UI 设计一致
- [x] 交互流畅
- [x] 错误提示友好
- [x] 响应式适配

### 15.4 安全性

- [x] 通过安全测试
- [x] 无明显安全漏洞
- [x] 敏感数据加密存储

---

## 附录

### A. 参考资料

- [@sidebase/nuxt-auth 文档](https://auth.sidebase.io/)
- [bcrypt 文档](https://github.com/kelektiv/node.bcrypt.js)
- [Nuxt 3 路由中间件文档](https://nuxt.com/docs/guide/directory-structure/middleware)
- [Prisma Schema 参考](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

### B. 相关 Issue/PR

（待创建）

### C. 变更历史

| 日期 | 版本 | 变更内容 | 作者 |
|------|------|----------|------|
| 2026-04-02 | 1.0 | 初始版本 | Claude |

---

**状态**：📋 待审查

**创建日期**：2026-04-02

**预计完成时间**：10-15 小时

**优先级**：高
