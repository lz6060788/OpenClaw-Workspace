# OpenClaw 开发后台 - 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建 OpenClaw 个人开发后台，包含 GitHub 项目开发功能和 OpenClaw 文档管理功能

**Architecture:** 采用 Nuxt 3 + Vue 3 + Pinia + Tailwind CSS + Monaco Editor，三栏布局（两级侧边栏 + 主区域），使用 keep-alive 缓存页面状态

**Tech Stack:** Nuxt 3, Vue 3, TypeScript, Pinia, Tailwind CSS, Monaco Editor

---

## 文件结构

```
OpenClaw-Workspace/
├── layouts/
│   └── default.vue              # 主布局（三栏结构）
├── pages/
│   ├── index.vue                 # 首页/重定向
│   ├── dev/
│   │   └── index.vue            # 开发功能主页
│   └── docs/
│       └── index.vue            # 文档功能主页
├── components/
│   ├── layout/
│   │   ├── PrimarySidebar.vue    # 一级侧边栏
│   │   ├── DevSidebar.vue       # 开发功能二级侧边栏
│   │   └── DocsSidebar.vue      # 文档功能二级侧边栏
│   ├── dev/
│   │   ├── ChatPanel.vue        # 对话区域
│   │   ├── PreviewPanel.vue     # 效果展示区
│   │   ├── FileTree.vue         # 文件树
│   │   └── CodeEditor.vue       # 代码编辑器
│   └── docs/
│       └── DocEditor.vue        # 文档编辑器
├── stores/
│   ├── app.ts                   # 全局状态（当前功能模块）
│   ├── project.ts               # 项目状态管理
│   └── docs.ts                  # 文档状态管理
├── server/
│   └── api/
│       ├── projects/
│       │   ├── list.get.ts      # 获取项目列表
│       │   ├── add.post.ts      # 添加项目
│       │   └── [name]/
│       │       ├── files.get.ts # 获取文件列表
│       │       └── file.get.ts  # 读取文件内容
│       └── dev/
│           └── [...path].ts     # 预览代理
└── composables/
    └── useProjects.ts           # 项目相关逻辑
```

---

## Phase 1: 基础布局搭建

### Task 1.1: 创建主布局

**Files:**
- Modify: `layouts/default.vue`
- Create: `components/layout/PrimarySidebar.vue`

- [ ] **Step 1: 创建一级侧边栏组件**

```vue
<!-- components/layout/PrimarySidebar.vue -->
<template>
  <aside class="w-20 bg-gray-800 flex flex-col items-center py-4">
    <NuxtLink
      to="/dev"
      class="nav-item mb-4"
      :class="{ 'active': route.path.startsWith('/dev') }"
    >
      <span class="text-2xl">💻</span>
    </NuxtLink>
    <NuxtLink
      to="/docs"
      class="nav-item"
      :class="{ 'active': route.path.startsWith('/docs') }"
    >
      <span class="text-2xl">📄</span>
    </NuxtLink>
  </aside>
</template>

<script setup>
const route = useRoute()
</script>

<style scoped>
.nav-item {
  @apply w-14 h-14 flex items-center justify-center rounded-lg transition-colors;
}
.nav-item:hover {
  @apply bg-gray-700;
}
.nav-item.active {
  @apply bg-blue-600 text-white;
}
</style>
```

- [ ] **Step 2: 修改默认布局**

```vue
<!-- layouts/default.vue -->
<template>
  <div class="flex h-screen bg-gray-900 text-gray-100">
    <PrimarySidebar />
    <slot />
  </div>
</template>

<script setup>
import PrimarySidebar from '~/components/layout/PrimarySidebar.vue'
</script>
```

- [ ] **Step 3: 提交**

```bash
git add layouts/default.vue components/layout/PrimarySidebar.vue
git commit -m "feat: 添加一级侧边栏组件"
```

---

### Task 1.2: 安装依赖

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 添加 Monaco Editor 和 pinia 依赖**

