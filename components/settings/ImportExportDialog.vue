<!-- components/settings/ImportExportDialog.vue -->
<template>
  <el-dialog
    v-model="visible"
    title="导入/导出配置"
    width="600px"
    append-to-body
    @close="handleClose"
  >
    <el-tabs v-model="activeTab" class="w-full">
      <!-- Export Tab -->
      <el-tab-pane label="导出配置" name="export">
        <div class="space-y-4">
          <div class="p-4 rounded-lg bg-zinc-800/50 border border-white/5">
            <div class="flex items-start gap-3">
              <Icon name="info" size="sm" icon-color="rgb(59 130 246)" />
              <div class="flex-1">
                <h4 class="text-sm font-medium text-zinc-200">导出说明</h4>
                <p class="text-xs text-zinc-500 mt-1">
                  导出的配置文件包含所有设置项，包括敏感信息的加密值。
                  请妥善保管导出的文件，避免泄露。
                </p>
              </div>
            </div>
          </div>

          <el-form-item label="选择要导出的配置">
            <el-checkbox-group v-model="exportCategories">
              <el-checkbox label="openclaw">OpenClaw 配置</el-checkbox>
              <el-checkbox label="vercel">Vercel 配置</el-checkbox>
              <el-checkbox label="github">GitHub 配置</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item label="是否包含敏感信息">
            <el-switch v-model="includeSensitive" />
            <div class="text-xs text-zinc-500 mt-1">
              开启后将包含完整的敏感信息（密钥、令牌等）
            </div>
          </el-form-item>

          <el-button
            type="primary"
            class="w-full"
            :icon="Download"
            :loading="exporting"
            :disabled="exportCategories.length === 0"
            @click="handleExport"
          >
            导出配置
          </el-button>
        </div>
      </el-tab-pane>

      <!-- Import Tab -->
      <el-tab-pane label="导入配置" name="import">
        <div class="space-y-4">
          <div class="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div class="flex items-start gap-3">
              <Icon name="alert-triangle" size="sm" icon-color="rgb(251 191 36)" />
              <div class="flex-1">
                <h4 class="text-sm font-medium text-amber-400">导入警告</h4>
                <p class="text-xs text-zinc-500 mt-1">
                  导入配置将覆盖现有设置。建议先导出当前配置作为备份。
                  导入的敏感信息将自动加密存储。
                </p>
              </div>
            </div>
          </div>

          <el-form-item label="配置文件">
            <el-upload
              ref="uploadRef"
              class="w-full"
              drag
              :auto-upload="false"
              :limit="1"
              accept=".json"
              :on-change="handleFileChange"
              :on-exceed="handleExceed"
              :file-list="fileList"
            >
              <Icon name="upload-cloud" size="lg" icon-color="rgb(115 115 115)" />
              <div class="el-upload__text mt-2">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip text-xs text-zinc-500">
                  只能上传 JSON 格式的配置文件
                </div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item label="导入选项">
            <el-checkbox-group v-model="importOptions">
              <el-checkbox label="merge">合并模式（保留未指定的设置）</el-checkbox>
              <el-checkbox label="validate">导入前验证配置格式</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <div v-if="previewData" class="p-3 rounded-lg bg-zinc-800/50 border border-white/5">
            <div class="text-xs font-medium text-zinc-300 mb-2">配置预览</div>
            <div class="space-y-1 text-xs text-zinc-500">
              <div v-for="(value, key) in previewData" :key="key" class="flex justify-between">
                <span>{{ key }}:</span>
                <span class="font-mono">{{ String(value).substring(0, 30) }}{{ String(value).length > 30 ? '...' : '' }}</span>
              </div>
            </div>
          </div>

          <el-button
            type="primary"
            class="w-full"
            :icon="Upload"
            :loading="importing"
            :disabled="!fileList.length"
            @click="handleImport"
          >
            导入配置
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <el-button @click="handleClose">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Download, Upload } from '@element-plus/icons-vue'
import type { UploadInstance, UploadUserFile, UploadRawFile } from 'element-plus'
import Icon from '~/components/Icon.vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  imported: []
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const activeTab = ref('export')
const exporting = ref(false)
const importing = ref(false)
const exportCategories = ref(['openclaw', 'vercel', 'github'])
const includeSensitive = ref(false)
const importOptions = ref(['validate'])
const fileList = ref<UploadUserFile[]>([])
const uploadRef = ref<UploadInstance>()
const previewData = ref<Record<string, any> | null>(null)

const handleExport = async () => {
  exporting.value = true
  try {
    const response = await $fetch(`/api/settings/export?categories=${exportCategories.value.join(',')}&sensitive=${includeSensitive.value}`)

    // Create blob and download
    const blob = new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `openclaw-config-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    ElMessage.success('配置导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出配置失败')
  } finally {
    exporting.value = false
  }
}

const handleFileChange = (file: UploadUserFile) => {
  fileList.value = [file]

  // Read and preview file
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      previewData.value = JSON.parse(content)
    } catch (error) {
      ElMessage.error('文件格式错误，请上传有效的 JSON 文件')
      previewData.value = null
    }
  }
  reader.readAsText(file.raw as File)
}

const handleExceed = () => {
  ElMessage.warning('只能上传一个文件')
  fileList.value = []
}

const handleImport = async () => {
  if (!fileList.value.length) return

  importing.value = true
  try {
    const file = fileList.value[0].raw as File
    const content = await file.text()
    const data = JSON.parse(content)

    await $fetch('/api/settings/import', {
      method: 'POST',
      body: {
        config: data,
        merge: importOptions.value.includes('merge'),
        validate: importOptions.value.includes('validate')
      }
    })

    ElMessage.success('配置导入成功')
    emit('imported')
    handleClose()
  } catch (error: any) {
    console.error('导入失败:', error)
    ElMessage.error(error.message || '导入配置失败')
  } finally {
    importing.value = false
  }
}

const handleClose = () => {
  visible.value = false
  // Reset state
  fileList.value = []
  previewData.value = null
  exportCategories.value = ['openclaw', 'vercel', 'github']
  importOptions.value = ['validate']
}
</script>
