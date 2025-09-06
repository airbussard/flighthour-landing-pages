import { PaymentProvider, PaymentIntent, PaymentMethod, CheckoutSession } from '../types'

/**
 * Debug Payment Provider für Entwicklung
 * Simuliert erfolgreiche Zahlungen ohne echte Transaktionen
 */
export class DebugPaymentProvider implements PaymentProvider {
  async createPaymentIntent(amount: number, currency: string): Promise<PaymentIntent> {
    return {
      id: `debug_pi_${Date.now()}`,
      amount,
      currency,
      status: 'requires_payment_method',
      clientSecret: `debug_secret_${Date.now()}`,
      created: new Date(),
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentIntent> {
    return {
      id: paymentIntentId,
      amount: 10000, // 100 EUR
      currency: 'eur',
      status: 'succeeded',
      clientSecret: `debug_secret_${Date.now()}`,
      created: new Date(),
    }
  }

  async createCheckoutSession(params: {
    lineItems: Array<{ price: string; quantity: number }>
    successUrl: string
    cancelUrl: string
    customerEmail?: string
  }): Promise<CheckoutSession> {
    return {
      id: `debug_cs_${Date.now()}`,
      url: `${params.successUrl}?session_id=debug_${Date.now()}`,
      successUrl: params.successUrl,
      cancelUrl: params.cancelUrl,
      paymentStatus: 'unpaid',
      created: new Date(),
    }
  }

  async retrieveCheckoutSession(sessionId: string): Promise<CheckoutSession> {
    return {
      id: sessionId,
      url: '#',
      successUrl: '/checkout/erfolg',
      cancelUrl: '/checkout',
      paymentStatus: 'paid',
      created: new Date(),
      customerEmail: 'test@example.com',
      amountTotal: 10000,
    }
  }

  async createPaymentMethod(params: {
    type: 'card' | 'sepa_debit' | 'paypal'
    card?: {
      number: string
      expMonth: number
      expYear: number
      cvc: string
    }
  }): Promise<PaymentMethod> {
    // Simuliere verschiedene Test-Cases basierend auf Kartennummer
    const testCases: Record<string, 'success' | 'declined' | 'error'> = {
      '4242424242424242': 'success',
      '4000000000000002': 'declined',
      '4000000000009995': 'error',
    }

    const outcome = testCases[params.card?.number || ''] || 'success'

    if (outcome === 'declined') {
      throw new Error('Karte wurde abgelehnt')
    }
    if (outcome === 'error') {
      throw new Error('Zahlungsfehler')
    }

    return {
      id: `debug_pm_${Date.now()}`,
      type: params.type,
      card: params.card
        ? {
            brand: 'visa',
            last4: params.card.number.slice(-4),
            expMonth: params.card.expMonth,
            expYear: params.card.expYear,
          }
        : undefined,
      created: new Date(),
    }
  }

  async attachPaymentMethod(
    paymentMethodId: string,
    customerId: string
  ): Promise<PaymentMethod> {
    return {
      id: paymentMethodId,
      type: 'card',
      card: {
        brand: 'visa',
        last4: '4242',
        expMonth: 12,
        expYear: 2025,
      },
      created: new Date(),
    }
  }

  async createCustomer(params: { email: string; name?: string }): Promise<{
    id: string
    email: string
    name?: string
  }> {
    return {
      id: `debug_cus_${Date.now()}`,
      email: params.email,
      name: params.name,
    }
  }

  async createPrice(params: {
    amount: number
    currency: string
    productId: string
  }): Promise<{ id: string }> {
    return {
      id: `debug_price_${Date.now()}`,
    }
  }

  async createProduct(params: {
    name: string
    description?: string
  }): Promise<{ id: string }> {
    return {
      id: `debug_prod_${Date.now()}`,
    }
  }

  async handleWebhook(payload: any, signature: string): Promise<void> {
    console.log('[Debug Provider] Webhook received:', payload)
    // Im Debug-Modus loggen wir nur
  }
}

export default DebugPaymentProvider