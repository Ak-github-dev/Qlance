import * as walletManager from '../utils/walletManager.js'

/**
 * Test wallet import from testnet seed
 */
async function testWalletImport() {
  console.log('\n=== Testing Wallet Import ===\n')

  const testSeed = process.env.TESTNET_WALLET_SEED || 'ghromhommngqxjokdlnyjkaoxmjbnwqneiikevfkxfncftudczluvcl'
  const expectedAddress = process.env.TESTNET_WALLET_ADDRESS || 'LCVHHLFGKILFGFURMYODOOWBGTFBDNLFTKVWUZBNADBSFXKQPVWZDLPDTAXK'
  const rpcUrl = process.env.QUBIC_TESTNET_RPC || 'https://testnet-rpc.qubicdev.com'

  console.log(`Testing with seed: ${testSeed}`)
  console.log(`Expected address: ${expectedAddress}\n`)

  try {
    console.log('Step 1: Importing wallet...')
    const result = await walletManager.importWallet(testSeed)

    console.log('Step 2: Import result received')
    console.log(`  isValid: ${result.isValid}`)
    console.log(`  publicKey: ${result.publicKey}`)
    console.log(`  error: ${result.error || 'none'}`)

    if (!result.isValid) {
      console.error(`❌ Import failed: ${result.error}`)
      return
    }

    // Verify address matches
    if (result.publicKey === expectedAddress) {
      console.log(`✅ Address matches expected wallet!`)
    } else {
      console.warn(`⚠️  Address mismatch!`)
      console.warn(`  Expected: ${expectedAddress}`)
      console.warn(`  Got:      ${result.publicKey}`)
    }

    // Get balance
    console.log(`\nStep 3: Fetching balance...`)
    try {
      const balance = await walletManager.getBalance(result.publicKey, rpcUrl)
      console.log(`✅ Balance: ${balance} (≈ ${Number(balance) / 1e18} QUBIC)`)
    } catch (balanceError) {
      console.error(`❌ Balance fetch failed:`)
      console.error(`   Error type: ${balanceError?.constructor?.name}`)
      console.error(`   Message: ${String(balanceError)}`)
      if (balanceError instanceof Error) {
        console.error(`   Stack: ${balanceError.stack}`)
      }
    }
  } catch (error) {
    console.error(`❌ Test failed at step:`)
    console.error(`   Error type: ${error?.constructor?.name}`)
    console.error(`   Message: ${String(error)}`)
    if (error instanceof Error) {
      console.error(`   Stack: ${error.stack}`)
    } else {
      console.error(`   Full error object:`, error)
    }
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('========================================')
  console.log('  Qlance Wallet Integration Test')
  console.log('========================================')

  await testWalletImport()

  console.log('\n========================================')
  console.log('  Tests Complete')
  console.log('========================================\n')
}

runTests().catch((error) => {
  console.error('FATAL ERROR in test runner:')
  console.error(`  Type: ${error?.constructor?.name}`)
  console.error(`  Message: ${String(error)}`)
  console.error(`  Stack: ${error?.stack}`)
  process.exit(1)
})
