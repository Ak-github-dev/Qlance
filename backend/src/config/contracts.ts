/**
 * Qlance Smart Contract Configuration
 * Based on compiled contract at C:\QubicContracts\core\src\contracts\Qlance.h
 */

export const QLANCE_CONFIG = {
  // Contract identification
  name: 'Qlance',
  index: 100,
  address: process.env.QUBIC_CONTRACT_ADDRESS || 'KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXIUO',

  // Procedures (state-modifying operations)
  procedures: {
    PostJob: {
      id: 1,
      name: 'PostJob',
      inputSize: 8, // uint64 priceInQubic
      outputSize: 16, // uint64 jobId + uint8 status
    },
    ClaimJob: {
      id: 2,
      name: 'ClaimJob',
      inputSize: 8, // uint64 jobId
      outputSize: 1, // uint8 status
    },
    SubmitWork: {
      id: 3,
      name: 'SubmitWork',
      inputSize: 8, // uint64 jobId
      outputSize: 1, // uint8 status
    },
    ApproveWork: {
      id: 4,
      name: 'ApproveWork',
      inputSize: 8, // uint64 jobId
      outputSize: 1, // uint8 status
    },
    RejectWork: {
      id: 5,
      name: 'RejectWork',
      inputSize: 8, // uint64 jobId
      outputSize: 1, // uint8 status
    },
  },

  // Functions (read-only operations)
  functions: {
    GetJobsCount: {
      id: 1,
      name: 'GetJobsCount',
      inputSize: 0,
      outputSize: 8, // uint64 count
    },
    GetJob: {
      id: 2,
      name: 'GetJob',
      inputSize: 8, // uint64 jobId
      outputSize: 24, // uint64 jobId + uint64 price + uint8 status
    },
  },

  // RPC configuration
  rpc: {
    mainnet: process.env.QUBIC_MAINNET_RPC || 'https://rpc.qubic.org',
    testnet: process.env.QUBIC_TESTNET_RPC || 'https://testnet-rpc.qubicdev.com',
  },

  // Transaction configuration
  transaction: {
    tickOffset: 10, // Execute 10 ticks in the future
    maxRetries: 3,
    retryDelayMs: 1000,
  },
}

/**
 * Get contract procedure by name
 */
export function getProcedure(name: keyof typeof QLANCE_CONFIG.procedures) {
  return QLANCE_CONFIG.procedures[name]
}

/**
 * Get contract function by name
 */
export function getFunction(name: keyof typeof QLANCE_CONFIG.functions) {
  return QLANCE_CONFIG.functions[name]
}
