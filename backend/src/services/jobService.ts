/**
 * Job Service - Handles job operations on Qlance contract
 */

import * as walletManager from '../utils/walletManager.js'
import * as transactionBuilder from '../utils/transactionBuilder.js'

const QLANCE_CONTRACT_ADDRESS = process.env.QUBIC_CONTRACT_ADDRESS || 'KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXIUO'
const QLANCE_TESTNET_RPC = process.env.QUBIC_TESTNET_RPC || 'https://testnet-rpc.qubicdev.com'

/**
 * Post a new job to Qlance contract
 */
export async function postJobOnChain(
  walletSeed: string,
  walletAddress: string,
  priceInQubic: bigint
): Promise<{
  success: boolean
  transactionId?: string
  error?: string
  details?: any
}> {
  try {
    const currentTick = await walletManager.getCurrentTick(QLANCE_TESTNET_RPC)
    const targetTick = currentTick + 10

    const payload = transactionBuilder.buildPostJobPayload(priceInQubic)

    const txParams = {
      sourcePublicKey: walletAddress,
      destinationAddress: QLANCE_CONTRACT_ADDRESS,
      tick: targetTick,
      inputType: 1,
      payload,
      amount: BigInt(0),
    }

    const result = await transactionBuilder.executeTransaction(txParams, walletSeed, QLANCE_TESTNET_RPC)

    return {
      success: true,
      transactionId: result.id || 'pending',
      details: result,
    }
  } catch (error) {
    console.error('Post job error:', error)
    return {
      success: false,
      error: String(error),
    }
  }
}

/**
 * Claim a job from Qlance contract
 */
export async function claimJobOnChain(
  walletSeed: string,
  walletAddress: string,
  jobId: bigint
): Promise<{
  success: boolean
  transactionId?: string
  error?: string
  details?: any
}> {
  try {
    const currentTick = await walletManager.getCurrentTick(QLANCE_TESTNET_RPC)
    const targetTick = currentTick + 10

    const payload = transactionBuilder.buildClaimJobPayload(jobId)

    const txParams = {
      sourcePublicKey: walletAddress,
      destinationAddress: QLANCE_CONTRACT_ADDRESS,
      tick: targetTick,
      inputType: 2,
      payload,
      amount: BigInt(0),
    }

    const result = await transactionBuilder.executeTransaction(txParams, walletSeed, QLANCE_TESTNET_RPC)

    return {
      success: true,
      transactionId: result.id || 'pending',
      details: result,
    }
  } catch (error) {
    console.error('Claim job error:', error)
    return {
      success: false,
      error: String(error),
    }
  }
}

/**
 * Submit work for a job
 */
export async function submitWorkOnChain(
  walletSeed: string,
  walletAddress: string,
  jobId: bigint
): Promise<{
  success: boolean
  transactionId?: string
  error?: string
  details?: any
}> {
  try {
    const currentTick = await walletManager.getCurrentTick(QLANCE_TESTNET_RPC)
    const targetTick = currentTick + 10

    const payload = transactionBuilder.buildSubmitWorkPayload(jobId)

    const txParams = {
      sourcePublicKey: walletAddress,
      destinationAddress: QLANCE_CONTRACT_ADDRESS,
      tick: targetTick,
      inputType: 3,
      payload,
      amount: BigInt(0),
    }

    const result = await transactionBuilder.executeTransaction(txParams, walletSeed, QLANCE_TESTNET_RPC)

    return {
      success: true,
      transactionId: result.id || 'pending',
      details: result,
    }
  } catch (error) {
    console.error('Submit work error:', error)
    return {
      success: false,
      error: String(error),
    }
  }
}

/**
 * Approve completed work
 */
export async function approveWorkOnChain(
  walletSeed: string,
  walletAddress: string,
  jobId: bigint
): Promise<{
  success: boolean
  transactionId?: string
  error?: string
  details?: any
}> {
  try {
    const currentTick = await walletManager.getCurrentTick(QLANCE_TESTNET_RPC)
    const targetTick = currentTick + 10

    const payload = transactionBuilder.buildApproveWorkPayload(jobId)

    const txParams = {
      sourcePublicKey: walletAddress,
      destinationAddress: QLANCE_CONTRACT_ADDRESS,
      tick: targetTick,
      inputType: 4,
      payload,
      amount: BigInt(0),
    }

    const result = await transactionBuilder.executeTransaction(txParams, walletSeed, QLANCE_TESTNET_RPC)

    return {
      success: true,
      transactionId: result.id || 'pending',
      details: result,
    }
  } catch (error) {
    console.error('Approve work error:', error)
    return {
      success: false,
      error: String(error),
    }
  }
}

/**
 * Reject work and refund
 */
export async function rejectWorkOnChain(
  walletSeed: string,
  walletAddress: string,
  jobId: bigint
): Promise<{
  success: boolean
  transactionId?: string
  error?: string
  details?: any
}> {
  try {
    const currentTick = await walletManager.getCurrentTick(QLANCE_TESTNET_RPC)
    const targetTick = currentTick + 10

    const payload = transactionBuilder.buildRejectWorkPayload(jobId)

    const txParams = {
      sourcePublicKey: walletAddress,
      destinationAddress: QLANCE_CONTRACT_ADDRESS,
      tick: targetTick,
      inputType: 5,
      payload,
      amount: BigInt(0),
    }

    const result = await transactionBuilder.executeTransaction(txParams, walletSeed, QLANCE_TESTNET_RPC)

    return {
      success: true,
      transactionId: result.id || 'pending',
      details: result,
    }
  } catch (error) {
    console.error('Reject work error:', error)
    return {
      success: false,
      error: String(error),
    }
  }
}
