/**
 * Contract Transaction Test
 * Tests transaction building and payload encoding
 */

import * as transactionBuilder from '../utils/transactionBuilder.js'
import * as walletManager from '../utils/walletManager.js'

async function testPayloadBuilding() {
  console.log('\n=== Testing Payload Building ===\n')

  // Test PostJob payload
  const postJobPayload = transactionBuilder.buildPostJobPayload(BigInt(1000))
  console.log(`✅ PostJob payload built: ${postJobPayload.length} bytes`)
  console.log(`   Hex: ${Buffer.from(postJobPayload).toString('hex')}`)
  console.log(`   Base64: ${Buffer.from(postJobPayload).toString('base64')}`)

  // Test ClaimJob payload
  const claimJobPayload = transactionBuilder.buildClaimJobPayload(BigInt(5))
  console.log(`✅ ClaimJob payload built: ${claimJobPayload.length} bytes`)

  // Test other payloads
  const submitPayload = transactionBuilder.buildSubmitWorkPayload(BigInt(5))
  console.log(`✅ SubmitWork payload built: ${submitPayload.length} bytes`)

  const approvePayload = transactionBuilder.buildApproveWorkPayload(BigInt(5))
  console.log(`✅ ApproveWork payload built: ${approvePayload.length} bytes`)

  const rejectPayload = transactionBuilder.buildRejectWorkPayload(BigInt(5))
  console.log(`✅ RejectWork payload built: ${rejectPayload.length} bytes`)
}

async function testTransactionParameters() {
  console.log('\n=== Testing Transaction Parameters ===\n')

  const walletAddress = 'WRHOEDJCSNSWACSNWPRQWPBXQIOCAULOEJPCUDFDDFRLALPTIQUESAIELSNA'
  const contractAddress = 'KAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXIUO'
  const payload = transactionBuilder.buildPostJobPayload(BigInt(1000))

  const txParams = {
    sourcePublicKey: walletAddress,
    destinationAddress: contractAddress,
    tick: 38648500,
    inputType: 1,
    payload,
    amount: BigInt(0),
  }

  console.log(`✅ Transaction parameters created:`)
  console.log(`   Source: ${txParams.sourcePublicKey.substring(0, 20)}...`)
  console.log(`   Destination: ${txParams.destinationAddress.substring(0, 20)}...`)
  console.log(`   InputType (PostJob): ${txParams.inputType}`)
  console.log(`   Tick: ${txParams.tick}`)
  console.log(`   Payload size: ${txParams.payload.length} bytes`)
}

async function testCurrentTick() {
  console.log('\n=== Testing Current Tick ===\n')

  const rpcUrl = process.env.QUBIC_TESTNET_RPC || 'https://testnet-rpc.qubicdev.com'

  try {
    const tick = await walletManager.getCurrentTick(rpcUrl)
    console.log(`✅ Current tick: ${tick}`)
    console.log(`   Target tick (current + 10): ${tick + 10}`)
  } catch (error) {
    console.error(`❌ Failed to get tick:`, error)
  }
}

async function runTests() {
  console.log('========================================')
  console.log('  Qlance Contract Transaction Test')
  console.log('========================================')

  await testPayloadBuilding()
  testTransactionParameters()
  await testCurrentTick()

  console.log('\n========================================')
  console.log('  Tests Complete')
  console.log('========================================\n')
}

runTests().catch(console.error)
