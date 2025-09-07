import { getSupabaseClient } from './supabase'
import type { 
  User, 
  Partner, 
  Experience, 
  Order, 
  Voucher, 
  UserRole,
  VerificationStatus,
  OrderStatus,
  PartnerPayout
} from './types'

export class AdminService {
  // Dashboard Statistics
  static async getDashboardStats() {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    try {
      // Execute all queries in parallel
      const [
        usersResult,
        newUsersResult,
        partnersResult,
        activePartnersResult,
        ordersResult,
        ordersThisMonthResult,
        revenueResult,
        revenueThisMonthResult,
        revenueLastMonthResult,
        experiencesResult,
        activeExperiencesResult,
        vouchersResult,
        activeVouchersResult,
        redeemedVouchersResult,
      ] = await Promise.all([
        // User stats
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true })
          .gte('created_at', startOfMonth.toISOString()),
        
        // Partner stats
        supabase.from('partners').select('*', { count: 'exact', head: true }),
        supabase.from('partners').select('*', { count: 'exact', head: true })
          .eq('verification_status', 'VERIFIED')
          .eq('is_active', true),
        
        // Order stats
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true })
          .gte('created_at', startOfMonth.toISOString()),
        
        // Revenue stats - we need to fetch and sum manually
        supabase.from('orders').select('total_amount')
          .eq('status', 'COMPLETED'),
        supabase.from('orders').select('total_amount')
          .eq('status', 'COMPLETED')
          .gte('created_at', startOfMonth.toISOString()),
        supabase.from('orders').select('total_amount')
          .eq('status', 'COMPLETED')
          .gte('created_at', startOfLastMonth.toISOString())
          .lte('created_at', endOfLastMonth.toISOString()),
        
