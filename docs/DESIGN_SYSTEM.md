# OpenClaw Workspace - 设计系统文档

> 版本: 1.2.0
> 最后更新: 2026-03-26
> 主题: 工业级暗黑 + 琥珀橙 (#f59e0b)

---

## 目录

1. [设计理念](#设计理念)
2. [颜色规范](#颜色规范)
3. [间距系统](#间距系统)
4. [圆角规范](#圆角规范)
5. [阴影规范](#阴影规范)
6. [字体规范](#字体规范)
7. [组件状态](#组件状态)
8. [组件命名规范](#组件命名规范)
9. [现有组件库](#现有组件库)
10. [交互设计原则](#交互设计原则)
11. [技术规范](#技术规范)
12. [已知问题与修复指南](#已知问题与修复指南)

---

## 设计理念

OpenClaw Workspace 采用**工业级暗黑风格**，以暖调极深炭灰为背景，琥珀橙色 (#f59e0b) 作为主题点缀色，营造专业、现代、高效的工作环境。

### 核心原则

- **一致性**: 统一的视觉语言和交互模式
- **可访问性**: 确保足够的对比度和可读性
- **性能优先**: 轻量级动画和过渡效果
- **响应式**: 适配桌面端和移动端体验

---

## 颜色规范

### 主题色

```css
--color-primary: #f59e0b      /* 琥珀橙 - 主要操作 */
--color-primary-hover: #d97706  /* 深琥珀橙 - 悬浮状态 */
--color-secondary: #78716c    /* 暖灰 - 次要元素 */
--color-accent: #f59e0b       /* 强调色 - 与 primary 一致 */
```

### 渐变定义

主按钮采用琥珀橙渐变：
```css
background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
```

悬浮状态渐变：
```css
background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
```

### 背景色

```css
--bg-primary: #18181B   /* 主背景 - 极深炭灰 */
--bg-secondary: #27272A /* 次级背景 - 深炭灰 */
--bg-tertiary: #3f3f46  /* 三级背景 - 中炭灰 */
--bg-body: #0f172a      /* 页面背景 - 深蓝灰 */
```

### 文字颜色

```css
--text-primary: #fafafa   /* 主要文字 - 近白色 */
--text-secondary: #a1a1aa /* 次要文字 - 浅灰 */
--text-tertiary: #71717a  /* 三级文字 - 中灰 */
--text-muted: #52525b     /* 弱化文字 - 深灰 */
```

### 边框颜色

```css
--border-subtle: rgba(255, 255, 255, 0.08)   /* 微弱边框 */
--border-default: rgba(255, 255, 255, 0.12)  /* 默认边框 */
--border-strong: rgba(255, 255, 255, 0.2)    /* 强调边框 */
```

### 语义颜色

```css
--color-success: #22c55e  /* 成功 - 绿色 */
--color-warning: #f59e0b  /* 警告 - 琥珀色 */
--color-error: #ef4444    /* 错误 - 红色 */
```

### 图标颜色

```css
/* Ghost 变体 */
ghost: #71717a

/* Primary 变体 */
primary: #f59e0b

/* Secondary 变体 */
secondary: #a1a1aa

/* Danger 变体 */
danger: #f87171

/* Success 变体 */
success: #34d399

/* Subtle 变体 */
subtle: #71717a

/* Disabled 状态 */
disabled: #71717a
```

---

## 间距系统

基于 **4px** 基础单位的间距系统：

```css
--spacing-1: 0.25rem;  /* 4px  */
--spacing-2: 0.5rem;   /* 8px  */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
```

### 使用场景

- **4px**: 极小间距、图标与文字间隙
- **8px**: 小间距、相关元素之间
- **12px**: 中等间距、表单字段间隙
- **16px**: 标准间距、卡片内边距
- **20px**: 大间距、章节间距
- **24px**: 超大间距、区块分隔
- **32px**: 巨大间距、页面级分隔

---

## 圆角规范

统一的圆角系统，保持硬朗现代感：

```css
--radius-sm: 0.375rem;  /* 6px  - 小元素 */
--radius-md: 0.5rem;    /* 8px  - 标准元素 */
--radius-lg: 0.75rem;   /* 12px - 大元素/按钮 */
--radius-xl: 1rem;      /* 16px - 卡片 */
--radius-2xl: 1.25rem;  /* 20px - 模态框 */
```

### 统一圆角

```css
--radius-unified: 6px;  /* 全局统一圆角 */
```

### 使用场景

- **6px**: 小按钮、标签、输入框
- **8px**: 标准按钮、卡片
- **12px**: 大按钮、容器
- **16px**: 面板、对话框
- **20px**: 模态框、大型容器

---

## 阴影规范

多层次阴影系统，营造深度感：

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

### 特殊阴影

主按钮阴影：
```css
box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
```

主按钮悬浮阴影：
```css
box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
```

Focus 状态阴影：
```css
box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
```

---

## 字体规范

### 字体家族

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### 字体大小

```css
--text-xs: 0.75rem;    /* 12px - 辅助文字 */
--text-sm: 0.875rem;   /* 14px - 小号文字、标签 */
--text-base: 1rem;     /* 16px - 正文 */
--text-lg: 1.125rem;   /* 18px - 小标题 */
--text-xl: 1.25rem;    /* 20px - 中标题 */
--text-2xl: 1.5rem;    /* 24px - 大标题 */
--text-3xl: 1.875rem;  /* 30px - 超大标题 */
```

### 字重

- **400**: Regular - 正文
- **500**: Medium - 标签、按钮、表单标签
- **600**: Semibold - 小标题
- **700**: Bold - 大标题

### 使用场景

- **12px (xs)**: 错误提示、辅助说明
- **14px (sm)**: 按钮文字、表单标签、辅助信息
- **16px (base)**: 正文、输入框文字
- **18px (lg)**: 小标题
- **20px+**: 各级标题

---

## 组件状态

### 通用状态规则

#### 1. **Hover (悬浮态)**

- 颜色加深或背景透明度增加
- 添加阴影增强深度
- 过渡时间: 200ms

```css
transition: all 0.2s ease-out;
```

#### 2. **Active (点击态)**

- 微缩放效果: `transform: scale(0.95)`
- 即时反馈，无过渡延迟

```css
active:scale-95
```

#### 3. **Focus (聚焦态)**

- 蓝色轮廓: `outline: 2px solid #3b82f6`
- 轮廓偏移: `outline-offset: 2px`
- 外发光: `box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)`

```css
.app-button:focus-visible {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
}
```

#### 4. **Disabled (禁用态)**

- 透明度降低至 50%
- 鼠标样式: `not-allowed`
- 移除所有交互效果

```css
disabled:opacity-50 disabled:cursor-not-allowed
```

#### 5. **Loading (加载态)**

- 显示旋转图标
- 禁用指针事件
- 保持原有布局

---

## 组件命名规范

### 文件命名

- 基础组件: `App[ComponentName].vue`
- 示例: `AppButton.vue`, `AppInput.vue`, `AppIcon.vue`

### CSS 类命名

使用 BEM (Block Element Modifier) 风格变体：

```css
.app-button              /* Block */
.app-button-primary      /* Modifier - 变体 */
.app-button-md           /* Modifier - 尺寸 */
.app-button-disabled     /* Modifier - 状态 */
```

### Props 命名

```typescript
// 变体
variant: 'primary' | 'secondary' | 'ghost' | 'danger'

// 尺寸
size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// 状态
disabled: boolean
loading: boolean

// 布局
fullWidth: boolean
iconPosition: 'left' | 'right'
```

---

## 现有组件库

### 1. AppButton (按钮组件)

**文件**: `components/base/AppButton.vue`

#### 变体 (Variants)

| 变体 | 用途 | 样式 |
|------|------|------|
| `primary` | 主要操作 | 琥珀橙渐变背景 + 黑色文字 |
| `secondary` | 次要操作 | 半透明深灰背景 + 浅灰文字 |
| `ghost` | 轻量操作 | 透明背景 + 灰色文字 |
| `danger` | 危险操作 | 红色背景 + 白色文字 |

#### 尺寸 (Sizes)

| 尺寸 | 高度 | 内边距 | 字体 |
|------|------|--------|------|
| `xs` | 2rem | 0.375rem 0.75rem | 12px |
| `sm` | 2.25rem | 0.5rem 1rem | 14px |
| `md` | 2.5rem | 0.625rem 1.25rem | 14px |
| `lg` | 2.75rem | 0.75rem 1.5rem | 16px |

#### 特性

- 支持左右图标
- 加载状态动画
- 全宽选项
- 禁用状态
- 图标尺寸自动适配

---

### 2. AppInput (输入框组件)

**文件**: `components/base/AppInput.vue`

#### 特性

- 标签 + 必填标记
- 前缀/后缀图标
- 错误提示
- 辅助说明
- 禁用状态

#### 样式

```css
padding: 0.625rem 0.875rem;
background: rgba(15, 23, 42, 0.5);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: var(--radius-lg);
color: #f1f5f9;
font-size: var(--text-sm);
transition: all 0.15s ease-out;
```

#### Focus 状态

蓝色边框 + 外发光：
```css
border-color: #3b82f6;
box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
```

---

### 3. AppCard (卡片组件)

**文件**: `components/base/AppCard.vue`

#### 变体 (Variants)

| 变体 | 用途 | 样式 |
|------|------|------|
| `default` | 默认卡片 | 渐变背景 + 边框 |
| `bordered` | 边框卡片 | 透明背景 + 强边框 |
| `elevated` | 浮起卡片 | 渐变背景 + 阴影 + 边框 |

#### 内边距 (Padding)

| 尺寸 | 值 |
|------|-----|
| `none` | 无内边距 |
| `sm` | var(--spacing-4) - 16px |
| `md` | var(--spacing-6) - 24px |
| `lg` | var(--spacing-8) - 32px |

#### 特性

- 插槽支持：header、default、footer
- 悬浮效果（hoverable）
- 可点击状态（clickable + 上移动画）
- 统一 16px 圆角

---

### 4. AppTextarea (文本域组件)

**文件**: `components/base/AppTextarea.vue`

#### 尺寸 (Sizes)

| 尺寸 | 内边距 | 字体 | 最小高度 |
|------|--------|------|----------|
| `sm` | 0.5rem 0.75rem | 12px | 60px |
| `md` | 0.625rem 0.875rem | 14px | 80px |
| `lg` | 0.75rem 1rem | 16px | 100px |

#### 特性

- 字符计数显示
- 自动调整高度
- 最大长度限制
- 错误/提示信息
- Focus 状态使用琥珀橙边框

#### Focus 状态（特殊）

与其他表单控件不同，Textarea 使用琥珀橙主题色：
```css
border-color: #f59e0b;
box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
```

---

### 5. AppCheckbox (复选框组件)

**文件**: `components/base/AppCheckbox.vue`

#### 尺寸 (Sizes)

| 尺寸 | 盒子大小 | 字体 |
|------|----------|------|
| `sm` | 16×16px | 12px |
| `md` | 18×18px | 14px |
| `lg` | 20×20px | 16px |

#### 特性

- 支持单选和数组模式
- 半选状态（indeterminate）
- 使用 AppIcon 显示选中图标
- Hover 时边框变琥珀橙
- 选中状态使用琥珀橙渐变背景

#### 选中样式

```css
background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
border-color: #f59e0b;
```

---

### 6. AppRadio (单选框组件)

**文件**: `components/base/AppRadio.vue`

#### 尺寸 (Sizes)

| 尺寸 | 盒子大小 | 圆点大小 | 字体 |
|------|----------|----------|------|
| `sm` | 16×16px | 6×6px | 12px |
| `md` | 18×18px | 8×8px | 14px |
| `lg` | 20×20px | 10×10px | 16px |

#### 特性

- 圆形设计（border-radius: 50%）
- 缩放动画（选中时圆点从 0 放大到 1）
- Hover 时边框变琥珀橙
- 选中状态使用琥珀橙圆点渐变

#### 选中动画

```css
.app-radio-dot {
  transform: scale(0);
  transition: transform 0.15s ease-out;
}

.app-radio-box-checked .app-radio-dot {
  transform: scale(1);
}
```

---

### 7. AppIcon (图标组件)

**文件**: `components/base/AppIcon.vue`

#### 尺寸 (Sizes)

| 尺寸 | 容器 | 图标 | 内边距 |
|------|------|------|--------|
| `xs` | 32×32 | 14×14 | 6px |
| `sm` | 36×36 | 16×16 | 8px |
| `md` | 40×40 | 18×18 | 10px |
| `lg` | 44×44 | 20×20 | 10px |
| `xl` | 48×48 | 22×22 | 12px |

#### 变体 (Variants)

| 变体 | 颜色 |
|------|------|
| `ghost` | #71717a |
| `primary` | #f59e0b |
| `secondary` | #a1a1aa |
| `danger` | #f87171 |
| `success` | #34d399 |
| `subtle` | #71717a |

#### 背景样式 (Backgrounds)

- `filled`: 实色背景
- `tinted`: 浅色背景 (10% 透明度)
- `outlined`: 边框背景
- `none`: 无背景

#### 特性

- 可点击状态 (缩放动画)
- 禁用状态
- 加载遮罩
- 图标 + 标签组合
- 圆形/方形选项

---

## 交互设计原则

### 动画和过渡

#### 标准过渡时间

- **快速**: 150ms - 输入框、边框变化
- **标准**: 200ms - 按钮、悬浮效果
- **缓慢**: 300ms - 模态框、页面切换

#### 缓动函数

```css
transition: all 0.2s ease-out;  /* 标准输出 */
transition: all 0.15s ease-out; /* 快速输出 */
```

#### 微交互

1. **悬浮缩放**: `hover:scale-105`
2. **点击缩放**: `active:scale-95`
3. **图标缩放**: `group-hover:scale-110`

### Z-index 层级

```css
--z-dropdown: 1000
--z-sticky: 1020
--z-fixed: 1030
--z-modal-backdrop: 1040
--z-modal: 1050
--z-popover: 1060
--z-tooltip: 1070
```

### 滚动条样式

- 宽度: 6px
- 仅在 hover 时显示
- 半透明滑块

```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}
```

### 移动端优化

- 移除 hover 效果，使用 active
- 防止 iOS 文本缩放 (font-size: 16px)
- 触摸友好的点击区域 (最小 44×44px)

---

## 技术规范

### Props 定义标准

所有新组件必须使用 **TypeScript interface + withDefaults** 模式：

```typescript
<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  size: 'md',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()
</script>
```

**优点**:
- 完整的 TypeScript 类型推断
- 清晰的 Props 文档
- IDE 自动补全支持
- 与 AppIcon.vue 保持一致

---

### CSS 变量使用规范

#### 必须使用 CSS 变量的属性

**颜色**:
```css
/* ✅ 正确 */
color: var(--text-primary);
background: var(--bg-secondary);
border-color: var(--border-default);

/* ❌ 错误 - 硬编码颜色 */
color: #f1f5f9;
background: rgba(15, 23, 42, 0.5);
border: 1px solid rgba(255, 255, 255, 0.2);
```

**圆角**:
```css
/* ✅ 正确 */
border-radius: var(--radius-lg);

/* ❌ 错误 */
border-radius: 0.75rem;
border-radius: 12px;
```

**阴影**:
```css
/* ✅ 正确 */
box-shadow: var(--shadow-lg);

/* ❌ 错误 */
box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
```

**间距**:
```css
/* ✅ 正确 */
padding: var(--spacing-4);
gap: var(--spacing-3);

/* ❌ 错误 */
padding: 1rem;
gap: 12px;
```

#### 特殊情况

**渐变** - 可使用硬编码（主题渐变应定义为变量）:
```css
/* 主题渐变 - 建议在 main.css 中定义 */
background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
```

**透明度叠加** - 可使用 rgba():
```css
/* 当需要动态透明度时 */
background: rgba(15, 23, 42, 0.5);
```

---

### 无障碍访问规范

#### 1. Role 属性

根据组件功能添加适当的 role：

```vue
<!-- 按钮类组件 -->
<button role="button" />

<!-- 切换开关 -->
<div role="switch" :aria-checked="checked" />

<!-- 选项卡 -->
<div role="tab" :aria-selected="selected" />

<!-- 对话框 -->
<div role="dialog" aria-modal="true" />
```

#### 2. Aria 属性

```vue
<!-- 标签关联 -->
<label :for="inputId">{{ label }}</label>
<input :id="inputId" :aria-label="label" />

<!-- 状态描述 -->
<div :aria-describedby="errorId">{{ error }}</div>
<input :aria-invalid="!!error" :aria-errormessage="errorId" />

<!-- 加载状态 -->
<div :aria-busy="loading" :aria-label="loading ? 'Loading' : null" />

<!-- 禁用状态 -->
<button :aria-disabled="disabled" />

<!-- 扩展控制 -->
<button :aria-expanded="expanded" :aria-controls="panelId" />
```

#### 3. 键盘事件

```typescript
// Enter / Space 激活
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleClick()
  }
}

// Escape 关闭
const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleClose()
  }
}

// 方向键导航
const handleArrowKey = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    navigateOptions(e.key === 'ArrowDown' ? 1 : -1)
  }
}
```

#### 4. Focus 管理

```vue
<!-- Focus trap (模态框) -->
<div ref="containerRef" @keydown.tab="trapFocus">

<!-- Focus restore (关闭后恢复) -->
const previousActiveElement = ref<HTMLElement>()

onMounted(() => {
  previousActiveElement.value = document.activeElement as HTMLElement
})

onUnmounted(() => {
  previousActiveElement.value?.focus()
})
```

---

### 组件结构规范

#### 模板结构

```vue
<template>
  <!-- 根元素类名 -->
  <div :class="componentClasses" v-bind="attrs">
    <!-- 插槽区域 -->
    <div v-if="$slots.prefix" class="app-component-prefix">
      <slot name="prefix" />
    </div>

    <!-- 默认内容 -->
    <slot />

    <!-- 后缀插槽 -->
    <div v-if="$slots.suffix" class="app-component-suffix">
      <slot name="suffix" />
    </div>
  </div>
</template>
```

#### Script 结构

```typescript
<script setup lang="ts">
// 1. 导入
import { computed, ref } from 'vue'

// 2. Props 定义
interface Props { ... }
const props = withDefaults(defineProps<Props>(), { ... })

// 3. Emits 定义
const emit = defineEmits<{ ... }>()

// 4. Refs
const localState = ref(...)

// 5. Computed
const computedValue = computed(() => ...)

// 6. Methods
const handleAction = () => { ... }

// 7. 生命周期
onMounted(() => { ... })
</script>
```

#### Style 结构

```vue
<style scoped>
/* 1. 基础样式 */
.app-component {
  /* 布局 */
  display: flex;

  /* 尺寸 */
  width: 100%;

  /* 外观 */
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);

  /* 动画 */
  transition: all 0.2s ease-out;
}

/* 2. 变体样式 */
.app-component-primary { ... }
.app-component-secondary { ... }

/* 3. 尺寸样式 */
.app-component-sm { ... }
.app-component-md { ... }

/* 4. 状态样式 */
.app-component:hover { ... }
.app-component:focus { ... }
.app-component:disabled { ... }

/* 5. 元素样式 */
.app-component-label { ... }
.app-component-input { ... }
</style>
```

---

### 完整的 CSS 变量速查表

```css
/* ===== 颜色 ===== */
--color-primary: #f59e0b
--color-primary-hover: #d97706
--color-secondary: #78716c
--color-success: #22c55e
--color-warning: #f59e0b
--color-error: #ef4444

/* 背景 */
--bg-primary: #18181B
--bg-secondary: #27272A
--bg-tertiary: #3f3f46
--bg-body: #0f172a

/* 文字 */
--text-primary: #fafafa
--text-secondary: #a1a1aa
--text-tertiary: #71717a
--text-muted: #52525b

/* 边框 */
--border-subtle: rgba(255, 255, 255, 0.08)
--border-default: rgba(255, 255, 255, 0.12)
--border-strong: rgba(255, 255, 255, 0.2)

/* ===== 间距 ===== */
--spacing-1: 0.25rem  /* 4px */
--spacing-2: 0.5rem   /* 8px */
--spacing-3: 0.75rem  /* 12px */
--spacing-4: 1rem     /* 16px */
--spacing-5: 1.25rem  /* 20px */
--spacing-6: 1.5rem   /* 24px */
--spacing-8: 2rem     /* 32px */

/* ===== 圆角 ===== */
--radius-sm: 0.375rem  /* 6px */
--radius-md: 0.5rem    /* 8px */
--radius-lg: 0.75rem   /* 12px */
--radius-xl: 1rem      /* 16px */
--radius-2xl: 1.25rem  /* 20px */
--radius-unified: 6px

/* ===== 阴影 ===== */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25)

/* ===== 字体 ===== */
--text-xs: 0.75rem
--text-sm: 0.875rem
--text-base: 1rem
--text-lg: 1.125rem
--text-xl: 1.25rem
--text-2xl: 1.5rem
--text-3xl: 1.875rem

/* ===== Z-index ===== */
--z-dropdown: 1000
--z-sticky: 1020
--z-fixed: 1030
--z-modal-backdrop: 1040
--z-modal: 1050
--z-popover: 1060
--z-tooltip: 1070
```

---

## 已知问题与修复指南

### 问题 1: Props 定义不统一

**现状**:
- AppIcon.vue 使用 `interface Props` + `withDefaults`
- 其他组件使用 `defineProps` 直接定义

**修复方案**: 统一使用 interface 模式

```typescript
// ❌ 旧模式
const props = defineProps({
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'md'
  }
})

// ✅ 新模式
interface Props {
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})
```

---

### 问题 2: CSS 变量使用不一致

**现状**: 大量硬编码颜色值

**修复对照表**:

| 硬编码值 | CSS 变量 | 说明 |
|---------|----------|------|
| `#f1f5f9` | `var(--text-primary)` | 主要文字 |
| `#a1a1aa` | `var(--text-secondary)` | 次要文字 |
| `#71717a` | `var(--text-tertiary)` | 三级文字 |
| `rgba(241, 245, 249, 0.5)` | `var(--text-secondary)` (调整透明度) | 半透明文字 |
| `rgba(241, 245, 249, 0.4)` | `var(--text-muted)` | 弱化文字 |
| `#f59e0b` | `var(--color-primary)` | 主题色 |
| `#d97706` | `var(--color-primary-hover)` | 悬浮色 |
| `#ef4444` | `var(--color-error)` | 错误色 |
| `rgba(15, 23, 42, 0.5)` | `var(--bg-body)` + 透明度 | 输入框背景 |
| `rgba(255, 255, 255, 0.2)` | `var(--border-strong)` | 强边框 |
| `rgba(255, 255, 255, 0.1)` | `var(--border-default)` | 默认边框 |
| `rgba(39, 39, 42, 0.5)` | `var(--bg-secondary)` + 透明度 | 次级背景 |
| `rgba(39, 39, 42, 0.8)` | `var(--bg-secondary)` | 不透明次级背景 |
| `#3b82f6` | (需定义) `var(--color-focus)` | Focus 蓝色 |
| `#0f172a` | `var(--bg-body)` | 页面背景 |
| `#27272a` | `var(--bg-secondary)` | 次级背景 |
| `#1e293b` | (需定义) `var(--bg-elevated)` | 浮起背景 |

---

### 问题 3: 圆角值不一致

**现状**:
- 设计规范定义 `--radius-unified: 6px`
- 组件中使用 `var(--radius-lg)` = 12px

**修复方案**:

1. **统一圆角标准**:
```css
/* 更新圆角定义以匹配设计 */
--radius-sm: 0.25rem;  /* 4px  - 微小圆角 */
--radius-md: 0.375rem; /* 6px  - 标准圆角 (统一) */
--radius-lg: 0.5rem;   /* 8px  - 大圆角 */
--radius-xl: 0.75rem;  /* 12px - 超大圆角 */
```

2. **组件更新**:
```css
/* 按钮和输入框使用标准圆角 */
.app-button,
.app-input,
.app-textarea {
  border-radius: var(--radius-md); /* 6px */
}

/* 卡片使用大圆角 */
.app-card {
  border-radius: var(--radius-xl); /* 12px */
}
```

---

### 问题 4: 无障碍访问缺失

**修复清单**:

- [ ] 添加适当的 `role` 属性
- [ ] 添加 `aria-label` 或 `aria-labelledby`
- [ ] 添加 `aria-describedby` 关联错误/提示信息
- [ ] 实现 `aria-invalid` 状态
- [ ] 支持键盘导航 (Enter, Space, Escape, Arrow keys)
- [ ] 实现 `tabindex` 控制
- [ ] Focus 可见性增强
- [ ] 屏幕阅读器测试

**示例修复**:

```vue
<!-- AppInput.vue 修复 -->
<template>
  <div class="app-input">
    <label
      :id="labelId"
      :for="inputId"
      class="app-input-label"
    >
      {{ label }}
      <span v-if="required" aria-hidden="true">*</span>
    </label>

    <input
      :id="inputId"
      ref="inputRef"
      v-model="inputValue"
      :disabled="disabled"
      :aria-label="label"
      :aria-describedby="descriptionId"
      :aria-invalid="!!error"
      :aria-required="required"
      :aria-disabled="disabled"
      class="app-input-field"
      @keydown="handleKeydown"
    />

    <p
      v-if="error"
      :id="errorId"
      class="app-input-error"
      role="alert"
      aria-live="polite"
    >
      {{ error }}
    </p>

    <p
      v-else-if="hint"
      :id="hintId"
      class="app-input-hint"
    >
      {{ hint }}
    </p>
  </div>
</template>
```

---

### 问题 5: 缺少 Focus 颜色变量

**修复**: 添加到 `main.css`

```css
/* 在 main.css 中添加 */
:root {
  /* Focus 颜色 */
  --color-focus: #3b82f6;
  --color-focus-ring: rgba(59, 130, 246, 0.1);
}

/* 使用 */
.app-component:focus {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

.app-component:focus-visible {
  box-shadow: 0 0 0 3px var(--color-focus-ring);
}
```

---

### 问题 6: 主题渐变未定义为变量

**修复**: 添加渐变变量

```css
:root {
  /* 主题渐变 */
  --gradient-primary: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  --gradient-primary-hover: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  --gradient-card: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
}

/* 使用 */
.app-button-primary {
  background: var(--gradient-primary);
}

.app-button-primary:hover {
  background: var(--gradient-primary-hover);
}
```

---

## 设计资源

### CSS 变量文件

`/root/.openclaw/workspace/OpenClaw-Workspace/assets/css/main.css`

### 组件目录

```
components/base/
├── AppButton.vue      # 按钮组件
├── AppInput.vue       # 输入框组件
├── AppTextarea.vue    # 文本域组件
├── AppCheckbox.vue    # 复选框组件
├── AppRadio.vue       # 单选框组件
├── AppCard.vue        # 卡片组件
└── AppIcon.vue        # 图标组件
```

### 图标库

使用 [Lucide Icons](https://lucide.dev/) 通过 Nuxt UI 的 `<UIcon>` 组件。

---

## 版本历史

- **v1.2.0** (2026-03-26): 技术规范与问题修复指南
  - 新增技术规范章节（Props 定义、CSS 变量使用、无障碍访问）
  - 新增已知问题与修复指南（6个主要问题的解决方案）
  - 新增完整 CSS 变量速查表
  - 新增组件结构规范（模板、脚本、样式）
  - 新增无障碍访问规范（role、aria、键盘事件、focus 管理）
  - 统一 Props 定义方式为 interface Props 模式
  - 完善颜色变量映射表

- **v1.1.0** (2026-03-26): 扩展组件分析
  - 新增 AppCard 组件规范
  - 新增 AppTextarea 组件规范
  - 新增 AppCheckbox 组件规范
  - 新增 AppRadio 组件规范
  - 更新组件目录结构

- **v1.0.0** (2026-03-26): 初始设计系统文档
  - 定义颜色、间距、圆角、阴影系统
  - 记录基础组件规范（Button、Input、Icon）
  - 建立命名和交互规范

---

**维护者**: OpenClaw Workspace Team
**最后审核**: 2026-03-26
