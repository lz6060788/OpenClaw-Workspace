<!-- components/dev/VercelConfigDialog.vue -->
<template>
  <el-dialog
    v-model="visible"
    :title="`配置 Vercel: ${project?.name || ''}`"
    width="600px"
    append-to-body
    @close="handleClose"
  >
    <el-tabs v-model="activeTab" class="w-full">
      <!-- Vercel 项目选择 -->
      <el-tab-pane label="Vercel 项目" name="vercel">
        <div class="space-y-4">
          <el-form-item label="选择 Vercel 项目">
            <el-select
              v-model="form.vercelProjectId"
              placeholder="请选择 Vercel 项目"
              class="w-full"
              :loading="loadingVercelProjects"
              filterable
            >
              <el-option
                v-for="vercelProject in vercelProjects"
                :key="vercelProject.id"
                :label="vercelProject.name"
                :value="vercelProject.id"
              >
                <div class="flex items-center justify-between">
                  <span>{{ vercelProject.name }}</span>
                  <el-tag v-if="vercelProject.framework" size="small" type="info">
                    {{ vercelProject.framework }}
                  </el-tag>
                </div>
              </el-option>
            </el-select>
            <template #footer>
              <el-button
                text
                type="primary"
                size="small"
                @click="refreshVercelProjects"
                :loading="loadingVercelProjects"
              >
                刷新项目列表
              </el-button>
            </template>
          </el-form-item>

          <el-form-item label="创建新项目">
            <div class="flex gap-2">
              <el-input
                v-model="newProjectName"
                placeholder="输入新项目名称"
                :disabled="creatingProject"
              />
              <el-button
                type="primary"
                :disabled="!newProjectName.trim()"
                :loading="creatingProject"
                @click="createVercelProject"
              >
                创建
              </el-button>
            </div>
          </el-form-item>

          <el-form-item label="部署 URL">
            <el-input
              v-model="form.vercelUrl"
              placeholder="自动获取或手动输入"
              :disabled="!form.vercelProjectId"
            >
              <template #append>
                <el-button
                  :disabled="!form.vercelProjectId"
                  @click="openVercelProject"
                >
                  打开
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </div>
      </el-tab-pane>

      <!-- 构建设置 -->
      <el-tab-pane label="构建设置" name="build">
        <div class="space-y-4">
          <el-form-item label="框架预设">
            <el-select v-model="form.framework" placeholder="选择框架" class="w-full">
              <el-option label="Vite" value="vite" />
              <el-option label="Next.js" value="nextjs" />
              <el-option label="Nuxt" value="nuxt" />
              <el-option label="React" value="react" />
              <el-option label="Vue" value="vue" />
              <el-option label="Angular" value="angular" />
              <el-option label="Svelte" value="svelte" />
              <el-option label="其他" value="other" />
            </el-select>
          </el-form-item>

          <el-form-item label="安装命令">
            <el-input v-model="form.installCommand" placeholder="例如：npm install" />
            <template #footer>
              <el-button text type="primary" size="small" @click="setDefaults('install')">
                使用默认值
              </el-button>
            </template>
          </el-form-item>

          <el-form-item label="构建命令">
            <el-input v-model="form.buildCommand" placeholder="例如：npm run build" />
            <template #footer>
              <el-button text type="primary" size="small" @click="setDefaults('build')">
                使用默认值
              </el-button>
            </template>
          </el-form-item>

          <el-form-item label="输出目录">
            <el-input v-model="form.outputDirectory" placeholder="例如：dist" />
            <template #footer>
              <el-button text type="primary" size="small" @click="setDefaults('output')">
                使用默认值
              </el-button>
            </template>
          </el-form-item>
        </div>
      </el-tab-pane>

      <!-- 部署历史 -->
      <el-tab-pane label="部署历史" name="history">
        <div v-if="loadingDeployments" class="flex-center py-8">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span class="ml-2">加载中...</span>
        </div>

        <div v-else-if="deployments.length === 0" class="text-center py-8 text-zinc-500">
          暂无部署记录
        </div>

        <el-timeline v-else class="px-4">
          <el-timeline-item
            v-for="deploy in deployments"
            :key="deploy.id"
            :timestamp="formatDate(deploy.createdAt)"
            :type="getTimelineType(deploy.status)"
            placement="top"
          >
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <el-tag :type="getStatusType(deploy.status)" size="small">
                  {{ getStatusText(deploy.status) }}
                </el-tag>
                <el-tag v-if="deploy.production" type="warning" size="small">
                  生产环境
                </el-tag>
              </div>
              <div v-if="deploy.url" class="text-sm">
                <a :href="deploy.url" target="_blank" class="text-blue-400 hover:text-blue-300">
                  {{ deploy.url }}
                </a>
              </div>
              <div v-if="deploy.errorMessage" class="text-sm text-red-400">
                {{ deploy.errorMessage }}
              </div>
              <div v-if="deploy.duration" class="text-xs text-zinc-500">
                耗时: {{ deploy.duration }}秒
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <div class="flex items-center justify-between">
        <el-button @click="testDeploy" :disabled="!form.vercelProjectId" :loading="testingDeploy">
          测试部署
        </el-button>
        <div class="flex gap-2">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="saveConfig" :loading="saving">
            保存配置
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

interface Project {
  id: number
  name: string
  vercelProjectId?: string | null
  vercelUrl?: string | null
  buildCommand?: string | null
  outputDirectory?: string | null
  installCommand?: string | null
  framework?: string | null
}

interface Deployment {
  id: number
  vercelDeployId: string
  status: string
  url: string | null
  production: boolean
  createdAt: Date
  completedAt?: Date | null
  duration?: number | null
  errorMessage?: string | null
}

