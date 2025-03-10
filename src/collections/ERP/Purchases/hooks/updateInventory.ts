import type { CollectionAfterChangeHook } from 'payload'
import type { Purchase, Inventory } from '../../../../payload-types'
import type { PaginatedDocs } from 'payload'

export const updateInventory: CollectionAfterChangeHook<Purchase> = async ({
  doc,
  operation,
  req: { payload },
}) => {
  // Only update stock when status changes to 'delivered' or 'partiallyDelivered'
  if (!['delivered', 'partiallyDelivered'].includes(doc.status) || !doc.purchaseItems?.length) return doc

  // Don't process if it's a creation - we only want to handle status changes
  if (operation === 'create') return doc

  // Process each purchase item
  for (const item of doc.purchaseItems) {
    const productId = typeof item.product === 'object' ? item.product.id : item.product

    // Try to find existing inventory record for this product
    const inventoryItems: PaginatedDocs<Inventory> = await payload.find({
      collection: 'inventory',
      where: {
        product: {
          equals: productId,
        },
      },
      depth: 0,
    })

    // If we have an existing inventory location, add to it
    if (inventoryItems.docs.length > 0 && inventoryItems.docs[0]?.id) {
      const primaryLocation = inventoryItems.docs[0]
      
      try {
        await payload.update({
          collection: 'inventory',
          id: primaryLocation.id,
          data: {
            quantity: (primaryLocation.quantity ?? 0) + item.quantity,
          },
        })
      } catch (error) {
        console.error(`Failed to update inventory for product ${productId}:`, error)
      }
      continue
    }

    // If no inventory location exists, create one
    const defaultWarehouse = await payload.find({
      collection: 'warehouses',
      limit: 1,
    })

    if (defaultWarehouse.docs[0]?.id && defaultWarehouse.docs[0]?.code) {
      const product = await payload.findByID({
        collection: 'products',
        id: productId,
      })

      if (product?.sku) {
        try {
          await payload.create({
            collection: 'inventory',
            data: {
              inventoryId: `INV-${product.sku}-${defaultWarehouse.docs[0].code}`,
              product: productId,
              warehouse: defaultWarehouse.docs[0].id,
              quantity: item.quantity,
            },
          })
        } catch (error) {
          console.error(`Failed to create inventory for product ${productId}:`, error)
        }
      }
    }
  }

  return doc
}
