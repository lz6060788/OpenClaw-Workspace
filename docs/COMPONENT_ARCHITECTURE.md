# OpenClaw Workspace 组件库架构文档

## 概述

本文档描述 OpenClaw Workspace 项目的基础组件库架构设计、组件清单和开发规范。

## 技术栈

- **框架**: Nuxt 3 + Vue 3 Composition API
- **样式**: UnoCSS 原子类（主要） + Scoped CSS（仅 CSS 变量和特殊伪类）
- **类型**: TypeScript
- **图标**: UnoCSS Icons (Iconify)
- **无头组件**: Headless UI Vue (用于复杂交互组件)

## 架构原则

### UnoCSS 优先

组件样式使用 **UnoCSS 原子类**，避免自定义 CSS 类。

```vue
<!-- ✅ 推荐：使用 UnoCSS 原子类 -->
<template>
  <button :class="buttonClasses">点击</button>
</template>
<script setup>
const buttonClasses = computed(() => [
  'flex-center gap-2 px-4 py-2.5 rounded-xl',
  'transition-all duration-200 active:scale-95',
  props.variant === 'primary' && 'bg-gradient-to-br from-amber-400 to-amber-600 text-white'
])
</script>

<!-- ❌ 避免：自定义 CSS 类 -->
<template>
  <button class="app-button app-button-primary">点击</button>
</template>
<style scoped>
.app-button { ... }
.app-button-primary { ... }
</style>
```

### 使用场景

| 场景 | 方式 |
|------|------|
| 布局、间距、颜色、字体等 | UnoCSS 原子类 |
| 组件变体样式组合 | computed 属性返回原子类数组 |
| CSS 变量引用 | `var(--color-primary)` |
| 特殊伪类/动画 | `<style scoped>` |

## 目录结构

```
components/
├── base/              # 基础组件（核心组件库）
│   ├── AppButton.vue
│   ├── AppInput.vue
│   ├── AppSelect.vue
│   └── ...
├── layout/            # 布局组件
│   ├── PrimarySidebar.vue
│   └── DocsSidebar.vue
├── dev/               # 开发工具组件
│   ├── CodeEditor.vue
│   └── FileTree.vue
└── docs/              # 文档相关组件
    ├── ComponentShowcase.vue
    └── PropsTable.vue
```

## 设计系统

### 颜色主题

```css
/* 主色调 - 琥珀橙 */
--color-primary: #f59e0b
--color-primary-light: #fbbf24
--color-primary-dark: #d97706

/* 状态色 */
--color-success: #22c55e
--color-warning: #f59e0b
--color-error: #ef4444
--color-info: #3b82f6

/* 文本色 */
--text-primary: #f1f5f9
--text-secondary: rgba(241, 245, 249, 0.6)
--text-tertiary: rgba(241, 245, 249, 0.5)
--text-muted: rgba(241, 245, 249, 0.4)
--text-disabled: rgba(241, 245, 249, 0.3)

/* 背景色 */
--bg-body: rgba(15, 23, 42, 0.5)
--bg-darker: rgba(15, 23, 42, 0.8)

/* 边框色 */
--border-default: rgba(255, 255, 255, 0.2)
--border-subtle: rgba(255, 255, 255, 0.1)
--border-strong: rgba(255, 255, 255, 0.3)

/* Z-index */
--z-dropdown: 1000
--z-modal: 1000
--z-tooltip: 1001
--z-toast: 2000
--z-badge: 10
```

### UnoCSS Shortcuts

项目配置了以下快捷类：

```ts
flex-center: 'flex items-center justify-center'
flex-between: 'flex items-center justify-between'
btn-base: 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95'
btn-ghost: 'bg-transparent hover:bg-white/5 active:bg-white/10'
text-primary: 'text-[var(--text-primary)]'
text-secondary: 'text-[var(--text-secondary)]'
```

## 组件清单

### ✅ 已完成组件 (29/34)

#### 表单控件 (13)

| 组件 | 功能 |
|------|------|
| `AppInput` | 文本输入框 |
| `AppTextarea` | 多行文本输入 |
| `AppSelect` | 下拉选择框 |
| `AppCheckbox` | 复选框 |
| `AppRadio` | 单选框 |
| `AppSwitch` | 开关 |
| `AppSlider` | 滑块 |
| `AppDatePicker` | 日期选择器 |
| `AppTimePicker` | 时间选择器 |
| `AppColorPicker` | 颜色选择器 |
| `AppFileUpload` | 文件上传 |
| `AppFormField` | 表单字段包装器 |
| `AppInputGroup` | 表单组 |

#### 提示反馈 (8)

| 组件 | 功能 |
|------|------|
| `AppAlert` | 警告提示 |
| `AppToast` | 轻提示 |
| `AppModal` | 模态框 |
| `AppDrawer` | 抽屉 |
| `AppTooltip` | 工具提示 |
| `AppPopover` | 弹出框 |
| `AppProgress` | 进度条 |
| `AppSpinner` | 加载指示器 |

#### 基础组件 (3)

