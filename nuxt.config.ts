// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: false },
  
  // 禁用 SSR，使用 SPA 模式
  ssr: false,
  
  modules: ['@nuxt/ui', '@unocss/nuxt'],
  
  // 引入自定义 CSS
  css: ['~/assets/css/main.css'],
  
  // Nuxt UI 配置
  ui: {
    global: true,
    fonts: false,
  },
  
  // UnoCSS 配置
  uno: {
    shortcuts: {
      'btn': 'px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer',
      'btn-primary': 'btn bg-green-500 text-white hover:bg-green-600',
    },
  },
  
  // 应用配置
  app: {
    head: {
      title: 'OpenClaw Workspace',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'OpenClaw Workspace Dashboard' }
      ],
    }
  },
  
  // 颜色模式配置
  colorMode: {
    preference: 'system',
    fallback: 'light',
  },
  
  // 兼容性问题
  compatibilityDate: '2024-11-01',
})
