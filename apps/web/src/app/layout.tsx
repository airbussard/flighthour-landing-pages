import type { Metadata } from 'next'
import './globals.css'
import { RootLayout } from '@/components/layout/RootLayout'

export const metadata: Metadata = {
  metadataBase: new URL('https://eventhour.de'),
  title: 'Eventhour - Unvergessliche Erlebnisse schenken',
  description:
    'Entdecke einzigartige Erlebnisse und Geschenkideen bei Eventhour. Von Abenteuer bis Wellness - finde das perfekte Geschenk für jeden Anlass.',
  keywords: 'Erlebnisgeschenke, Gutscheine, Geschenkideen, Abenteuer, Wellness, Events',
  openGraph: {
    title: 'Eventhour - Unvergessliche Erlebnisse schenken',
    description: 'Entdecke einzigartige Erlebnisse und Geschenkideen bei Eventhour.',
    url: 'https://eventhour.de',
    siteName: 'Eventhour',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Eventhour - Erlebnisgeschenke',
      },
    ],
    locale: 'de_DE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eventhour - Unvergessliche Erlebnisse schenken',
    description: 'Entdecke einzigartige Erlebnisse und Geschenkideen bei Eventhour.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </head>
      <body className="font-poppins antialiased">
        <RootLayout>{children}</RootLayout>
      </body>
    </html>
  )
}
