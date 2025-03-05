import type { CollectionAfterChangeHook } from 'payload'
import type { Product } from '../../../../payload-types'

export const syncProductPrice: CollectionAfterChangeHook<Product> = async ({
  doc,
  operation,
  req: { payload },
}) => {
  // Only sync on update and create
  if (operation !== 'update' && operation !== 'create') return doc

  // Find all draft orders that reference this product
  const orders = await payload.find({
    collection: 'orders',
    where: {
      'orderItems.product': {
        equals: doc.id,
      },
      status: {
        equals: 'new',
      },
    },
    depth: 0,
  })

  // Update each order's item prices
  for (const order of orders.docs) {
    const updatedItems = order.orderItems?.map(item => {
      if (item.product === doc.id) {
        return {
          ...item,
          unitPrice: doc.price,
        }
      }
      return item
    })

    if (updatedItems) {
      await payload.update({
        collection: 'orders',
        id: order.id,
        data: {
          orderItems: updatedItems,
          // Recalculate totals
          subtotal: updatedItems.reduce((sum, item) => {
            const itemTotal = item.quantity * item.unitPrice
            return sum + (itemTotal - (itemTotal * (item.discount || 0) / 100))
          }, 0),
        },
      })
    }
  }

  // Find and update inventory entries that match this product
  const inventory = await payload.find({
    collection: 'inventory',
    where: {
      product: {
        equals: doc.id,
      },
    },
    depth: 0,
  })

  // Note: We don't update value in inventory since that's not part of our schema
  // Instead we calculate it when needed based on current price * quantity

  return doc
}
