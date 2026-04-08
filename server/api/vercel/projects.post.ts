/**
 * POST /api/vercel/projects
 *
 * Create a new Vercel project.
 */

import vercel from '~/server/utils/vercel'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, framework, buildCommand, outputDirectory, installCommand, rootDirectory } = body

    if (!name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Project name is required',
      })
    }

    const project = await vercel.createVercelProject({
      name,
      framework,
      buildCommand,
      outputDirectory,
      installCommand,
      rootDirectory,
    })

    return {
      success: true,
      project: {
        id: project.id,
        name: project.name,
        url: project.url || null,
        framework: project.framework || null,
      },
    }
  } catch (error) {
    console.error('Create Vercel project error:', error)
    throw createError({
      statusCode: error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to create Vercel project',
    })
  }
})
