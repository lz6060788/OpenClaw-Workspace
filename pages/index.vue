<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// 示例数据
const stats = [
  { label: '活跃任务', value: '12', icon: 'lucide:list-todo', color: 'primary' },
  { label: 'GitHub 仓库', value: '8', icon: 'lucide:github', color: 'neutral' },
  { label: '定时任务', value: '5', icon: 'lucide:clock', color: 'secondary' },
  { label: '在线容器', value: '3', icon: 'lucide:container', color: 'success' },
]

const recentTasks = [
  { id: 1, name: '代码审查 #42', status: '进行中', time: '5分钟前' },
  { id: 2, name: '部署生产环境', status: '已完成', time: '1小时前' },
  { id: 3, name: '更新文档', status: '等待中', time: '2小时前' },
]
</script>

<template>
  <div>
    <!-- 欢迎标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">欢迎回来</h1>
      <p class="text-neutral-500">这里是您的工作台概览</p>
    </div>
    
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <UCard v-for="stat in stats" :key="stat.label">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg flex items-center justify-center" :class="`bg-${stat.color}-500/10`">
            <UIcon :name="stat.icon" class="w-6 h-6" :class="`text-${stat.color}-500`" />
          </div>
          <div>
            <p class="text-2xl font-bold">{{ stat.value }}</p>
            <p class="text-sm text-neutral-500">{{ stat.label }}</p>
          </div>
        </div>
      </UCard>
    </div>
    
    <!-- 最近任务 -->
    <UCard>
      <template #header>
        <h2 class="font-semibold">最近任务</h2>
      </template>
      
      <div class="space-y-3">
        <div v-for="task in recentTasks" :key="task.id" class="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full" :class="{
              'bg-primary-500': task.status === '进行中',
              'bg-green-500': task.status === '已完成',
              'bg-yellow-500': task.status === '等待中',
            }" />
            <span>{{ task.name }}</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="text-sm text-neutral-500">{{ task.status }}</span>
            <span class="text-sm text-neutral-400">{{ task.time }}</span>
          </div>
        </div>
      </div>
      
      <template #footer>
        <UButton to="/tasks" variant="ghost" color="neutral" trailing-icon="lucide:arrow-right">
          查看全部任务
        </UButton>
      </template>
    </UCard>
  </div>
</template>
