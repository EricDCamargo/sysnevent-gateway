import { Router } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import type { IncomingMessage, ServerResponse } from 'http'
import dotenv from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import { Request as ExpressRequest } from 'express'

dotenv.config()
const router = Router()

router.use((req: Request, res: Response, next: NextFunction) => {
  const start = performance.now()

  console.log('\n--- Incoming Request ---')
  console.log(`[METHOD] ${req.method}`)
  console.log(`[URL] ${req.originalUrl}`)
  console.log('[HEADERS]', req.headers)

  res.on('finish', () => {
    const duration = (performance.now() - start).toFixed(2)
    console.log(`[STATUS] ${res.statusCode}`)
    console.log(`[DURATION] ${duration} ms`)
    console.log('------------------------\n')
  })

  next()
})

const proxyWithLogging = (
  prefix: string,
  target: string,
  preservePath: boolean
) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: preservePath ? undefined : { [`^${prefix}`]: '' },
    on: {
      proxyReq: (proxyReq, req: IncomingMessage, res: ServerResponse) => {
        const expressReq = req as ExpressRequest
        console.log(`[PROXY] Forwarding to: ${target}${expressReq.originalUrl}`)
      },
      proxyRes: (proxyRes, req, res) => {
        console.log(
          `[PROXY] Response from target with status ${proxyRes.statusCode}`
        )
      }
    }
  })

// === PARTICIPANT SERVICE ===
router.use(
  '/participants',
  proxyWithLogging('/participants', process.env.PARTICIPANT_SERVICE!, false)
)

// === EVENT SERVICE ===
router.use(
  '/events',
  proxyWithLogging('/events', process.env.EVENT_SERVICE!, false)
)

// === REPORTS SERVICE ===
router.use(
  '/reports',
  proxyWithLogging('/reports', process.env.REPORT_SERVICE!, false)
)

// === USER SERVICE — passando todo o tráfego para ele ===
router.use('/', proxyWithLogging('/', process.env.USER_SERVICE!, true))

export { router as gatewayRouter }
