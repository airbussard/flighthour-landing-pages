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

    // Fetch orders with items
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          experiences (
            title
          )
        )
      `)
      .eq('customer_email', user.email)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Orders fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    // Transform data
    const transformedOrders = (orders || []).map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      createdAt: order.created_at,
      status: order.status,
      paymentStatus: order.payment_status,
      subtotal: order.subtotal,
      taxAmount: order.tax_amount,
      totalAmount: order.total_amount,
      customerEmail: order.customer_email,
      items: (order.order_items || []).map((item: any) => ({
        id: item.id,
        itemType: item.item_type,
        experienceTitle: item.experiences?.title,
        voucherValue: item.voucher_value,
        quantity: item.quantity,
        unitPrice: item.unit_price
      }))
    }))

    return NextResponse.json({
      orders: transformedOrders
    })
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}