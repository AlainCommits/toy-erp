import type { CollectionAfterChangeHook } from 'payload'
import type { Customer } from '../../../../payload-types'

export const assignOrders: CollectionAfterChangeHook<Customer> = async ({
  doc,
  req: { payload },
}) => {
  // Find orders that belong to this customer
  const orders = await payload.find({
    collection: 'orders',
    where: {
      customer: {
        equals: doc.id,
      },
    },
    depth: 0,
  })

  // Update customer's orders field with found orders
  if (orders.docs.length > 0) {
    const orderIds = orders.docs.map(order => order.id)
    await payload.update({
      collection: 'customers',
      id: doc.id,
      data: {
        orders: orderIds,
      },
    })
  }

  return doc
}
