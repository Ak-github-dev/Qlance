import { Router, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { Job, ApiResponse } from '../types/index.js'

const router = Router()

// In-memory storage for MVP (Phase 3: Replace with database)
const jobsStore: Map<string, Job> = new Map()

/**
 * GET /jobs
 * Fetch all open jobs
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const jobs = Array.from(jobsStore.values()).filter(job => job.status === 'open')

    const response: ApiResponse<Job[]> = {
      success: true,
      data: jobs,
      message: `Retrieved ${jobs.length} open jobs`,
    }

    res.json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: String(error),
    })
  }
})

/**
 * POST /jobs
 * Create a new job
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const { title, description, category, priceInQubic, clientAddress, deadline } = req.body

    // Validation
    if (!title || !description || !priceInQubic || !clientAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: title, description, priceInQubic, clientAddress',
      })
    }

    const newJob: Job = {
      id: uuidv4(),
      title,
      description,
      category: category || 'general',
      priceInQubic,
      status: 'open',
      clientAddress,
      deadline: new Date(deadline) || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    jobsStore.set(newJob.id, newJob)

    const response: ApiResponse<Job> = {
      success: true,
      data: newJob,
      message: 'Job created successfully',
    }

    res.status(201).json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: String(error),
    })
  }
})

/**
 * GET /jobs/:jobId
 * Fetch a specific job
 */
router.get('/:jobId', (req: Request, res: Response) => {
  try {
    const { jobId } = req.params
    const job = jobsStore.get(jobId)

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      })
    }

    const response: ApiResponse<Job> = {
      success: true,
      data: job,
    }

    res.json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: String(error),
    })
  }
})

/**
 * PUT /jobs/:jobId/claim
 * Worker claims a job
 */
router.put('/:jobId/claim', (req: Request, res: Response) => {
  try {
    const { jobId } = req.params
    const { workerAddress } = req.body

    if (!workerAddress) {
      return res.status(400).json({
        success: false,
        error: 'workerAddress is required',
      })
    }

    const job = jobsStore.get(jobId)

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found',
      })
    }

    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        error: `Job cannot be claimed. Current status: ${job.status}`,
      })
    }

    job.status = 'claimed'
    job.workerAddress = workerAddress
    job.updatedAt = new Date()

    jobsStore.set(jobId, job)

    const response: ApiResponse<Job> = {
      success: true,
      data: job,
      message: 'Job claimed successfully',
    }

    res.json(response)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: String(error),
    })
  }
})


/**
 * POST /api/jobs/post-on-chain
 * Post a job to the Qlance smart contract
 *
 * Body:
 * {
 *   "seed": "wallet-seed",
 *   "walletAddress": "YOURADDRESS...",
 *   "priceInQubic": "1000000000"
 * }
 */
router.post('/post-on-chain', async (req: Request, res: Response) => {
  try {
    const { seed, walletAddress, priceInQubic } = req.body

    if (!seed || !walletAddress || !priceInQubic) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: seed, walletAddress, priceInQubic',
      })
    }

    // Validate seed
    const seedValid = /^[a-z]{55,56}$/.test(seed)
    if (!seedValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid seed format',
      })
    }

    // Import job service
    const jobService = await import('../services/jobService.js')

    // Post job to contract
    const result = await jobService.postJobOnChain(seed, walletAddress, BigInt(priceInQubic))

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      })
    }

    res.json({
      success: true,
      data: {
        message: 'Job posted to contract',
        transactionId: result.transactionId,
        details: result.details,
      },
    })
  } catch (error) {
    console.error('Post job on-chain error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to post job on contract',
    })
  }
})

/**
 * POST /api/jobs/:id/claim-on-chain
 * Claim a job from the contract
 */
router.post('/:id/claim-on-chain', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { seed, walletAddress } = req.body

    if (!seed || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: seed, walletAddress',
      })
    }

    const jobService = await import('../services/jobService.js')
    const result = await jobService.claimJobOnChain(seed, walletAddress, BigInt(id))

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      })
    }

    res.json({
      success: true,
      data: {
        message: 'Job claimed on contract',
        transactionId: result.transactionId,
        details: result.details,
      },
    })
  } catch (error) {
    console.error('Claim job error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to claim job',
    })
  }
})

/**
 * POST /api/jobs/:id/submit-work-on-chain
 * Submit work completion
 */
router.post('/:id/submit-work-on-chain', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { seed, walletAddress } = req.body

    if (!seed || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: seed, walletAddress',
      })
    }

    const jobService = await import('../services/jobService.js')
    const result = await jobService.submitWorkOnChain(seed, walletAddress, BigInt(id))

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      })
    }

    res.json({
      success: true,
      data: {
        message: 'Work submitted on contract',
        transactionId: result.transactionId,
        details: result.details,
      },
    })
  } catch (error) {
    console.error('Submit work error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to submit work',
    })
  }
})

/**
 * POST /api/jobs/:id/approve-work-on-chain
 * Approve work and release payment
 */
router.post('/:id/approve-work-on-chain', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { seed, walletAddress } = req.body

    if (!seed || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: seed, walletAddress',
      })
    }

    const jobService = await import('../services/jobService.js')
    const result = await jobService.approveWorkOnChain(seed, walletAddress, BigInt(id))

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      })
    }

    res.json({
      success: true,
      data: {
        message: 'Work approved on contract',
        transactionId: result.transactionId,
        details: result.details,
      },
    })
  } catch (error) {
    console.error('Approve work error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to approve work',
    })
  }
})

/**
 * POST /api/jobs/:id/reject-work-on-chain
 * Reject work and refund
 */
router.post('/:id/reject-work-on-chain', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { seed, walletAddress } = req.body

    if (!seed || !walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: seed, walletAddress',
      })
    }

    const jobService = await import('../services/jobService.js')
    const result = await jobService.rejectWorkOnChain(seed, walletAddress, BigInt(id))

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error,
      })
    }

    res.json({
      success: true,
      data: {
        message: 'Work rejected on contract',
        transactionId: result.transactionId,
        details: result.details,
      },
    })
  } catch (error) {
    console.error('Reject work error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to reject work',
    })
  }
})


export default router
