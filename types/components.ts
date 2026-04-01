/**
 * OpenClaw Workspace 组件库类型定义
 * @description 组件库通用的 TypeScript 类型定义
 */

// =============================================================================
// 基础类型
// =============================================================================

/**
 * 组件尺寸
 */
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * 组件变体
 */
export type ComponentVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

/**
 * 颜色类型
 */
export type ComponentColor = 'primary' | 'success' | 'warning' | 'error' | 'info'

/**
 * 位置类型
 */
export type Placement = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

// =============================================================================
// 表单组件通用类型
// =============================================================================

/**
 * 表单组件基础 Props
 */
export interface BaseFormProps {
  /** 标签文本 */
  label?: string
  /** 错误提示 */
  error?: string
  /** 帮助提示 */
  hint?: string
  /** 禁用状态 */
  disabled?: boolean
  /** 必填标记 */
  required?: boolean
  /** 组件尺寸 */
  size?: ComponentSize
}

/**
 * 表单组件 Props（支持 v-model）
 */
export interface FormProps<T = any> extends BaseFormProps {
  /** 绑定值 */
  modelValue?: T
  /** 占位符文本 */
  placeholder?: string
}

// =============================================================================
// 选择器类型
// =============================================================================

/**
 * 选择器选项
 */
export interface SelectOption {
  /** 显示文本 */
  label: string
  /** 选项值 */
  value: any
  /** 禁用状态 */
  disabled?: boolean
  /** 提示文本 */
  hint?: string
  /** 分组名称 */
  group?: string
}

/**
 * 选择器分组
 */
export interface SelectOptionGroup {
  label: string
  options: SelectOption[]
}

// =============================================================================
// 日期时间类型
// =============================================================================

/**
 * 日期格式
 */
export type DateFormat = 'YYYY-MM-DD' | 'YYYY/MM/DD' | 'DD/MM/YYYY' | 'MM-DD-YYYY'

/**
 * 时间格式
 */
export type TimeFormat = 'HH:mm' | 'HH:mm:ss' | 'hh:mm A' | 'hh:mm:ss A'

/**
 * 日期范围
 */
export interface DateRange {
  start: Date
  end: Date
}

// =============================================================================
// 颜色类型
// =============================================================================

/**
 * 颜色值（支持多种格式）
 */
export type ColorValue = string | ColorObject

/**
 * 颜色对象
 */
export interface ColorObject {
  /** Hex 格式 */
  hex: string
  /** RGB 格式 */
  rgb: {
    r: number
    g: number
    b: number
    a?: number
  }
  /** HSL 格式 */
  hsl?: {
    h: number
    s: number
    l: number
    a?: number
  }
}

// =============================================================================
// 文件类型
// =============================================================================

/**
 * 文件信息
 */
export interface FileInfo {
  /** 文件对象 */
  file: File
  /** 预览 URL（图片） */
  preview?: string
  /** 上传进度 */
  progress?: number
  /** 上传状态 */
  status?: 'pending' | 'uploading' | 'success' | 'error'
  /** 错误信息 */
  error?: string
}

/**
 * 文件验证规则
 */
export interface FileValidationRule {
  /** 最大文件大小（字节） */
  maxSize?: number
  /** 允许的文件类型 */
  accept?: string
  /** 自定义验证函数 */
  validator?: (file: File) => boolean | string
}

// =============================================================================
// 表格类型
// =============================================================================

/**
 * 表格列定义
 */
export interface TableColumn {
  /** 列键值 */
  key: string
  /** 列标题 */
  title: string
  /** 列宽度 */
  width?: number | string
  /** 对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 是否可排序 */
  sortable?: boolean
  /** 是否可筛选 */
  filterable?: boolean
  /** 自定义渲染 */
  render?: (value: any, record: any, index: number) => any
  /** 固定列 */
  fixed?: 'left' | 'right'
}

/**
 * 表格分页配置
 */
export interface TablePagination {
  /** 当前页 */
  current: number
  /** 每页条数 */
  pageSize: number
  /** 总条数 */
  total: number
  /** 显示总数 */
  showTotal?: boolean
  /** 可选每页条数 */
  showSizeChanger?: boolean
  /** 快速跳转 */
  showQuickJumper?: boolean
}

// =============================================================================
// 弹窗类型
// =============================================================================

/**
 * 模态框 Props
 */
export interface ModalProps {
  /** 标题 */
  title?: string
  /** 宽度 */
  width?: number | string
  /** 是否可见 */
  open?: boolean
  /** 点击遮罩关闭 */
  maskClosable?: boolean
  /** 显示关闭按钮 */
  closable?: boolean
  /** 确认按钮文字 */
  okText?: string
  /** 取消按钮文字 */
  cancelText?: string
  /** 加载状态 */
  confirmLoading?: boolean
}

/**
 * 抽屉 Props
 */
export interface DrawerProps {
  /** 标题 */
  title?: string
  /** 位置 */
  placement?: 'left' | 'right' | 'top' | 'bottom'
  /** 宽度/高度 */
  size?: number | string
  /** 是否可见 */
  open?: boolean
  /** 点击遮罩关闭 */
  maskClosable?: boolean
  /** 显示关闭按钮 */
  closable?: boolean
}

// =============================================================================
// 通知类型
// =============================================================================

/**
 * 通知配置
 */
export interface NotificationConfig {
  /** 标题 */
  title: string
  /** 描述 */
  description?: string
  /** 类型 */
  type?: ComponentColor
  /** 持续时间（毫秒） */
  duration?: number
  /** 位置 */
  placement?: Placement
  /** 可关闭 */
  closable?: boolean
  /** 图标 */
  icon?: string
}

// =============================================================================
// 步骤条类型
// =============================================================================

/**
 * 步骤项
 */
export interface StepItem {
  /** 标题 */
  title: string
  /** 描述 */
  description?: string
  /** 图标 */
  icon?: string
  /** 状态 */
  status?: 'wait' | 'process' | 'finish' | 'error'
  /** 禁用 */
  disabled?: boolean
}

// =============================================================================
// 树形控件类型
// =============================================================================

/**
 * 树节点
 */
export interface TreeNode {
  /** 节点键值 */
  key: string | number
  /** 节点标题 */
  title: string
  /** 子节点 */
  children?: TreeNode[]
  /** 禁用 */
  disabled?: boolean
  /** 是否可选中 */
  selectable?: boolean
  /** 扩展数据 */
  data?: any
}

// =============================================================================
// 工具类型
// =============================================================================

/**
 * 组件 Props 类型提取
 */
export type ComponentProps<T> = T extends new () => { $props: infer P } ? P : never

/**
 * 移除某些属性
 */
export type OmitProps<T, K extends keyof T> = Omit<T, K>

/**
 * 使某些属性可选
 */
export type PartialProps<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * 组件实例类型
 */
export type ComponentInstance<T> = T extends new () => infer R ? R : never
