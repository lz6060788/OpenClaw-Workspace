<!-- layouts/default.vue -->
<template>
  <div class="app-layout">
    <!-- 一级侧边栏 - 精简版 -->
    <aside class="primary-sidebar" :class="{ collapsed: sidebarCollapsed }">
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
      <!-- 侧边栏折叠按钮 -->
      <button class="collapse-btn" @click="toggleSidebar" :title="sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'">
        <AppIcon :name="sidebarCollapsed ? 'chevron-right' : 'chevron-left'" size="sm" />
      </button>
    </aside>

    <!-- 二级侧边栏 - 可折叠 -->
    <aside class="secondary-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <KeepAlive>
        <component :is="sidebarComponent" />
      </KeepAlive>
    </aside>

    <!-- 主区域 -->
    <main class="main-area">
      <div class="main-content-wrapper">
        <KeepAlive>
          <NuxtPage />
        </KeepAlive>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppIcon from '~/components/base/AppIcon.vue'

const route = useRoute()
const sidebarCollapsed = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

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
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* 一级侧边栏 - 与二级侧边栏同色，仅用细线分隔 */
.primary-sidebar {
  width: var(--sidebar-primary-width);
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-subtle);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-2);
  transition: width 0.3s ease-out;
  position: relative;
  z-index: 10;
}

.primary-sidebar.collapsed {
  width: 2.5rem;
}

.primary-sidebar-logo {
  margin-bottom: var(--spacing-3);
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  border-radius: var(--radius-unified);
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  transition: transform 0.2s ease-out;
}

.logo-icon:hover {
  transform: scale(1.05);
}

.primary-sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--spacing-2);
  border-radius: var(--radius-unified);
  transition: all 0.2s ease-out;
  color: var(--text-secondary);
  text-decoration: none;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.nav-item.active {
  background: rgba(245, 158, 11, 0.15);
  color: var(--color-primary);
}

.nav-label {
  font-size: 0.6rem;
  font-weight: 500;
}

/* 折叠按钮 */
.collapse-btn {
  position: absolute;
  bottom: var(--spacing-2);
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--radius-unified);
  background: var(--bg-tertiary);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-out;
}

.collapse-btn:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* 二级侧边栏 - 可折叠 */
.secondary-sidebar {
  width: var(--sidebar-secondary-width);
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-subtle);
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.3s ease-out, transform 0.3s ease-out;
}

.secondary-sidebar.collapsed {
  width: 0;
  transform: translateX(-100%);
}

/* 主区域 - 占据全部宽度 */
.main-area {
  flex: 1;
  overflow: hidden;
  background: var(--bg-primary);
  display: flex;
}

/* 主内容包裹器 - 全宽显示 */
.main-content-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
</style>
