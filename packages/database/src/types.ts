// Database Types for Supabase Tables

export type UserRole = 'ADMIN' | 'PARTNER' | 'CUSTOMER'
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED'
export type AdditionalServiceType = 'PHYSICAL_PRODUCT' | 'DIGITAL_SERVICE' | 'PACKAGING'
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
export type OrderItemType = 'EXPERIENCE' | 'VALUE_VOUCHER'
export type VoucherType = 'EXPERIENCE' | 'VALUE'
export type VoucherStatus = 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'CANCELLED'
export type PayoutStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED'

export interface User {
  id: string
  email: string
  name: string | null
  role: UserRole
  created_at: Date
  updated_at: Date
}

export interface CustomerProfile {
  id: string
  user_id: string
  phone: string | null
  birthday: Date | null
  default_postal_code: string | null
  preferences: any
  created_at: Date
  updated_at: Date
  user?: User
}

export interface Partner {
  id: string
  user_id: string
  company_name: string
  legal_form: string | null
  trade_register_number: string | null
  tax_id: string | null
  vat_id: string | null
  website: string | null
  phone: string | null
  email: string | null
  business_street: string
  business_number: string
  business_city: string
  business_postal_code: string
  business_country: string
  billing_street: string | null
  billing_number: string | null
  billing_city: string | null
  billing_postal_code: string | null
  billing_country: string | null
  use_business_address_for_billing: boolean
  bank_name: string | null
  iban: string | null
  bic: string | null
  account_holder_name: string | null
  bank_verified: boolean
  contact_person_name: string | null
  contact_person_email: string | null
  contact_person_phone: string | null
  contact_person_position: string | null
  commission_rate: number
  payment_terms: string
  contract_start_date: Date | null
  contract_end_date: Date | null
  is_active: boolean
  verification_status: VerificationStatus
  created_at: Date
  updated_at: Date
  verified_at: Date | null
  user?: User
  experiences?: Experience[]
  _count?: {
    experiences: number
    payouts: number
  }
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  parent_category_id: string | null
  sort_order: number
  is_active: boolean
  created_at: Date
}

export interface Experience {
  id: string
  title: string
  slug: string
  description: string
  short_description: string
  location_name: string
  street: string | null
  city: string
  postal_code: string
  country: string
  latitude: number | null
  longitude: number | null
  duration: number
  max_participants: number | null
  partner_id: string
  category_id: string | null
  retail_price: number
  tax_rate: number
  partner_payout: number
  search_keywords: string | null
  popularity_score: number
  is_active: boolean
  created_at: Date
  updated_at: Date
  partner?: Partner
  category?: Category
  _count?: {
    vouchers: number
  }
}

export interface Order {
  id: string
  order_number: string
  customer_user_id: string | null
  subtotal: number
  tax_amount: number
  total_amount: number
  payment_intent_id: string | null
  payment_status: PaymentStatus
  payment_method: string | null
  customer_email: string
  customer_name: string | null
  status: OrderStatus
  created_at: Date
  updated_at: Date
  completed_at: Date | null
  items?: OrderItem[]
  vouchers?: Voucher[]
  customer?: CustomerProfile
}

export interface OrderItem {
  id: string
  order_id: string
  item_type: OrderItemType
  experience_id: string | null
  voucher_value: number | null
  quantity: number
  unit_price: number
  tax_rate: number
  experience?: Experience
}

export interface Voucher {
  id: string
  voucher_code: string
  voucher_type: VoucherType
  experience_id: string | null
  voucher_value: number | null
  remaining_value: number | null
  customer_email: string
  customer_name: string | null
  order_id: string | null
  issued_at: Date
  expires_at: Date
  redeemed_at: Date | null
  redeemed_by_partner_id: string | null
  redemption_notes: string | null
  tax_rate: number
  status: VoucherStatus
  created_at: Date
  updated_at: Date
  experience?: Experience
}

export interface PartnerPayout {
  id: string
  partner_id: string
  voucher_id: string
  amount: number
  status: PayoutStatus
  claimed_at: Date
  approved_at: Date | null
  paid_at: Date | null
  created_at: Date
  partner?: Partner
  voucher?: Voucher
}

export interface AdditionalService {
  id: string
  name: string
  description: string | null
  price: number
  tax_rate: number
  service_type: AdditionalServiceType
  is_active: boolean
  created_at: Date
  updated_at: Date
}