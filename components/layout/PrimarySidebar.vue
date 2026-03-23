<!-- components/layout/PrimarySidebar.vue -->
<template>
  <aside class="w-20 bg-gray-800 flex flex-col items-center py-4 border-r border-gray-700">
    <NuxtLink
      to="/dev"
      class="nav-item mb-4"
      :class="{ active: route.path.startsWith('/dev') }"
    >
      <span class="text-2xl">💻</span>
    </NuxtLink>
    <NuxtLink
      to="/docs"
      class="nav-item"
      :class="{ active: route.path.startsWith('/docs') }"
    >
      <span class="text-2xl">📄</span>
    </NuxtLink>
  </aside>
</template>

<script setup lang="ts">
const route = useRoute()
</script>

<style scoped>
.nav-item {
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: background-color 0.15s;
  cursor: pointer;
}

.nav-item:hover {
  background-color: rgb(55 65 81);
}

.nav-item.active {
  background-color: rgb(37 99 235);
  color: white;
}
</style>
