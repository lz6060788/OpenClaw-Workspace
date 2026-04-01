/**
 * POST /api/vercel/link
 *
 * Link a GitHub project to a Vercel project.
 */

import { db } from '~/server/utils/db'
import vercel from '~/server/utils/vercel'

interface LinkRequest {
  projectId: number
  vercelProjectId: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<LinkRequest>(event)

    // Validate request body
    if (!body.projectId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'projectId is required'
      })
    }

    if (!body.vercelProjectId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'vercelProjectId is required'
      })
    }

    // Check if project exists
    const existingProject = await db.project.findById(body.projectId)
    if (!existingProject) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Project not found'
      })
    }

    // Get Vercel project details
    const vercelProject = await vercel.getVercelProject(body.vercelProjectId)

    // Update project with Vercel configuration
    const updatedProject = await db.project.update(body.projectId, {
      vercelProjectId: body.vercelProjectId,
      vercelUrl: vercelProject.url || null,
      vercelTeamId: process.env.VERCEL_TEAM_ID || null,
      framework: vercelProject.framework || null,
      buildCommand: vercelProject.buildCommand || null,
      outputDirectory: vercelProject.outputDirectory || null,
      installCommand: vercelProject.installCommand || null,
    })

    return {
      success: true,
      project: updatedProject
    }
  } catch (error) {
    console.error('Link Vercel project error:', error)

    // Re-throw HTTP errors
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to link Vercel project'
    })
  }
})