```bash
cd /root/.openclaw/workspace/OpenClaw-Workspace
npm install @guolao/vue-monaco-editor pinia @pinia/nuxt
```

- [ ] **Step 2: 修改 nuxt.config.ts 添加 pinia**

```typescript
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],
  // ...
})
```

- [ ] **Step 3: 提交**

```bash
git add package.json package-lock.json nuxt.config.ts
git commit -m "chore: 安装 Monaco Editor 和 Pinia 依赖"
```

---

## Phase 2: 状态管理

### Task 2.1: 创建全局状态

**Files:**
- Create: `stores/app.ts`

- [ ] **Step 1: 创建 app 状态 store**

```typescript
// stores/app.ts
import { defineStore } from 'pinia'

export type ModuleType = 'dev' | 'docs'

export const useAppStore = defineStore('app', {
  state: () => ({
    currentModule: 'dev' as ModuleType,
  }),
  actions: {
    setModule(module: ModuleType) {
      this.currentModule = module
    },
  },
})
```

- [ ] **Step 2: 提交**

```bash
git add stores/app.ts
git commit -m "feat: 添加全局状态管理"
```

---

### Task 2.2: 创建项目状态

**Files:**
- Create: `stores/project.ts`

- [ ] **Step 1: 创建项目状态 store**

```typescript
// stores/project.ts
import { defineStore } from 'pinia'

export interface Project {
  name: string
  path: string
}

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [] as Project[],
    currentProject: null as Project | null,
    files: [] as string[],
    currentFile: null as string | null,
    fileContent: '',
  }),
  actions: {
    setProjects(projects: Project[]) {
      this.projects = projects
    },
    setCurrentProject(project: Project | null) {
      this.currentProject = project
    },
    setFiles(files: string[]) {
      this.files = files
    },
    setCurrentFile(file: string | null) {
      this.currentFile = file
    },
    setFileContent(content: string) {
      this.fileContent = content
    },
  },
})
```

- [ ] **Step 2: 提交**

```bash
git add stores/project.ts
git commit -m "feat: 添加项目状态管理"
```

---

## Phase 3: 开发功能 - 侧边栏与项目列表

### Task 3.1: 开发功能二级侧边栏

**Files:**
- Create: `components/layout/DevSidebar.vue`

- [ ] **Step 1: 创建开发功能侧边栏组件**

```vue
<!-- components/layout/DevSidebar.vue -->
<template>
  <aside class="w-56 bg-gray-800 border-r border-gray-700 flex flex-col">
    <div class="p-4 border-b border-gray-700">
      <h2 class="text-lg font-semibold">项目列表</h2>
    </div>
    <div class="flex-1 overflow-y-auto p-2">
      <div
        v-for="project in projectStore.projects"
        :key="project.name"
        class="project-item"
        :class="{ 'active': projectStore.currentProject?.name === project.name }"
        @click="selectProject(project)"
      >
        {{ project.name }}
      </div>
    </div>
    <div class="p-4 border-t border-gray-700">
      <button class="btn-primary w-full" @click="showAddDialog = true">
        + 添加项目
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useProjectStore } from '~/stores/project'

const projectStore = useProjectStore()
const showAddDialog = ref(false)

const selectProject = (project) => {
  projectStore.setCurrentProject(project)
}

onMounted(async () => {
  // 加载项目列表
  const { data } = await useFetch('/api/projects/list')
  if (data.value) {
    projectStore.setProjects(data.value)
  }
})
</script>

<style scoped>
.project-item {
  @apply px-3 py-2 rounded cursor-pointer transition-colors;
}
.project-item:hover {
  @apply bg-gray-700;
}
.project-item.active {
  @apply bg-blue-600 text-white;
}
.btn-primary {
  @apply px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors;
}
</style>
```

- [ ] **Step 2: 创建项目列表 API**

