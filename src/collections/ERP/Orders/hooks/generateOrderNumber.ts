import type { CollectionBeforeChangeHook } from 'payload'
import type { Order } from '../../../../payload-types'

export const generateOrderNumber: CollectionBeforeChangeHook<Order> = async ({
  data,
  operation,
  req: { payload },
}) => {
  // Only generate number on create
  if (operation !== 'create') return data

  // Find the highest existing order number
  const existingOrders = await payload.find({
    collection: 'orders',
    sort: '-orderNumber',
    limit: 1,
    depth: 0,
  })

  let nextNumber = 1
  const lastOrder = existingOrders.docs[0] as Order | undefined
  if (lastOrder?.orderNumber) {
    const match = lastOrder.orderNumber.match(/ORD-(\d+)/)
    if (match?.[1]) {
      nextNumber = parseInt(match[1], 10) + 1
    }
  }

  // Set current date as orderDate if not provided
  if (!data.orderDate) {
    data.orderDate = new Date().toISOString()
  }

  return {
    ...data,
    orderNumber: `ORD-${nextNumber.toString().padStart(5, '0')}`,
  }
}
