import type { CollectionBeforeChangeHook } from 'payload'
import type { Purchase } from '../../../../payload-types'

export const handleCancellation: CollectionBeforeChangeHook<Purchase> = async ({
  data,
  originalDoc,
  req: { payload },
}) => {
  // Only handle status changes to cancelled
  if (!originalDoc || data.status !== 'cancelled') {
    return data
  }

  // If the status was already cancelled, don't process
  if (originalDoc.status === 'cancelled') {
    return data
  }

  // If the order was already completed or delivered, don't process
  if (['completed', 'delivered'].includes(originalDoc.status)) {
    return data
  }

  // Get all purchase items that need to be handled
  const items = originalDoc.purchaseItems || []

  // Process each item
  for (const item of items) {
    const productId = typeof item.product === 'object' ? item.product.id : item.product

    // Only adjust inventory for delivered or partially delivered purchases
    if (['delivered', 'partiallyDelivered'].includes(originalDoc.status)) {
      // Get inventory items for this product
      const inventoryResponse = await payload.find({
        collection: 'inventory',
        where: {
          product: {
            equals: productId,
          },
        },
        depth: 0,
      })

      // Adjust stock if inventory exists
      if (inventoryResponse.docs.length > 0) {
        const primaryLocation = inventoryResponse.docs[0]
        if (!primaryLocation?.id) {
          const errorMessage = `No valid inventory location found for product ${productId}`
          payload.logger.error({
            msg: errorMessage,
            data: { productId }
          })
          continue
        }

        try {
          // Reduce stock by the full quantity since we're cancelling the purchase
          await payload.update({
            collection: 'inventory',
            id: primaryLocation.id,
            data: {
              quantity: Math.max(0, (primaryLocation.quantity || 0) - item.quantity),
            },
          })
        } catch (error) {
          const errorMessage = `Failed to update inventory for cancelled purchase`
          payload.logger.error({
            msg: errorMessage,
            err: error,
            data: { 
              productId,
              locationId: primaryLocation.id,
              quantity: item.quantity 
            }
          })
          throw new Error(errorMessage)
        }
      } else {
        payload.logger.warn({
          msg: 'No inventory locations found during purchase cancellation',
          data: { productId }
        })
      }
    }
  }

  return data
}
