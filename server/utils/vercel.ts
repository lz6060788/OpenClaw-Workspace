/**
 * Vercel API Integration Module
 * Handles all Vercel API operations for OpenClaw Workspace
 */

const VERCEL_API_BASE = 'https://api.vercel.com'
const VERCEL_API_VERSION = 'v8'

export interface VercelProject {
  id: string
  name: string
  url?: string
  framework?: string
  buildCommand?: string
  outputDirectory?: string
  installCommand?: string
  devCommand?: string
}

export interface VercelDeployment {
  id: string
  status: 'queued' | 'building' | 'ready' | 'error' | 'cancelled' | 'deactivated'
  url?: string
  project: VercelProject
  createdAt: number
  updatedAt?: number
  finishedAt?: number
  production?: boolean
  target?: string
}

export interface VercelDeploymentCreateParams {
  projectId: string
  branch?: string
  production?: boolean
}

export interface VercelProjectCreateParams {
  name: string
  framework?: string
  buildCommand?: string
  outputDirectory?: string
  installCommand?: string
  devCommand?: string
  rootDirectory?: string
}

/**
 * Get Vercel API configuration from environment
 */
function getVercelConfig() {
  const token = process.env.VERCEL_TOKEN
  const teamId = process.env.VERCEL_TEAM_ID

  if (!token) {
    throw new Error('VERCEL_TOKEN environment variable is not set')
  }

  return { token, teamId }
}

/**
 * Make a request to Vercel API
 */
async function vercelFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { token, teamId } = getVercelConfig()

  const url = new URL(`${VERCEL_API_BASE}${endpoint}`)
  if (teamId) {
    url.searchParams.set('teamId', teamId)
  }

  const response = await fetch(url.toString(), {
    ...options,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Vercel API error: ${response.status} ${response.statusText} - ${error}`)
  }

  return response.json()
}

/**
 * Get all Vercel projects for the authenticated user/team
 */
export async function getVercelProjects(): Promise<VercelProject[]> {
  const response = await vercelFetch<{
    projects: VercelProject[]
  }>(`/${VERCEL_API_VERSION}/projects`)

  return response.projects
}

/**
 * Get a specific Vercel project by ID
 */
export async function getVercelProject(projectId: string): Promise<VercelProject> {
  return vercelFetch<VercelProject>(`/${VERCEL_API_VERSION}/projects/${projectId}`)
}

/**
 * Create a new Vercel project
 */
export async function createVercelProject(
  params: VercelProjectCreateParams
): Promise<VercelProject> {
  return vercelFetch<VercelProject>(`/${VERCEL_API_VERSION}/projects`, {
    method: 'POST',
    body: JSON.stringify({
      name: params.name,
      framework: params.framework,
      buildCommand: params.buildCommand,
      outputDirectory: params.outputDirectory,
      installCommand: params.installCommand,
      devCommand: params.devCommand,
      rootDirectory: params.rootDirectory,
    }),
  })
}

/**
 * Get deployments for a specific Vercel project
 */
export async function getVercelDeployments(
  projectId: string,
  limit = 20
): Promise<VercelDeployment[]> {
  const response = await vercelFetch<{
    deployments: VercelDeployment[]
  }>(`/${VERCEL_API_VERSION}/v6/integrations/github/${projectId}/deployments?limit=${limit}`)

  return response.deployments || []
}

/**
 * Get a specific deployment by ID
 */
export async function getVercelDeployment(
  deploymentId: string
): Promise<VercelDeployment> {
  return vercelFetch<VercelDeployment>(`/${VERCEL_API_VERSION}/v13/deployments/${deploymentId}`)
}

/**
 * Create a new deployment for a project
 */
export async function createDeployment(
  params: VercelDeploymentCreateParams
): Promise<VercelDeployment> {
  const { projectId, branch = 'main', production = false } = params

  return vercelFetch<VercelDeployment>(`/${VERCEL_API_VERSION}/v13/deployments`, {
    method: 'POST',
    body: JSON.stringify({
      project: projectId,
      branch,
      target: production ? 'production' : 'preview',
    }),
  })
}

/**
 * Get the latest deployment for a project
 */
export async function getLatestDeployment(
  projectId: string
): Promise<VercelDeployment | null> {
  try {
    const deployments = await getVercelDeployments(projectId, 1)
    return deployments[0] || null
  } catch (error) {
    console.error('Failed to get latest deployment:', error)
    return null
  }
}

/**
 * Cancel a deployment
 */
export async function cancelDeployment(deploymentId: string): Promise<void> {
  await vercelFetch(`/${VERCEL_API_VERSION}/v13/deployments/${deploymentId}/cancel`, {
    method: 'POST',
  })
}

/**
 * Redeploy a specific deployment
 */
export async function redeploy(deploymentId: string): Promise<VercelDeployment> {
  const deployment = await getVercelDeployment(deploymentId)

  return vercelFetch<VercelDeployment>(`/${VERCEL_API_VERSION}/v13/deployments`, {
    method: 'POST',
    body: JSON.stringify({
      project: deployment.project.id,
      branch: deployment.target === 'production' ? 'main' : 'branch',
      target: deployment.target || 'preview',
    }),
  })
}

/**
 * Delete a Vercel project
 */
export async function deleteVercelProject(projectId: string): Promise<void> {
  await vercelFetch(`/${VERCEL_API_VERSION}/projects/${projectId}`, {
    method: 'DELETE',
  })
}

/**
 * Verify Vercel API connection
 */
export async function verifyVercelConnection(): Promise<boolean> {
  try {
    await getVercelProjects()
    return true
  } catch (error) {
    console.error('Vercel connection verification failed:', error)
    return false
  }
}

export default {
  getVercelProjects,
  getVercelProject,
  createVercelProject,
  getVercelDeployments,
  getVercelDeployment,
  createDeployment,
  getLatestDeployment,
  cancelDeployment,
  redeploy,
  deleteVercelProject,
  verifyVercelConnection,
}
