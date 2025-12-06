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

export default router
