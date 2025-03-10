import type { CollectionAfterChangeHook } from 'payload'
import type { Order } from '../../../../payload-types'

export const updateInventory: CollectionAfterChangeHook<Order> = async ({
  doc,
  operation,
  req: { payload },
}) => {
  // Only update stock on create
  if (operation !== 'create' || !doc.orderItems?.length) return doc

  // Process each order item
  for (const item of doc.orderItems) {
    const productId = typeof item.product === 'object' ? item.product.id : item.product

    // Get all inventory locations for this product
    const inventoryItems = await payload.find({
      collection: 'inventory',
      where: {
        product: {
          equals: productId,
        },
      },
      sort: '-quantity', // Get locations with highest stock first
    })

    // Collect valid inventory items
    const validItems = inventoryItems.docs.filter(invItem => 
      invItem?.id && typeof invItem.quantity === 'number' && invItem.quantity > 0
    )

    let remainingQuantity = item.quantity

    // Reduce stock from available locations
    for (const invItem of validItems) {
      if (remainingQuantity <= 0) break

      const deduction = Math.min(invItem.quantity, remainingQuantity)
      remainingQuantity -= deduction

      await payload.update({
        collection: 'inventory',
        id: invItem.id,
        data: {
          quantity: invItem.quantity - deduction,
        },
      })
    }

    if (remainingQuantity > 0) {
      throw new Error(`Insufficient stock for product in any location`)
    }
  }

  return doc
}
