import axios from 'axios'

/**
 * Qlance Contract Details
 */
export const QLANCE_CONTRACT = {
  index: 100,
  // Contract address derived from index 100
  address: 'KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXIUO',
}

/**
 * Qlance Procedure IDs
 * Mapped from contract registration
 */
export const QLANCE_PROCEDURES = {
  POST_JOB: 1,
  CLAIM_JOB: 2,
  SUBMIT_WORK: 3,
  APPROVE_WORK: 4,
  REJECT_WORK: 5,
}

/**
 * Qlance Function IDs (Read-only)
 */
export const QLANCE_FUNCTIONS = {
  GET_JOBS_COUNT: 1,
  GET_JOB: 2,
}

/**
 * Create payload for PostJob procedure
 *
 * Input struct (from Qlance.h):
 * - priceInQubic: uint64 (8 bytes)
 *
 * Total: 8 bytes
 */
export function encodePostJobPayload(priceInQubic: bigint): Buffer {
  const buffer = Buffer.alloc(8)
  buffer.writeBigUInt64LE(priceInQubic, 0)
  return buffer
}

/**
 * Create payload for ClaimJob procedure
 *
 * Input struct:
 * - jobId: uint64 (8 bytes)
 *
 * Total: 8 bytes
 */
export function encodeClaimJobPayload(jobId: bigint): Buffer {
  const buffer = Buffer.alloc(8)
  buffer.writeBigUInt64LE(jobId, 0)
  return buffer
}

/**
 * Create payload for SubmitWork procedure
 *
 * Input struct:
 * - jobId: uint64 (8 bytes)
 *
 * Total: 8 bytes
 */
export function encodeSubmitWorkPayload(jobId: bigint): Buffer {
  const buffer = Buffer.alloc(8)
  buffer.writeBigUInt64LE(jobId, 0)
  return buffer
}

/**
 * Create payload for ApproveWork procedure
 *
 * Input struct:
 * - jobId: uint64 (8 bytes)
 *
 * Total: 8 bytes
 */
export function encodeApproveWorkPayload(jobId: bigint): Buffer {
  const buffer = Buffer.alloc(8)
  buffer.writeBigUInt64LE(jobId, 0)
  return buffer
}

/**
 * Create payload for RejectWork procedure
 *
 * Input struct:
 * - jobId: uint64 (8 bytes)
 *
 * Total: 8 bytes
 */
export function encodeRejectWorkPayload(jobId: bigint): Buffer {
  const buffer = Buffer.alloc(8)
  buffer.writeBigUInt64LE(jobId, 0)
  return buffer
}

/**
 * Create payload for GetJob function
 *
 * Input struct:
 * - jobId: uint64 (8 bytes)
 *
 * Total: 8 bytes
 */
export function encodeGetJobPayload(jobId: bigint): Buffer {
  const buffer = Buffer.alloc(8)
  buffer.writeBigUInt64LE(jobId, 0)
  return buffer
}

/**
 * Query a contract function via RPC
 *
 * Functions are read-only and don't require transactions
 */
export async function queryContractFunction(
  rpcUrl: string,
  contractIndex: number,
  inputType: number,
  payload: Buffer
): Promise<string> {
  try {
    const requestData = payload.toString('base64')

    const response = await axios.post(`${rpcUrl}/v1/querySmartContract`, {
      contractIndex,
      inputType,
      inputSize: payload.length,
      requestData,
    })

    if (response.data.responseData) {
      return response.data.responseData // Base64-encoded response
    }

    throw new Error('No response data from contract query')
  } catch (error) {
    console.error('Contract query failed:', error)
    throw error
  }
}

/**
 * Get current tick from RPC
 *
 * Required to schedule transaction execution
 */
export async function getCurrentTick(rpcUrl: string): Promise<number> {
  try {
    const response = await axios.get(`${rpcUrl}/v1/tick-info`)

    if (response.data.tickInfo && response.data.tickInfo.tick) {
      return response.data.tickInfo.tick
    }

    throw new Error('Could not get current tick')
  } catch (error) {
    console.error('Failed to get current tick:', error)
    throw error
  }
}

/**
 * Types for transaction building
 */
export interface QubicTransactionParams {
  sourcePublicKey: string // Your wallet public key
  destinationAddress: string // Contract address
  amount: bigint // 0 for contract calls
  tick: number // Future tick for execution
  inputType: number // Procedure or function ID
  payload: Buffer // Encoded input data
}

/**
 * Build unsigned transaction (structure only)
 *
 * Note: Actual signing requires private key from seed
 * This is handled by @qubic-lib/qubic-ts-library
 */
export function buildUnsignedTransaction(
  params: QubicTransactionParams
): object {
  return {
    sourcePublicKey: params.sourcePublicKey,
    destinationPublicKey: params.destinationAddress,
    amount: params.amount.toString(),
    tick: params.tick,
    inputType: params.inputType,
    inputSize: params.payload.length,
    payload: params.payload.toString('base64'),
  }
}

/**
 * Broadcast signed transaction to RPC
 */
export async function broadcastTransaction(
  rpcUrl: string,
  encodedTransaction: string
): Promise<any> {
  try {
    const response = await axios.post(`${rpcUrl}/v1/broadcast-transaction`, {
      encodedTransaction,
    })

    return response.data
  } catch (error) {
    console.error('Failed to broadcast transaction:', error)
    throw error
  }
}

/**
 * Verify transaction was included in a tick
 */
export async function getTransactionStatus(
  rpcUrl: string,
  transactionId: string
): Promise<any> {
  try {
    const response = await axios.get(`${rpcUrl}/v1/transactions/${transactionId}`)
    return response.data
  } catch (error) {
    console.error('Failed to get transaction status:', error)
    throw error
  }
}
