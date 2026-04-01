import { defineNitroPlugin } from 'nitropack/runtime'

export default defineNitroPlugin((nitroApp) => {
  // Initialize database connection
  // The Prisma Client is already created in server/utils/db.ts
  // This plugin ensures it's available throughout the application lifecycle

  // Graceful shutdown
  nitroApp.hooks.hook('close', async () => {
    const { prisma } = await import('../utils/db')
    await prisma.$disconnect()
  })
})
