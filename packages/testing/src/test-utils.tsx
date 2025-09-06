import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'USER',
  createdAt: new Date().toISOString(),
  ...overrides,
})

export const createMockExperience = (overrides = {}) => ({
  id: 'exp-123',
  title: 'Test Experience',
  description: 'Test Description',
  price: 99.99,
  duration: 60,
  maxParticipants: 10,
  images: ['/test-image.jpg'],
  category: 'ADVENTURE',
  location: 'Test Location',
  ...overrides,
})

export const createMockOrder = (overrides = {}) => ({
  id: 'order-123',
  userId: 'user-123',
  status: 'PENDING',
  total: 99.99,
  items: [],
  createdAt: new Date().toISOString(),
  ...overrides,
})

export const createMockPartner = (overrides = {}) => ({
  id: 'partner-123',
  companyName: 'Test Company',
  email: 'partner@example.com',
  verificationStatus: 'VERIFIED',
  isActive: true,
  commission: 20,
  ...overrides,
})