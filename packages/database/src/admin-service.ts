import { prisma } from './client'
import { User, Partner, Experience, Order, Voucher, UserRole, Prisma } from '@prisma/client'

export class AdminService {
  // Dashboard Statistics
  static async getDashboardStats() {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    const [
      totalUsers,
      newUsersThisMonth,
      totalPartners,
      activePartners,
      totalOrders,
      ordersThisMonth,
      totalRevenue,
      revenueThisMonth,
      revenueLastMonth,
      totalExperiences,
      activeExperiences,
      totalVouchers,
      activeVouchers,
      redeemedVouchersThisMonth,
    ] = await Promise.all([
      // User stats
      prisma.user.count(),
      prisma.user.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      // Partner stats
      prisma.partner.count(),
      prisma.partner.count({
        where: { 
          verificationStatus: 'VERIFIED',
          isActive: true 
        },
      }),
      // Order stats
      prisma.order.count(),
      prisma.order.count({
        where: { createdAt: { gte: startOfMonth } },
      }),
      // Revenue stats
      prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: startOfMonth },
        },
        _sum: { totalAmount: true },
      }),
      prisma.order.aggregate({
        where: {
          status: 'COMPLETED',
          createdAt: {
            gte: startOfLastMonth,
            lte: endOfLastMonth,
          },
        },
        _sum: { totalAmount: true },
      }),
      // Experience stats
      prisma.experience.count(),
      prisma.experience.count({
        where: { isActive: true },
      }),
      // Voucher stats
      prisma.voucher.count(),
      prisma.voucher.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.voucher.count({
        where: {
          status: 'REDEEMED',
          redeemedAt: { gte: startOfMonth },
        },
      }),
    ])

    const monthlyGrowth = revenueLastMonth._sum.totalAmount
      ? ((revenueThisMonth._sum.totalAmount || 0) - (revenueLastMonth._sum.totalAmount || 0)) /
        revenueLastMonth._sum.totalAmount *
        100
      : 0

    return {
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
      },
      partners: {
        total: totalPartners,
        active: activePartners,
      },
      orders: {
        total: totalOrders,
        thisMonth: ordersThisMonth,
      },
      revenue: {
        total: totalRevenue._sum.totalAmount || 0,
        thisMonth: revenueThisMonth._sum.totalAmount || 0,
        lastMonth: revenueLastMonth._sum.totalAmount || 0,
        monthlyGrowth,
      },
      experiences: {
        total: totalExperiences,
        active: activeExperiences,
      },
      vouchers: {
        total: totalVouchers,
        active: activeVouchers,
        redeemedThisMonth: redeemedVouchersThisMonth,
      },
    }
  }

  // User Management
  static async getUsers(params?: {
    skip?: number
    take?: number
    search?: string
    role?: UserRole
    orderBy?: Prisma.UserOrderByWithRelationInput
  }) {
    const where: Prisma.UserWhereInput = {}

    if (params?.search) {
      where.OR = [
        { email: { contains: params.search, mode: 'insensitive' } },
        { name: { contains: params.search, mode: 'insensitive' } },
      ]
    }

    if (params?.role) {
      where.role = params.role
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: params?.skip || 0,
        take: params?.take || 20,
        orderBy: params?.orderBy || { createdAt: 'desc' },
        include: {
          customerProfile: true,
          partner: true,
        },
      }),
      prisma.user.count({ where }),
    ])

    return { users, total }
  }

  static async updateUserRole(userId: string, role: UserRole) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    })

    // Create partner profile if changing to PARTNER role
    if (role === 'PARTNER') {
      const existingPartner = await prisma.partner.findUnique({
        where: { userId },
      })

      if (!existingPartner) {
        await prisma.partner.create({
          data: {
            userId,
            companyName: user.name || 'Unnamed Partner',
            businessStreet: '',
            businessNumber: '',
            businessCity: '',
            businessPostalCode: '',
            verificationStatus: 'PENDING',
          },
        })
      }
    }

    return user
  }

  static async deleteUser(userId: string) {
    return prisma.user.delete({
      where: { id: userId },
    })
  }

  // Partner Management
  static async getPartners(params?: {
    skip?: number
    take?: number
    search?: string
    verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED'
    isActive?: boolean
  }) {
    const where: Prisma.PartnerWhereInput = {}

    if (params?.search) {
      where.OR = [
        { companyName: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
      ]
    }

    if (params?.verificationStatus) {
      where.verificationStatus = params.verificationStatus
    }
    
    if (params?.isActive !== undefined) {
      where.isActive = params.isActive
    }

    const [partners, total] = await Promise.all([
      prisma.partner.findMany({
        where,
        skip: params?.skip || 0,
        take: params?.take || 20,
        orderBy: { createdAt: 'desc' },
        include: {
          user: true,
          experiences: {
            select: {
              id: true,
              title: true,
              isActive: true,
            },
          },
          _count: {
            select: {
              experiences: true,
              payouts: true,
            },
          },
        },
      }),
      prisma.partner.count({ where }),
    ])

    return { partners, total }
  }

  static async updatePartnerStatus(
    partnerId: string,
    verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED',
    isActive?: boolean
  ) {
    const data: any = {}
    if (verificationStatus) data.verificationStatus = verificationStatus
    if (isActive !== undefined) data.isActive = isActive
    
    return prisma.partner.update({
      where: { id: partnerId },
      data,
    })
  }

  static async getPartnerPayouts(partnerId?: string) {
    const where: Prisma.PartnerPayoutWhereInput = partnerId
      ? { partnerId }
      : {}

    return prisma.partnerPayout.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        partner: {
          include: {
            user: true,
          },
        },
        voucher: {
          include: {
            experience: true,
          },
        },
      },
    })
  }

  static async processPayouts(payoutIds: string[]) {
    return prisma.partnerPayout.updateMany({
      where: {
        id: { in: payoutIds },
        status: 'PENDING',
      },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    })
  }

  // Experience Management
  static async getExperiences(params?: {
    skip?: number
    take?: number
    search?: string
    isActive?: boolean
    partnerId?: string
  }) {
    const where: Prisma.ExperienceWhereInput = {}

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ]
    }

    if (params?.isActive !== undefined) {
      where.isActive = params.isActive
    }

    if (params?.partnerId) {
      where.partnerId = params.partnerId
    }

    const [experiences, total] = await Promise.all([
      prisma.experience.findMany({
        where,
        skip: params?.skip || 0,
        take: params?.take || 20,
        orderBy: { createdAt: 'desc' },
        include: {
          partner: {
            include: {
              user: true,
            },
          },
          category: true,
          _count: {
            select: {
              vouchers: true,
            },
          },
        },
      }),
      prisma.experience.count({ where }),
    ])

    return { experiences, total }
  }

  static async toggleExperienceStatus(experienceId: string) {
    const experience = await prisma.experience.findUnique({
      where: { id: experienceId },
    })

    if (!experience) {
      throw new Error('Experience not found')
    }

    return prisma.experience.update({
      where: { id: experienceId },
      data: { isActive: !experience.isActive },
    })
  }

  // Order Management
  static async getOrders(params?: {
    skip?: number
    take?: number
    search?: string
    status?: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
  }) {
    const where: Prisma.OrderWhereInput = {}

    if (params?.search) {
      where.OR = [
        { id: { contains: params.search, mode: 'insensitive' } },
        { customerEmail: { contains: params.search, mode: 'insensitive' } },
      ]
    }

    if (params?.status) {
      where.status = params.status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: params?.skip || 0,
        take: params?.take || 20,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              experience: true,
            },
          },
          vouchers: true,
          customer: {
            include: {
              user: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ])

    return { orders, total }
  }

  static async updateOrderStatus(
    orderId: string,
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
  ) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
    })
  }

  // Revenue Analytics
  static async getRevenueAnalytics(days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const orders = await prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        totalAmount: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    // Group by date
    const revenueByDate = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date] += order.totalAmount
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
  }

  // User Growth Analytics
  static async getUserGrowthAnalytics(days: number = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const users = await prisma.user.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        role: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    // Group by date and role
    const usersByDate = users.reduce((acc, user) => {
      const date = user.createdAt.toISOString().split('T')[0]
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
  }

  // System Settings (stored in a separate settings table or config)
  static async getSystemSettings() {
    // For now, return hardcoded settings
    // In production, these would be stored in database
    return {
      platformFee: 30, // 30% platform fee
      minPayoutAmount: 50, // Minimum 50€ for partner payouts
      voucherValidityDays: 365, // Vouchers valid for 1 year
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