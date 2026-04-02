/**
 * POST /api/settings/github-path/migrate
 *
 * Migrate GitHub projects from old path to new path
 */

import { existsSync, readdirSync, statSync } from 'fs'
import { readdir, readFile, writeFile, mkdir, rename, unlink } from 'fs/promises'
import { join, resolve, dirname } from 'path'
import { execSync } from 'child_process'

export default defineEventHandler(async (event) => {
  const { from, to, action } = await readBody(event)

  if (!from || !to || !action) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required parameters: from, to, action'
    })
  }

  const fromPath = resolve(from)
  const toPath = resolve(to)

  // Check if old path exists
  if (!existsSync(fromPath)) {
    return {
      success: true,
      message: 'Old path does not exist, nothing to migrate'
    }
  }

  // Find all git repositories in old path
  const projects = await findGitRepositories(fromPath)

  if (projects.length === 0) {
    return {
      success: true,
      message: 'No projects found in old path',
      projects: []
    }
  }

  try {
    switch (action) {
      case 'keep':
        // Keep old projects, don't do anything
        return {
          success: true,
          message: 'Old projects preserved',
          projects,
          action: 'keep'
        }

      case 'move':
        // Move projects to new path
        await moveProjects(projects, fromPath, toPath)
        return {
          success: true,
          message: `Successfully moved ${projects.length} project(s)`,
          projects,
          action: 'move'
        }

      case 'delete':
        // Delete old projects
        await deleteProjects(projects, fromPath)
        return {
          success: true,
          message: `Successfully deleted ${projects.length} project(s)`,
          projects,
          action: 'delete'
        }

      default:
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid action: ${action}`
        })
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Migration failed: ${error.message}`
    })
  }
})

/**
 * Find all git repositories in a directory
 */
async function findGitRepositories(basePath: string): Promise<string[]> {
  const projects: string[] = []
  const entries = await readdir(basePath, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) continue

    const fullPath = join(basePath, entry.name)

    // Check if it's a git repository
    const gitDir = join(fullPath, '.git')
    if (existsSync(gitDir)) {
      projects.push(entry.name)
      continue
    }

    // Recursively search in subdirectories (one level deep)
    try {
      const subEntries = await readdir(fullPath, { withFileTypes: true })
      for (const subEntry of subEntries) {
        if (!subEntry.isDirectory()) continue

        const subGitDir = join(fullPath, subEntry.name, '.git')
        if (existsSync(subGitDir)) {
          projects.push(join(entry.name, subEntry.name))
        }
      }
    } catch {
      // Ignore permission errors
    }
  }

  return projects
}

/**
 * Move projects from old path to new path
 */
async function moveProjects(projects: string[], from: string, to: string) {
  // Ensure new path exists
  await mkdir(to, { recursive: true })

  for (const project of projects) {
    const fromPath = join(from, project)
    const toPath = join(to, project)

    // Create parent directory if needed
    const parentDir = dirname(toPath)
    await mkdir(parentDir, { recursive: true })

    // Move directory
    await rename(fromPath, toPath)
  }
}

/**
 * Delete projects from path
 */
async function deleteProjects(projects: string[], basePath: string) {
  for (const project of projects) {
    const projectPath = join(basePath, project)

    // Delete directory recursively
    await deleteDirectory(projectPath)
  }
}

/**
 * Delete directory recursively
 */
async function deleteDirectory(dirPath: string) {
  const entries = await readdir(dirPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name)

    if (entry.isDirectory()) {
      await deleteDirectory(fullPath)
    } else {
      await unlink(fullPath)
    }
  }

  // Delete the directory itself
  await import('fs/promises').then(m => m.rmdir(dirPath))
}