        // Experience stats
        supabase.from('experiences').select('*', { count: 'exact', head: true }),
        supabase.from('experiences').select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        
        // Voucher stats
        supabase.from('vouchers').select('*', { count: 'exact', head: true }),
        supabase.from('vouchers').select('*', { count: 'exact', head: true })
          .eq('status', 'ACTIVE'),
        supabase.from('vouchers').select('*', { count: 'exact', head: true })
          .eq('status', 'REDEEMED')
          .gte('redeemed_at', startOfMonth.toISOString()),
      ])

      // Calculate revenue sums
      const totalRevenue = revenueResult.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
      const revenueThisMonth = revenueThisMonthResult.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
      const revenueLastMonth = revenueLastMonthResult.data?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

      const monthlyGrowth = revenueLastMonth
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth * 100)
        : 0

      return {
        users: {
          total: usersResult.count || 0,
          newThisMonth: newUsersResult.count || 0,
        },
        partners: {
          total: partnersResult.count || 0,
          active: activePartnersResult.count || 0,
        },
        orders: {
          total: ordersResult.count || 0,
          thisMonth: ordersThisMonthResult.count || 0,
        },
        revenue: {
          total: totalRevenue,
          thisMonth: revenueThisMonth,
          lastMonth: revenueLastMonth,
          monthlyGrowth,
        },
        experiences: {
          total: experiencesResult.count || 0,
          active: activeExperiencesResult.count || 0,
        },
        vouchers: {
          total: vouchersResult.count || 0,
          active: activeVouchersResult.count || 0,
          redeemedThisMonth: redeemedVouchersResult.count || 0,
        },
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }

  // User Management
  static async getUsers(params?: {
    skip?: number
    take?: number
    search?: string
    role?: UserRole
    orderBy?: string
  }) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      let query = supabase
        .from('users')
        .select(`
          *,
          customer_profiles!customer_profiles_user_id_fkey (*)
        `, { count: 'exact' })

      // Apply search filter
      if (params?.search) {
        query = query.or(`email.ilike.%${params.search}%,name.ilike.%${params.search}%`)
      }

      // Apply role filter
      if (params?.role) {
        query = query.eq('role', params.role)
      }

      // Apply pagination
      const skip = params?.skip || 0
      const take = params?.take || 20
      query = query.range(skip, skip + take - 1)

      // Apply ordering
      query = query.order('created_at', { ascending: false })

      const { data, error, count } = await query

      if (error) throw error

      // Transform data to match expected structure
      const users = data?.map((user: any) => ({
        ...user,
        customerProfile: user.customer_profiles?.[0] || null,
      })) || []

      return { users, total: count || 0 }
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  static async updateUserRole(userId: string, role: UserRole) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      // Update user role
      const { data: user, error: userError } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId)
        .select()
        .single()

      if (userError) throw userError

      // Create partner profile if changing to PARTNER role
      if (role === 'PARTNER') {
        const { data: existingPartner } = await supabase
          .from('partners')
          .select('id')
          .eq('user_id', userId)
          .single()

        if (!existingPartner) {
          const { error: partnerError } = await supabase
            .from('partners')
            .insert({
              user_id: userId,
              company_name: user.name || 'Unnamed Partner',
              business_street: '',
              business_number: '',
              business_city: '',
              business_postal_code: '',
              verification_status: 'PENDING',
            })

          if (partnerError) throw partnerError
        }
      }

      return user
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  }

  static async deleteUser(userId: string) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  // Partner Management
  static async getPartners(params?: {
    skip?: number
    take?: number
    search?: string
    verificationStatus?: VerificationStatus
    isActive?: boolean
  }) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      let query = supabase
        .from('partners')
        .select(`
          *,
          users!partners_user_id_fkey (*),
          experiences (id, title, is_active)
        `, { count: 'exact' })

      // Apply search filter
      if (params?.search) {
        query = query.or(`company_name.ilike.%${params.search}%,email.ilike.%${params.search}%`)
      }

      // Apply verification status filter
      if (params?.verificationStatus) {
        query = query.eq('verification_status', params.verificationStatus)
      }

      // Apply active filter
      if (params?.isActive !== undefined) {
        query = query.eq('is_active', params.isActive)
      }

      // Apply pagination
      const skip = params?.skip || 0
      const take = params?.take || 20
      query = query.range(skip, skip + take - 1)

      // Apply ordering
      query = query.order('created_at', { ascending: false })

      const { data, error, count } = await query

      if (error) throw error

      // Transform data and add counts
      const partners = await Promise.all((data || []).map(async (partner: any) => {
        // Get experience count
        const { count: experienceCount } = await supabase
          .from('experiences')
          .select('*', { count: 'exact', head: true })
          .eq('partner_id', partner.id)

        // Get payout count
        const { count: payoutCount } = await supabase
          .from('partner_payouts')
          .select('*', { count: 'exact', head: true })
          .eq('partner_id', partner.id)

        return {
          ...partner,
          user: partner.users,
          _count: {
            experiences: experienceCount || 0,
            payouts: payoutCount || 0,
          }
        }
      }))

      return { partners, total: count || 0 }
    } catch (error) {
      console.error('Error fetching partners:', error)
      throw error
    }
  }

  static async updatePartnerStatus(
    partnerId: string,
    verificationStatus?: VerificationStatus,
    isActive?: boolean
  ) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      const updates: any = {}
      if (verificationStatus) updates.verification_status = verificationStatus
      if (isActive !== undefined) updates.is_active = isActive

      const { data, error } = await supabase
        .from('partners')
        .update(updates)
        .eq('id', partnerId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating partner status:', error)
      throw error
    }
  }

  static async getPartnerPayouts(partnerId?: string) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      let query = supabase
        .from('partner_payouts')
        .select(`
          *,
          partners!partner_payouts_partner_id_fkey (
            *,
            users!partners_user_id_fkey (*)
          ),
          vouchers!partner_payouts_voucher_id_fkey (
            *,
            experiences!vouchers_experience_id_fkey (*)
          )
        `)
        .order('created_at', { ascending: false })

      if (partnerId) {
        query = query.eq('partner_id', partnerId)
      }

      const { data, error } = await query

      if (error) throw error

      // Transform data
      const payouts = (data || []).map((payout: any) => ({
        ...payout,
        partner: {
          ...payout.partners,
          user: payout.partners?.users
        },
        voucher: {
          ...payout.vouchers,
          experience: payout.vouchers?.experiences
        }
      }))

      return payouts
    } catch (error) {
      console.error('Error fetching partner payouts:', error)
      throw error
    }
  }

  static async processPayouts(payoutIds: string[]) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      const { error } = await supabase
        .from('partner_payouts')
        .update({
          status: 'PAID',
          paid_at: new Date().toISOString()
        })
        .in('id', payoutIds)
        .eq('status', 'PENDING')

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error processing payouts:', error)
      throw error
    }
  }

  // Experience Management
  static async getExperiences(params?: {
    skip?: number
    take?: number
    search?: string
    isActive?: boolean
    partnerId?: string
  }) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      let query = supabase
        .from('experiences')
        .select(`
          *,
          partners!experiences_partner_id_fkey (
            *,
            users!partners_user_id_fkey (*)
          ),
          categories!experiences_category_id_fkey (*)
        `, { count: 'exact' })

      // Apply search filter
      if (params?.search) {
        query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%`)
      }

      // Apply active filter
      if (params?.isActive !== undefined) {
        query = query.eq('is_active', params.isActive)
      }

      // Apply partner filter
      if (params?.partnerId) {
        query = query.eq('partner_id', params.partnerId)
      }

      // Apply pagination
      const skip = params?.skip || 0
      const take = params?.take || 20
      query = query.range(skip, skip + take - 1)

      // Apply ordering
      query = query.order('created_at', { ascending: false })

      const { data, error, count } = await query

      if (error) throw error

      // Add voucher counts
      const experiences = await Promise.all((data || []).map(async (experience: any) => {
        const { count: voucherCount } = await supabase
          .from('vouchers')
          .select('*', { count: 'exact', head: true })
          .eq('experience_id', experience.id)

        return {
          ...experience,
          partner: {
            ...experience.partners,
            user: experience.partners?.users
          },
          category: experience.categories,
          _count: {
            vouchers: voucherCount || 0
          }
        }
      }))

      return { experiences, total: count || 0 }
    } catch (error) {
      console.error('Error fetching experiences:', error)
      throw error
    }
  }

  static async toggleExperienceStatus(experienceId: string) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      // First get current status
      const { data: experience, error: fetchError } = await supabase
        .from('experiences')
        .select('is_active')
        .eq('id', experienceId)
        .single()

      if (fetchError) throw fetchError
      if (!experience) throw new Error('Experience not found')

      // Toggle status
      const { data, error } = await supabase
        .from('experiences')
        .update({ is_active: !experience.is_active })
        .eq('id', experienceId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error toggling experience status:', error)
      throw error
    }
  }

  // Order Management
  static async getOrders(params?: {
    skip?: number
    take?: number
    search?: string
    status?: OrderStatus
  }) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      let query = supabase
        .from('orders')
        .select(`
          *,
          order_items!order_items_order_id_fkey (
            *,
            experiences!order_items_experience_id_fkey (*)
          ),
          vouchers!vouchers_order_id_fkey (*),
          customer_profiles!orders_customer_user_id_fkey (
            *,
            users!customer_profiles_user_id_fkey (*)
          )
        `, { count: 'exact' })

      // Apply search filter
      if (params?.search) {
        query = query.or(`id.ilike.%${params.search}%,customer_email.ilike.%${params.search}%`)
      }

      // Apply status filter
      if (params?.status) {
        query = query.eq('status', params.status)
      }

      // Apply pagination
      const skip = params?.skip || 0
      const take = params?.take || 20
      query = query.range(skip, skip + take - 1)

      // Apply ordering
      query = query.order('created_at', { ascending: false })

      const { data, error, count } = await query

      if (error) throw error

      // Transform data
      const orders = (data || []).map((order: any) => ({
        ...order,
        items: order.order_items || [],
        customer: order.customer_profiles?.[0] ? {
          ...order.customer_profiles[0],
          user: order.customer_profiles[0].users
        } : null
      }))

      return { orders, total: count || 0 }
    } catch (error) {
      console.error('Error fetching orders:', error)
      throw error
    }
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating order status:', error)
      throw error
    }
  }

  // Revenue Analytics
  static async getRevenueAnalytics(days: number = 30) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from('orders')
        .select('created_at, total_amount')
        .eq('status', 'COMPLETED')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      // Group by date
      const revenueByDate = (data || []).reduce((acc, order) => {
        const date = new Date(order.created_at).toISOString().split('T')[0]
        if (!acc[date]) {
          acc[date] = 0
        }
        acc[date] += order.total_amount
        return acc
      }, {} as Record<string, number>)

      // Fill missing dates with 0
      const result = []
      const currentDate = new Date(startDate)
      while (currentDate <= new Date()) {
        const dateStr = currentDate.toISOString().split('T')[0]
        result.push({
          date: dateStr,
          revenue: revenueByDate[dateStr] || 0,
        })
        currentDate.setDate(currentDate.getDate() + 1)
      }

      return result
    } catch (error) {
      console.error('Error fetching revenue analytics:', error)
      throw error
    }
  }

  // User Growth Analytics
  static async getUserGrowthAnalytics(days: number = 30) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from('users')
        .select('created_at, role')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      // Group by date and role
      const usersByDate = (data || []).reduce((acc, user) => {
        const date = new Date(user.created_at).toISOString().split('T')[0]
        if (!acc[date]) {
          acc[date] = { total: 0, customers: 0, partners: 0 }
        }
        acc[date].total++
        if (user.role === 'CUSTOMER') {
          acc[date].customers++
        } else if (user.role === 'PARTNER') {
          acc[date].partners++
        }
        return acc
      }, {} as Record<string, { total: number; customers: number; partners: number }>)

      // Fill missing dates
      const result = []
      const currentDate = new Date(startDate)
      while (currentDate <= new Date()) {
        const dateStr = currentDate.toISOString().split('T')[0]
        result.push({
          date: dateStr,
          total: usersByDate[dateStr]?.total || 0,
          customers: usersByDate[dateStr]?.customers || 0,
          partners: usersByDate[dateStr]?.partners || 0,
        })
        currentDate.setDate(currentDate.getDate() + 1)
      }

      return result
    } catch (error) {
      console.error('Error fetching user growth analytics:', error)
      throw error
    }
  }

  // System Settings
  static async getSystemSettings() {
    // For now, return hardcoded settings
    // In production, these would be stored in a settings table
    return {
      platformFee: 30,
      minPayoutAmount: 50,
      voucherValidityDays: 365,
      maintenanceMode: false,
      registrationEnabled: true,
      emailNotifications: true,
    }
  }

  static async updateSystemSettings(settings: Partial<{
    platformFee: number
    minPayoutAmount: number
    voucherValidityDays: number
    maintenanceMode: boolean
    registrationEnabled: boolean
    emailNotifications: boolean
  }>) {
    // In production, save to database
    // For now, just return the settings
    return settings
  }
}

export default AdminService