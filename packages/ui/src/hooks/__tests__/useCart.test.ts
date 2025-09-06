import { renderHook, act } from '@testing-library/react'
import { useCart } from '../useCart'

describe('useCart Hook', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes with empty cart', () => {
    const { result } = renderHook(() => useCart())
    
    expect(result.current.items).toEqual([])
    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })

  it('adds item to cart', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem({
        id: 'exp-1',
        experienceId: 'exp-1',
        title: 'Test Experience',
        price: 99.99,
        quantity: 1,
        date: '2024-03-01',
        participants: 2,
      })
    })
    
    expect(result.current.items).toHaveLength(1)
    expect(result.current.totalItems).toBe(1)
    expect(result.current.totalPrice).toBe(99.99)
  })

  it('updates item quantity', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem({
        id: 'exp-1',
        experienceId: 'exp-1',
        title: 'Test Experience',
        price: 99.99,
        quantity: 1,
        date: '2024-03-01',
        participants: 2,
      })
    })
    
    act(() => {
      result.current.updateQuantity('exp-1', 3)
    })
    
    expect(result.current.items[0].quantity).toBe(3)
    expect(result.current.totalItems).toBe(3)
    expect(result.current.totalPrice).toBe(299.97)
  })

  it('removes item from cart', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem({
        id: 'exp-1',
        experienceId: 'exp-1',
        title: 'Test Experience',
        price: 99.99,
        quantity: 1,
        date: '2024-03-01',
        participants: 2,
      })
    })
    
    act(() => {
      result.current.removeItem('exp-1')
    })
    
    expect(result.current.items).toHaveLength(0)
    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })

  it('clears entire cart', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem({
        id: 'exp-1',
        experienceId: 'exp-1',
        title: 'Test Experience',
        price: 99.99,
        quantity: 1,
        date: '2024-03-01',
        participants: 2,
      })
      result.current.addItem({
        id: 'exp-2',
        experienceId: 'exp-2',
        title: 'Another Experience',
        price: 149.99,
        quantity: 2,
        date: '2024-03-02',
        participants: 1,
      })
    })
    
    act(() => {
      result.current.clearCart()
    })
    
    expect(result.current.items).toHaveLength(0)
    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })

  it('persists cart to localStorage', () => {
    const { result } = renderHook(() => useCart())
    
    act(() => {
      result.current.addItem({
        id: 'exp-1',
        experienceId: 'exp-1',
        title: 'Test Experience',
        price: 99.99,
        quantity: 1,
        date: '2024-03-01',
        participants: 2,
      })
    })
    
    const stored = localStorage.getItem('eventhour-cart')
    expect(stored).toBeTruthy()
    
    const parsed = JSON.parse(stored!)
    expect(parsed.state.items).toHaveLength(1)
  })
})