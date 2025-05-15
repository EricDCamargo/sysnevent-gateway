import { Router } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import dotenv from 'dotenv'
dotenv.config()
const router = Router()

// Proxy definitions
router.use(
  '/participants',
  createProxyMiddleware({
    target: process.env.PARTICIPANT_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/participants': '' }
  })
)

router.use(
  '/events',
  createProxyMiddleware({
    target: process.env.EVENT_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/events': '' }
  })
)

router.use(
  '/tickets',
  createProxyMiddleware({
    target: process.env.TICKET_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/tickets': '' }
  })
)

router.use(
  '/reports',
  createProxyMiddleware({
    target: process.env.REPORT_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/reports': '' }
  })
)

export { router as gatewayRouter }
