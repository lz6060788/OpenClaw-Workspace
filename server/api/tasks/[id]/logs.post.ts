import prisma from '~/server/services/prisma'

// 添加任务日志
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Task ID is required'
    })
  }
  
  const { content, type = 'info' } = body
  
  const log = await prisma.taskLog.create({
    data: {
      taskId: id,
      content,
      type
    }
  })
  
  return log
})
