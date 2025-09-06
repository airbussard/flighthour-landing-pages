import { DebugPaymentProvider } from './providers/debug'
import { PaymentProvider } from './types'

export * from './types'
export { DebugPaymentProvider }

// Payment Service Factory
export class PaymentService {
  private static provider: PaymentProvider

  static initialize(mode: 'debug' | 'stripe' = 'debug') {
    if (mode === 'debug') {
      this.provider = new DebugPaymentProvider()
    } else {
      // TODO: Implement Stripe provider
      throw new Error('Stripe provider not implemented yet')
    }
  }

  static getProvider(): PaymentProvider {
    if (!this.provider) {
      this.initialize('debug')
    }
    return this.provider
  }
}

// Initialize with debug provider by default
PaymentService.initialize('debug')