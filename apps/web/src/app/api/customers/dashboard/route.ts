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

    // Fetch recent orders
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_email', user.email)
      .order('created_at', { ascending: false })
      .limit(5)

    // Fetch active vouchers
    const { data: vouchers } = await supabase
      .from('vouchers')
      .select(`
        *,
        experiences (
          title
        )
      `)
      .eq('customer_email', user.email)
      .eq('status', 'ACTIVE')
      .order('expires_at', { ascending: true })
      .limit(4)

    // Calculate stats
    const { data: allOrders } = await supabase
      .from('orders')
      .select('total_amount, status')
      .eq('customer_email', user.email)
      .in('status', ['CONFIRMED', 'COMPLETED'])

    const totalSpent = allOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
    const totalOrders = allOrders?.length || 0

    const { count: activeVouchersCount } = await supabase
      .from('vouchers')
      .select('*', { count: 'exact', head: true })
      .eq('customer_email', user.email)
      .eq('status', 'ACTIVE')

    // Transform data
    const recentOrders = (orders || []).map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      createdAt: order.created_at,
      status: order.status,
      totalAmount: order.total_amount
    }))

    const activeVouchers = (vouchers || []).map(voucher => ({
      id: voucher.id,
      voucherCode: voucher.voucher_code,
      voucherType: voucher.voucher_type,
      voucherValue: voucher.voucher_value,
      experienceTitle: voucher.experiences?.title,
      expiresAt: voucher.expires_at
    }))

    return NextResponse.json({
      recentOrders,
      activeVouchers,
      stats: {
        totalOrders,
        totalSpent,
        activeVouchers: activeVouchersCount || 0
      }
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}