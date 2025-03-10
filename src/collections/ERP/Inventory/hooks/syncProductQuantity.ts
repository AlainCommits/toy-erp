import type { CollectionAfterChangeHook } from 'payload'
import type { Inventory } from '../../../../payload-types'

export const syncProductQuantity: CollectionAfterChangeHook<Inventory> = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  // Only sync if quantity has changed
  if (previousDoc?.quantity === doc.quantity) return doc

  const productId = typeof doc.product === 'object' ? doc.product.id : doc.product
  if (!productId) return doc

  // Get all inventory items for this product
  const inventoryItems = await payload.find({
    collection: 'inventory',
    where: {
      product: {
        equals: productId,
      },
    },
  })

  // Calculate total quantity across all locations
  const totalQuantity = inventoryItems.docs.reduce((sum, item) => sum + (item.quantity ?? 0), 0)

  // Update the product's stock quantity
  await payload.update({
    collection: 'products',
    id: productId,
    data: {
      stockQuantity: totalQuantity,
    },
  })

  return doc
}
