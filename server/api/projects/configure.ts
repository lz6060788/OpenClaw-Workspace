/**
 * POST /api/projects/configure
 *
 * Configure Vercel and build settings for a project.
 */

import { db } from '~/server/utils/db'

interface ConfigureRequest {
  projectId: number
  projectName?: string
  projectFullName?: string
  vercelProjectId?: string
  vercelUrl?: string
  vercelTeamId?: string
  openclawAgentId?: string
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

    // Find project by GitHub ID (projectId from frontend is GitHub ID)
    let existingProject = await db.project.findByGithubId(body.projectId)

    // Auto-create project in DB if not exists
    if (!existingProject) {
      if (!body.projectName || !body.projectFullName) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Project not found in database. Provide projectName and projectFullName to auto-create.'
        })
      }
      const nameParts = body.projectFullName.split('/')
      existingProject = await db.project.upsert({
        githubId: body.projectId,
        name: body.projectName,
        fullName: body.projectFullName,
        owner: nameParts[0] || '',
        defaultBranch: 'main',
      })
    }

    // Prepare update data
    const updateData: {
      vercelProjectId?: string | null
      vercelUrl?: string | null
      vercelTeamId?: string | null
      openclawAgentId?: string | null
      buildCommand?: string | null
      outputDirectory?: string | null
      installCommand?: string | null
      framework?: string | null
    } = {}

    // Only include fields that are explicitly provided
    if (body.vercelProjectId !== undefined) updateData.vercelProjectId = body.vercelProjectId || null
    if (body.vercelUrl !== undefined) updateData.vercelUrl = body.vercelUrl || null
    if (body.vercelTeamId !== undefined) updateData.vercelTeamId = body.vercelTeamId || null
    if (body.openclawAgentId !== undefined) updateData.openclawAgentId = body.openclawAgentId || null
    if (body.buildCommand !== undefined) updateData.buildCommand = body.buildCommand || null
    if (body.outputDirectory !== undefined) updateData.outputDirectory = body.outputDirectory || null
    if (body.installCommand !== undefined) updateData.installCommand = body.installCommand || null
    if (body.framework !== undefined) updateData.framework = body.framework || null

    // Update project configuration (use database ID, not GitHub ID)
    const updatedProject = await db.project.update(existingProject.id, updateData)

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
