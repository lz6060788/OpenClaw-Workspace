/**
 * GET /api/projects/sync
 *
 * Sync GitHub projects to the database.
 * This endpoint retrieves projects from local storage and syncs them to the database.
 */

import { db } from '~/server/utils/db'

interface GitHubProjectData {
  id: number
  name: string
  fullName: string
  owner: string
  description?: string
  defaultBranch: string
  isPrivate: boolean
}

export default defineEventHandler(async (event) => {
  try {
    // Get the project store from runtime config or session
    // For now, we'll sync from a simple storage mechanism
    // In production, this would sync from GitHub API or local project store

    const storage = useStorage('projects')
    const projects: GitHubProjectData[] = await storage.getItem('list') || []

    if (!projects.length) {
      return {
        synced: 0,
        updated: 0,
        projects: [],
        message: 'No projects found to sync'
      }
    }

    let syncedCount = 0
    let updatedCount = 0
    const syncedProjects = []

    for (const projectData of projects) {
      try {
        const project = await db.project.upsert({
          githubId: projectData.id,
          name: projectData.name,
          fullName: projectData.fullName,
          owner: projectData.owner,
          description: projectData.description || null,
          defaultBranch: projectData.defaultBranch,
          isPrivate: projectData.isPrivate,
        })

        syncedCount++
        syncedProjects.push(project)

        // Check if it was an update (project has deployments)
        const existingProject = await db.project.findByGithubId(projectData.id)
        if (existingProject && existingProject.createdAt.getTime() !== project.createdAt.getTime()) {
          updatedCount++
        }
      } catch (error) {
        console.error(`Failed to sync project ${projectData.fullName}:`, error)
      }
    }

    return {
      synced: syncedCount,
      updated: updatedCount,
      projects: syncedProjects,
      message: `Successfully synced ${syncedCount} projects (${updatedCount} updated)`
    }
  } catch (error) {
    console.error('Project sync error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to sync projects'
    })
  }
})
