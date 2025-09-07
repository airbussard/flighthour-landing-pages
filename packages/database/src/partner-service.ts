import { getSupabaseClient } from './supabase'
import type { Partner, Experience, Voucher, PartnerPayout } from './types'

export class PartnerService {
  static async getPartnerByUserId(userId: string): Promise<Partner | null> {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching partner by user ID:', error)
      throw error
    }
  }

  static async getPartnerStatistics(partnerId: string) {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

      // Get partner details
      const { data: partner, error: partnerError } = await supabase
        .from('partners')
        .select('*')
        .eq('id', partnerId)
        .single()

      if (partnerError) throw partnerError

      // Get experiences count
      const { count: totalExperiences } = await supabase
        .from('experiences')
        .select('*', { count: 'exact', head: true })
        .eq('partner_id', partnerId)

      const { count: activeExperiences } = await supabase
        .from('experiences')
        .select('*', { count: 'exact', head: true })
        .eq('partner_id', partnerId)
        .eq('is_active', true)

      // Get vouchers statistics
      const { data: allVouchers } = await supabase
        .from('vouchers')
        .select('*')
        .eq('redeemed_by_partner_id', partnerId)

      const totalVouchers = allVouchers?.length || 0
      const redeemedThisMonth = allVouchers?.filter(v => 
        v.redeemed_at && new Date(v.redeemed_at) >= startOfMonth
      ).length || 0

      // Get revenue data
      const { data: payouts } = await supabase
        .from('partner_payouts')
        .select('amount, created_at, status')
        .eq('partner_id', partnerId)

      const totalRevenue = payouts?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
      const revenueThisMonth = payouts?.filter(p => 
        new Date(p.created_at) >= startOfMonth
      ).reduce((sum, p) => sum + (p.amount || 0), 0) || 0
      const revenueLastMonth = payouts?.filter(p => 
        new Date(p.created_at) >= startOfLastMonth && 
        new Date(p.created_at) <= endOfLastMonth
      ).reduce((sum, p) => sum + (p.amount || 0), 0) || 0

      const pendingPayouts = payouts?.filter(p => 
        p.status === 'PENDING'
      ).reduce((sum, p) => sum + (p.amount || 0), 0) || 0

      // Calculate growth
      const monthlyGrowth = revenueLastMonth > 0
        ? ((revenueThisMonth - revenueLastMonth) / revenueLastMonth * 100)
        : 0

      return {
        partner,
        statistics: {
          experiences: {
            total: totalExperiences || 0,
            active: activeExperiences || 0,
          },
          vouchers: {
            total: totalVouchers,
            redeemedThisMonth,
          },
          revenue: {
            total: totalRevenue / 100, // Convert from cents to euros
            thisMonth: revenueThisMonth / 100,
            lastMonth: revenueLastMonth / 100,
            pending: pendingPayouts / 100,
            monthlyGrowth,
          },
        },
      }
    } catch (error) {
      console.error('Error fetching partner statistics:', error)
      throw error
    }
  }

  static async getPartnerExperiences(partnerId: string): Promise<Experience[]> {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      const { data, error } = await supabase
        .from('experiences')
        .select(`
          *,
          categories!experiences_category_id_fkey (*)
        `)
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data || []).map((exp: any) => ({
        ...exp,
        category: exp.categories,
      }))
    } catch (error) {
      console.error('Error fetching partner experiences:', error)
      throw error
    }
  }

  static async getRecentVouchers(partnerId: string, limit: number = 10): Promise<Voucher[]> {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      const { data, error } = await supabase
        .from('vouchers')
        .select(`
          *,
          experiences!vouchers_experience_id_fkey (*)
        `)
        .eq('redeemed_by_partner_id', partnerId)
        .order('redeemed_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data || []).map((voucher: any) => ({
        ...voucher,
        experience: voucher.experiences,
      }))
    } catch (error) {
      console.error('Error fetching recent vouchers:', error)
      throw error
    }
  }

  static async redeemVoucher(voucherCode: string, partnerId: string): Promise<Voucher> {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      // First, get the voucher
      const { data: voucher, error: voucherError } = await supabase
        .from('vouchers')
        .select('*')
        .eq('voucher_code', voucherCode)
        .single()

      if (voucherError) throw voucherError
      if (!voucher) throw new Error('Voucher not found')

      // Check if already redeemed
      if (voucher.status === 'REDEEMED') {
        throw new Error('Voucher already redeemed')
      }

      // Check if expired
      if (new Date(voucher.expires_at) < new Date()) {
        throw new Error('Voucher expired')
      }

      // Update voucher status
      const { data: updatedVoucher, error: updateError } = await supabase
        .from('vouchers')
        .update({
          status: 'REDEEMED',
          redeemed_at: new Date().toISOString(),
          redeemed_by_partner_id: partnerId,
        })
        .eq('id', voucher.id)
        .select()
        .single()

      if (updateError) throw updateError

      // Create payout record
      const { error: payoutError } = await supabase
        .from('partner_payouts')
        .insert({
          partner_id: partnerId,
          voucher_id: voucher.id,
          amount: voucher.voucher_value || 0,
          status: 'PENDING',
        })

      if (payoutError) throw payoutError

      return updatedVoucher
    } catch (error) {
      console.error('Error redeeming voucher:', error)
      throw error
    }
  }

  static async getPayouts(partnerId: string): Promise<PartnerPayout[]> {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      const { data, error } = await supabase
        .from('partner_payouts')
        .select(`
          *,
          vouchers!partner_payouts_voucher_id_fkey (
            *,
            experiences!vouchers_experience_id_fkey (*)
          )
        `)
        .eq('partner_id', partnerId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return (data || []).map((payout: any) => ({
        ...payout,
        voucher: {
          ...payout.vouchers,
          experience: payout.vouchers?.experiences,
        },
      }))
    } catch (error) {
      console.error('Error fetching partner payouts:', error)
      throw error
    }
  }

  static async updatePartnerProfile(partnerId: string, updates: Partial<Partner>): Promise<Partner> {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    try {
      const { data, error } = await supabase
        .from('partners')
        .update(updates)
        .eq('id', partnerId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating partner profile:', error)
      throw error
    }
  }
}