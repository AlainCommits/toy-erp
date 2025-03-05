import type { CollectionBeforeChangeHook } from 'payload'
import type { Order } from '../../../../payload-types'

export const validateOrderItems: CollectionBeforeChangeHook<Order> = async ({
  data,
  req: { payload },
}) => {
  if (!data?.orderItems?.length) return data

  for (const item of data.orderItems) {
    const productId = typeof item.product === 'object' ? item.product.id : item.product

    const product = await payload.findByID({
      collection: 'products',
      id: productId,
      depth: 0,
    })

    if (!product) {
      throw new Error('Product not found')
    }

    // We know stockQuantity exists because it's required in the schema
    // but TypeScript doesn't know this, so we need to handle the case
    const stockQuantity = product.stockQuantity ?? 0

    if (stockQuantity < item.quantity) {
      throw new Error(`Insufficient stock for product ${product.name} (${stockQuantity} available)`)
    }

    // Set unit price if not manually provided
    if (!item.unitPrice) {
      item.unitPrice = product.price
    }
  }

  return data
}
