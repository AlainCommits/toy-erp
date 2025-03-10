import type { CollectionAfterChangeHook } from 'payload'
import type { Product, Inventory, Warehouse } from '../../../../payload-types'
import type { PaginatedDocs } from 'payload'

export const syncInventoryQuantity: CollectionAfterChangeHook<Product> = async ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  // If stockQuantity hasn't changed, no need to sync
  if (previousDoc?.stockQuantity === doc.stockQuantity) return doc

  // Get all inventory items for this product
  const inventoryItems: PaginatedDocs<Inventory> = await payload.find({
    collection: 'inventory',
    where: {
      product: {
        equals: doc.id,
      },
    },
  })

  const totalQuantity = doc.stockQuantity ?? 0

  // Check if we have any inventory items and if they have valid quantities
  const validInventoryItems = inventoryItems.docs.filter(item => item?.id && typeof item.quantity === 'number')
  const currentTotal = validInventoryItems.reduce((sum, item) => sum + item.quantity, 0)

  // If there's only one inventory record, update it
  if (validInventoryItems.length === 1) {
    const item = validInventoryItems[0]
    if (!item?.id) return doc

    await payload.update({
      collection: 'inventory',
      id: item.id,
      data: {
        quantity: totalQuantity,
      },
    })
    return doc
  }

  // If there are multiple records, distribute the difference proportionally
  if (validInventoryItems.length > 1) {
    const difference = totalQuantity - currentTotal
    for (const item of validInventoryItems) {
      if (!item?.id || typeof item.quantity !== 'number') continue

      const proportion = item.quantity / currentTotal
      const adjustment = Math.round(difference * proportion)
      
      await payload.update({
        collection: 'inventory',
        id: item.id,
        data: {
          quantity: Math.max(0, item.quantity + adjustment),
        },
      })
    }
  }

  // If there are no inventory records, create one with default warehouse
  if (validInventoryItems.length === 0) {
    const defaultWarehouse: PaginatedDocs<Warehouse> = await payload.find({
      collection: 'warehouses',
      limit: 1,
    })

    const warehouse = defaultWarehouse.docs[0]
    if (warehouse?.id && warehouse.code && doc.sku) {
      const inventoryId = `INV-${doc.sku}-${warehouse.code}`
      await payload.create({
        collection: 'inventory',
        data: {
          inventoryId,
          product: doc.id,
          warehouse: warehouse.id,
          quantity: totalQuantity,
        },
      })
    }
  }

  return doc
}
