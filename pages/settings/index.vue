<!-- pages/settings/index.vue -->
<template>
  <div class="h-full flex flex-col">
    <!-- Header -->
    <div class="border-b border-white/5 px-6 py-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-zinc-100">系统设置</h1>
          <p class="text-sm text-zinc-500 mt-1">配置 OpenClaw Workspace</p>
        </div>
        <el-button
          @click="showImportExport = true"
          :icon="Download"
        >
          导入/导出配置
        </el-button>
      </div>

      <!-- Tabs -->
      <el-tabs
        v-model="currentCategory"
        class="mt-4"
        @tab-change="handleTabChange"
      >
        <el-tab-pane
          v-for="category in categories"
          :key="category.id"
          :label="category.label"
          :name="category.id"
        >
          <template #label>
            <div class="flex items-center gap-2">
              <Icon
                :name="category.icon"
                size="sm"
                icon-color="rgb(115 115 115)"
              />
              <span>{{ category.label }}</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- Content Area -->
    <main class="flex-1 overflow-y-auto">
      <div class="max-w-3xl mx-auto p-6">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-zinc-100">
            {{ currentCategoryData?.label }} 配置
          </h2>
          <p class="text-sm text-zinc-500 mt-1">
            {{ currentCategoryData?.description }}
          </p>
        </div>

        <!-- System category: Show password change and GitHub path config -->
        <template v-if="currentCategory === 'system'">
          <GitHubPathConfig />
          <PasswordChange />
        </template>

        <!-- Other categories: Show settings form -->
        <SettingsForm
          v-else
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
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import Icon from '~/components/Icon.vue'
import SettingsForm from '~/components/settings/SettingsForm.vue'
import ImportExportDialog from '~/components/settings/ImportExportDialog.vue'
import PasswordChange from '~/components/settings/PasswordChange.vue'
import GitHubPathConfig from '~/components/settings/GitHubPathConfig.vue'

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
  },
  {
    id: 'system',
    label: '系统',
    description: '系统设置和账户管理',
    icon: 'user'
  }
]

const currentCategory = ref('openclaw')
const loading = ref(false)
const showImportExport = ref(false)

const currentCategoryData = computed(() =>
  categories.find(c => c.id === currentCategory.value)
)

const handleTabChange = (tabName: string) => {
  currentCategory.value = tabName
}

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

<style scoped>
:deep(.el-tabs__header) {
  margin-bottom: 0;
}

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.el-tabs__item) {
  color: rgb(115 115 115);
  font-size: 14px;
  padding: 0 20px;
}

:deep(.el-tabs__item:hover) {
  color: rgb(228 228 231);
}

:deep(.el-tabs__item.is-active) {
  color: rgb(251 191 36);
}

:deep(.el-tabs__active-bar) {
  background-color: rgb(251 191 36);
}
</style>
