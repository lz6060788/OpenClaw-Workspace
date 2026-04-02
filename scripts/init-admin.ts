import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

// Simple hash function for initial admin
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'openclaw-salt').digest('hex')
}

async function createAdmin() {
  try {
    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    })

    if (existingAdmin) {
      console.log('✓ Admin account already exists')
      await prisma.$disconnect()
      return
    }

    // Create admin account
    const password = hashPassword('admin')
    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        password
      }
    })

    console.log('✓ Admin account created successfully!')
    console.log('  Username:', admin.username)
    console.log('  Password: admin')
    console.log('  ⚠️  Please change the password after first login')
  } catch (error) {
    console.error('✗ Error creating admin account:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
