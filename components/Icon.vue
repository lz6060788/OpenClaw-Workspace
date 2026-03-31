<!-- components/Icon.vue - Element Plus Icon wrapper -->
<template>
  <div
    class="app-icon-wrapper"
    :class="[
      variant,
      background,
      { clickable, loading, disabled }
    ]"
    @click="handleClick"
  >
    <el-icon
      :size="iconSize"
      :color="effectiveColor"
      class="app-icon"
      :class="{ loading }"
    >
      <component :is="iconComponent" v-if="!loading" />
      <IconsLoading v-else />
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import * as Icons from '@element-plus/icons-vue'

interface Props {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  clickable?: boolean
  loading?: boolean
  variant?: 'subtle' | 'primary' | 'danger'
  background?: 'tinted' | 'outlined' | 'filled'
  iconColor?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  clickable: false,
  loading: false,
  variant: undefined,
  background: undefined,
  iconColor: undefined
})

const emit = defineEmits<{
  click: []
}>()

const iconMap: Record<string, any> = {
  'code-2': Icons.DocumentCopy,
  'file-text': Icons.Document,
  'chevron-left': Icons.ArrowLeft,
  'chevron-right': Icons.ArrowRight,
  'chevron-down': Icons.ArrowDown,
  'chevron-up': Icons.ArrowUp,
  'moon': Icons.Moon,
  'sun': Icons.Sunny,
  'x': Icons.Close,
  'menu': Icons.Menu,
  'file-code': Icons.DocumentCopy,
  'file-search': Icons.Search,
  'loader-2': Icons.Loading,
  'save': Icons.Check,
  'plus': Icons.Plus,
  'minus': Icons.Minus,
  'check': Icons.Check,
  'close': Icons.Close,
  'search': Icons.Search,
  'settings': Icons.Setting,
  'home': Icons.House,
  'user': Icons.User,
  'bell': Icons.Bell,
  'star': Icons.Star,
  'heart': Icons.Star,
  'trash': Icons.Delete,
  'edit': Icons.Edit,
  'copy': Icons.CopyDocument,
  'download': Icons.Download,
  'upload': Icons.Upload,
  'refresh': Icons.Refresh,
  'refresh-cw': Icons.Refresh,
  'filter': Icons.Filter,
  'sort': Icons.Sort,
  'calendar': Icons.Calendar,
  'clock': Icons.Clock,
  'info': Icons.InfoFilled,
  'warning': Icons.Warning,
  'error': Icons.CircleClose,
  'success': Icons.CircleCheck,
  'folder-git-2': Icons.FolderOpened,
  'folder-open': Icons.FolderOpened,
  'folder': Icons.Folder,
  'file': Icons.Document,
  'sparkles': Icons.Star,
  'book-open': Icons.Reading,
  'monitor': Icons.Monitor,
  'message-square': Icons.ChatLineSquare,
  'layers': Icons.Menu,
  'eye': Icons.View,
  'history': Icons.Clock,
  'trash-2': Icons.Delete,
  'file-plus': Icons.DocumentAdd,
  'edit-3': Icons.Edit,
  'zap': Icons.Lightning,
  'bug': Icons.Warning,
  'send': Icons.Promotion,
}

const iconComponent = computed(() => {
  return iconMap[props.name] || Icons.Document
})

const iconSize = computed(() => {
  const sizeMap = { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 }
  return sizeMap[props.size]
})

const effectiveColor = computed(() => {
  return props.iconColor || props.color
})

const handleClick = () => {
  if (props.clickable && !props.loading && !props.disabled) {
    emit('click')
  }
}
</script>

<style scoped>
.app-icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.app-icon-wrapper.clickable {
  cursor: pointer;
}

.app-icon-wrapper.clickable:not(.disabled):hover {
  transform: scale(1.1);
}

.app-icon-wrapper.clickable:not(.disabled):active {
  transform: scale(0.95);
}

.app-icon-wrapper.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app-icon.loading {
  animation: spin 1s linear infinite;
}

/* Variant styles */
.app-icon-wrapper.subtle {
  color: rgb(161 161 170);
}

.app-icon-wrapper.primary {
  color: rgb(251 191 36);
}

.app-icon-wrapper.danger {
  color: rgb(248 113 113);
}

/* Background styles */
.app-icon-wrapper.tinted {
  padding: 0.25rem;
  border-radius: 0.5rem;
  background-color: rgb(24 24 27 / 0.5);
}

.app-icon-wrapper.outlined {
  padding: 0.25rem;
  border-radius: 0.5rem;
  border: 1px solid rgb(255 255 255 / 0.1);
}

.app-icon-wrapper.filled {
  padding: 0.5rem;
  border-radius: 0.75rem;
  background: linear-gradient(to bottom right, rgb(251 191 36), rgb(217 119 6));
  color: white;
}

.app-icon-wrapper.filled .app-icon {
  color: white;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
