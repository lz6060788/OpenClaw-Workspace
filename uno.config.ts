// UnoCSS 配置
import { defineConfig, presetUno, presetIcons, presetTypography } from 'unocss'

export default defineConfig({
  // 使用 UnoCSS 的预设
  presets: [
    presetUno(),        // UnoCSS 核心预设 (Tailwind CSS 兼容)
    presetIcons({       // 图标预设
      scale: 1.2,
      cdn: 'https://esm.sh/',
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(), // 排版预设
  ],

  // 主题配置 - 遵循 ui-ux-pro-max 设计规范
  theme: {
    colors: {
      primary: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16',
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
  },

  // Shortcuts 配置 - 常用样式组合
  shortcuts: {
    'btn': 'px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer',
    'btn-primary': 'btn bg-primary-500 text-white hover:bg-primary-600',
    'btn-ghost': 'btn bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
    'card': 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
    'input-base': 'w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500',
  },

  // 自动导入
  autoImport: true,
  
  // 规则配置
  rules: [
    ['text-primary', { color: '#22c55e' }],
  ],
})
