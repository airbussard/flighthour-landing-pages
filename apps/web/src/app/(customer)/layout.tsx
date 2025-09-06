'use client'

import { RootLayout } from '@/components/layout/RootLayout'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <RootLayout>{children}</RootLayout>
}