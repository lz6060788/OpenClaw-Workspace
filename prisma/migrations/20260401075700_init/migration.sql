-- CreateTable
CREATE TABLE "GitHubProject" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "githubId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "description" TEXT,
    "defaultBranch" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "vercelProjectId" TEXT,
    "vercelUrl" TEXT,
    "vercelTeamId" TEXT,
    "buildCommand" TEXT DEFAULT 'npm run build',
    "outputDirectory" TEXT DEFAULT 'dist',
    "installCommand" TEXT DEFAULT 'npm install',
    "framework" TEXT,
    "lastSyncAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastDeployAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Deployment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "projectId" INTEGER NOT NULL,
    "vercelDeployId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "url" TEXT,
    "production" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completedAt" DATETIME,
    "duration" INTEGER,
    "buildLogs" TEXT,
    "errorMessage" TEXT,
    CONSTRAINT "Deployment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "GitHubProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "GitHubProject_githubId_key" ON "GitHubProject"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "GitHubProject_vercelProjectId_key" ON "GitHubProject"("vercelProjectId");

-- CreateIndex
CREATE INDEX "GitHubProject_owner_idx" ON "GitHubProject"("owner");

-- CreateIndex
CREATE INDEX "GitHubProject_vercelProjectId_idx" ON "GitHubProject"("vercelProjectId");

-- CreateIndex
CREATE UNIQUE INDEX "Deployment_vercelDeployId_key" ON "Deployment"("vercelDeployId");

-- CreateIndex
CREATE INDEX "Deployment_projectId_idx" ON "Deployment"("projectId");

-- CreateIndex
CREATE INDEX "Deployment_status_idx" ON "Deployment"("status");
