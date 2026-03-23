import prisma from '~/server/services/prisma'

// 获取任务列表
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const status = query.status as string | undefined
  
  const where = status && status !== 'all' ? { status } : {}
  
  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { logs: true, steps: true }
      }
    }
  })
  
  return tasks
})
