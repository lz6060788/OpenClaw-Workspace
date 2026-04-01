<!-- pages/settings/index.vue -->
<template>
  <div class="h-full flex">
    <!-- Left Sidebar - Category Navigation -->
    <aside class="w-64 border-r border-white/5 flex flex-col">
      <div class="p-4 border-b border-white/5">
        <h1 class="text-lg font-semibold text-zinc-100">系统设置</h1>
        <p class="text-xs text-zinc-500 mt-1">配置 OpenClaw Workspace</p>
      </div>

      <nav class="flex-1 overflow-y-auto p-2 space-y-1">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="currentCategory = category.id"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left"
          :class="currentCategory === category.id
            ? 'bg-amber-500/10 text-amber-400'
            : 'hover:bg-white/5 text-zinc-400 hover:text-zinc-200'"
        >
          <Icon
            :name="category.icon"
            size="sm"
            :icon-color="currentCategory === category.id ? 'rgb(251 191 36)' : 'rgb(115 115 115)'"
          />
          <div class="flex-1">
            <span class="text-sm font-medium">{{ category.label }}</span>
            <p class="text-xs opacity-60 mt-0.5">{{ category.description }}</p>
          </div>
        </button>
      </nav>

      <!-- Import/Export Buttons -->
      <div class="p-3 border-t border-white/5 space-y-2">
        <el-button
          class="w-full"
          @click="showImportExport = true"
          :icon="Download"
        >
          导入/导出配置
        </el-button>
      </div>
    </aside>

    <!-- Right Content Area -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-3xl mx-auto p-6">
        <div class="mb-6">
          <h2 class="text-2xl font-semibold text-zinc-100">
            {{ currentCategoryData?.label }}
          </h2>
          <p class="text-sm text-zinc-500 mt-1">
            {{ currentCategoryData?.description }}
          </p>
        </div>

        <SettingsForm
          :category="currentCategory"
          :loading="loading"
          @save="handleSave"
          @reset="handleReset"
        />
      </div>
    </main>

    <!-- Import/Export Dialog -->
    <ImportExportDialog
      v-model="showImportExport"
      @imported="handleImported"
    />
  </div>
</template>

<script setup lang="ts">
import { Download } from '@element-plus/icons-vue'
import Icon from '~/components/Icon.vue'
import SettingsForm from '~/components/settings/SettingsForm.vue'
import ImportExportDialog from '~/components/settings/ImportExportDialog.vue'

interface Category {
  id: string
  label: string
  description: string
  icon: string
}

const categories: Category[] = [
  {
    id: 'openclaw',
    label: 'OpenClaw',
    description: 'OpenClaw 核心配置',
    icon: 'settings'
  },
  {
    id: 'vercel',
    label: 'Vercel',
    description: 'Vercel 部署配置',
    icon: 'cloud'
  },
  {
    id: 'github',
    label: 'GitHub',
    description: 'GitHub 集成配置',
    icon: 'github'
  }
]

const currentCategory = ref('openclaw')
const loading = ref(false)
const showImportExport = ref(false)

const currentCategoryData = computed(() =>
  categories.find(c => c.id === currentCategory.value)
)

const handleSave = async (data: Record<string, any>) => {
  loading.value = true
  try {
    await $fetch('/api/settings', {
      method: 'POST',
      body: {
        category: currentCategory.value,
        settings: data
      }
    })
    ElMessage.success('保存成功')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

const handleReset = async () => {
  loading.value = true
  try {
    await $fetch('/api/settings/reset', {
      method: 'POST',
      body: { category: currentCategory.value }
    })
    ElMessage.success('已重置为默认值')
  } catch (error) {
    console.error('重置失败:', error)
    ElMessage.error('重置失败')
  } finally {
    loading.value = false
  }
}

const handleImported = () => {
  ElMessage.success('配置导入成功')
}
</script>
