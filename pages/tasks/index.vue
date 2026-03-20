<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: '任务分发'
})

// 任务状态选项
const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '进行中', value: 'running' },
  { label: '已完成', value: 'completed' },
  { label: '等待中', value: 'pending' },
  { label: '失败', value: 'failed' },
]

const selectedStatus = ref('all')
const tasks = ref<any[]>([])
const loading = ref(false)
const showCreateModal = ref(false)

// 新建任务表单
const newTask = ref({
  name: '',
  description: '',
  owner: 'Cursor'
})

// 获取任务列表
const fetchTasks = async () => {
  loading.value = true
  try {
    const query = selectedStatus.value !== 'all' ? `?status=${selectedStatus.value}` : ''
    const data = await $fetch(`/api/tasks${query}`)
    tasks.value = data
  } catch (e) {
    console.error('Failed to fetch tasks:', e)
  } finally {
    loading.value = false
  }
}

// 创建任务
const createTask = async () => {
  try {
    await $fetch('/api/tasks', {
      method: 'POST',
      body: newTask.value
    })
    showCreateModal.value = false
    newTask.value = { name: '', description: '', owner: 'Cursor' }
    await fetchTasks()
  } catch (e) {
    console.error('Failed to create task:', e)
  }
}

// 状态颜色映射
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

// 格式化时间
const formatTime = (date: string) => {
  return new Date(date).toLocaleString('zh-CN')
}

// 监听状态筛选变化
watch(selectedStatus, fetchTasks)

// 初始加载
onMounted(fetchTasks)
</script>

<template>
  <div class="space-y-4">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold">任务分发</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">多对话框并行任务管理</p>
      </div>
      <UButton icon="lucide:plus" @click="showCreateModal = true">
        新建任务
      </UButton>
    </div>
    
    <!-- 筛选 -->
    <div class="flex gap-2">
      <UBadge 
        v-for="option in statusOptions" 
        :key="option.value"
        :variant="selectedStatus === option.value ? 'solid' : 'soft'"
        :color="selectedStatus === option.value ? 'primary' : 'gray'"
        class="cursor-pointer"
        @click="selectedStatus = option.value"
      >
        {{ option.label }}
      </UBadge>
    </div>
    
    <!-- 任务列表 -->
    <div v-if="loading" class="text-center py-12">
      <UIcon name="lucide:loader-2" class="w-8 h-8 animate-spin text-primary mx-auto" />
    </div>
    
    <div v-else class="space-y-3">
      <UCard 
        v-for="task in tasks" 
        :key="task.id"
        class="hover:shadow-md transition-shadow cursor-pointer"
      >
        <NuxtLink :to="`/tasks/${task.id}`" class="block">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div :class="`w-10 h-10 rounded-lg flex items-center justify-center bg-${statusColors[task.status]}-500/10`">
                <UIcon 
                  :name="task.status === 'running' ? 'lucide:loader-2' : task.status === 'completed' ? 'lucide:check-circle' : task.status === 'failed' ? 'lucide:x-circle' : 'lucide:clock'" 
                  :class="`w-5 h-5 text-${statusColors[task.status]}-500 ${task.status === 'running' ? 'animate-spin' : ''}`"
                />
              </div>
              <div>
                <h3 class="font-medium">{{ task.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ task.description || '无描述' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-400">{{ formatTime(task.createdAt) }}</span>
              <UBadge :color="statusColors[task.status]" variant="soft">
                {{ statusLabels[task.status] }}
              </UBadge>
              <UIcon name="lucide:chevron-right" class="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </NuxtLink>
      </UCard>
    </div>
    
    <!-- 空状态 -->
    <div v-if="!loading && tasks.length === 0" class="text-center py-12">
      <UIcon name="lucide:inbox" class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <p class="text-gray-500">暂无任务</p>
      <UButton class="mt-4" @click="showCreateModal = true">创建第一个任务</UButton>
    </div>
    
    <!-- 创建任务弹窗 -->
    <UModal v-model="showCreateModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">新建任务</h3>
        </template>
        
        <div class="space-y-4">
          <UFormField label="任务名称">
            <UInput v-model="newTask.name" placeholder="输入任务名称" />
          </UFormField>
          <UFormField label="任务描述">
            <UTextarea v-model="newTask.description" placeholder="输入任务描述" />
          </UFormField>
          <UFormField label="负责人">
            <USelect v-model="newTask.owner" :options="['Cursor', 'User', 'System']" />
          </UFormField>
        </div>
        
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="showCreateModal = false">取消</UButton>
            <UButton :disabled="!newTask.name" @click="createTask">创建</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
