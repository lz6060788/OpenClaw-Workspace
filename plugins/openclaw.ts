// plugins/openclaw.ts
import { OpenClawHttpClient } from '~/utils/openclaw-http'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  // 从配置中获取 API 地址
  const apiUrl = config.public.openclawApiUrl || '/api/openclaw'

  const client = new OpenClawHttpClient(apiUrl)

  // 提供全局访问
  nuxtApp.provide('openclaw', client)

  // 测试连接
  if (process.client) {
    client.testConnection().then(connected => {
      console.log('[OpenClaw] Connection test:', connected ? 'OK' : 'FAILED')
    }).catch(error => {
      console.error('[OpenClaw] Connection test failed:', error)
    })
  }
})