```typescript
// server/api/projects/list.get.ts
import { readdir } from 'fs/promises'
import { join } from 'path'

const PROJECTS_DIR = join(process.cwd(), 'github-projects')

export default defineEventHandler(async () => {
  try {
    await mkdir(PROJECTS_DIR, { recursive: true })
    const entries = await readdir(PROJECTS_DIR, { withFileTypes: true })
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => ({
        name: entry.name,
        path: join(PROJECTS_DIR, entry.name),
      }))
  } catch (error) {
    return []
  }
})
```

- [ ] **Step 3: 更新布局引入二级侧边栏**

- [ ] **Step 4: 提交**

```bash
git add components/layout/DevSidebar.vue server/api/projects/list.get.ts
git commit -m "feat: 添加开发功能侧边栏和项目列表API"
```

---

### Task 3.2: 创建开发功能页面

**Files:**
- Create: `pages/dev/index.vue`

- [ ] **Step 1: 创建开发功能主页**

```vue
<!-- pages/dev/index.vue -->
<template>
  <div class="flex flex-1 overflow-hidden">
    <DevSidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="flex-1 flex">
        <ChatPanel class="w-1/2 border-r border-gray-700" />
        <PreviewPanel class="w-1/2" />
      </div>
      <div class="h-1/2 border-t border-gray-700">
        <FileTree class="h-full" />
      </div>
    </div>
  </div>
</template>

<script setup>
import DevSidebar from '~/components/layout/DevSidebar.vue'
import ChatPanel from '~/components/dev/ChatPanel.vue'
import PreviewPanel from '~/components/dev/PreviewPanel.vue'
import FileTree from '~/components/dev/FileTree.vue'
</script>
```

- [ ] **Step 2: 提交**

```bash
git add pages/dev/index.vue
git commit -m "feat: 添加开发功能主页"
```

---

## Phase 4: 开发功能 - 对话与预览

### Task 4.1: 对话区域

**Files:**
- Create: `components/dev/ChatPanel.vue`

- [ ] **Step 1: 创建对话面板组件**

```vue
<!-- components/dev/ChatPanel.vue -->
<template>
  <div class="flex flex-col h-full">
    <div class="p-4 border-b border-gray-700">
      <h3 class="font-semibold">对话</h3>
    </div>
    <div class="flex-1 overflow-y-auto p-4 space-y-4">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message"
        :class="msg.role"
      >
        <div class="message-content">{{ msg.content }}</div>
      </div>
    </div>
    <div class="p-4 border-t border-gray-700">
      <div class="flex gap-2">
        <input
          v-model="input"
          type="text"
          class="flex-1 px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          placeholder="输入指令..."
          @keyup.enter="sendMessage"
        />
        <button class="btn-primary px-4" @click="sendMessage">发送</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const messages = ref([
  { role: 'assistant', content: '你好！我是你的开发助手。选择一个项目开始吧。' }
])
const input = ref('')

const sendMessage = () => {
  if (!input.value.trim()) return

  messages.value.push({ role: 'user', content: input.value })
  const userMsg = input.value
  input.value = ''

  // TODO: 调用 OpenClaw 网关执行指令
  setTimeout(() => {
    messages.value.push({
      role: 'assistant',
      content: `收到指令: ${userMsg}\n\n[这里将显示执行结果]`
    })
  }, 500)
}
</script>

<style scoped>
.message {
  @apply max-w-[80%] p-3 rounded-lg;
}
.message.user {
  @apply bg-blue-600 ml-auto;
}
.message.assistant {
  @apply bg-gray-700;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add components/dev/ChatPanel.vue
git commit -m "feat: 添加对话面板组件"
```

---

### Task 4.2: 效果展示区

**Files:**
- Create: `components/dev/PreviewPanel.vue`

- [ ] **Step 1: 创建预览面板组件**

