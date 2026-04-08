/**
 * GET /api/projects/:id
 *
 * Get project details including deployment history.
 */

import { db } from '~/server/utils/db'

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

    return {
      success: true,
      project
    }
  } catch (error) {
    console.error('Get project error:', error)

    // Re-throw HTTP errors
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to get project'
    })
  }
})
