import axios from 'axios'
import { QubicRpcResponse } from '../types/index.js'

export class QubicHelper {
  private rpcUrl: string

  constructor(rpcUrl: string = process.env.QUBIC_TESTNET_RPC_URL || 'https://testnet-rpc.qubicdev.com') {
    this.rpcUrl = rpcUrl
  }

  /**
   * Test connection to RPC - using a simple status check
   */
  async testConnection(): Promise<boolean> {
    try {
      // Try a simple HTTP GET to check if RPC is reachable
      const response = await axios.get(this.rpcUrl, {
        timeout: 5000,
      })
      
      // If we get any response (even 404), the server is reachable
      console.log('✅ Qubic RPC is reachable')
      return true
    } catch (error: any) {
      // If we can reach the server but get 404 on root, that's OK
      if (error.response?.status === 404) {
        console.log('✅ Qubic RPC endpoint is reachable (returned 404 on root, which is expected)')
        return true
      }
      
      // If we can't reach it at all, that's a real connection error
      console.error('❌ Cannot reach Qubic RPC:', error.message)
      return false
    }
  }

  /**
   * Check if address is valid Qubic format
   */
  isValidQubicAddress(address: string): boolean {
    // Qubic addresses are 60 characters long and uppercase
    return /^[A-Z0-9]{60}$/.test(address)
  }

  /**
   * Get RPC endpoint
   */
  getRpcUrl(): string {
    return this.rpcUrl
  }

  /**
   * Get testnet RPC endpoint
   */
  getTestnetRpcUrl(): string {
    return process.env.QUBIC_TESTNET_RPC_URL || 'https://testnet-rpc.qubicdev.com'
  }

  /**
   * Make a generic RPC call (for future Phase 1 integration)
   */
  async rpcCall(method: string, params: any = {}): Promise<any> {
    try {
      const response = await axios.post(this.rpcUrl, {
        jsonrpc: '2.0',
        id: 1,
        method: method,
        params: params,
      })

      if (response.data.error) {
        console.error('RPC Error:', response.data.error)
        return null
      }

      return response.data.result
    } catch (error) {
      console.error(`RPC call failed for method '${method}':`, error)
      return null
    }
  }
}

export default new QubicHelper()
