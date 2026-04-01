<!-- pages/docs/components/[slug].vue -->
<template>
  <div class="docs-component-page">
    <div class="docs-container">
      <div class="docs-sidebar">
        <NuxtLink to="/docs/components" class="docs-back-link">
          <Icon name="arrow-left" size="sm" />
          返回组件列表
        </NuxtLink>
        <nav class="docs-nav">
          <div v-for="section in navigation" :key="section.title" class="docs-nav-section">
            <h4 class="docs-nav-section-title">{{ section.title }}</h4>
            <div class="docs-nav-items">
              <NuxtLink
                v-for="item in section.items"
                :key="item.slug"
                :to="`/docs/components/${item.slug}`"
                class="docs-nav-item"
                :class="{ 'docs-nav-item-active': $route.params.slug === item.slug }"
              >
                {{ item.name }}
              </NuxtLink>
            </div>
          </div>
        </nav>
      </div>

      <div class="docs-content">
        <div v-if="componentData">
          <!-- Component Header -->
          <div class="component-header">
            <div class="component-header-icon">
              <Icon :name="componentData.icon" size="xl" />
            </div>
            <div>
              <h1 class="component-title">{{ componentData.name }}</h1>
              <p class="component-description">{{ componentData.description }}</p>
            </div>
          </div>

          <!-- Usage -->
          <section class="docs-section">
            <h2 class="docs-section-title">使用方式</h2>
            <ComponentShowcase
              title="基础示例"
              :code="componentData.usage.basic"
            >
              <component :is="componentData.component" v-bind="componentData.defaultProps" />
            </ComponentShowcase>

            <ComponentShowcase
              v-if="componentData.usage.variants"
              title="变体示例"
              :code="componentData.usage.variants"
            >
              <slot name="variants" />
            </ComponentShowcase>
          </section>

          <!-- Props -->
          <section class="docs-section">
            <h2 class="docs-section-title">API</h2>
            <PropsTable :props="componentData.props" />
          </section>

          <!-- Events -->
          <section v-if="componentData.events?.length" class="docs-section">
            <h2 class="docs-section-title">事件</h2>
            <div class="events-table">
              <table>
                <thead>
                  <tr>
                    <th>事件名</th>
                    <th>参数</th>
                    <th>说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="event in componentData.events" :key="event.name">
                    <td class="event-name"><code>{{ event.name }}</code></td>
                    <td class="event-params"><code>{{ event.params || '-' }}</code></td>
                    <td class="event-description">{{ event.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Slots -->
          <section v-if="componentData.slots?.length" class="docs-section">
            <h2 class="docs-section-title">插槽</h2>
            <div class="slots-table">
              <table>
                <thead>
                  <tr>
                    <th>插槽名</th>
                    <th>说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="slot in componentData.slots" :key="slot.name">
                    <td class="slot-name"><code>{{ slot.name }}</code></td>
                    <td class="slot-description">{{ slot.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div v-else class="component-not-found">
          <Icon name="alert-circle" size="xl" />
          <h2>组件文档未找到</h2>
          <p>该组件的文档正在编写中...</p>
          <NuxtLink to="/docs/components" class="back-link">
            返回组件列表
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue'
import ComponentShowcase from '~/components/docs/ComponentShowcase.vue'
import PropsTable from '~/components/docs/PropsTable.vue'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

// Component documentation data
const componentDocs: Record<string, any> = {
  'app-button': {
    name: 'AppButton',
    icon: 'mouse-pointer',
    description: '按钮组件，支持多种尺寸和变体样式',
    component: resolveComponent('AppButton'),
    defaultProps: { variant: 'primary', size: 'md' },
    usage: {
      basic: `<el-button variant="primary" size="md">
  点击按钮
</el-button>`
    },
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'ghost' | 'danger'", default: "'primary'", description: '按钮变体样式' },
      { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: '按钮尺寸' },
      { name: 'icon', type: 'string', default: '-', description: '图标名称' },
      { name: 'iconPosition', type: "'left' | 'right'", default: "'left'", description: '图标位置' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
      { name: 'loading', type: 'boolean', default: 'false', description: '加载状态' },
      { name: 'fullWidth', type: 'boolean', default: 'false', description: '全宽按钮' }
    ],
    events: [
      { name: 'click', params: '-', description: '点击按钮时触发' }
    ]
  },
  'app-input': {
    name: 'AppInput',
    icon: 'type',
    description: '文本输入框组件',
    component: resolveComponent('AppInput'),
    defaultProps: { label: '用户名', placeholder: '请输入用户名' },
    usage: {
      basic: `<AppInput
  v-model="value"
  label="用户名"
  placeholder="请输入用户名"
/>`
    },
    props: [
      { name: 'modelValue', type: 'string | number', default: "''", description: '输入值' },
      { name: 'type', type: "'text' | 'password' | 'email' | 'number'", default: "'text'", description: '输入框类型' },
      { name: 'label', type: 'string', default: '-', description: '标签文本' },
      { name: 'placeholder', type: 'string', default: '-', description: '占位符文本' },
      { name: 'error', type: 'string', default: '-', description: '错误提示' },
      { name: 'hint', type: 'string', default: '-', description: '帮助提示' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
      { name: 'required', type: 'boolean', default: 'false', description: '必填标记' },
      { name: 'prefixIcon', type: 'string', default: '-', description: '前缀图标' },
      { name: 'suffixIcon', type: 'string', default: '-', description: '后缀图标' }
    ],
    events: [
      { name: 'update:modelValue', params: 'value: string | number', description: '值更新时触发' }
    ]
  },
  'app-textarea': {
    name: 'AppTextarea',
    icon: 'align-left',
    description: '多行文本输入组件',
    component: resolveComponent('AppTextarea'),
    defaultProps: { label: '描述', placeholder: '请输入描述', rows: 4 },
    usage: {
      basic: `<AppTextarea
  v-model="value"
  label="描述"
  placeholder="请输入描述"
  :rows="4"
/>`
    },
    props: [
      { name: 'modelValue', type: 'string', default: "''", description: '输入值' },
      { name: 'label', type: 'string', default: '-', description: '标签文本' },
      { name: 'placeholder', type: 'string', default: '-', description: '占位符文本' },
      { name: 'error', type: 'string', default: '-', description: '错误提示' },
      { name: 'hint', type: 'string', default: '-', description: '帮助提示' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
      { name: 'required', type: 'boolean', default: 'false', description: '必填标记' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '尺寸' },
      { name: 'rows', type: 'number', default: '3', description: '显示行数' },
      { name: 'maxLength', type: 'number', default: '-', description: '最大字符数' },
      { name: 'showCharCount', type: 'boolean', default: 'false', description: '显示字符计数' },
      { name: 'autoResize', type: 'boolean', default: 'false', description: '自动调整高度' }
    ],
    events: [
      { name: 'update:modelValue', params: 'value: string', description: '值更新时触发' }
    ]
  },
  'app-select': {
    name: 'AppSelect',
    icon: 'chevron-down',
    description: '下拉选择框组件',
    component: resolveComponent('AppSelect'),
    defaultProps: { label: '选择项', placeholder: '请选择', options: [{ label: '选项1', value: 1 }, { label: '选项2', value: 2 }] },
    usage: {
      basic: `<AppSelect
  v-model="value"
  label="选择项"
  placeholder="请选择"
  :options="[
    { label: '选项1', value: 1 },
    { label: '选项2', value: 2 }
  ]"
/>`
    },
    props: [
      { name: 'modelValue', type: 'any | any[]', default: '[]', description: '选中值' },
      { name: 'options', type: 'SelectOption[]', default: '[]', description: '选项列表' },
      { name: 'label', type: 'string', default: '-', description: '标签文本' },
      { name: 'placeholder', type: 'string', default: "'请选择'", description: '占位符文本' },
      { name: 'error', type: 'string', default: '-', description: '错误提示' },
      { name: 'hint', type: 'string', default: '-', description: '帮助提示' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
      { name: 'required', type: 'boolean', default: 'false', description: '必填标记' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '尺寸' },
      { name: 'multiple', type: 'boolean', default: 'false', description: '多选模式' },
      { name: 'searchable', type: 'boolean', default: 'false', description: '可搜索' }
    ],
    events: [
      { name: 'update:modelValue', params: 'value: any | any[]', description: '值更新时触发' },
      { name: 'change', params: 'value: any | any[]', description: '选项变化时触发' }
    ]
  },
  'app-checkbox': {
    name: 'AppCheckbox',
    icon: 'check-square',
    description: '复选框组件',
    component: resolveComponent('AppCheckbox'),
    defaultProps: { label: '同意协议' },
    usage: {
      basic: `<AppCheckbox
  v-model="checked"
  label="同意协议"
/>`
    },
    props: [
      { name: 'modelValue', type: 'boolean | boolean[]', default: 'false', description: '选中状态' },
      { name: 'label', type: 'string', default: '-', description: '标签文本' },
      { name: 'error', type: 'string', default: '-', description: '错误提示' },
      { name: 'hint', type: 'string', default: '-', description: '帮助提示' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
      { name: 'indeterminate', type: 'boolean', default: 'false', description: '半选状态' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '尺寸' },
      { name: 'value', type: 'any', default: '-', description: '选项值（数组模式时使用）' }
    ],
    events: [
      { name: 'update:modelValue', params: 'value: boolean | boolean[]', description: '值更新时触发' },
      { name: 'change', params: 'value: boolean | boolean[]', description: '状态变化时触发' }
    ]
  },
  'app-switch': {
    name: 'AppSwitch',
    icon: 'toggle-left',
    description: '开关组件',
    component: resolveComponent('AppSwitch'),
    defaultProps: { label: '开启通知' },
    usage: {
      basic: `<AppSwitch
  v-model="enabled"
  label="开启通知"
/>`
    },
    props: [
      { name: 'modelValue', type: 'boolean', default: 'false', description: '开关状态' },
      { name: 'label', type: 'string', default: '-', description: '标签文本' },
      { name: 'error', type: 'string', default: '-', description: '错误提示' },
      { name: 'hint', type: 'string', default: '-', description: '帮助提示' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '尺寸' }
    ],
    events: [
      { name: 'update:modelValue', params: 'value: boolean', description: '值更新时触发' },
      { name: 'change', params: 'value: boolean', description: '状态变化时触发' }
    ]
  },
  'app-slider': {
    name: 'AppSlider',
    icon: 'sliders',
    description: '滑块组件',
    component: resolveComponent('AppSlider'),
    defaultProps: { label: '音量', min: 0, max: 100 },
    usage: {
      basic: `<AppSlider
  v-model="value"
  label="音量"
  :min="0"
  :max="100"
/>`
    },
    props: [
      { name: 'modelValue', type: 'number', default: '0', description: '当前值' },
      { name: 'label', type: 'string', default: '-', description: '标签文本' },
      { name: 'error', type: 'string', default: '-', description: '错误提示' },
      { name: 'hint', type: 'string', default: '-', description: '帮助提示' },
      { name: 'disabled', type: 'boolean', default: 'false', description: '禁用状态' },
      { name: 'required', type: 'boolean', default: 'false', description: '必填标记' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: '尺寸' },
      { name: 'min', type: 'number', default: '0', description: '最小值' },
      { name: 'max', type: 'number', default: '100', description: '最大值' },
      { name: 'step', type: 'number', default: '1', description: '步长' },
      { name: 'showValue', type: 'boolean', default: 'false', description: '显示当前值' }
    ],
    events: [
      { name: 'update:modelValue', params: 'value: number', description: '值更新时触发' },
      { name: 'change', params: 'value: number', description: '值变化时触发' }
    ]
  },
  'app-card': {
    name: 'AppCard',
    icon: 'credit-card',
    description: '卡片容器组件',
    component: resolveComponent('AppCard'),
    defaultProps: {},
    usage: {
      basic: `<AppCard>
  <template #header>标题</template>
  <p>卡片内容</p>
</AppCard>`
    },
    props: [
      { name: 'title', type: 'string', default: '-', description: '卡片标题' },
      { name: 'subtitle', type: 'string', default: '-', description: '卡片副标题' },
      { name: 'hoverable', type: 'boolean', default: 'false', description: '可悬停效果' }
    ],
    slots: [
      { name: 'header', description: '卡片头部插槽' },
      { name: 'default', description: '卡片内容插槽' },
      { name: 'footer', description: '卡片底部插槽' }
    ]
  }
}

const navigation = [
  {
    title: '表单控件',
    items: [
      { name: 'AppInput', slug: 'app-input' },
      { name: 'AppTextarea', slug: 'app-textarea' },
      { name: 'AppSelect', slug: 'app-select' },
      { name: 'AppCheckbox', slug: 'app-checkbox' },
      { name: 'AppRadio', slug: 'app-radio' },
      { name: 'AppSwitch', slug: 'app-switch' },
      { name: 'AppSlider', slug: 'app-slider' },
      { name: 'AppDatePicker', slug: 'app-date-picker' },
      { name: 'AppTimePicker', slug: 'app-time-picker' },
      { name: 'AppColorPicker', slug: 'app-color-picker' },
      { name: 'AppFileUpload', slug: 'app-file-upload' },
    ]
  },
  {
    title: '基础组件',
    items: [
      { name: 'AppButton', slug: 'app-button' },
      { name: 'AppCard', slug: 'app-card' },
      { name: 'AppIcon', slug: 'app-icon' },
    ]
  }
]

const componentData = computed(() => componentDocs[slug.value])
</script>

<style scoped>
.docs-component-page {
  min-height: 100vh;
  background: rgba(15, 23, 42, 0.3);
}

.docs-container {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
}

.docs-sidebar {
  width: 260px;
  padding: 2rem 1rem 2rem 2rem;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.docs-back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: rgba(241, 245, 249, 0.6);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all 0.15s ease-out;
  margin-bottom: 1.5rem;
  font-size: var(--text-sm);
}

.docs-back-link:hover {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.docs-nav {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.docs-nav-section-title {
  font-size: var(--text-xs);
  font-weight: 600;
  color: rgba(241, 245, 249, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.75rem 0;
}

.docs-nav-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.docs-nav-item {
  padding: 0.5rem 0.75rem;
  color: rgba(241, 245, 249, 0.6);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all 0.15s ease-out;
  font-size: var(--text-sm);
}

.docs-nav-item:hover {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.docs-nav-item-active {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
  font-weight: 500;
}

.docs-content {
  flex: 1;
  padding: 2rem 3rem;
  max-width: 900px;
}

.component-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.component-header-icon {
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(245, 158, 11, 0.1);
  border-radius: var(--radius-lg);
  color: #f59e0b;
}

.component-title {
  font-size: 2rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 0.5rem 0;
}

.component-description {
  font-size: var(--text-base);
  color: rgba(241, 245, 249, 0.6);
  margin: 0;
}

.docs-section {
  margin-bottom: 3rem;
}

.docs-section-title {
  font-size: var(--text-lg);
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 1.5rem 0;
}

.events-table,
.slots-table {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.events-table table,
.slots-table table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th,
.slots-table th {
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: var(--text-xs);
  font-weight: 600;
  color: rgba(241, 245, 249, 0.8);
  text-transform: uppercase;
}

.events-table td,
.slots-table td {
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: var(--text-sm);
  color: rgba(241, 245, 249, 0.8);
}

.events-table code,
.slots-table code {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.125rem 0.375rem;
  border-radius: var(--radius-sm);
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: var(--text-xs);
  color: #f59e0b;
}

.component-not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.component-not-found > svg {
  color: rgba(241, 245, 249, 0.3);
  margin-bottom: 1.5rem;
}

.component-not-found h2 {
  font-size: var(--text-xl);
  color: #f1f5f9;
  margin: 0 0 0.5rem 0;
}

.component-not-found p {
  color: rgba(241, 245, 249, 0.5);
  margin: 0 0 1.5rem 0;
}

.back-link {
  display: inline-block;
  padding: 0.625rem 1.25rem;
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all 0.15s ease-out;
}

.back-link:hover {
  background: rgba(245, 158, 11, 0.2);
}
</style>
