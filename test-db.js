import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function test() {
  try {
    // 测试 Setting 表是否存在
    const result = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`
    console.log('数据库表:', result)

    // 尝试查询 settings
    const settings = await prisma.setting.findMany()
    console.log('Settings:', settings.length, '条')
  } catch (error) {
    console.error('错误:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

test()
