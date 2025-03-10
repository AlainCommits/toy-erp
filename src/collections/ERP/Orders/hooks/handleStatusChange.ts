import type { CollectionBeforeChangeHook } from 'payload'
import type { Order } from '../../../../payload-types'

export const handleStatusChange: CollectionBeforeChangeHook<Order> = async ({
  data,
  originalDoc,
  req: { payload },
}) => {
  // Only handle status changes to cancelled or refunded
  if (!originalDoc || data.status === originalDoc.status) {
    return data
  }

  // Don't process if already cancelled or refunded
  if (originalDoc.status === 'cancelled' || originalDoc.status === 'refunded') {
    return data
  }

  // Handle cancellation or refund status change
  if (data.status === 'cancelled' || data.status === 'refunded') {
    try {
    // Get the order items to restore
    const items = originalDoc.orderItems || []

    // Restore stock for each item
    for (const item of items) {
      const productId = typeof item.product === 'object' ? item.product.id : item.product
      const quantity = item.quantity

      // Get product's current inventory locations
      const inventoryResponse = await payload.find({
        collection: 'inventory',
        where: {
          product: {
            equals: productId,
          },
        },
        sort: '-quantity', // Prioritize locations with highest stock
      })

      // Add stock back to the first available location
      if (inventoryResponse.docs.length > 0) {
        const primaryLocation = inventoryResponse.docs[0]
        if (!primaryLocation?.id) {
          throw new Error(`No valid inventory location found for product ${productId}`)
        }
        
        try {
          await payload.update({
            collection: 'inventory',
            id: primaryLocation.id,
            data: {
              quantity: (primaryLocation.quantity || 0) + quantity,
            },
          })
        } catch (error) {
          const errorMessage = `Failed to restore stock for product ${productId} in location ${primaryLocation.id}`
          payload.logger.error({
            msg: errorMessage,
            err: error,
            data: { productId, quantity, locationId: primaryLocation.id }
          })
          throw new Error(errorMessage)
        }
      } else {
        throw new Error(`No inventory locations found for product ${productId}`)
      }
    }
    } catch (error) {
      payload.logger.error({
        msg: 'Error processing order status change',
        err: error,
        data: { orderId: originalDoc.id, newStatus: data.status }
      })
      throw error
    }
  }

  return data
}
