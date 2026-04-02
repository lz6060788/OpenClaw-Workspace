import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkTables() {
  try {
    // Get all tables
    const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`
    console.log('Tables in database:', tables)

    // Try to find users
    const users = await prisma.user.findMany()
    console.log('Users found:', users.length)
    if (users.length > 0) {
      console.log('First user:', users[0].username)
    }
  } catch (error: any) {
    console.error('Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

checkTables()
