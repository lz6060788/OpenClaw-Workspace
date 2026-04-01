/**
 * POST /api/projects/configure
 *
 * Configure Vercel and build settings for a project.
 */

import { db } from '~/server/utils/db'

interface ConfigureRequest {
  projectId: number
  vercelProjectId?: string
  vercelUrl?: string
  vercelTeamId?: string
  buildCommand?: string
  outputDirectory?: string
  installCommand?: string
  framework?: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<ConfigureRequest>(event)

    // Validate request body
    if (!body.projectId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'projectId is required'
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

    // Prepare update data
    const updateData: {
      vercelProjectId?: string | null
      vercelUrl?: string | null
      vercelTeamId?: string | null
      buildCommand?: string | null
      outputDirectory?: string | null
      installCommand?: string | null
      framework?: string | null
    } = {}

    // Only include fields that are explicitly provided
    if (body.vercelProjectId !== undefined) updateData.vercelProjectId = body.vercelProjectId || null
    if (body.vercelUrl !== undefined) updateData.vercelUrl = body.vercelUrl || null
    if (body.vercelTeamId !== undefined) updateData.vercelTeamId = body.vercelTeamId || null
    if (body.buildCommand !== undefined) updateData.buildCommand = body.buildCommand || null
    if (body.outputDirectory !== undefined) updateData.outputDirectory = body.outputDirectory || null
    if (body.installCommand !== undefined) updateData.installCommand = body.installCommand || null
    if (body.framework !== undefined) updateData.framework = body.framework || null

    // Update project configuration
    const updatedProject = await db.project.update(body.projectId, updateData)

    return {
      success: true,
      project: updatedProject
    }
  } catch (error) {
    console.error('Project configuration error:', error)

    // Re-throw HTTP errors
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to configure project'
    })
  }
})
