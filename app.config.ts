// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineAppConfig({
  ui: {
    // 主题色配置 - OpenClaw 品牌色
    colors: {
      primary: 'cyan', // OpenClaw 主色
      secondary: 'violet',
      success: 'green',
      warning: 'amber',
      error: 'red',
      info: 'blue',
    },
    
    // 默认变体
    theme: {
      defaultVariants: {
        color: 'primary',
        variant: 'solid',
        size: 'md',
      },
    },
    
    // 幻灯片侧边栏
    slideover: {
      width: 'max-w-16rem',
    },
  },
  
  // 应用级配置
  app: {
    title: 'OpenClaw Workspace',
    description: 'OpenClaw Workspace Dashboard',
  },
})