```vue
<!-- components/dev/PreviewPanel.vue -->
<template>
  <div class="flex flex-col h-full">
    <div class="p-4 border-b border-gray-700 flex justify-between items-center">
      <h3 class="font-semibold">效果预览</h3>
      <button
        v-if="previewUrl"
        class="text-sm text-blue-400 hover:text-blue-300"
        @click="refresh"
      >
        刷新
      </button>
    </div>
    <div class="flex-1 bg-gray-900 relative">
      <iframe
        v-if="previewUrl"
        :src="previewUrl"
        class="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin"
      />
      <div v-else class="flex items-center justify-center h-full text-gray-500">
        <div class="text-center">
          <p class="text-4xl mb-2">🖥️</p>
          <p>未启动预览</p>
          <p class="text-sm mt-2">在对话中启动开发服务器后显示</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const previewUrl = ref('')

const refresh = () => {
  // 强制刷新 iframe
  const iframe = document.querySelector('iframe')
  if (iframe) {
    iframe.src = iframe.src
  }
}

// TODO: 监听项目状态，自动显示预览
</script>
```

- [ ] **Step 2: 提交**

```bash
git add components/dev/PreviewPanel.vue
git commit -m "feat: 添加预览面板组件"
```

---

### Task 4.3: 文件树

**Files:**
- Create: `components/dev/FileTree.vue`

- [ ] **Step 1: 创建文件树组件**

```vue
<!-- components/dev/FileTree.vue -->
<template>
  <div class="flex h-full">
    <div class="w-[30%] border-r border-gray-700 flex flex-col">
      <div class="p-3 border-b border-gray-700 font-semibold">
        文件
      </div>
      <div class="flex-1 overflow-y-auto p-2">
        <div v-if="!projectStore.currentProject" class="text-gray-500 text-center py-4">
          请先选择项目
        </div>
        <div v-else class="file-tree">
          <TreeNode
            v-for="item in fileTree"
            :key="item.path"
            :node="item"
            @select="selectFile"
          />
        </div>
      </div>
    </div>
    <CodeEditor class="w-[70%]" />
  </div>
</template>

<script setup>
import { useProjectStore } from '~/stores/project'
import TreeNode from './TreeNode.vue'
import CodeEditor from './CodeEditor.vue'

const projectStore = useProjectStore()
const fileTree = ref([])

const loadFiles = async () => {
  if (!projectStore.currentProject) return

  const { data } = await useFetch(`/api/projects/${projectStore.currentProject.name}/files`)
  if (data.value) {
    fileTree.value = data.value
  }
}

const selectFile = async (file) => {
  projectStore.setCurrentFile(file.path)
  const { data } = await useFetch(`/api/projects/${projectStore.currentProject.name}/file?path=${file.path}`)
  if (data.value) {
    projectStore.setFileContent(data.value)
  }
}

watch(() => projectStore.currentProject, loadFiles)
</script>
```

- [ ] **Step 2: 创建 TreeNode 组件**

```vue
<!-- components/dev/TreeNode.vue -->
<template>
  <div>
    <div
      class="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-700 rounded"
      :class="{ 'text-blue-400': isSelected }"
      @click="handleClick"
    >
      <span v-if="node.isDirectory" class="mr-1">{{ isExpanded ? '📂' : '📁' }}</span>
      <span v-else class="mr-1">📄</span>
      <span class="text-sm">{{ node.name }}</span>
    </div>
    <div v-if="isExpanded && node.children" class="ml-3">
      <TreeNode
        v-for="child in node.children"
        :key="child.path"
        :node="child"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  node: Object
})

const emit = defineEmits(['select'])

const isExpanded = ref(false)
const isSelected = ref(false)

const handleClick = () => {
  if (props.node.isDirectory) {
    isExpanded.value = !isExpanded.value
  } else {
    emit('select', props.node)
  }
}
</script>
```

- [ ] **Step 3: 创建文件列表 API**

