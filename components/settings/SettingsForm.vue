<!-- components/settings/SettingsForm.vue -->
<template>
  <div class="space-y-6">
    <el-form
      ref="formRef"
      :model="formData"
      label-position="top"
      class="space-y-4"
    >
      <template v-for="field in fields" :key="field.key">
        <!-- Password Input with Show/Hide Toggle -->
        <el-form-item
          v-if="field.type === 'password' || field.isSensitive"
          :label="field.label"
          :description="field.description"
        >
          <el-input
            v-model="formData[field.key]"
            :type="showPassword[field.key] ? 'text' : 'password'"
            :placeholder="field.defaultValue ? `默认值: ${field.defaultValue}` : '请输入'"
            show-password
            @update:model-value="handleFieldChange(field.key, $event)"
          >
            <template #suffix>
              <el-icon
                class="cursor-pointer"
                @click="togglePasswordVisibility(field.key)"
              >
                <component :is="showPassword[field.key] ? View : Hide" />
              </el-icon>
            </template>
          </el-input>
          <div v-if="field.description" class="text-xs text-zinc-500 mt-1">
            {{ field.description }}
          </div>
          <div v-if="field.defaultValue" class="text-xs text-zinc-600 mt-0.5">
            默认值: {{ field.defaultValue }}
          </div>
        </el-form-item>

        <!-- Select Input -->
        <el-form-item
          v-else-if="field.type === 'select'"
          :label="field.label"
        >
          <el-select
            v-model="formData[field.key]"
            :placeholder="`请选择${field.label}`"
            class="w-full"
            @change="handleFieldChange(field.key, $event)"
          >
            <el-option
              v-for="option in field.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <div v-if="field.description" class="text-xs text-zinc-500 mt-1">
            {{ field.description }}
          </div>
          <div v-if="field.defaultValue" class="text-xs text-zinc-600 mt-0.5">
            默认值: {{ field.defaultValue }}
          </div>
        </el-form-item>

        <!-- Async Select Input (loads options from API) -->
        <el-form-item
          v-else-if="field.type === 'async-select'"
          :label="field.label"
        >
          <el-select
            v-model="formData[field.key]"
            :placeholder="`请选择${field.label}`"
            class="w-full"
            :loading="asyncOptions[field.key]?.loading"
            filterable
            allow-create
            default-first-option
            @change="handleFieldChange(field.key, $event)"
          >
            <el-option
              v-for="option in asyncOptions[field.key]?.data || []"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <div v-if="field.description" class="text-xs text-zinc-500 mt-1">
            {{ field.description }}
          </div>
          <div v-if="field.defaultValue" class="text-xs text-zinc-600 mt-0.5">
            默认值: {{ field.defaultValue }}
          </div>
          <el-button
            text
            type="primary"
            size="small"
            class="mt-1"
            :loading="asyncOptions[field.key]?.loading"
            @click="loadAsyncOptions(field)"
          >
            刷新列表
          </el-button>
        </el-form-item>

        <!-- Switch/Boolean Input -->
        <el-form-item
          v-else-if="field.type === 'boolean'"
          :label="field.label"
        >
          <el-switch
            v-model="formData[field.key]"
            @change="handleFieldChange(field.key, $event)"
          />
          <div v-if="field.description" class="text-xs text-zinc-500 mt-1">
            {{ field.description }}
          </div>
          <div v-if="field.defaultValue !== undefined" class="text-xs text-zinc-600 mt-0.5">
            默认值: {{ field.defaultValue ? '开启' : '关闭' }}
          </div>
        </el-form-item>

        <!-- Number Input -->
        <el-form-item
          v-else-if="field.type === 'number'"
          :label="field.label"
        >
          <el-input-number
            v-model="formData[field.key]"
            :min="field.min"
            :max="field.max"
            :step="field.step || 1"
            class="w-full"
            @change="handleFieldChange(field.key, $event)"
          />
          <div v-if="field.description" class="text-xs text-zinc-500 mt-1">
            {{ field.description }}
          </div>
          <div v-if="field.defaultValue !== undefined" class="text-xs text-zinc-600 mt-0.5">
            默认值: {{ field.defaultValue }}
          </div>
        </el-form-item>

        <!-- Text Area -->
        <el-form-item
          v-else-if="field.type === 'textarea'"
          :label="field.label"
        >
          <el-input
            v-model="formData[field.key]"
            type="textarea"
            :rows="field.rows || 3"
            :placeholder="field.defaultValue ? `默认值: ${field.defaultValue}` : '请输入'"
            @update:model-value="handleFieldChange(field.key, $event)"
          />
          <div v-if="field.description" class="text-xs text-zinc-500 mt-1">
            {{ field.description }}
          </div>
          <div v-if="field.defaultValue" class="text-xs text-zinc-600 mt-0.5">
            默认值: {{ field.defaultValue }}
          </div>
        </el-form-item>

        <!-- Default Text Input -->
        <el-form-item
          v-else
          :label="field.label"
        >
          <el-input
            v-model="formData[field.key]"
            :placeholder="field.defaultValue ? `默认值: ${field.defaultValue}` : '请输入'"
            @update:model-value="handleFieldChange(field.key, $event)"
          />
          <div v-if="field.description" class="text-xs text-zinc-500 mt-1">
            {{ field.description }}
          </div>
          <div v-if="field.defaultValue" class="text-xs text-zinc-600 mt-0.5">
            默认值: {{ field.defaultValue }}
          </div>
        </el-form-item>
      </template>
    </el-form>

    <!-- Action Buttons -->
    <div class="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
      <el-button
        @click="handleReset"
        :disabled="!hasChanges"
      >
        重置
      </el-button>
      <el-button
        type="primary"
        @click="handleSave"
        :loading="loading"
        :disabled="!hasChanges"
      >
        保存更改
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { View, Hide } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

