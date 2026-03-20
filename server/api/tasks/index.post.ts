import prisma from '~/server/services/prisma'
import fs from 'node:fs'
import path from 'node:path'

// 创建新任务
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { name, description, owner, context } = body
  
  // 创建数据库记录
  const task = await prisma.task.create({
    data: {
      name,
      description,
      owner,
      context: context ? JSON.stringify(context) : null,
      status: 'pending',
    }
  })
  
  // 创建任务目录 /workspace/tasks/{task-id}/
  const taskDir = path.join('/workspace/tasks', task.id)
  fs.mkdirSync(taskDir, { recursive: true })
  
  // 创建子目录
  fs.mkdirSync(path.join(taskDir, 'logs'), { recursive: true })
  fs.mkdirSync(path.join(taskDir, 'context'), { recursive: true })
  fs.mkdirSync(path.join(taskDir, 'results'), { recursive: true })
  
  return task
})