interface VercelProject {
  id: string
  name: string
  url?: string
  framework?: string
}

const props = defineProps<{
  modelValue: boolean
  project?: Project | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'configured': [project: Project]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const activeTab = ref('vercel')
const loadingVercelProjects = ref(false)
const loadingDeployments = ref(false)
const creatingProject = ref(false)
const saving = ref(false)
const testingDeploy = ref(false)
const newProjectName = ref('')

const vercelProjects = ref<VercelProject[]>([])
const deployments = ref<Deployment[]>([])

const form = reactive({
  vercelProjectId: '',
  vercelUrl: '',
  buildCommand: '',
  outputDirectory: '',
  installCommand: '',
  framework: ''
})

// 加载 Vercel 项目列表
const loadVercelProjects = async () => {
  loadingVercelProjects.value = true
  try {
    const response = await $fetch<{ success: boolean; projects: VercelProject[] }>('/api/vercel/projects')
    if (response.success) {
      vercelProjects.value = response.projects
    }
  } catch (error) {
    console.error('加载 Vercel 项目失败:', error)
    ElMessage.error('加载 Vercel 项目失败')
  } finally {
    loadingVercelProjects.value = false
  }
}

// 刷新 Vercel 项目列表
const refreshVercelProjects = () => {
  loadVercelProjects()
}

// 创建新的 Vercel 项目
const createVercelProject = async () => {
  if (!newProjectName.value.trim()) return

  creatingProject.value = true
  try {
    const response = await $fetch<{ success: boolean; project: VercelProject }>('/api/vercel/projects', {
      method: 'POST',
      body: { name: newProjectName.value }
    })

    if (response.success) {
      vercelProjects.value.push(response.project)
      form.vercelProjectId = response.project.id
      newProjectName.value = ''
      ElMessage.success('项目创建成功')
    }
  } catch (error) {
    console.error('创建 Vercel 项目失败:', error)
    ElMessage.error('创建项目失败')
  } finally {
    creatingProject.value = false
  }
}

// 打开 Vercel 项目
const openVercelProject = () => {
  if (form.vercelUrl) {
    window.open(form.vercelUrl, '_blank')
  }
}

// 设置默认值
const setDefaults = (type: 'install' | 'build' | 'output') => {
  const defaults = {
    install: 'npm install',
    build: 'npm run build',
    output: 'dist'
  }
  if (type === 'install') form.installCommand = defaults.install
  if (type === 'build') form.buildCommand = defaults.build
  if (type === 'output') form.outputDirectory = defaults.output
}

// 加载部署历史
const loadDeployments = async () => {
  if (!props.project?.id) return

  loadingDeployments.value = true
  try {
    const response = await $fetch<{ success: boolean; project: { deployments: Deployment[] } }>(
      `/api/projects/${props.project.id}`
    )
    if (response.success) {
      deployments.value = response.project.deployments
    }
  } catch (error) {
    console.error('加载部署历史失败:', error)
  } finally {
    loadingDeployments.value = false
  }
}

// 测试部署
const testDeploy = async () => {
  if (!props.project?.id) return

  await ElMessageBox.confirm(
    '确定要触发测试部署吗？这将创建一个新的预览部署。',
    '确认部署',
    { type: 'warning' }
  )

  testingDeploy.value = true
  try {
    const response = await $fetch<{
      success: boolean
      deploymentId: number
      status: string
      url: string | null
    }>('/api/vercel/deploy', {
      method: 'POST',
      body: { projectId: props.project.id, production: false }
    })

    if (response.success) {
      ElMessage.success('部署已触发')
      await loadDeployments()
      activeTab.value = 'history'
    }
  } catch (error) {
    console.error('触发部署失败:', error)
    ElMessage.error('触发部署失败')
  } finally {
    testingDeploy.value = false
  }
}

// 保存配置
const saveConfig = async () => {
  if (!props.project?.id) return

  saving.value = true
  try {
    const response = await $fetch<{ success: boolean; project: Project }>('/api/projects/configure', {
      method: 'POST',
      body: {
        projectId: props.project.id,
        ...form
      }
    })

    if (response.success) {
      ElMessage.success('配置已保存')
      emit('configured', response.project)
      handleClose()
    }
  } catch (error) {
    console.error('保存配置失败:', error)
    ElMessage.error('保存配置失败')
  } finally {
    saving.value = false
  }
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
}

// 格式化日期
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取状态类型
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    queued: 'info',
    building: 'warning',
    ready: 'success',
    error: 'danger',
    cancelled: 'info',
    deactivated: 'info'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const textMap: Record<string, string> = {
    queued: '队列中',
    building: '构建中',
    ready: '成功',
    error: '失败',
    cancelled: '取消',
    deactivated: '停用'
  }
  return textMap[status] || status
}

// 获取时间轴类型
const getTimelineType = (status: string): string => {
  const typeMap: Record<string, string> = {
    ready: 'success',
    error: 'danger',
    cancelled: 'info',
    building: 'primary',
    queued: 'info'
  }
  return typeMap[status] || 'primary'
}

// 监听对话框打开
watch(visible, (val) => {
  if (val && props.project) {
    // 初始化表单数据
    form.vercelProjectId = props.project.vercelProjectId || ''
    form.vercelUrl = props.project.vercelUrl || ''
    form.buildCommand = props.project.buildCommand || ''
    form.outputDirectory = props.project.outputDirectory || ''
    form.installCommand = props.project.installCommand || ''
    form.framework = props.project.framework || ''

    // 加载数据
    loadVercelProjects()
    loadDeployments()
  }
})
</script>
