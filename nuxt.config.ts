// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // 禁用 SSR，使用 SPA 模式
  ssr: false,
  
  modules: ['@nuxt/ui'],
  
  // Nuxt UI 配置
  ui: {
    global: true,
    icons: ['lucide', 'heroicons'],
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
    storage: 'localStorage',
    storageKey: 'openclaw-color-mode',
  },
  
  // 兼容性问题
  compatibilityDate: '2024-11-01',
})
