import prisma from '~/server/services/prisma'

// 获取任务详情
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Task ID is required'
    })
  }
  
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      logs: {
        orderBy: { timestamp: 'desc' },
        take: 100
      },
      steps: {
        orderBy: { order: 'asc' }
      }
    }
  })
  
  if (!task) {
    throw createError({
      statusCode: 404,
      message: 'Task not found'
    })
  }
  
  // 解析 context JSON
  if (task.context) {
    task.context = JSON.parse(task.context)
  }
  
  return task
})
