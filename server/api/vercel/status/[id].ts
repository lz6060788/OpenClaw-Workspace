/**
 * GET /api/vercel/status/:id
 *
 * Get deployment status for a project.
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

    // Get project from database (projectId from frontend is GitHub ID)
    const project = await db.project.findByGithubId(projectId)
    if (!project) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found in database. Please configure the project first.'
      })
    }

    // Get latest deployment from database (use database ID)
    const latestDeployment = await db.deployment.findLatestByProject(project.id)

    if (!latestDeployment) {
      return {
        status: 'not_deployed',
        url: project.vercelUrl || null,
        latestDeployment: null
      }
    }

    // If deployment is still building, check Vercel API for latest status
    let deploymentStatus = latestDeployment.status
    let deploymentUrl = latestDeployment.url

    if (latestDeployment.status === 'building' || latestDeployment.status === 'queued') {
      try {
        const vercelDeployment = await vercel.getVercelDeployment(latestDeployment.vercelDeployId)

        // Update database with latest status
        if (vercelDeployment.status !== latestDeployment.status) {
          await db.deployment.update(latestDeployment.id, {
            status: vercelDeployment.status,
            url: vercelDeployment.url || null,
            completedAt: vercelDeployment.finishedAt ? new Date(vercelDeployment.finishedAt) : null,
            duration: vercelDeployment.finishedAt
              ? Math.floor((vercelDeployment.finishedAt - latestDeployment.createdAt.getTime()) / 1000)
              : null,
          })

          deploymentStatus = vercelDeployment.status
          deploymentUrl = vercelDeployment.url || null
        }
      } catch (error) {
        console.error('Failed to fetch deployment status from Vercel:', error)
      }
    }

    return {
      status: deploymentStatus,
      url: deploymentUrl || project.vercelUrl || null,
      latestDeployment: {
        id: latestDeployment.id,
        vercelDeployId: latestDeployment.vercelDeployId,
        status: deploymentStatus,
        createdAt: latestDeployment.createdAt.toISOString(),
        completedAt: latestDeployment.completedAt?.toISOString() || null,
        url: deploymentUrl || null,
        production: latestDeployment.production,
      }
    }
  } catch (error) {
    console.error('Get deployment status error:', error)

    // Re-throw HTTP errors
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to get deployment status'
    })
  }
})
