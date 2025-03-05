import type { CollectionBeforeChangeHook } from 'payload'
import type { Product } from '../../../../payload-types'

export const generateArticleNumber: CollectionBeforeChangeHook<Product> = async ({
  data, // for data being passed into create operation
  req: { payload },
}) => {
  // Find the highest existing article number
  const existingProducts = await payload.find({
    collection: 'products',
    sort: '-sku',
    limit: 1,
    depth: 0,
  })

  let nextNumber = 1
  const lastProduct = existingProducts.docs[0] as Product | undefined
  if (lastProduct?.sku) {
    const match = lastProduct.sku.match(/ART-(\d+)/)
    if (match?.[1]) {
      nextNumber = parseInt(match[1], 10) + 1
    }
  }

  return {
    ...data,
    sku: `ART-${nextNumber.toString().padStart(5, '0')}`,
  }
}
