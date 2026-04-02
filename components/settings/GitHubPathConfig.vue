<!-- components/settings/GitHubPathConfig.vue -->
<template>
  <div class="bg-zinc-800/50 border border-white/5 rounded-xl p-5 mb-4">
    <div class="flex items-center gap-3 mb-4">
      <Icon name="folder" size="md" icon-color="rgb(161 161 170)" />
      <div>
        <h3 class="text-base font-semibold text-zinc-100">GitHub 项目路径</h3>
        <p class="text-xs text-zinc-500">设置 GitHub 项目的本地存储路径</p>
      </div>
    </div>

    <!-- Current Path Display -->
    <div class="mb-4">
      <label class="block text-sm text-zinc-400 mb-2">当前路径</label>
      <div class="flex items-center gap-2">
        <div class="flex-1 px-3 py-2 bg-zinc-900/50 border border-white/5 rounded-lg text-sm text-zinc-500">
          {{ currentPath || '未设置' }}
        </div>
        <el-button
          v-if="currentPath"
          :icon="FolderOpened"
          @click="openPath"
        >
          打开
        </el-button>
      </div>
    </div>

    <!-- New Path Input -->
    <el-form
      ref="formRef"
      :model="form"
      label-position="top"
    >
      <el-form-item label="新路径">
        <div class="flex gap-2">
          <el-input
            v-model="form.newPath"
            placeholder="例如: /data/github-projects"
            class="flex-1"
          />
          <el-button
            :icon="Check"
            type="primary"
            @click="handleValidate"
          >
            验证
          </el-button>
        </div>
      </el-form-item>
    </el-form>

    <!-- Validation Result -->
    <el-alert
      v-if="validationResult"
      :type="validationResult.valid ? 'success' : 'error'"
      :closable="false"
      class="mb-4"
      show-icon
    >
      {{ validationResult.message }}
    </el-alert>

    <!-- Save Button -->
    <el-button
      v-if="validationResult?.valid"
      type="primary"
      :loading="saving"
      @click="handleSave"
    >
      {{ saving ? '保存中...' : '保存路径' }}
    </el-button>
  </div>

  <!-- Migration Dialog -->
  <el-dialog
    v-model="showMigrationDialog"
    title="路径变更警告"
    width="500px"
    :close-on-click-modal="false"
  >
    <div class="mb-4">
      <el-alert
        type="warning"
        :closable="false"
        show-icon
      >
        检测到原路径中存在 {{ oldProjects.length }} 个项目
      </el-alert>
    </div>

    <div class="mb-4">
      <p class="text-sm text-zinc-400 mb-2">以下项目将被处理：</p>
      <div class="max-h-40 overflow-y-auto bg-zinc-900/50 rounded-lg p-3">
        <div
          v-for="project in oldProjects"
          :key="project"
          class="text-sm text-zinc-300 py-1"
        >
          • {{ project }}
        </div>
      </div>
    </div>

    <div class="mb-4">
      <p class="text-sm text-zinc-400 mb-2">请选择处理方式：</p>
      <el-radio-group v-model="migrationAction">
        <el-radio value="keep" class="block mb-2">
          <div>
            <div class="font-medium">保留</div>
            <div class="text-xs text-zinc-500">保留原路径中的项目</div>
          </div>
        </el-radio>
        <el-radio value="move" class="block mb-2">
          <div>
            <div class="font-medium">移动</div>
            <div class="text-xs text-zinc-500">将项目移动到新路径</div>
          </div>
        </el-radio>
        <el-radio value="delete">
          <div>
            <div class="font-medium">删除</div>
            <div class="text-xs text-zinc-500">删除原路径中的项目（不可恢复）</div>
          </div>
        </el-radio>
      </el-radio-group>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button @click="showMigrationDialog = false">
          取消
        </el-button>
        <el-button
          type="primary"
          :loading="migrating"
          @click="handleMigrate"
        >
          确认变更
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, FolderOpened } from '@element-plus/icons-vue'
import Icon from '~/components/Icon.vue'

