<!-- layouts/default.vue -->
<template>
  <div class="app-layout">
    <!-- 一级侧边栏 -->
    <aside class="primary-sidebar">
      <div class="primary-sidebar-logo">
        <div class="logo-icon">🦞</div>
      </div>
      <nav class="primary-sidebar-nav">
        <NuxtLink
          to="/dev"
          class="nav-item"
          :class="{ active: route.path.startsWith('/dev') }"
        >
          <AppIcon name="code-2" size="lg" />
          <span class="nav-label">开发</span>
        </NuxtLink>
        <NuxtLink
          to="/docs"
          class="nav-item"
          :class="{ active: route.path.startsWith('/docs') }"
        >
          <AppIcon name="file-text" size="lg" />
          <span class="nav-label">文档</span>
        </NuxtLink>
      </nav>
    </aside>

    <!-- 二级侧边栏 -->
    <aside class="secondary-sidebar">
      <KeepAlive>
        <component :is="sidebarComponent" />
      </KeepAlive>
    </aside>

    <!-- 主区域 -->
    <main class="main-area">
      <KeepAlive>
        <NuxtPage />
      </KeepAlive>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '~/components/base/AppIcon.vue'

const route = useRoute()

const sidebarComponent = computed(() => {
  if (route.path.startsWith('/dev')) {
    return resolveComponent('LayoutDevSidebar')
  }
  if (route.path.startsWith('/docs')) {
    return resolveComponent('LayoutDocsSidebar')
  }
  return null
})
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f1f5f9;
}

/* 一级侧边栏 */
.primary-sidebar {
  width: 5rem;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-4);
}

.primary-sidebar-logo {
  margin-bottom: var(--spacing-6);
}

.logo-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: var(--radius-xl);
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.primary-sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3);
  border-radius: var(--radius-lg);
  transition: all 0.2s ease-out;
  color: rgba(241, 245, 249, 0.7);
  text-decoration: none;
}

.nav-item:hover {
  background: rgba(241, 245, 249, 0.05);
  color: #f1f5f9;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
  color: #60a5fa;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
}

.nav-label {
  font-size: var(--text-xs);
  font-weight: 500;
}

/* 二级侧边栏 */
.secondary-sidebar {
  width: 16rem;
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
}

.secondary-sidebar::-webkit-scrollbar {
  width: 6px;
}

.secondary-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.secondary-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.secondary-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 主区域 */
.main-area {
  flex: 1;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.3);
}
</style>
