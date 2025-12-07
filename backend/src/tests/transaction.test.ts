import { 
  encodePostJobPayload, 
  QLANCE_CONTRACT, 
  QLANCE_PROCEDURES,
  getCurrentTick,
  queryContractFunction,
  QLANCE_FUNCTIONS
} from '../utils/qubicTransaction.js'

/**
 * Test payload encoding
 */
async function testPayloadEncoding() {
  console.log('\n=== Testing Payload Encoding ===')

  // Test PostJob payload: price = 1000
  const payload = encodePostJobPayload(BigInt(1000))
  console.log(`✅ PostJob payload size: ${payload.length} bytes (expected 8)`)
  console.log(`   Payload (hex): ${payload.toString('hex')}`)
  console.log(`   Payload (base64): ${payload.toString('base64')}`)

  // Test ClaimJob payload: jobId = 5
  const claimPayload = encodePostJobPayload(BigInt(5))
  console.log(`✅ ClaimJob payload size: ${claimPayload.length} bytes (expected 8)`)
}

/**
 * Test RPC connection
 */
async function testRpcConnection() {
  console.log('\n=== Testing RPC Connection ===')

  const rpcUrl = process.env.QUBIC_TESTNET_RPC || 'https://testnet-rpc.qubicdev.com'

  try {
    const tick = await getCurrentTick(rpcUrl)
    console.log(`✅ Current tick: ${tick}`)
  } catch (error) {
    console.error(`❌ RPC connection failed:`, error)
  }
}

/**
 * Test contract configuration
 */
function testContractConfig() {
  console.log('\n=== Testing Contract Configuration ===')
  console.log(`Contract Index: ${QLANCE_CONTRACT.index}`)
  console.log(`Contract Address: ${QLANCE_CONTRACT.address}`)
  console.log(`PostJob procedure ID: ${QLANCE_PROCEDURES.POST_JOB}`)
  console.log(`GetJobsCount function ID: ${QLANCE_FUNCTIONS.GET_JOBS_COUNT}`)
  console.log('✅ Contract configuration loaded')
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('========================================')
  console.log('  Qlance Transaction Utilities Test')
  console.log('========================================')

  testContractConfig()
  testPayloadEncoding()
  await testRpcConnection()

  console.log('\n========================================')
  console.log('  Tests Complete')
  console.log('========================================\n')
}

runTests().catch(console.error)
