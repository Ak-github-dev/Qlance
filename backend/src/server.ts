import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import healthRoutes from './routes/health.js'
import jobsRoutes from './routes/jobs.js'
import qubicHelper from './utils/qubicHelper.js'

import walletRoutes from './routes/wallet.js'


dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3001

// ============== MIDDLEWARE ==============
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ============== LOGGING MIDDLEWARE ==============
app.use((req: Request, res: Response, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// ============== ROUTES ==============

// Health check
app.use('/health', healthRoutes)

// Jobs API
app.use('/api/jobs', jobsRoutes)

// Wallet API
app.use('/api/wallet', walletRoutes)


// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Qlance Backend API - Qubic Micro-Freelance Marketplace',
    version: '0.1.0',
    endpoints: {
      health: '/health',
      jobs: '/api/jobs',
      documentation: '/docs',
    },
  })
})

// API Info endpoint
app.get('/api/info', (req: Request, res: Response) => {
  res.json({
    project: 'Qlance - Qubic Micro-Freelance Marketplace',
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development',
    blockchain: {
      network: 'Qubic Testnet',
      rpcUrl: qubicHelper.getRpcUrl(),
    },
  })
})

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
  })
})

// ============== SERVER START ==============
app.listen(PORT, async () => {
  console.log('\n' + '='.repeat(50))
  console.log('🚀 Qlance Backend Server Starting...')
  console.log('='.repeat(50))
  console.log(`📡 Server running on http://localhost:${PORT}`)
  console.log(`🏥 Health check: http://localhost:${PORT}/health`)
  console.log(`📚 API Info: http://localhost:${PORT}/api/info`)
  console.log(`📖 Jobs API: http://localhost:${PORT}/api/jobs`)
  console.log('='.repeat(50) + '\n')

  // Test Qubic RPC connection
  try {
    const isConnected = await qubicHelper.testConnection()
    if (isConnected) {
      console.log('✅ Qubic RPC Connection: ACTIVE')
      console.log(`   RPC URL: ${qubicHelper.getRpcUrl()}`)
    } else {
      console.log('⚠️  Qubic RPC Connection: FAILED (will retry on request)')
      console.log(`   RPC URL: ${qubicHelper.getRpcUrl()}`)
    }
  } catch (error) {
    console.log('❌ Qubic RPC Test Error:', error)
  }

  console.log('\n')
})

export default app
