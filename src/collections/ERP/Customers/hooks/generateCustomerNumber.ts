import type { CollectionBeforeChangeHook } from 'payload'
import type { Customer } from '../../../../payload-types'

export const generateCustomerNumber: CollectionBeforeChangeHook<Customer> = async ({
  data,
  operation,
  req: { payload },
}) => {
  // Only generate number on create
  if (operation !== 'create') return data

  // Find the highest existing customer number
  const existingCustomers = await payload.find({
    collection: 'customers',
    sort: '-customerNumber',
    limit: 1,
    depth: 0,
  })

  let nextNumber = 1
  const lastCustomer = existingCustomers.docs[0] as Customer | undefined
  if (lastCustomer?.customerNumber) {
    const match = lastCustomer.customerNumber.match(/CUST-(\d+)/)
    if (match?.[1]) {
      nextNumber = parseInt(match[1], 10) + 1
    }
  }

  return {
    ...data,
    customerNumber: `CUST-${nextNumber.toString().padStart(5, '0')}`,
  }
}
