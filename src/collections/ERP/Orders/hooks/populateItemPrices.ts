import type { CollectionBeforeChangeHook } from 'payload'
import type { Order } from '../../../../payload-types'

export const populateItemPrices: CollectionBeforeChangeHook<Order> = async ({
  data,
  req: { payload },
}) => {
  if (!data?.orderItems?.length) return data

  const updatedItems = []

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

    const stockQuantity = product.stockQuantity ?? 0
    if (stockQuantity < item.quantity) {
      throw new Error(`Not enough stock for product ${product.name}. Available: ${stockQuantity}, Requested: ${item.quantity}`)
    }

    updatedItems.push({
      ...item,
      unitPrice: item.unitPrice || product.price
    })
  }

  // Calculate totals
  const subtotal = updatedItems.reduce((sum, item) => {
    const itemTotal = item.quantity * (item.unitPrice || 0)
    return sum + (itemTotal - (itemTotal * (item.discount || 0) / 100))
  }, 0)

  return {
    ...data,
    orderItems: updatedItems,
    subtotal: Math.round(subtotal * 100) / 100, // Round to 2 decimal places
    total: Math.round((subtotal + (data.shippingCost || 0) - (data.discount || 0)) * 100) / 100
  }
}
