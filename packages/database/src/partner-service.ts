import { prisma } from './client'
import { Partner, Experience, Voucher, PartnerPayout, Prisma } from '@prisma/client'

export class PartnerService {
  // Partner Profile Management
  static async getPartnerByUserId(userId: string): Promise<Partner | null> {
    return prisma.partner.findUnique({
      where: { userId },
      include: {
        user: true,
      },
    })
  }

  static async createPartner(data: {
    userId: string
    companyName: string
    businessStreet: string
    businessNumber: string
    businessCity: string
    businessPostalCode: string
    email?: string
    phone?: string
  }): Promise<Partner> {
    return prisma.partner.create({
      data,
    })
  }

  static async updatePartnerProfile(
    partnerId: string,
    data: Partial<Omit<Partner, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<Partner> {
    return prisma.partner.update({
      where: { id: partnerId },
      data,
    })
  }

  // Experience Management
  static async getPartnerExperiences(partnerId: string): Promise<Experience[]> {
    return prisma.experience.findMany({
      where: { partnerId },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async createExperience(data: {
    partnerId: string
    title: string
    slug: string
    description: string
    shortDescription: string
    locationName: string
    city: string
    postalCode: string
    duration: number
    retailPrice: number
    categoryId?: string
  }): Promise<Experience> {
    // Calculate partner payout (70% of retail price)
    const partnerPayout = Math.floor(data.retailPrice * 0.7)

    return prisma.experience.create({
      data: {
        ...data,
        partnerPayout,
      },
    })
  }

  static async updateExperience(
    experienceId: string,
    partnerId: string,
    data: Partial<Omit<Experience, 'id' | 'partnerId' | 'createdAt' | 'updatedAt'>>
  ): Promise<Experience> {
    // Verify the experience belongs to the partner
    const experience = await prisma.experience.findFirst({
      where: { id: experienceId, partnerId },
    })

    if (!experience) {
      throw new Error('Experience not found or unauthorized')
    }

    // Recalculate partner payout if price changed
    if (data.retailPrice) {
      data.partnerPayout = Math.floor(data.retailPrice * 0.7)
    }

    return prisma.experience.update({
      where: { id: experienceId },
      data,
    })
  }

  static async toggleExperienceStatus(
    experienceId: string,
    partnerId: string
  ): Promise<Experience> {
    const experience = await prisma.experience.findFirst({
      where: { id: experienceId, partnerId },
    })

    if (!experience) {
      throw new Error('Experience not found or unauthorized')
    }

    return prisma.experience.update({
      where: { id: experienceId },
      data: { isActive: !experience.isActive },
    })
  }

  // Voucher Redemption
  static async redeemVoucher(
    voucherCode: string,
    partnerId: string,
    notes?: string
  ): Promise<Voucher> {
    const voucher = await prisma.voucher.findUnique({
      where: { voucherCode },
      include: {
        experience: true,
      },
    })

    if (!voucher) {
      throw new Error('Gutschein nicht gefunden')
    }

    if (voucher.status !== 'ACTIVE') {
      throw new Error(`Gutschein ist ${voucher.status === 'REDEEMED' ? 'bereits eingelöst' : 'abgelaufen'}`)
    }

    if (voucher.expiresAt < new Date()) {
      throw new Error('Gutschein ist abgelaufen')
    }

    // Check if voucher is for partner's experience
    if (voucher.experience && voucher.experience.partnerId !== partnerId) {
      throw new Error('Gutschein ist nicht für Ihre Erlebnisse gültig')
    }

    // Redeem the voucher
    const redeemedVoucher = await prisma.voucher.update({
      where: { id: voucher.id },
      data: {
        status: 'REDEEMED',
        redeemedAt: new Date(),
        redeemedByPartnerId: partnerId,
        redemptionNotes: notes,
      },
    })

    // Create payout record
    if (voucher.experience) {
      await prisma.partnerPayout.create({
        data: {
          partnerId,
          voucherId: voucher.id,
          amount: voucher.experience.partnerPayout,
          status: 'PENDING',
        },
      })
    }

    return redeemedVoucher
  }

  static async getRedeemedVouchers(partnerId: string): Promise<Voucher[]> {
    return prisma.voucher.findMany({
      where: {
        redeemedByPartnerId: partnerId,
      },
      include: {
        experience: true,
      },
      orderBy: { redeemedAt: 'desc' },
    })
  }

  // Payouts
  static async getPayouts(partnerId: string): Promise<PartnerPayout[]> {
    return prisma.partnerPayout.findMany({
      where: { partnerId },
      include: {
        voucher: {
          include: {
            experience: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  static async getPendingPayoutAmount(partnerId: string): Promise<number> {
    const result = await prisma.partnerPayout.aggregate({
      where: {
        partnerId,
        status: 'PENDING',
      },
      _sum: {
        amount: true,
      },
    })

    return result._sum.amount || 0
  }

  // Statistics
  static async getPartnerStatistics(partnerId: string): Promise<{
    totalRevenue: number
    pendingPayout: number
    totalRedemptions: number
    activeExperiences: number
    thisMonthRevenue: number
    thisMonthRedemptions: number
  }> {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [
      totalRevenue,
      pendingPayout,
      totalRedemptions,
      activeExperiences,
      monthlyPayouts,
      monthlyRedemptions,
    ] = await Promise.all([
      // Total revenue (all payouts)
      prisma.partnerPayout.aggregate({
        where: { partnerId },
        _sum: { amount: true },
      }),
      // Pending payouts
      this.getPendingPayoutAmount(partnerId),
      // Total redemptions
      prisma.voucher.count({
        where: { redeemedByPartnerId: partnerId },
      }),
      // Active experiences
      prisma.experience.count({
        where: { partnerId, isActive: true },
      }),
      // This month's revenue
      prisma.partnerPayout.aggregate({
        where: {
          partnerId,
          createdAt: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      // This month's redemptions
      prisma.voucher.count({
        where: {
          redeemedByPartnerId: partnerId,
          redeemedAt: { gte: startOfMonth },
        },
      }),
    ])

    return {
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingPayout,
      totalRedemptions,
      activeExperiences,
      thisMonthRevenue: monthlyPayouts._sum.amount || 0,
      thisMonthRedemptions: monthlyRedemptions,
    }
  }
}

export default PartnerService