/**
 * POST /api/vercel/deploy
 *
 * Trigger a new deployment for a project.
 */

import { db } from '~/server/utils/db'
import vercel from '~/server/utils/vercel'

interface DeployRequest {
  projectId: number
  branch?: string
  production?: boolean
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<DeployRequest>(event)

    // Validate request body
    if (!body.projectId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'projectId is required'
      })
    }

    // Get project from database (projectId from frontend is GitHub ID)
    const project = await db.project.findByGithubId(body.projectId)
    if (!project) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found in database. Please configure the project first.'
      })
    }

    // Check if project is linked to Vercel
    if (!project.vercelProjectId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Project is not linked to a Vercel project'
      })
    }

    // Create deployment via Vercel API
    const deployment = await vercel.createDeployment({
      projectId: project.vercelProjectId,
      branch: body.branch || project.defaultBranch,
      production: body.production || false,
    })

    // Create deployment record in database
    const deploymentRecord = await db.deployment.create({
      projectId: project.id,
      vercelDeployId: deployment.id,
      status: deployment.status,
      url: deployment.url || null,
      production: deployment.production || false,
    })

    // Update project's last deploy timestamp
    await db.project.update(project.id, {
      lastDeployAt: new Date(),
    })

    return {
      success: true,
      deploymentId: deploymentRecord.id,
      vercelDeploymentId: deployment.id,
      status: deployment.status,
      url: deployment.url || null
    }
  } catch (error) {
    console.error('Create deployment error:', error)

    // Re-throw HTTP errors
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to create deployment'
    })
  }
})
