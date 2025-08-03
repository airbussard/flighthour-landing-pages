import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flighthour - Das unvergessliche Geburtstagsgeschenk',
  description: 'Schenke ein einzigartiges Flugerlebnis im professionellen Flugsimulator. Das perfekte Geburtstagsgeschenk für Jung und Alt.',
  keywords: 'Flugsimulator, Geburtstagsgeschenk, Geschenkidee, Flighthour, Flugerlebnis, Berlin',
  authors: [{ name: 'Flighthour' }],
  openGraph: {
    title: 'Flighthour - Das unvergessliche Geburtstagsgeschenk',
    description: 'Schenke ein einzigartiges Flugerlebnis im professionellen Flugsimulator.',
    url: 'https://geschenke.flighthour.de',
    siteName: 'Flighthour Geschenke',
    images: [
      {
        url: '/images/og-birthday.jpg',
        width: 1200,
        height: 630,
        alt: 'Flighthour Geburtstagsgeschenk',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flighthour - Das unvergessliche Geburtstagsgeschenk',
    description: 'Schenke ein einzigartiges Flugerlebnis im professionellen Flugsimulator.',
    images: ['/images/og-birthday.jpg'],
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}