```typescript
// server/api/projects/[name]/files.get.ts
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

const PROJECTS_DIR = join(process.cwd(), 'github-projects')

async function getFileTree(dir: string, relativePath = ''): Promise<any[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const result = []

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    if (entry.name === 'node_modules') continue

    const fullPath = join(dir, entry.name)
    const relPath = join(relativePath, entry.name)

    if (entry.isDirectory()) {
      result.push({
        name: entry.name,
        path: relPath,
        isDirectory: true,
        children: await getFileTree(fullPath, relPath)
      })
    } else {
      result.push({
        name: entry.name,
        path: relPath,
        isDirectory: false
      })
    }
  }

  return result
}

export default defineEventHandler(async (event) => {
  const name = getRouterParam(event, 'name')
  const projectPath = join(PROJECTS_DIR, name!)

  try {
    return await getFileTree(projectPath)
  } catch (error) {
    throw createError({ statusCode: 404, message: 'Project not found' })
  }
})
```

- [ ] **Step 4: 提交**

```bash
git add components/dev/FileTree.vue components/dev/TreeNode.vue server/api/projects/\[name\]/files.get.ts
git commit -m "feat: 添加文件树组件和API"
```

---

### Task 4.4: 代码编辑器

**Files:**
- Create: `components/dev/CodeEditor.vue`

- [ ] **Step 1: 创建代码编辑器组件**

```vue
<!-- components/dev/CodeEditor.vue -->
<template>
  <div class="flex flex-col h-full">
    <div class="p-3 border-b border-gray-700 flex justify-between items-center">
      <span class="font-semibold">
        {{ projectStore.currentFile || '未选择文件' }}
      </span>
      <button
        v-if="projectStore.currentFile"
        class="btn-primary text-sm px-3 py-1"
        @click="saveFile"
      >
        保存
      </button>
    </div>
    <div class="flex-1">
      <VueMonacoEditor
        v-if="projectStore.currentFile"
        v-model:value="content"
        :language="language"
        theme="vs-dark"
        :options="editorOptions"
      />
      <div v-else class="flex items-center justify-center h-full text-gray-500">
        选择文件查看内容
      </div>
    </div>
  </div>
</template>

<script setup>
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'
import { useProjectStore } from '~/stores/project'

const projectStore = useProjectStore()
const content = ref('')
const originalContent = ref('')

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  scrollBeyondLastLine: false,
  automaticLayout: true,
}

const language = computed(() => {
  if (!projectStore.currentFile) return 'plaintext'
  const ext = projectStore.currentFile.split('.').pop()
  const map: Record<string, string> = {
    ts: 'typescript',
    js: 'javascript',
    vue: 'vue',
    md: 'markdown',
    json: 'json',
    css: 'css',
    scss: 'scss',
  }
  return map[ext || ''] || 'plaintext'
})

const saveFile = async () => {
  if (!projectStore.currentProject || !projectStore.currentFile) return

  await $fetch(`/api/projects/${projectStore.currentProject.name}/save`, {
    method: 'POST',
    body: {
      path: projectStore.currentFile,
      content: content.value
    }
  })
  originalContent.value = content.value
}

watch(() => projectStore.fileContent, (newVal) => {
  content.value = newVal
  originalContent.value = newVal
})
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add components/dev/CodeEditor.vue
git commit -m "feat: 添加代码编辑器组件"
```

---

### Task 4.5: 前端预览代理

**Files:**
- Create: `server/api/dev/[...path].ts`

- [ ] **Step 1: 创建预览代理 API**