| 组件 | 功能 |
|------|------|
| `AppButton` | 按钮 |
| `AppCard` | 卡片 |
| `AppIcon` | 图标 |

#### 数据展示 (5)

| 组件 | 功能 |
|------|------|
| `AppTable` | 表格 |
| `AppBadge` | 徽章 |
| `AppAvatar` | 头像 |
| `AppPagination` | 分页 |
| `AppBreadcrumb` | 面包屑 |

### 📋 待开发组件 (5)

| 组件 | 功能 | 优先级 |
|------|------|--------|
| `AppList` | 列表 | 低 |
| `AppTree` | 树形控件 | 低 |
| `AppTag` | 标签 | 低 |
| `AppSteps` | 步骤条 | 低 |
| (导航分类剩余组件) | - | - |

## 组件 API 设计规范

### Props 定义

使用 `interface Props` + `withDefaults` 模式：

```typescript
interface Props {
  modelValue?: string
  label?: string
  error?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})
```

### 样式计算模式

使用 computed 属性动态组合 UnoCSS 类：

```typescript
const inputClasses = computed(() => [
  'flex items-center px-4 py-3 bg-body/50 border rounded-xl transition-all',
  props.error ? 'border-red-500 focus:border-red-500' : 'border-default focus:border-primary',
  props.disabled && 'opacity-50 cursor-not-allowed'
])
```

### 无障碍访问

所有交互组件必须包含 ARIA 属性：

```vue
<button
  :aria-label="label"
  :aria-disabled="disabled"
  :aria-pressed="pressed"
  @keydown.enter="handleClick"
>
```

### 事件定义

```typescript
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
  'focus': []
  'blur': []
}>()
```
| `AppSwitch` | 开关 | ✅ |
| `AppSlider` | 滑块 | ✅ |
| `AppDatePicker` | 日期选择器 | ✅ |
| `AppTimePicker` | 时间选择器 | ✅ |
| `AppColorPicker` | 颜色选择器 | ✅ |
| `AppFileUpload` | 文件上传 | ✅ |
| `AppFormField` | 表单字段包装器 | ✅ |
| `AppInputGroup` | 表单组 | ✅ |

#### 基础组件 (Base Components)

| 组件 | 功能 | 状态 |
|------|------|------|
| `AppButton` | 按钮 | ✅ |
| `AppCard` | 卡片 | ✅ |
| `AppIcon` | 图标 | ✅ |

### 📋 待开发组件

#### 提示反馈组件 (Feedback Components)

| 组件 | 功能 | 优先级 | 依赖 |
|------|------|--------|------|
| `AppAlert` | 警告提示 | 高 | - |
| `AppToast` | 轻提示 | 高 | - |
| `AppModal` | 模态框 | 高 | Headless UI Dialog |
| `AppDrawer` | 抽屉 | 中 | Headless UI |
| `AppTooltip` | 工具提示 | 中 | Headless UI Tooltip |
| `AppProgress` | 进度条 | 中 | - |
| `AppSpinner` | 加载指示器 | 中 | - |

#### 数据展示组件 (Data Display)

| 组件 | 功能 | 优先级 | 依赖 |
|------|------|--------|------|
| `AppTable` | 表格 | 中 | - |
| `AppList` | 列表 | 低 | - |
| `AppTree` | 树形控件 | 低 | - |
| `AppBadge` | 徽章 | 低 | - |
| `AppTag` | 标签 | 低 | - |
| `AppAvatar` | 头像 | 低 | - |

#### 导航组件 (Navigation)

| 组件 | 功能 | 优先级 | 依赖 |
|------|------|--------|------|
| `AppTabs` | 标签页 | 中 | - |
| `AppBreadcrumb` | 面包屑 | 低 | - |
| `AppPagination` | 分页 | 低 | - |
| `AppSteps` | 步骤条 | 低 | - |

## 组件 API 设计规范

### Props 命名规范

```typescript
// 通用 Props
interface BaseProps {
  // 尺寸
  size?: 'sm' | 'md' | 'lg'
  
  // 变体样式
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  
  // 状态
  disabled?: boolean
  loading?: boolean
  
  // 标签和提示
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

// 表单组件 Props
interface FormProps extends BaseProps {
  modelValue?: any
  placeholder?: string
}
```

### Events 命名规范

```typescript
// 标准 Events
interface BaseEvents {
  // 更新值（v-model）
  'update:modelValue': [value: any]
  
  // 值变化
  'change': [value: any]
  
  // 点击事件
  'click': []
  
  // 焦点事件
  'focus': []
  'blur': []
}
```

### Slots 设计规范

```vue
<!-- 标准插槽 -->
<template>
  <div class="app-component">
    <!-- 前置插槽 -->
    <slot name="prefix" />
    
    <!-- 默认内容 -->
    <slot />
    
    <!-- 后置插槽 -->
    <slot name="suffix" />
    
    <!-- 附加内容 -->
    <slot name="append" />
  </div>
</template>
```

## TypeScript 类型定义

### 基础类型

