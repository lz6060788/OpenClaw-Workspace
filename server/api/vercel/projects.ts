/**
 * GET /api/vercel/projects
 *
 * Get list of Vercel projects for the authenticated user/team.
 */

import vercel from '~/server/utils/vercel'

export default defineEventHandler(async (event) => {
  try {
    const projects = await vercel.getVercelProjects()

    return {
      success: true,
      projects: projects.map(p => ({
        id: p.id,
        name: p.name,
        url: p.url || null,
        framework: p.framework || null
      }))
    }
  } catch (error) {
    console.error('Get Vercel projects error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to get Vercel projects'
    })
  }
})