```typescript
// server/api/dev/[...path].ts
export default defineEventHandler(async (event) => {
  const path = event.path.replace('/api/dev/', '')
  const [port, ...rest] = path.split('/')
  const targetPath = rest.join('/')

  if (!port || isNaN(parseInt(port))) {
    throw createError({ statusCode: 400, message: 'Invalid port' })
  }

  const targetUrl = `http://127.0.0.1:${port}/${targetPath}`

  try {
    const response = await $fetch.raw(targetUrl, {
      headers: {
        ...getRequestHeaders(event),
        host: 'localhost',
      },
      responseType: 'arrayBuffer',
    })

    // 设置响应头
    const contentType = response.headers.get('content-type')
    if (contentType) {
      setHeader(event, 'Content-Type', contentType)
    }
    setHeader(event, 'Access-Control-Allow-Origin', '*')

    return response._data
  } catch (error) {
    throw createError({
      statusCode: 502,
      message: `Failed to proxy to http://127.0.0.1:${port}`,
    })
  }
})
```

- [ ] **Step 2: 提交**

```bash
git add server/api/dev/\[...path\].ts
git commit -m "feat: 添加前端预览代理API"
```

---

## Phase 5: 文档管理功能

### Task 5.1: 文档功能侧边栏

**Files:**
- Create: `components/layout/DocsSidebar.vue`

- [ ] **Step 1: 创建文档功能侧边栏**

```vue
<!-- components/layout/DocsSidebar.vue -->
<template>
  <aside class="w-56 bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden">
    <div class="p-4 border-b border-gray-700">
      <h2 class="text-lg font-semibold">OpenClaw 文档</h2>
    </div>
    <div class="flex-1 overflow-y-auto p-2">
      <!-- 配置文件 -->
      <div class="mb-4">
        <div class="section-title" @click="toggleSection('config')">
          {{ isExpanded.config ? '📂' : '📁' }} 配置文件
        </div>
        <div v-if="isExpanded.config" class="ml-3">
          <div
            v-for="file in configFiles"
            :key="file"
            class="file-item"
            :class="{ 'active': currentDoc === file }"
            @click="selectDoc(file)"
          >
            {{ file }}
          </div>
        </div>
      </div>

      <!-- Skills -->
      <div class="mb-4">
        <div class="section-title" @click="toggleSection('skills')">
          {{ isExpanded.skills ? '📂' : '📁' }} Skills
        </div>
        <div v-if="isExpanded.skills" class="ml-3">
          <div
            v-for="skill in skills"
            :key="skill"
            class="file-item"
            :class="{ 'active': currentDoc === `skills/${skill}` }"
            @click="selectDoc(`skills/${skill}`)"
          >
            {{ skill }}
          </div>
        </div>
      </div>

      <!-- Memory -->
      <div class="mb-4">
        <div class="section-title" @click="toggleSection('memory')">
          {{ isExpanded.memory ? '📂' : '📁' }} Memory
        </div>
        <div v-if="isExpanded.memory" class="ml-3">
          <div
            v-for="file in memoryFiles"
            :key="file"
            class="file-item"
            :class="{ 'active': currentDoc === `memory/${file}` }"
            @click="selectDoc(`memory/${file}`)"
          >
            {{ file }}
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
const emit = defineEmits(['select'])

const configFiles = ['AGENTS.md', 'SOUL.md', 'USER.md', 'TOOLS.md', 'IDENTITY.md', 'HEARTBEAT.md']
const skills = ref(['brainstorming', 'coding-agent', 'healthcheck', 'weather', 'feishu-doc', 'feishu-drive'])
const memoryFiles = ref(['2026-03-23.md', '2026-03-22.md'])

const isExpanded = reactive({
  config: true,
  skills: true,
  memory: true,
})

const currentDoc = ref('')

const toggleSection = (section: keyof typeof isExpanded) => {
  isExpanded[section] = !isExpanded[section]
}

const selectDoc = (doc: string) => {
  currentDoc.value = doc
  emit('select', doc)
}
</script>

