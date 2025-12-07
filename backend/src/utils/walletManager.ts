/**
 * MINIMAL Wallet Manager
 * Only uses what we KNOW works from official examples
 */

/**
 * Import wallet from seed
 * Derives public key locally using QubicHelper
 */
export async function importWallet(seed: string): Promise<{
  publicKey: string
  seed: string
  isValid: boolean
  error?: string
}> {
  try {
    // Validate seed format (55-56 lowercase characters)
    if (!/^[a-z]{55,56}$/.test(seed)) {
      return {
        publicKey: '',
        seed,
        isValid: false,
        error: 'Invalid seed format',
      }
    }

    // Import and use QubicHelper
    const { QubicHelper } = await import('@qubic-lib/qubic-ts-library/dist/qubicHelper.js')
    const helper = new QubicHelper()

    // Create ID package - official documented method
    const id = await helper.createIdPackage(seed)

    // Check what we actually got
    if (!id) {
      return {
        publicKey: '',
        seed,
        isValid: false,
        error: 'Failed to create ID package',
      }
    }

    // Get public ID
    const publicId = (id as any).publicId

    if (!publicId) {
      console.error('ID package structure:', JSON.stringify(id, null, 2))
      return {
        publicKey: '',
        seed,
        isValid: false,
        error: `ID package missing publicId. Got: ${JSON.stringify(Object.keys(id))}`,
      }
    }

    return {
      publicKey: publicId,
      seed,
      isValid: true,
    }
  } catch (error) {
    console.error('Wallet import error:', error)
    return {
      publicKey: '',
      seed,
      isValid: false,
      error: String(error),
    }
  }
}

/**
 * Get balance using RPC HTTP call
 * Response format: { balance: { balance: "123456", ... } }
 */
export async function getBalance(
  publicKey: string,
  rpcUrl: string = 'https://testnet-rpc.qubicdev.com'
): Promise<bigint> {
  try {
    const axios = await import('axios')
    const baseUrl = rpcUrl.endsWith('/') ? rpcUrl : rpcUrl + '/'

    const response = await axios.default.get(`${baseUrl}v1/balances/${publicKey}`)

    // Handle nested structure: { balance: { balance: "123456" } }
    let balanceValue: any

    if (response.data?.balance?.balance !== undefined) {
      // Nested: response.data.balance.balance
      balanceValue = response.data.balance.balance
    } else if (response.data?.balance !== undefined && typeof response.data.balance === 'string') {
      // Direct string at response.data.balance
      balanceValue = response.data.balance
    } else if (response.data?.balanceData?.balance !== undefined) {
      // Alternative format
      balanceValue = response.data.balanceData.balance
    } else {
      console.warn('Unexpected balance response format:', response.data)
      return BigInt(0)
    }

    return BigInt(balanceValue)
  } catch (error) {
    console.error('Get balance error:', error)
    throw error
  }
}

/**
 * Get current tick from RPC
 */
export async function getCurrentTick(rpcUrl: string = 'https://testnet-rpc.qubicdev.com'): Promise<number> {
  try {
    const axios = await import('axios')
    const baseUrl = rpcUrl.endsWith('/') ? rpcUrl : rpcUrl + '/'

    // Try /status endpoint first
    try {
      const response = await axios.default.get(`${baseUrl}status`)
      if (response.data?.tick !== undefined) {
        return response.data.tick
      }
    } catch (statusError) {
      console.warn('Status endpoint failed, trying tick-info')
    }

    // Fallback to tick-info
    const response = await axios.default.get(`${baseUrl}v1/tick-info`)

    if (response.data?.tickInfo?.tick !== undefined) {
      return response.data.tickInfo.tick
    }

    throw new Error('Could not get current tick from either endpoint')
  } catch (error) {
    console.error('Failed to get current tick:', error)
    throw error
  }
}

/**
 * Validate Qubic address format (60 characters, uppercase alphanumeric)
 */
export function validateQubicAddress(address: string): boolean {
  return /^[A-Z0-9]{60}$/.test(address)
}

/**
 * Validate seed format (55-56 lowercase characters)
 */
export function validateSeed(seed: string): boolean {
  return /^[a-z]{55,56}$/.test(seed)
}

/**
 * Get QubicHelper instance for transaction signing
 */
export async function getQubicHelper() {
  const { QubicHelper } = await import('@qubic-lib/qubic-ts-library/dist/qubicHelper.js')
  return new QubicHelper()
}

/**
 * Get QubicConnector instance for RPC calls
 */
export async function getQubicConnector(rpcUrl: string = 'https://testnet-rpc.qubicdev.com') {
  try {
    const { QubicConnector } = await import('@qubic-lib/qubic-ts-library/dist/qubicConnector.js')
    return new QubicConnector(rpcUrl)
  } catch (error) {
    console.warn('QubicConnector not available:', error)
    return null
  }
}
