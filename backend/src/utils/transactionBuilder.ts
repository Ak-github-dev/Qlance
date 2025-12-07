/**
 * Transaction Builder for Qlance Smart Contract
 * Based on OFFICIAL Qubic RPC documentation
 * Reference: https://docs.qubic.org/developers/smart-contracts/rpc/ts-library/
 */

/**
 * Build payload for PostJob procedure
 * Struct: uint64 priceInQubic (8 bytes)
 */
export function buildPostJobPayload(priceInQubic: bigint): Uint8Array {
  const payloadBuffer = new Uint8Array(8)
  const view = new DataView(payloadBuffer.buffer)
  view.setBigUint64(0, priceInQubic, true)
  return payloadBuffer
}

/**
 * Build payload for ClaimJob procedure
 * Struct: uint64 jobId (8 bytes)
 */
export function buildClaimJobPayload(jobId: bigint): Uint8Array {
  const payloadBuffer = new Uint8Array(8)
  const view = new DataView(payloadBuffer.buffer)
  view.setBigUint64(0, jobId, true)
  return payloadBuffer
}

/**
 * Build payload for SubmitWork procedure
 * Struct: uint64 jobId (8 bytes)
 */
export function buildSubmitWorkPayload(jobId: bigint): Uint8Array {
  const payloadBuffer = new Uint8Array(8)
  const view = new DataView(payloadBuffer.buffer)
  view.setBigUint64(0, jobId, true)
  return payloadBuffer
}

/**
 * Build payload for ApproveWork procedure
 * Struct: uint64 jobId (8 bytes)
 */
export function buildApproveWorkPayload(jobId: bigint): Uint8Array {
  const payloadBuffer = new Uint8Array(8)
  const view = new DataView(payloadBuffer.buffer)
  view.setBigUint64(0, jobId, true)
  return payloadBuffer
}

/**
 * Build payload for RejectWork procedure
 * Struct: uint64 jobId (8 bytes)
 */
export function buildRejectWorkPayload(jobId: bigint): Uint8Array {
  const payloadBuffer = new Uint8Array(8)
  const view = new DataView(payloadBuffer.buffer)
  view.setBigUint64(0, jobId, true)
  return payloadBuffer
}

/**
 * Transaction parameters
 */
export interface TransactionParams {
  sourcePublicKey: string // Your wallet address (60 chars)
  destinationAddress: string // Contract address
  tick: number // Target execution tick
  inputType: number // Procedure ID (1-5)
  payload: Uint8Array // Encoded input data
  amount?: bigint // QU amount (0 for procedures)
}

/**
 * Sign and broadcast transaction using official QubicTransaction
 * Official code: https://docs.qubic.org/developers/smart-contracts/rpc/ts-library/
 */
export async function executeTransaction(
  params: TransactionParams,
  seed: string,
  rpcUrl: string = 'https://testnet-rpc.qubicdev.com'
): Promise<any> {
  try {
    // Import official classes
    const { QubicTransaction } = await import('@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction.js')
    const { PublicKey } = await import('@qubic-lib/qubic-ts-library/dist/qubic-types/PublicKey.js')
    const { DynamicPayload } = await import('@qubic-lib/qubic-ts-library/dist/qubic-types/DynamicPayload.js')
    const axios = await import('axios')

    // Create PublicKey objects
    const sourcePublicKey = new PublicKey(params.sourcePublicKey)
    const destinationPublicKey = new PublicKey(params.destinationAddress)

    // Create DynamicPayload from binary data
    const dynamicPayload = new DynamicPayload(params.payload.length)
    dynamicPayload.setPayload(params.payload)

    // Build transaction using official API
    const transaction = new QubicTransaction()
      .setSourcePublicKey(sourcePublicKey)
      .setDestinationPublicKey(destinationPublicKey)
      .setAmount(params.amount ? Number(params.amount) : 0) // Use plain number
      .setTick(params.tick)
      .setInputType(params.inputType)
      .setPayload(dynamicPayload) // Use DynamicPayload object

    // Sign transaction with seed
    const txBuffer = await transaction.build(seed)

    // Encode to base64
    const encodedTransaction = Buffer.from(txBuffer).toString('base64')

    // Broadcast to RPC
    const baseUrl = rpcUrl.endsWith('/') ? rpcUrl : rpcUrl + '/'
    const response = await axios.default.post(`${baseUrl}v1/broadcast-transaction`, {
      encodedTransaction,
    })

    return response.data
  } catch (error) {
    console.error('Transaction execution error:', error)
    throw error
  }
}

/**
 * Helper to build transaction without broadcasting
 */
export async function buildSignedTransaction(
  params: TransactionParams,
  seed: string
): Promise<string> {
  try {
    const { QubicTransaction } = await import('@qubic-lib/qubic-ts-library/dist/qubic-types/QubicTransaction.js')
    const { PublicKey } = await import('@qubic-lib/qubic-ts-library/dist/qubic-types/PublicKey.js')
    const { DynamicPayload } = await import('@qubic-lib/qubic-ts-library/dist/qubic-types/DynamicPayload.js')

    const sourcePublicKey = new PublicKey(params.sourcePublicKey)
    const destinationPublicKey = new PublicKey(params.destinationAddress)

    const dynamicPayload = new DynamicPayload(params.payload.length)
    dynamicPayload.setPayload(params.payload)

    const transaction = new QubicTransaction()
      .setSourcePublicKey(sourcePublicKey)
      .setDestinationPublicKey(destinationPublicKey)
      .setAmount(params.amount ? Number(params.amount) : 0)
      .setTick(params.tick)
      .setInputType(params.inputType)
      .setPayload(dynamicPayload)

    const txBuffer = await transaction.build(seed)
    return Buffer.from(txBuffer).toString('base64')
  } catch (error) {
    console.error('Build signed transaction error:', error)
    throw error
  }
}
