import { ExperienceService } from '../experience-service'
import { prisma } from '../client'

// Mock Prisma client
jest.mock('../client', () => ({
  prisma: {
    experience: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    experienceCategory: {
      findMany: jest.fn(),
    },
  },
}))

describe('ExperienceService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('searchExperiences', () => {
    it('returns filtered experiences', async () => {
      const mockExperiences = [
        {
          id: 'exp-1',
          title: 'Flight Simulator',
          description: 'Experience flying',
          price: 199.99,
          category: 'ADVENTURE',
        },
      ]

      ;(prisma.experience.findMany as jest.Mock).mockResolvedValue(mockExperiences)

      const result = await ExperienceService.searchExperiences({
        category: 'ADVENTURE',
        minPrice: 100,
        maxPrice: 300,
      })

      expect(result).toEqual(mockExperiences)
      expect(prisma.experience.findMany).toHaveBeenCalledWith({
        where: {
          category: 'ADVENTURE',
          price: {
            gte: 100,
            lte: 300,
          },
          isActive: true,
        },
        include: {
          partner: true,
          availabilities: true,
        },
      })
    })

    it('searches by text query', async () => {
      const mockExperiences = []
      ;(prisma.experience.findMany as jest.Mock).mockResolvedValue(mockExperiences)

      await ExperienceService.searchExperiences({
        query: 'simulator',
      })

      expect(prisma.experience.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'simulator', mode: 'insensitive' } },
            { description: { contains: 'simulator', mode: 'insensitive' } },
          ],
          isActive: true,
        },
        include: {
          partner: true,
          availabilities: true,
        },
      })
    })
  })

  describe('getExperienceById', () => {
    it('returns experience with details', async () => {
      const mockExperience = {
        id: 'exp-1',
        title: 'Flight Simulator',
        partner: { id: 'partner-1', companyName: 'Test Company' },
        availabilities: [],
      }

      ;(prisma.experience.findUnique as jest.Mock).mockResolvedValue(mockExperience)

      const result = await ExperienceService.getExperienceById('exp-1')

      expect(result).toEqual(mockExperience)
      expect(prisma.experience.findUnique).toHaveBeenCalledWith({
        where: { id: 'exp-1' },
        include: {
          partner: true,
          availabilities: {
            where: {
              date: { gte: expect.any(Date) },
              availableSpots: { gt: 0 },
            },
            orderBy: { date: 'asc' },
          },
        },
      })
    })

    it('returns null for non-existent experience', async () => {
      ;(prisma.experience.findUnique as jest.Mock).mockResolvedValue(null)

      const result = await ExperienceService.getExperienceById('non-existent')

      expect(result).toBeNull()
    })
  })

  describe('createExperience', () => {
    it('creates new experience', async () => {
      const newExperience = {
        title: 'New Experience',
        description: 'Test description',
        price: 99.99,
        category: 'ADVENTURE',
        partnerId: 'partner-1',
      }

      const mockCreated = { id: 'exp-new', ...newExperience }
      ;(prisma.experience.create as jest.Mock).mockResolvedValue(mockCreated)

      const result = await ExperienceService.createExperience(newExperience)

      expect(result).toEqual(mockCreated)
      expect(prisma.experience.create).toHaveBeenCalledWith({
        data: newExperience,
      })
    })
  })
})