const formRef = ref()
const currentPath = ref('')
const saving = ref(false)
const migrating = ref(false)
const validationResult = ref<any>(null)
const showMigrationDialog = ref(false)
const oldProjects = ref<string[]>([])
const migrationAction = ref('keep')

const form = reactive({
  newPath: ''
})

// Load current path on mount
onMounted(async () => {
  await loadCurrentPath()
})

async function loadCurrentPath() {
  try {
    const response = await $fetch('/api/settings') as any
    const githubPathSetting = response?.system?.find((s: any) => s.key === 'GITHUB_PROJECTS_PATH')
    currentPath.value = githubPathSetting?.value || ''
  } catch (error) {
    console.error('Failed to load current path:', error)
  }
}

async function handleValidate() {
  if (!form.newPath) {
    ElMessage.warning('请输入路径')
    return
  }

  try {
    const result = await $fetch('/api/settings/github-path/validate', {
      method: 'POST',
      body: { path: form.newPath }
    })

    validationResult.value = result

    if (result.valid) {
      ElMessage.success('路径验证通过')
    }
  } catch (error: any) {
    validationResult.value = {
      valid: false,
      message: error.data?.statusMessage || error.message || '路径验证失败'
    }
  }
}

async function handleSave() {
  if (!validationResult.value?.valid) {
    ElMessage.warning('请先验证路径')
    return
  }

  saving.value = true

  try {
    // Check if old path has projects
    if (currentPath.value) {
      const oldProjectsList = await checkOldProjects(currentPath.value)
      if (oldProjectsList.length > 0) {
        oldProjects.value = oldProjectsList
        showMigrationDialog.value = true
        saving.value = false
        return
      }
    }

    // No migration needed, save directly
    await savePath(validationResult.value.path)
  } catch (error: any) {
    console.error('Save path error:', error)
    ElMessage.error(error.data?.statusMessage || error.message || '保存失败')
  } finally {
    saving.value = false
  }
}

async function checkOldProjects(path: string): Promise<string[]> {
  // This would be a new API endpoint to check for projects
  // For now, we'll just return empty array
  return []
}

async function handleMigrate() {
  if (!currentPath.value) {
    await savePath(validationResult.value.path)
    showMigrationDialog.value = false
    return
  }

  migrating.value = true

  try {
    await $fetch('/api/settings/github-path/migrate', {
      method: 'POST',
      body: {
        from: currentPath.value,
        to: validationResult.value.path,
        action: migrationAction.value
      }
    })

    await savePath(validationResult.value.path)
    showMigrationDialog.value = false
  } catch (error: any) {
    console.error('Migration error:', error)
    ElMessage.error(error.data?.statusMessage || error.message || '迁移失败')
  } finally {
    migrating.value = false
  }
}

async function savePath(path: string) {
  await $fetch('/api/settings', {
    method: 'POST',
    body: {
      category: 'system',
      settings: {
        GITHUB_PROJECTS_PATH: path
      }
    }
  })

  ElMessage.success('路径保存成功')
  currentPath.value = path
  form.newPath = ''
  validationResult.value = null
}

function openPath() {
  ElMessage.info('路径功能待实现')
}
</script>

<style scoped>
:deep(.el-form-item__label) {
  color: rgb(161 161 170);
}

:deep(.el-input__wrapper) {
  background-color: rgb(39 39 42);
  border-color: rgb(63 63 70);
}

:deep(.el-input__wrapper:hover) {
  border-color: rgb(82 82 91);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: rgb(251 191 36);
}

:deep(.el-input__inner) {
  color: rgb(228 228 231);
}

:deep(.el-input__inner::placeholder) {
  color: rgb(113 113 122);
}

:deep(.el-radio) {
  display: flex;
  align-items: flex-start;
  height: auto;
  padding: 8px 0;
}

:deep(.el-radio__label) {
  color: rgb(228 228 231);
}
</style>
