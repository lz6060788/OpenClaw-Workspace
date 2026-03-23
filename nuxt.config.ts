// https://nuxt.com/docs/api/configuration/nuxt-config
// OpenClaw Workspace - 个人开发后台

export default defineNuxtConfig({
  devtools: { enabled: false },

  // 部署在根路径
  base: '/',

  // 禁用 SSR，使用 SPA 模式
  ssr: false,

  // Nuxt UI v3 + UnoCSS + Pinia
  modules: ['@nuxt/ui', '@unocss/nuxt', '@pinia/nuxt'],

  // 引入自定义 CSS
  css: ['~/assets/css/main.css'],

  // Nuxt UI 配置
  ui: {
    global: true,
    fonts: false,
  },

  // UnoCSS 配置 - 设计系统
  uno: {
    presets: [],
    shortcuts: {
      // 布局
      'flex-center': 'flex items-center justify-center',
      'flex-between': 'flex items-center justify-between',
      'flex-col-center': 'flex flex-col items-center justify-center',
      'flex-col-between': 'flex flex-col items-center justify-between',

      // 间距
      'p-card': 'p-5',
      'p-card-lg': 'p-6',
      'p-card-xl': 'p-8',
      'gap-card': 'gap-4',
      'gap-card-lg': 'gap-6',

      // 文字
      'text-title': 'text-lg font-semibold',
      'text-subtitle': 'text-sm font-medium',
      'text-body': 'text-sm text-gray-400',
      'text-muted': 'text-xs text-gray-500',

      // 圆角
      'rounded-card': 'rounded-xl',
      'rounded-btn': 'rounded-lg',
      'rounded-input': 'rounded-lg',

      // 阴影
      'shadow-card': 'shadow-lg shadow-gray-900/20',
      'shadow-card-lg': 'shadow-xl shadow-gray-900/30',

      // 过渡
      'transition-all': 'transition-all duration-200 ease-out',
    },
    theme: {
      colors: {
        // 设计系统色彩
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
    },
  },

  // 应用配置
  app: {
    head: {
      title: 'OpenClaw Workspace',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'OpenClaw 个人开发后台' }
      ],
    }
  },

  // 兼容性问题
  compatibilityDate: '2024-11-01',
})
