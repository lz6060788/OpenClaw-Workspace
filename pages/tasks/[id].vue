<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: '任务详情'
})

const route = useRoute()
const taskId = route.params.id as string

const task = ref<any>(null)
const loading = ref(true)
const newLog = ref('')

// 获取任务详情
const fetchTask = async () => {
  loading.value = true
  try {
    task.value = await $fetch(`/api/tasks/${taskId}`)
  } catch (e) {
    console.error('Failed to fetch task:', e)
  } finally {
    loading.value = false
  }
}

// 更新任务状态
const updateStatus = async (status: string) => {
  try {
    await $fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: { status }
    })
    await fetchTask()
  } catch (e) {
    console.error('Failed to update status:', e)
  }
}

// 添加日志
const addLog = async () => {
  if (!newLog.value.trim()) return
  try {
    await $fetch(`/api/tasks/${taskId}/logs`, {
      method: 'POST',
      body: { content: newLog.value, type: 'output' }
    })
    newLog.value = ''
    await fetchTask()
  } catch (e) {
    console.error('Failed to add log:', e)
  }
}

const statusColors: Record<string, string> = {
  running: 'primary',
  completed: 'success',
  pending: 'warning',
  failed: 'error',
  paused: 'neutral'
}

const statusLabels: Record<string, string> = {
  running: '进行中',
  completed: '已完成',
  pending: '等待中',
  failed: '失败',
  paused: '已暂停'
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

onMounted(fetchTask)
</script>

<template>
  <div class="space-y-4">
    <!-- 返回按钮 -->
    <UButton variant="ghost" to="/tasks" leading-icon="lucide:arrow-left">
      返回任务列表
    </UButton>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-12">
      <UIcon name="lucide:loader-2" class="w-8 h-8 animate-spin text-primary mx-auto" />
    </div>
    
    <template v-else-if="task">
      <!-- 任务信息 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div :class="`w-10 h-10 rounded-lg flex items-center justify-center bg-${statusColors[task.status]}-500/10`">
                <UIcon 
                  :name="task.status === 'running' ? 'lucide:loader-2' : task.status === 'completed' ? 'lucide:check-circle' : task.status === 'failed' ? 'lucide:x-circle' : 'lucide:clock'" 
                  :class="`w-5 h-5 text-${statusColors[task.status]}-500 ${task.status === 'running' ? 'animate-spin' : ''}`"
                />
              </div>
              <div>
                <h2 class="text-xl font-semibold">{{ task.name }}</h2>
                <p class="text-sm text-gray-500">{{ task.description || '无描述' }}</p>
              </div>
            </div>
            <UBadge :color="statusColors[task.status]" variant="solid" size="lg">
              {{ statusLabels[task.status] }}
            </UBadge>
          </div>
        </template>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-500">任务ID</p>
            <p class="font-mono text-sm">{{ task.id }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">负责人</p>
            <p>{{ task.owner || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">创建时间</p>
            <p>{{ formatTime(task.createdAt) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">完成时间</p>
            <p>{{ task.completedAt ? formatTime(task.completedAt) : '-' }}</p>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <template #footer>
          <div class="flex gap-2">
            <UButton 
              v-if="task.status === 'pending'" 
              color="primary" 
              @click="updateStatus('running')"
            >
              开始执行
            </UButton>
            <UButton 
              v-if="task.status === 'running'" 
              color="warning" 
              @click="updateStatus('paused')"
            >
              暂停
            </UButton>
            <UButton 
              v-if="task.status === 'paused'" 
              color="primary" 
              @click="updateStatus('running')"
            >
              继续
            </UButton>
            <UButton 
              v-if="task.status === 'running' || task.status === 'paused'" 
              color="success" 
              @click="updateStatus('completed')"
            >
              完成
            </UButton>
            <UButton 
              v-if="task.status === 'running' || task.status === 'paused'" 
              color="error" 
              @click="updateStatus('failed')"
            >
              标记失败
            </UButton>
          </div>
        </template>
      </UCard>
      
      <!-- 任务日志 -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">任务日志</h3>
        </template>
        
        <!-- 日志列表 -->
        <div class="space-y-2 mb-4 max-h-96 overflow-y-auto">
          <div 
            v-for="log in task.logs" 
            :key="log.id"
            class="font-mono text-sm p-2 rounded"
            :class="log.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-gray-50 dark:bg-gray-800'"
          >
            <span class="text-gray-400">[{{ formatTime(log.timestamp) }}]</span>
            <span class="ml-2">{{ log.content }}</span>
          </div>
          <div v-if="task.logs.length === 0" class="text-center py-8 text-gray-500">
            暂无日志
          </div>
        </div>
        
        <!-- 添加日志 -->
        <div class="flex gap-2">
          <UInput 
            v-model="newLog" 
            placeholder="添加日志..." 
            @keyup.enter="addLog"
          />
          <UButton @click="addLog">发送</UButton>
        </div>
      </UCard>
    </template>
  </div>
</template>
