export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded' | 'canceled'
  clientSecret: string
  created: Date
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'sepa_debit' | 'paypal'
  card?: {
    brand: string
    last4: string
    expMonth: number
    expYear: number
  }
  created: Date
}

export interface CheckoutSession {
  id: string
  url: string
  successUrl: string
  cancelUrl: string
  paymentStatus: 'paid' | 'unpaid'
  created: Date
  customerEmail?: string
  amountTotal?: number
}

export interface PaymentProvider {
  createPaymentIntent(amount: number, currency: string): Promise<PaymentIntent>
  confirmPayment(paymentIntentId: string): Promise<PaymentIntent>
  createCheckoutSession(params: {
    lineItems: Array<{ price: string; quantity: number }>
    successUrl: string
    cancelUrl: string
    customerEmail?: string
  }): Promise<CheckoutSession>
  retrieveCheckoutSession(sessionId: string): Promise<CheckoutSession>
  createPaymentMethod(params: {
    type: 'card' | 'sepa_debit' | 'paypal'
    card?: {
      number: string
      expMonth: number
      expYear: number
      cvc: string
    }
  }): Promise<PaymentMethod>
  attachPaymentMethod(paymentMethodId: string, customerId: string): Promise<PaymentMethod>
  createCustomer(params: { email: string; name?: string }): Promise<{
    id: string
    email: string
    name?: string
  }>
  createPrice(params: {
    amount: number
    currency: string
    productId: string
  }): Promise<{ id: string }>
  createProduct(params: { name: string; description?: string }): Promise<{ id: string }>
  handleWebhook(payload: any, signature: string): Promise<void>
}