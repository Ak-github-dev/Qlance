// User Roles
export type UserRole = 'client' | 'worker' | 'both'

// Job Status
export type JobStatus = 'open' | 'claimed' | 'submitted' | 'approved' | 'rejected' | 'completed' | 'cancelled'

// User Entity
export interface User {
  id: string
  walletAddress: string
  displayName: string
  role: UserRole
  reputation: number
  totalJobsCompleted: number
  totalJobsPosted: number
  createdAt: Date
  updatedAt: Date
}

// Job Entity
export interface Job {
  id: string
  title: string
  description: string
  category: string
  priceInQubic: number
  status: JobStatus
  clientAddress: string
  workerAddress?: string
  deadline: Date
  createdAt: Date
  updatedAt: Date
  contractAddress?: string // Qubic contract address
}

// Submission Entity
export interface Submission {
  id: string
  jobId: string
  workerAddress: string
  content: string
  fileUrl?: string
  aiScore?: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Qubic RPC Response
export interface QubicRpcResponse {
  status: 'success' | 'error'
  data?: any
  message?: string
}
