/**
 * POST /api/init-admin
 *
 * Initialize default admin account (admin/admin)
 * This endpoint should be disabled in production after first use
 */

import bcrypt from 'bcrypt'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // Check if admin already exists
  const existingAdmin = await db.user.findByUsername('admin')

  if (existingAdmin) {
    return {
      success: false,
      message: 'Admin account already exists'
    }
  }

  // Create admin account with default password
  const password = await bcrypt.hash('admin', 10)

  const admin = await db.user.create({
    username: 'admin',
    password
  })

  return {
    success: true,
    message: 'Admin account created successfully',
    user: {
      id: admin.id,
      username: admin.username
    }
  }
})