<style scoped>
.section-title {
  @apply px-2 py-1 font-semibold cursor-pointer hover:bg-gray-700 rounded;
}
.file-item {
  @apply px-2 py-1 text-sm cursor-pointer hover:bg-gray-700 rounded;
}
.file-item.active {
  @apply bg-blue-600 text-white;
}
</style>
```

- [ ] **Step 2: 提交**

```bash
git add components/layout/DocsSidebar.vue
git commit -m "feat: 添加文档功能侧边栏"
```

---

### Task 5.2: 文档功能页面

**Files:**
- Create: `pages/docs/index.vue`
- Create: `components/docs/DocEditor.vue`

- [ ] **Step 1: 创建文档页面**

```vue
<!-- pages/docs/index.vue -->
<template>
  <div class="flex flex-1 overflow-hidden">
    <DocsSidebar @select="handleSelectDoc" />
    <DocEditor class="flex-1" />
  </div>
</template>

<script setup>
import DocsSidebar from '~/components/layout/DocsSidebar.vue'
import DocEditor from '~/components/docs/DocEditor.vue'

const handleSelectDoc = (doc: string) => {
  // TODO: 更新编辑器内容
}
</script>
```

- [ ] **Step 2: 创建文档编辑器**

```vue
<!-- components/docs/DocEditor.vue -->
<template>
  <div class="flex flex-col h-full">
    <div class="p-3 border-b border-gray-700 flex justify-between items-center">
      <span class="font-semibold">{{ currentDoc || '选择文档' }}</span>
      <div class="flex gap-2">
        <button
          class="btn-secondary text-sm px-3 py-1"
          @click="refresh"
        >
          刷新
        </button>
        <button
          v-if="currentDoc"
          class="btn-primary text-sm px-3 py-1"
          @click="saveDoc"
        >
          保存
        </button>
      </div>
    </div>
    <div class="flex-1">
      <VueMonacoEditor
        v-if="currentDoc"
        v-model:value="content"
        language="markdown"
        theme="vs-dark"
        :options="editorOptions"
      />
      <div v-else class="flex items-center justify-center h-full text-gray-500">
        选择左侧文档进行编辑
      </div>
    </div>
  </div>
</template>

<script setup>
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'

const currentDoc = ref('')
const content = ref('')
const originalContent = ref('')

const editorOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  wordWrap: 'on',
  automaticLayout: true,
}

// TODO: 加载文档内容
// TODO: 保存文档

const saveDoc = async () => {
  // 保存逻辑
}

const refresh = () => {
  // 重新加载
}
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors;
}
.btn-secondary {
  @apply px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition-colors;
}
</style>
```

- [ ] **Step 3: 提交**

```bash
git add pages/docs/index.vue components/docs/DocEditor.vue
git commit -m "feat: 添加文档管理功能页面"
```

---

## Phase 6: 整合与测试

### Task 6.1: 整合页面路由

**Files:**
- Modify: `app.vue`

- [ ] **Step 1: 更新 app.vue**

```vue
<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 2: 创建重定向**

```vue
<!-- pages/index.vue -->
<script setup>
navigateTo('/dev')
</script>
```

- [ ] **Step 3: 提交**

```bash
git add app.vue pages/index.vue
git commit -m "feat: 整合路由配置"
```

---

### Task 6.2: 创建 GitHub 项目目录

**Files:**
- Create: `github-projects/`

- [ ] **Step 1: 创建项目目录**

```bash
cd /root/.openclaw/workspace/OpenClaw-Workspace
mkdir -p github-projects
touch github-projects/.gitkeep
git add github-projects/.gitkeep
git commit -m "chore: 创建 GitHub 项目目录"
```

---

## 验收标准

- [ ] 访问 `/dev` 显示开发功能页面
- [ ] 访问 `/docs` 显示文档管理页面
- [ ] 一级侧边栏可切换两个功能
- [ ] 开发页面包含：对话、预览、文件区域
- [ ] 文档页面可编辑配置文件
- [ ] 文件树可展开/折叠，点击加载文件内容
- [ ] 代码编辑器语法高亮正常工作
- [ ] 预览代理 `/api/dev/:port/*` 可正常转发请求

---

**计划版本**: 1.0  
**创建日期**: 2026-03-23
