import prisma from '~/server/services/prisma'

// 更新任务状态
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Task ID is required'
    })
  }
  
  const { status } = body
  
  const updateData: any = { status }
  
  // 如果任务完成或失败，记录完成时间
  if (status === 'completed' || status === 'failed') {
    updateData.completedAt = new Date()
  }
  
  const task = await prisma.task.update({
    where: { id },
    data: updateData
  })
  
  return task
})
