import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@eventhour/auth'
import { getSupabaseClient } from '@eventhour/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await AuthService.getCurrentUser()
    if (!user || user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    // Fetch vouchers
    const { data: vouchers, error } = await supabase
      .from('vouchers')
      .select(`
        *,
        experiences (
          title
        )
      `)
      .eq('customer_email', user.email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Vouchers fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch vouchers' }, { status: 500 })
    }

    // Transform data
    const transformedVouchers = (vouchers || []).map(voucher => ({
      id: voucher.id,
      voucherCode: voucher.voucher_code,
      voucherType: voucher.voucher_type,
      experienceId: voucher.experience_id,
      experienceTitle: voucher.experiences?.title,
      voucherValue: voucher.voucher_value,
      remainingValue: voucher.remaining_value,
      issuedAt: voucher.issued_at,
      expiresAt: voucher.expires_at,
      status: voucher.status,
      redeemedAt: voucher.redeemed_at
    }))

    return NextResponse.json({
      vouchers: transformedVouchers
    })
  } catch (error) {
    console.error('Vouchers API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}