interface SettingField {
  key: string
  label: string
  type: 'text' | 'password' | 'select' | 'boolean' | 'number' | 'textarea' | 'async-select'
  description?: string
  defaultValue?: string | number | boolean
  isSensitive?: boolean
  options?: Array<{ label: string; value: string | number }>
  /** For async-select: API endpoint to fetch options from */
  optionsEndpoint?: string
  min?: number
  max?: number
  step?: number
  rows?: number
}

const props = defineProps<{
  category: string
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [data: Record<string, any>]
  reset: []
}>()

const formRef = ref<FormInstance>()
const formData = ref<Record<string, any>>({})
const originalData = ref<Record<string, any>>({})
const showPassword = ref<Record<string, boolean>>({})

// Async options state for fields with optionsEndpoint
const asyncOptions = ref<Record<string, {
  loading: boolean
  data: Array<{ label: string; value: string }>
}>>({})

// Load async options for a field
const loadAsyncOptions = async (field: SettingField) => {
  if (!field.optionsEndpoint) return

  if (!asyncOptions.value[field.key]) {
    asyncOptions.value[field.key] = { loading: false, data: [] }
  }

  asyncOptions.value[field.key].loading = true
  try {
    const response = await $fetch<{ success: boolean; agents: Array<{ label: string; value: string }> }>(
      field.optionsEndpoint
    )
    if (response.success) {
      asyncOptions.value[field.key].data = response.agents
    }
  } catch (error) {
    console.error(`Failed to load options for ${field.key}:`, error)
  } finally {
    asyncOptions.value[field.key].loading = false
  }
}

