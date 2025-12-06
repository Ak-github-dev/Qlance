import { Router, Request, Response } from 'express'
import qubicHelper from '../utils/qubicHelper.js'

const router = Router()

/**
 * GET /health
 * Health check endpoint
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const rpcConnected = await qubicHelper.testConnection()

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Qlance Backend',
      version: '0.1.0',
      environment: process.env.NODE_ENV || 'development',
      qubic: {
        rpcUrl: qubicHelper.getTestnetRpcUrl(),
        connected: rpcConnected,
      },
    })
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: String(error),
    })
  }
})

export default router
