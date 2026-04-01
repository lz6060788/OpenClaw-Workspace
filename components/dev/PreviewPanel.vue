<!-- components/dev/PreviewPanel.vue -->
<template>
  <div class="preview-panel flex flex-col h-full bg-zinc-900/50">
    <!-- 部署状态栏 -->
    <div v-if="currentProject && currentProject.vercelProjectId" class="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-zinc-900/30">
      <div class="flex items-center gap-3">
        <!-- 部署状态 -->
        <div v-if="deploymentStatus" class="flex items-center gap-2">
          <el-icon v-if="['queued', 'building'].includes(deploymentStatus.status)" class="is-loading text-blue-400">
            <Loading />
          </el-icon>
          <Icon
            v-else-if="deploymentStatus.status === 'ready'"
            name="check-circle-2"
            size="sm"
            icon-color="rgb(52 211 153)"
          />
          <Icon
            v-else-if="deploymentStatus.status === 'error'"
            name="x-circle"
            size="sm"
            icon-color="rgb(239 68 68)"
          />
          <span class="text-sm text-zinc-300">
            {{ getDeploymentStatusText(deploymentStatus.status) }}
          </span>
        </div>

        <!-- 部署 URL -->
        <div v-if="deploymentUrl" class="flex items-center gap-2 text-sm text-zinc-500">
          <a
            :href="deploymentUrl"
            target="_blank"
            class="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {{ deploymentUrl }}
          </a>
          <el-button text size="small" @click="copyDeploymentUrl">
            <Icon name="copy" size="xs" />
          </el-button>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- 刷新按钮 -->
        <el-button
          v-if="deploymentStatus"
          text
          size="small"
          :loading="refreshingStatus"
          @click="refreshDeploymentStatus"
        >
          <Icon name="refresh-cw" size="xs" />
        </el-button>

        <!-- 在 Vercel 打开 -->
        <el-button
          v-if="currentProject.vercelUrl"
          text
          size="small"
          @click="openInVercel"
        >
          <Icon name="external-link" size="xs" />
          <span class="ml-1">Vercel</span>
        </el-button>
      </div>
    </div>

    <!-- 预览区域 -->
    <div v-if="previewUrl" class="flex-1 relative">
      <iframe
        :src="previewUrl"
        class="w-full h-full border-none bg-white preview-iframe"
        @load="onIframeLoad"
      />
      <el-button
        class="absolute bottom-4 right-4 refresh-button"
        type="info"
        circle
        :icon="IconsRefresh"
        title="刷新预览"
        @click="manualRefresh"
      />
    </div>

    <!-- 未配置 Vercel 提示 -->
    <div v-else-if="currentProject && !currentProject.vercelProjectId" class="flex flex-col items-center justify-center h-full p-8 text-center">
      <div class="w-16 h-16 flex-center rounded-xl bg-zinc-800/50 border border-white/5 mb-6">
        <Icon name="cloud" size="xl" icon-color="rgb(82 82 83)" />
      </div>
      <h4 class="text-lg font-semibold text-zinc-200 mb-2">未配置 Vercel</h4>
      <p class="text-sm text-zinc-500 mb-6">配置 Vercel 项目后，这里会显示部署预览</p>
      <el-button type="primary" @click="openVercelConfig">
        <Icon name="settings" size="sm" class="mr-2" />
        配置 Vercel
      </el-button>
    </div>

    <!-- 未选择项目提示 -->
    <div v-else class="flex flex-col items-center justify-center h-full p-8 text-center">
      <Icon name="monitor" size="xl" icon-color="rgb(82 82 83)" />
      <h4 class="text-lg font-semibold text-zinc-200 mt-4 mb-2">未选择项目</h4>
      <p class="text-sm text-zinc-500">从左侧选择一个项目开始预览</p>
    </div>
  </div>
</template>

<style scoped>
.refresh-button {
  background: rgb(24 24 27 / 0.9);
  border-color: rgb(255 255 255 / 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.refresh-button:hover {
  background: rgb(39 39 42);
  border-color: rgb(255 255 255 / 0.15);
  transform: scale(1.05);
}

.refresh-button:active {
  transform: scale(0.95);
}
</style>

<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useProjectStore, Deployment } from '~/stores/project'
import { useDeploymentStore } from '~/stores/deployment'

const IconsRefresh = Icons.Refresh
const projectStore = useProjectStore()
const deploymentStore = useDeploymentStore()

const refreshingStatus = ref(false)
const pollingInterval = ref<ReturnType<typeof setInterval> | null>(null)

const currentProject = computed(() => projectStore.currentProject)

// 部署状态
const deploymentStatus = computed(() => {
  return currentProject.value?.latestDeploy || null
})

// 部署 URL（优先使用最新部署的 URL，否则使用项目的 Vercel URL）
const deploymentUrl = computed(() => {
  if (deploymentStatus.value?.url) {
    return deploymentStatus.value.url
  }
  return currentProject.value?.vercelUrl || null
})

// 预览 URL
const previewUrl = computed(() => {
  if (deploymentUrl.value) {
    return deploymentUrl.value
  }
  return ''
})

// 获取部署状态文本
const getDeploymentStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    queued: '队列中...',
    building: '构建中...',
    ready: '部署成功',
    error: '部署失败',
    cancelled: '已取消',
    deactivated: '已停用'
  }
  return statusMap[status] || status
}

// 刷新部署状态
const refreshDeploymentStatus = async () => {
  if (!currentProject.value?.id) return

  refreshingStatus.value = true
  try {
    await deploymentStore.fetchDeploymentStatus(currentProject.value.id)
  } catch (error) {
    console.error('刷新部署状态失败:', error)
  } finally {
    refreshingStatus.value = false
  }
}

// 开始轮询部署状态
const startPolling = () => {
  if (pollingInterval.value) return

  // 立即获取一次状态
  refreshDeploymentStatus()

  // 每 5 秒轮询一次
  pollingInterval.value = setInterval(() => {
    if (currentProject.value?.id) {
      refreshDeploymentStatus()
    }
  }, 5000)
}

// 停止轮询
const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value)
    pollingInterval.value = null
  }
}

// 复制部署 URL
const copyDeploymentUrl = () => {
  if (deploymentUrl.value) {
    navigator.clipboard.writeText(deploymentUrl.value)
    ElMessage.success('URL 已复制到剪贴板')
  }
}

// 在 Vercel 打开
const openInVercel = () => {
  if (currentProject.value?.vercelUrl) {
    window.open(currentProject.value.vercelUrl, '_blank')
  }
}

// 打开 Vercel 配置
const openVercelConfig = () => {
  // 触发父组件打开配置对话框
  const event = new CustomEvent('open-vercel-config')
  window.dispatchEvent(event)
}

// iframe 加载完成
const onIframeLoad = () => {
  // 可以在这里添加加载完成的逻辑
}

// 手动刷新预览
const manualRefresh = () => {
  const iframe = document.querySelector('.preview-iframe') as HTMLIFrameElement
  if (iframe) {
    iframe.src = iframe.src
  }
}

// 监听当前项目变化
watch(currentProject, (newProject) => {
  stopPolling()

  if (newProject?.vercelProjectId) {
    // 如果项目已配置 Vercel，开始轮询部署状态
    startPolling()
  }
}, { immediate: true })

// 组件卸载时停止轮询
onUnmounted(() => {
  stopPolling()
})
</script>
