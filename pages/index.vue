<script setup lang="ts">
// 首页重定向到任务页面
definePageMeta({
  layout: 'default',
  title: '首页'
})

// 直接显示任务系统
</script>

<template>
  <div>
    <NuxtLink to="/tasks" class="block">
      <div class="text-center py-12">
        <UIcon name="lucide:list-todo" class="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 class="text-xl font-semibold mb-2">任务分发系统</h2>
        <p class="text-gray-500">点击进入任务管理</p>
      </div>
    </NuxtLink>
  </div>
</template>
