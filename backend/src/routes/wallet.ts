import { Router, Request, Response } from 'express'
import * as walletManager from '../utils/walletManager.js'

const router = Router()

/**
 * POST /api/wallet/import
 * Import wallet from seed phrase
 *
 * Body: { "seed": "your-55-char-seed" }
 */
router.post('/import', async (req: Request, res: Response) => {
  try {
    const { seed } = req.body
    const rpcUrl = process.env.QUBIC_TESTNET_RPC || 'https://testnet-rpc.qubicdev.com'

    if (!seed) {
      return res.status(400).json({
        success: false,
        error: 'Seed phrase is required',
      })
    }

    if (!walletManager.validateSeed(seed)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid seed format. Must be 55-56 lowercase characters.',
      })
    }

    // Import wallet
    const result = await walletManager.importWallet(seed)

    if (!result.isValid) {
      return res.status(400).json({
        success: false,
        error: result.error,
      })
    }

    // Get balance
    let balance = BigInt(0)
    try {
      balance = await walletManager.getBalance(result.publicKey, rpcUrl)
    } catch (error) {
      console.warn('Could not fetch balance:', error)
    }

    res.json({
      success: true,
      data: {
        publicKey: result.publicKey,
        balance: balance.toString(),
        message: 'Wallet imported successfully',
      },
    })
  } catch (error) {
    console.error('Wallet import error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to import wallet',
    })
  }
})

/**
 * GET /api/wallet/:publicKey/balance
 * Get balance for a wallet address
 */
router.get('/:publicKey/balance', async (req: Request, res: Response) => {
  try {
    const { publicKey } = req.params
    const rpcUrl = process.env.QUBIC_TESTNET_RPC || 'https://testnet-rpc.qubicdev.com'

    if (!walletManager.validateQubicAddress(publicKey)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Qubic address format',
      })
    }

    const balance = await walletManager.getBalance(publicKey, rpcUrl)

    res.json({
      success: true,
      data: {
        publicKey,
        balance: balance.toString(),
      },
    })
  } catch (error) {
    console.error('Balance fetch error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch balance',
    })
  }
})

/**
 * GET /api/wallet/validate/:address
 * Validate a Qubic address format
 */
router.get('/validate/:address', (req: Request, res: Response) => {
  const { address } = req.params
  const isValid = walletManager.validateQubicAddress(address)

  res.json({
    success: true,
    data: {
      address,
      isValid,
    },
  })
})

export default router
