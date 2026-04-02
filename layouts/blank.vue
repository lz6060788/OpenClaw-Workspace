<!-- layouts/blank.vue - 无侧边栏布局，用于设置页面等独立页面 -->
<template>
  <div class="h-screen overflow-hidden bg-zinc-900 text-zinc-50 flex flex-col">
    <!-- 主区域 -->
    <main class="flex-1 overflow-hidden bg-zinc-900 flex flex-col min-w-0">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
// 无侧边栏的简洁布局
</script>
