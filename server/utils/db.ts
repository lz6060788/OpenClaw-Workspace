import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'file:/root/.openclaw/workspace/OpenClaw-Workspace/openclaw.db'
      }
    }
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Helper functions for common database operations
export const db = {
  // Project operations
  project: {
    // Find all projects
    findAll: () => prisma.gitHubProject.findMany({
      include: {
        deployments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
      orderBy: { updatedAt: 'desc' },
    }),

    // Find project by ID
    findById: (id: number) => prisma.gitHubProject.findUnique({
      where: { id },
      include: {
        deployments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    }),

    // Find project by GitHub ID
    findByGithubId: (githubId: number) => prisma.gitHubProject.findUnique({
      where: { githubId },
      include: {
        deployments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    }),

    // Find project by Vercel Project ID
    findByVercelId: (vercelProjectId: string) => prisma.gitHubProject.findUnique({
      where: { vercelProjectId },
    }),

    // Create or update project
    upsert: (data: {
      githubId: number
      name: string
      fullName: string
      owner: string
      description?: string | null
      defaultBranch: string
      isPrivate?: boolean
    }) => prisma.gitHubProject.upsert({
      where: { githubId: data.githubId },
      update: data,
      create: data,
    }),

    // Update project
    update: (id: number, data: {
      vercelProjectId?: string | null
      vercelUrl?: string | null
      vercelTeamId?: string | null
      openclawAgentId?: string | null
      buildCommand?: string | null
      outputDirectory?: string | null
      installCommand?: string | null
      framework?: string | null
      lastDeployAt?: Date
    }) => prisma.gitHubProject.update({
      where: { id },
      data,
    }),

    // Delete project
    delete: (id: number) => prisma.gitHubProject.delete({
      where: { id },
    }),
  },

  // Deployment operations
  deployment: {
    // Create deployment
    create: (data: {
      projectId: number
      vercelDeployId: string
      status: string
      url?: string | null
      production?: boolean
    }) => prisma.deployment.create({
      data,
    }),

    // Update deployment
    update: (id: number, data: {
      status?: string
      url?: string | null
      completedAt?: Date | null
      duration?: number | null
      buildLogs?: string | null
      errorMessage?: string | null
    }) => prisma.deployment.update({
      where: { id },
      data,
    }),

    // Find deployment by Vercel Deploy ID
    findByVercelId: (vercelDeployId: string) => prisma.deployment.findUnique({
      where: { vercelDeployId },
      include: {
        project: true,
      },
    }),

    // Find latest deployment for a project
    findLatestByProject: (projectId: number) => prisma.deployment.findFirst({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    }),

    // Find all deployments for a project
    findByProject: (projectId: number, limit = 20) => prisma.deployment.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }),
  },

  // Setting operations
  setting: {
    // Find all settings by category
    findByCategory: (category: string) => prisma.setting.findMany({
      where: { category },
    }),

    // Find setting by key
    findByKey: (key: string) => prisma.setting.findUnique({
      where: { key },
    }),

    // Find multiple settings by keys
    findByKeys: (keys: string[]) => prisma.setting.findMany({
      where: { key: { in: keys } },
    }),

    // Create or update setting
    upsert: (key: string, data: {
      value: string
      type: string
      category: string
      description?: string | null
      isSensitive?: boolean
      isEncrypted?: boolean
      defaultValue?: string | null
    }) => prisma.setting.upsert({
      where: { key },
      update: data,
      create: { key, ...data },
    }),

    // Batch upsert settings
    batchUpsert: (settings: Array<{
      key: string
      value: string
      type: string
      category: string
      description?: string | null
      isSensitive?: boolean
      isEncrypted?: boolean
      defaultValue?: string | null
    }>) => Promise.all(
      settings.map(setting =>
        prisma.setting.upsert({
          where: { key: setting.key },
          update: {
            value: setting.value,
            type: setting.type,
            category: setting.category,
            description: setting.description,
            isSensitive: setting.isSensitive ?? false,
            isEncrypted: setting.isEncrypted ?? false,
            defaultValue: setting.defaultValue,
          },
          create: {
            key: setting.key,
            value: setting.value,
            type: setting.type,
            category: setting.category,
            description: setting.description,
            isSensitive: setting.isSensitive ?? false,
            isEncrypted: setting.isEncrypted ?? false,
            defaultValue: setting.defaultValue,
          },
        })
      )
    ),

    // Delete setting by key
    delete: (key: string) => prisma.setting.delete({
      where: { key },
    }),

    // Find all settings with optional filters
    findAll: (filters?: {
      category?: string
      type?: string
      isSensitive?: boolean
    }) => prisma.setting.findMany({
      where: filters ? {
        ...(filters.category && { category: filters.category }),
        ...(filters.type && { type: filters.type }),
        ...(filters.isSensitive !== undefined && { isSensitive: filters.isSensitive }),
      } : undefined,
    }),
  },

  // User operations
  user: {
    // Find user by ID
    findById: (id: number) => prisma.user.findUnique({
      where: { id },
    }),

    // Find user by username
    findByUsername: (username: string) => prisma.user.findUnique({
      where: { username },
    }),

    // Create user
    create: (data: {
      username: string
      password: string
    }) => prisma.user.create({
      data,
    }),

    // Update user
    update: (id: number, data: {
      password?: string
    }) => prisma.user.update({
      where: { id },
      data,
    }),

    // Delete user
    delete: (id: number) => prisma.user.delete({
      where: { id },
    }),
  },

  // Session operations
  session: {
    // Find session by token
    findByToken: (token: string) => prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    }),

    // Create session
    create: (data: {
      userId: number
      token: string
      expiresAt: Date
    }) => prisma.session.create({
      data,
    }),

    // Delete session by token
    deleteByToken: (token: string) => prisma.session.delete({
      where: { token },
    }),

    // Delete all sessions for a user
    deleteByUserId: (userId: number) => prisma.session.deleteMany({
      where: { userId },
    }),

    // Delete expired sessions
    deleteExpired: () => prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    }),
  },
}

export default prisma
