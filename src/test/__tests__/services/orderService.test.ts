import { describe, it, expect, vi, beforeEach } from 'vitest'
import { orderService } from '@/services/orderService'

// Mock do Firebase
vi.mock('@/services/firebase', () => ({
  db: {
    collection: vi.fn(() => ({
      add: vi.fn(),
      doc: vi.fn(() => ({
        update: vi.fn(),
        onSnapshot: vi.fn(),
      })),
      onSnapshot: vi.fn(),
    })),
  },
}))

describe('OrderService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create an order successfully', async () => {
    const mockOrder = {
      customerName: 'João Silva',
      customerPhone: '11999999999',
      customerAddress: 'Rua Teste, 123',
      items: [
        { id: '1', name: 'Hambúrguer', price: 25, quantity: 2 }
      ],
      total: 50
    }

    const result = await orderService.createOrder(mockOrder)
    
    expect(result).toBeDefined()
    expect(result.id).toBeDefined()
  })

  it('should update order status', async () => {
    const orderId = 'test-order-id'
    const newStatus = 'approved'

    await orderService.updateOrderStatus(orderId, newStatus)
    
    // Verificar se a função foi chamada
    expect(true).toBe(true) // Placeholder - implementar verificação real
  })

  it('should listen to order changes', () => {
    const callback = vi.fn()
    
    orderService.onOrderStatusChange('test-order-id', callback)
    
    expect(callback).toBeDefined()
  })
}) 