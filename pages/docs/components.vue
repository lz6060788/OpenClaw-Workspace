<!-- pages/docs/components.vue -->
<template>
  <div class="docs-components-page">
    <div class="docs-header">
      <h1 class="docs-title">组件库文档</h1>
      <p class="docs-subtitle">OpenClaw Workspace 基础组件库</p>
    </div>

    <div class="docs-sections">
      <!-- 表单控件 -->
      <section class="docs-section">
        <h2 class="docs-section-title">表单控件</h2>
        <div class="docs-grid">
          <NuxtLink
            v-for="component in formComponents"
            :key="component.name"
            :to="`/docs/components/${component.slug}`"
            class="component-card"
          >
            <div class="component-card-icon">
              <Icon :name="component.icon" size="lg" />
            </div>
            <div class="component-card-info">
              <h3 class="component-card-name">{{ component.name }}</h3>
              <p class="component-card-description">{{ component.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- 反馈组件 -->
      <section class="docs-section">
        <h2 class="docs-section-title">反馈组件</h2>
        <div class="docs-grid">
          <NuxtLink
            v-for="component in feedbackComponents"
            :key="component.name"
            :to="`/docs/components/${component.slug}`"
            class="component-card"
          >
            <div class="component-card-icon">
              <Icon :name="component.icon" size="lg" />
            </div>
            <div class="component-card-info">
              <h3 class="component-card-name">{{ component.name }}</h3>
              <p class="component-card-description">{{ component.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- 基础组件 -->
      <section class="docs-section">
        <h2 class="docs-section-title">基础组件</h2>
        <div class="docs-grid">
          <NuxtLink
            v-for="component in baseComponents"
            :key="component.name"
            :to="`/docs/components/${component.slug}`"
            class="component-card"
          >
            <div class="component-card-icon">
              <Icon :name="component.icon" size="lg" />
            </div>
            <div class="component-card-info">
              <h3 class="component-card-name">{{ component.name }}</h3>
              <p class="component-card-description">{{ component.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue'

const formComponents = [
  { name: 'AppInput', slug: 'app-input', icon: 'type', description: '文本输入框' },
  { name: 'AppTextarea', slug: 'app-textarea', icon: 'align-left', description: '多行文本输入' },
  { name: 'AppSelect', slug: 'app-select', icon: 'chevron-down', description: '下拉选择框' },
  { name: 'AppCheckbox', slug: 'app-checkbox', icon: 'check-square', description: '复选框' },
  { name: 'AppRadio', slug: 'app-radio', icon: 'radio', description: '单选框' },
  { name: 'AppSwitch', slug: 'app-switch', icon: 'toggle-left', description: '开关' },
  { name: 'AppSlider', slug: 'app-slider', icon: 'sliders', description: '滑块' },
  { name: 'AppDatePicker', slug: 'app-date-picker', icon: 'calendar', description: '日期选择器' },
  { name: 'AppTimePicker', slug: 'app-time-picker', icon: 'clock', description: '时间选择器' },
  { name: 'AppColorPicker', slug: 'app-color-picker', icon: 'droplet', description: '颜色选择器' },
  { name: 'AppFileUpload', slug: 'app-file-upload', icon: 'upload-cloud', description: '文件上传' },
  { name: 'AppFormField', slug: 'app-form-field', icon: 'layout', description: '表单字段包装器' },
  { name: 'AppInputGroup', slug: 'app-input-group', icon: 'layers', description: '表单组' },
]

const feedbackComponents = [
  { name: 'AppAlert', slug: 'app-alert', icon: 'alert-triangle', description: '警告提示' },
  { name: 'AppToast', slug: 'app-toast', icon: 'bell', description: '轻提示' },
  { name: 'AppModal', slug: 'app-modal', icon: 'square', description: '模态框' },
  { name: 'AppDrawer', slug: 'app-drawer', icon: 'sidebar', description: '抽屉' },
  { name: 'AppTooltip', slug: 'app-tooltip', icon: 'help-circle', description: '工具提示' },
  { name: 'AppProgress', slug: 'app-progress', icon: 'activity', description: '进度条' },
  { name: 'AppSpinner', slug: 'app-spinner', icon: 'loader-2', description: '加载指示器' },
]

const baseComponents = [
  { name: 'AppButton', slug: 'app-button', icon: 'mouse-pointer', description: '按钮' },
  { name: 'AppCard', slug: 'app-card', icon: 'credit-card', description: '卡片' },
  { name: 'AppIcon', slug: 'app-icon', icon: 'star', description: '图标' },
]
</script>

<style scoped>
.docs-components-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.docs-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.docs-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.docs-subtitle {
  font-size: var(--text-lg);
  color: rgba(241, 245, 249, 0.6);
  margin: 0;
}

.docs-sections {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.docs-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.docs-section-title {
  font-size: var(--text-xl);
  font-weight: 600;
  color: #f1f5f9;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.docs-section-title::before {
  content: '';
  width: 4px;
  height: 1.5rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 2px;
}

.docs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.component-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease-out;
  text-decoration: none;
}

.component-card:hover {
  background: rgba(245, 158, 11, 0.05);
  border-color: #f59e0b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.1);
}

.component-card-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 158, 11, 0.1);
  border-radius: var(--radius-md);
  color: #f59e0b;
  flex-shrink: 0;
}

.component-card-info {
  flex: 1;
  min-width: 0;
}

.component-card-name {
  font-size: var(--text-base);
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 0.25rem 0;
}

.component-card-description {
  font-size: var(--text-sm);
  color: rgba(241, 245, 249, 0.5);
  margin: 0;
}
</style>
