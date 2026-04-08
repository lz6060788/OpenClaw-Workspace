// https://nuxt.com/docs/api/configuration/nuxt-config
// OpenClaw Workspace - 个人开发后台

export default defineNuxtConfig({
  devtools: { enabled: false },

  // 部署在根路径
  base: '/',

  // 禁用 SSR，使用 SPA 模式
  ssr: false,

  // Element Plus + Nuxt UI (for color mode) + UnoCSS + Pinia
  // Note: @sidebase/nuxt-auth is disabled - using custom auth implementation
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
    presets: [
      [
        'unocss:preset-icons',
        {
          scale: 1.2,
          cdn: 'https://esm.sh/',
          extraProperties: {
            'display': 'inline-block',
            'vertical-align': 'middle',
          },
        },
      ],
    ],
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
      'text-body': 'text-sm text-zinc-400',
      'text-muted': 'text-xs text-zinc-500',

      // 圆角
      'rounded-card': 'rounded-xl',
      'rounded-btn': 'rounded-xl',
      'rounded-input': 'rounded-2xl',

      // 阴影
      'shadow-card': 'shadow-lg shadow-zinc-900/20',
      'shadow-card-lg': 'shadow-xl shadow-zinc-900/30',

      // 过渡
      'transition-all': 'transition-all duration-200 ease-out',

      // 图标尺寸
      'icon-xs': 'w-3 h-3',
      'icon-sm': 'w-4 h-4',
      'icon-md': 'w-5 h-5',
      'icon-lg': 'w-6 h-6',
      'icon-xl': 'w-8 h-8',

      // 按钮基础样式
      'btn-base': 'flex-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95',
      'btn-ghost': 'btn-base bg-zinc-800/50 border border-white/5 text-zinc-400 hover:bg-white/5 hover:text-zinc-300',
      'btn-primary': 'btn-base bg-gradient-to-br from-amber-400 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-500/20',
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
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'description', content: 'OpenClaw 个人开发后台' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'theme-color', content: '#18181B' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ],
    }
  },

  // 兼容性问题
  compatibilityDate: '2024-11-01',

  // 运行时配置
  runtimeConfig: {
    // 服务端私有配置
    // 注意：这些配置现在优先从数据库读取，环境变量作为后备
    // OPENCLAW 配置 - 可通过 /settings 页面配置
    openclawGatewayUrl: process.env.OPENCLAW_GATEWAY_URL || 'http://127.0.0.1:18789',
    openclawGatewayToken: process.env.OPENCLAW_GATEWAY_TOKEN || '',
    openclawAgentId: process.env.OPENCLAW_AGENT_ID || 'main',
    chatDataDir: process.env.CHAT_DATA_DIR || '/data/openclaw-chat',
    // Vercel 配置 - 可通过 /settings 页面配置
    vercelToken: process.env.VERCEL_TOKEN || '',
    vercelTeamId: process.env.VERCEL_TEAM_ID || '',
    vercelWebhookSecret: process.env.VERCEL_WEBHOOK_SECRET || '',
    // 认证配置
    auth: {
      // Session secret (使用环境变量)
      sessionSecret: process.env.AUTH_SECRET || 'change-me-in-production',
      // Session max age (7 days)
      sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE || '604800', 10),
      // Origin for production (required by nuxt-auth)
      origin: process.env.AUTH_ORIGIN || 'https://dev.theirises.cn',
    },
    // 客户端公开配置
    public: {
      openclawApiUrl: '/api/openclaw',
      // Auth public config
      auth: {
        // Base URL of the auth endpoints
        baseURL: '/api/auth',
        // Full URL for production
        origin: process.env.AUTH_ORIGIN || 'https://dev.theirises.cn',
        // Whether to enable credentials (cookies)
        credentials: true,
      }
    }
  },

  // Vite 配置
  vite: {
    server: {
      allowedHosts: true, // 允许所有主机
      hmr: {
        protocol: 'wss', // 生产环境使用 wss
        host: 'dev.theirises.cn',
        overlay: true
      },
      watch: {
        usePolling: true // 使用轮询以确保 HMR 在代理后正常工作
      }
    },
    // Worker 配置
    worker: {
      format: 'es'
    }
  },

  // Nitro 服务器配置
  nitro: {
    experimental: {
      wasm: true
    },
    // 生产环境监听配置
    // 允许从任何 IP 访问（Traefik 反向代理需要）
    listen: ['0.0.0.0:3000'],
    envPrefix: '',
    runtimeConfig: {
      nitro: {
        // 设置数据库路径
        DATABASE_URL: 'file:/root/.openclaw/workspace/OpenClaw-Workspace/openclaw.db'
      }
    }
  }
})
