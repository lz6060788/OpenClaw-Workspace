/**
 * GET /api/projects/:id
 *
 * Get project details including deployment history.
 * Syncs deployment statuses from Vercel API.
 */

import { db } from '~/server/utils/db'
import vercel from '~/server/utils/vercel'

export default defineEventHandler(async (event) => {
  try {
    const projectId = parseInt(getRouterParam(event, 'id') || '')

    if (isNaN(projectId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid project ID'
      })
    }

    const project = await db.project.findByGithubId(projectId)

    if (!project) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found'
      })
    }

    // Sync non-final deployment statuses from Vercel
    if (project.deployments && project.deployments.length > 0) {
      const finalStatuses = ['READY', 'ERROR', 'CANCELED', 'DEACTIVATED']
      const pending = project.deployments.filter(d => !finalStatuses.includes(d.status.toUpperCase()))

      for (const dep of pending) {
        try {
          const vercelDep = await vercel.getVercelDeployment(dep.vercelDeployId)
          if (vercelDep.status !== dep.status) {
            await db.deployment.update(dep.id, {
              status: vercelDep.status,
              url: vercelDep.url ? ensureProtocol(vercelDep.url) : null,
              completedAt: vercelDep.finishedAt ? new Date(vercelDep.finishedAt) : null,
              duration: vercelDep.finishedAt
                ? Math.floor((vercelDep.finishedAt - dep.createdAt.getTime()) / 1000)
                : null,
            })
          }
        } catch (e) {
          console.error(`Failed to sync deployment ${dep.vercelDeployId}:`, e)
        }
      }

      // Reload project with updated deployments
      const updated = await db.project.findByGithubId(projectId)
      if (updated) {
        updated.deployments.forEach(d => {
          if (d.url) d.url = ensureProtocol(d.url)
        })
        return { success: true, project: updated }
      }
    }

    // Ensure URLs have protocol
    project.deployments.forEach(d => {
      if (d.url) d.url = ensureProtocol(d.url)
    })

    return {
      success: true,
      project
    }
  } catch (error) {
    console.error('Get project error:', error)

    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to get project'
    })
  }
})

function ensureProtocol(url: string): string {
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  return url
}