```typescript
// components/base/types.ts

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type Color = 'primary' | 'success' | 'warning' | 'error' | 'info'

// 表单组件通用 Props
export interface FormComponentProps {
  modelValue?: any
  label?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  size?: Size
}

// Select 选项
export interface SelectOption {
  label: string
  value: any
  disabled?: boolean
  hint?: string
  group?: string
}

// 颜色
export interface ColorValue {
  hex: string
  rgb: { r: number; g: number; b: number }
}
```

## 与第三方库集成

### Headless UI 集成

```vue
<!-- 使用 Headless UI Dialog 实现模态框 -->
<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

const isOpen = ref(false)

function openModal() {
  isOpen.value = true
}

function closeModal() {
  isOpen.value = false
}
</script>

<template>
  <Dialog :open="isOpen" @close="closeModal">
    <DialogPanel>
      <DialogTitle>标题</DialogTitle>
      <!-- 内容 -->
    </DialogPanel>
  </Dialog>
</template>
```

### Nuxt UI 集成

```vue
<!-- 复用 Nuxt UI 组件的样式和功能 -->
<script setup lang="ts">
// 使用 Nuxt UI 的工具函数
import { useToast } from '@nuxt/ui'

const toast = useToast()

function showToast() {
  toast.add({ title: '成功', description: '操作已完成' })
}
</script>
```

## 开发规范

### 文件命名

```
# 组件文件命名
PascalCase + App 前缀
✅ AppButton.vue
✅ AppInput.vue
❌ button.vue
❌ Button.vue
```

### 代码风格

```vue
<!-- 组件模板 -->
<template>
  <div class="app-component">
    <!-- 使用 BEM 风格的 CSS 类名 -->
    <div class="app-component__header" />
    <div class="app-component__body" />
    <div class="app-component__footer" />
  </div>
</template>

<script setup lang="ts">
// 使用 Composition API
import { ref, computed } from 'vue'

// Props 定义
const props = defineProps<{
  modelValue?: string
}>()

// Emits 定义
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped>
/* 使用 scoped CSS */
/* 使用 CSS 变量 */
/* 添加过渡动画 */
.app-component {
  transition: all 0.2s ease-out;
}
</style>
```

### 性能优化

1. **使用 Teleport 避免层级问题**
   ```vue
   <Teleport to="body">
     <div class="dropdown">...</div>
   </Teleport>
   ```

2. **懒加载组件**
   ```vue
   <script setup>
   const AppModal = defineAsyncComponent(() => import('./AppModal.vue'))
   </script>
   ```

3. **使用 v-memo 优化列表渲染**
   ```vue
   <div v-for="item in list" v-memo="[item.id]" :key="item.id">
     {{ item.name }}
   </div>
   ```

## 测试策略

### 单元测试

```typescript
// components/base/__tests__/AppButton.spec.ts
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import AppButton from '../AppButton.vue'

describe('AppButton', () => {
  it('renders properly', () => {
    const wrapper = mount(AppButton, {
      slots: { default: 'Click me' }
    })
    expect(wrapper.text()).toContain('Click me')
  })

  it('emits click event', async () => {
    const wrapper = mount(AppButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })
})
```

## 文档规范

每个组件应包含：

1. **JSDoc 注释**
   ```typescript
   /**
    * AppButton - 按钮组件
    * @description 支持多种尺寸和变体样式的按钮组件
    * @example
    * <AppButton variant="primary" size="md">
    *   点击按钮
    * </AppButton>
    */
   ```

2. **使用示例**
   ```vue
   <Example title="基础用法">
     <AppButton>默认按钮</AppButton>
   </Example>
   ```

3. **API 文档**
   - Props 表格
   - Events 表格
   - Slots 表格

## 路线图

### Phase 1: 表单控件 ✅
- [x] AppInput, AppTextarea
- [x] AppSelect, AppCheckbox, AppRadio
- [x] AppSwitch, AppSlider
- [x] AppDatePicker, AppTimePicker
- [x] AppColorPicker, AppFileUpload

### Phase 2: 提示反馈组件 (进行中)
- [ ] AppAlert, AppToast
- [ ] AppModal (Headless UI)
- [ ] AppDrawer, AppTooltip (Headless UI)
- [ ] AppProgress, AppSpinner

### Phase 3: 数据展示组件
- [ ] AppTable, AppList
- [ ] AppTree, AppBadge
- [ ] AppTag, AppAvatar

### Phase 4: 导航组件
- [ ] AppTabs, AppBreadcrumb
- [ ] AppPagination, AppSteps

## 维护指南

### 添加新组件

1. 创建组件文件 `components/base/AppXxx.vue`
2. 实现 Props/Events/Slots
3. 添加样式和主题支持
4. 创建文档页面 `pages/docs/components/app-xxx.vue`
5. 添加单元测试
6. 更新本架构文档

### 版本控制

组件版本跟随项目版本，遵循语义化版本规范：
- **Major**: 破坏性变更
- **Minor**: 新增功能
- **Patch**: Bug 修复

## 相关文档

- [组件文档](/docs/components)
- [设计系统](./DESIGN_SYSTEM.md)
- [开发指南](./DEVELOPMENT.md)
