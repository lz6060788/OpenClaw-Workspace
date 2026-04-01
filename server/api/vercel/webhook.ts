/**
 * POST /api/vercel/webhook
 *
 * Receive deployment status updates from Vercel webhooks.
 */

import { createHmac, timingSafeEqual } from 'crypto'
import { db } from '~/server/utils/db'
import { H3Event } from 'h3'

interface VercelWebhookPayload {
  event: 'deployment.succeeded' | 'deployment.failed' | 'deployment.created' | 'deployment.ready'
  payload: {
    deployment: {
      id: string
      url?: string
      project: {
        id: string
        name: string
      }
      status: string
      createdAt: number
      finishedAt?: number
      target?: string
    }
  }
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Verify webhook secret if configured
    const webhookSecret = process.env.VERCEL_WEBHOOK_SECRET
    if (webhookSecret) {
      const signature = getHeader(event, 'x-vercel-signature')
      if (!signature) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Missing webhook signature'
        })
      }

      // Read raw body for signature verification
      const rawBody = await readRawBody(event)
      if (!rawBody) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Missing request body'
        })
      }

      // Calculate expected signature
      const expectedSignature = createHmac('sha1', webhookSecret)
        .update(rawBody)
        .digest('hex')

      // Verify signature using timing-safe comparison
      if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        throw createError({
          statusCode: 401,
          statusMessage: 'Invalid webhook signature'
        })
      }
    }

    const body = await readBody<VercelWebhookPayload>(event)

    const { deployment } = body.payload

    // Find deployment by Vercel deployment ID
    const deploymentRecord = await db.deployment.findByVercelId(deployment.id)

    if (!deploymentRecord) {
      console.warn(`Deployment ${deployment.id} not found in database`)
      return { success: true, message: 'Deployment not found' }
    }

    // Update deployment status
    await db.deployment.update(deploymentRecord.id, {
      status: deployment.status,
      url: deployment.url || null,
      completedAt: deployment.finishedAt ? new Date(deployment.finishedAt) : null,
      duration: deployment.finishedAt
        ? Math.floor((deployment.finishedAt - deployment.createdAt) / 1000)
        : null,
    })

    // Update project's last deploy timestamp if successful
    if (body.event === 'deployment.succeeded' || deployment.status === 'ready') {
      await db.project.update(deploymentRecord.projectId, {
        lastDeployAt: new Date(),
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Webhook processing error:', error)

    // Still return success to avoid webhook retry loops
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process webhook'
    }
  }
})