// Field definitions for each category
const categoryFields: Record<string, SettingField[]> = {
  openclaw: [
    {
      key: 'OPENCLAW_API_KEY',
      label: 'API Key',
      type: 'password',
      description: 'OpenClaw API 访问密钥',
      isSensitive: true,
      defaultValue: ''
    },
    {
      key: 'OPENCLAW_API_ENDPOINT',
      label: 'API Endpoint',
      type: 'text',
      description: 'OpenClaw API 服务器地址',
      defaultValue: 'http://127.0.0.1:18789'
    },
    {
      key: 'OPENCLAW_GATEWAY_URL',
      label: 'Gateway URL',
      type: 'text',
      description: 'OpenClaw Gateway 服务器地址',
      defaultValue: 'http://127.0.0.1:18789'
    },
    {
      key: 'OPENCLAW_GATEWAY_TOKEN',
      label: 'Gateway Token',
      type: 'password',
      description: 'OpenClaw Gateway 访问令牌',
      isSensitive: true,
      defaultValue: ''
    },
    {
      key: 'OPENCLAW_AGENT_ID',
      label: 'Agent ID',
      type: 'async-select',
      description: 'OpenClaw Agent 标识符',
      defaultValue: 'main',
      optionsEndpoint: '/api/openclaw/agents'
    },
    {
      key: 'CHAT_DATA_DIR',
      label: 'Chat Data Directory',
      type: 'text',
      description: '聊天数据存储目录',
      defaultValue: '/data/openclaw-chat'
    },
    {
      key: 'OPENCLAW_TIMEOUT',
      label: '请求超时',
      type: 'number',
      description: 'API 请求超时时间（毫秒）',
      defaultValue: 30000,
      min: 1000,
      max: 120000,
      step: 1000
    },
    {
      key: 'OPENCLAW_DEBUG',
      label: '调试模式',
      type: 'boolean',
      description: '启用详细的调试日志',
      defaultValue: false
    }
  ],
  vercel: [
    {
      key: 'VERCEL_TOKEN',
      label: 'Vercel Token',
      type: 'password',
      description: 'Vercel API 访问令牌',
      isSensitive: true,
      defaultValue: ''
    },
    {
      key: 'VERCEL_TEAM_ID',
      label: 'Team ID',
      type: 'text',
      description: 'Vercel 团队 ID（可选）',
      defaultValue: ''
    },
    {
      key: 'VERCEL_FRAMEWORK',
      label: '默认框架',
      type: 'select',
      description: '新项目的默认框架预设',
      defaultValue: 'vite',
      options: [
        { label: 'Vite', value: 'vite' },
        { label: 'Next.js', value: 'nextjs' },
        { label: 'Nuxt', value: 'nuxt' },
        { label: 'React', value: 'react' },
        { label: 'Vue', value: 'vue' }
      ]
    },
    {
      key: 'VERCEL_AUTO_DEPLOY',
      label: '自动部署',
      type: 'boolean',
      description: '代码推送后自动触发部署',
      defaultValue: true
    }
  ],
  github: [
    {
      key: 'GITHUB_TOKEN',
      label: 'GitHub Token',
      type: 'password',
      description: 'GitHub Personal Access Token',
      isSensitive: true,
      defaultValue: ''
    },
    {
      key: 'GITHUB_USERNAME',
      label: 'GitHub 用户名',
      type: 'text',
      description: '用于克隆仓库的用户名',
      defaultValue: ''
    },
    {
      key: 'GITHUB_DEFAULT_BRANCH',
      label: '默认分支',
      type: 'text',
      description: '新仓库的默认分支名称',
      defaultValue: 'main'
    },
    {
      key: 'GITHUB_AUTO_SYNC',
      label: '自动同步',
      type: 'boolean',
      description: '定期自动同步仓库状态',
      defaultValue: true
    }
  ]
}

const fields = computed(() => categoryFields[props.category] || [])

const hasChanges = computed(() => {
  return JSON.stringify(formData.value) !== JSON.stringify(originalData.value)
})

const togglePasswordVisibility = (key: string) => {
  showPassword.value[key] = !showPassword.value[key]
}

const handleFieldChange = (key: string, value: any) => {
  formData.value[key] = value
}

const handleSave = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      emit('save', formData.value)
      originalData.value = { ...formData.value }
    }
  })
}

const handleReset = () => {
  emit('reset')
}

// Load settings data
const loadSettings = async () => {
  try {
    const response = await $fetch<{ success: boolean; settings: Record<string, any> }>(
      `/api/settings?category=${props.category}`
    )
    if (response.success) {
      formData.value = { ...response.settings }
      originalData.value = { ...response.settings }
    }
  } catch (error) {
    console.error('加载设置失败:', error)
  }
}

// Load async options for all async-select fields in the current category
const loadCategoryAsyncOptions = () => {
  const categoryFs = categoryFields[props.category] || []
  for (const field of categoryFs) {
    if (field.type === 'async-select' && field.optionsEndpoint) {
      loadAsyncOptions(field)
    }
  }
}

// Watch category changes
watch(() => props.category, () => {
  loadSettings()
  loadCategoryAsyncOptions()
}, { immediate: true })
</script>
