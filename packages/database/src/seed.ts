import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@eventhour.de',
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Create Test Partner
  const partnerUser = await prisma.user.create({
    data: {
      email: 'partner@test.de',
      name: 'Test Partner',
      role: 'PARTNER',
      partner: {
        create: {
          companyName: 'Adventure GmbH',
          legalForm: 'GmbH',
          businessStreet: 'Hauptstraße',
          businessNumber: '123',
          businessCity: 'Berlin',
          businessPostalCode: '10115',
          email: 'info@adventure.de',
          phone: '+49 30 12345678',
          verificationStatus: 'VERIFIED',
          verifiedAt: new Date(),
        },
      },
    },
  })

  // Create Test Customer
  const customerUser = await prisma.user.create({
    data: {
      email: 'kunde@test.de',
      name: 'Test Kunde',
      role: 'CUSTOMER',
      customerProfile: {
        create: {
          phone: '+49 170 1234567',
          defaultPostalCode: '10115',
        },
      },
    },
  })

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Abenteuer & Action',
        slug: 'abenteuer-action',
        description: 'Adrenalin pur für Mutige',
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Wellness & Entspannung',
        slug: 'wellness-entspannung',
        description: 'Zeit für Körper und Seele',
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Kulinarik & Genuss',
        slug: 'kulinarik-genuss',
        description: 'Für Feinschmecker und Genießer',
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sport & Fitness',
        slug: 'sport-fitness',
        description: 'Aktiv werden und Spaß haben',
        sortOrder: 4,
      },
    }),
  ])

  // Create Sample Experiences
  const partner = await prisma.partner.findFirst({
    where: { userId: partnerUser.id },
  })

  if (partner) {
    const experiences = [
      {
        title: 'Tandem Fallschirmsprung',
        slug: 'tandem-fallschirmsprung-berlin',
        description:
          'Erlebe den ultimativen Adrenalinkick mit einem Tandemsprung aus 4000 Metern Höhe. Professionelle Instruktoren sorgen für deine Sicherheit.',
        shortDescription: 'Fallschirmsprung aus 4000m Höhe',
        locationName: 'Skydive Berlin',
        city: 'Berlin',
        postalCode: '12529',
        duration: 240,
        retailPrice: 24900, // 249€
        partnerPayout: 17430, // 70%
        categoryId: categories[0].id,
        searchKeywords: 'fallschirm, tandem, sprung, adrenalin, extremsport',
      },
      {
        title: 'Wellness-Wochenende Deluxe',
        slug: 'wellness-wochenende-deluxe-brandenburg',
        description:
          'Zwei Übernachtungen im 5-Sterne Spa-Hotel inklusive Vollpension und unbegrenztem Spa-Zugang.',
        shortDescription: 'Luxus-Spa-Wochenende für Zwei',
        locationName: 'Seeschloss Spa',
        city: 'Brandenburg',
        postalCode: '14776',
        duration: 2880, // 2 Tage
        retailPrice: 59900, // 599€
        partnerPayout: 41930, // 70%
        categoryId: categories[1].id,
        searchKeywords: 'wellness, spa, massage, erholung, wochenende',
      },
      {
        title: 'Sushi-Kochkurs',
        slug: 'sushi-kochkurs-berlin',
        description:
          'Lerne die Kunst der Sushi-Zubereitung von einem japanischen Meisterkoch. Inkl. aller Zutaten und Verkostung.',
        shortDescription: 'Japanischer Sushi-Kurs',
        locationName: 'Kochschule Berlin',
        city: 'Berlin',
        postalCode: '10178',
        duration: 240, // 4 Stunden
        retailPrice: 8900, // 89€
        partnerPayout: 6230, // 70%
        categoryId: categories[2].id,
        searchKeywords: 'sushi, kochen, kurs, japanisch, kulinarik',
      },
      {
        title: 'Stand-Up Paddling Kurs',
        slug: 'stand-up-paddling-kurs-wannsee',
        description:
          'Einführungskurs ins Stand-Up Paddling am schönen Wannsee. Equipment und Neoprenanzug inklusive.',
        shortDescription: 'SUP-Kurs am Wannsee',
        locationName: 'SUP Station Wannsee',
        city: 'Berlin',
        postalCode: '14109',
        duration: 180, // 3 Stunden
        retailPrice: 4900, // 49€
        partnerPayout: 3430, // 70%
        categoryId: categories[3].id,
        searchKeywords: 'sup, paddling, wassersport, wannsee, kurs',
      },
    ]

    for (const exp of experiences) {
      await prisma.experience.create({
        data: {
          ...exp,
          partnerId: partner.id,
        },
      })
    }
  }

  // Create Additional Services
  await prisma.additionalService.createMany({
    data: [
      {
        name: 'Premium Gutscheinbox',
        description: 'Edle Geschenkbox mit goldenem Band',
        price: 990, // 9.90€
        serviceType: 'PHYSICAL_PRODUCT',
      },
      {
        name: 'Persönliche Grußkarte',
        description: 'Individuell gestaltete Grußkarte',
        price: 490, // 4.90€
        serviceType: 'PHYSICAL_PRODUCT',
      },
      {
        name: 'Express-Versand',
        description: 'Lieferung am nächsten Werktag',
        price: 1490, // 14.90€
        serviceType: 'PACKAGING',
      },
      {
        name: 'Video-Grußbotschaft',
        description: 'Persönliche Videobotschaft zum Gutschein',
        price: 1990, // 19.90€
        serviceType: 'DIGITAL_SERVICE',
      },
    ],
  })

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
