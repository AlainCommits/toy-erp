import type { CollectionBeforeChangeHook } from 'payload'
import type { Order, User, Customer } from '../../../../payload-types'
import type { PaginatedDocs } from 'payload'

export const assignCustomer: CollectionBeforeChangeHook<Order> = async ({
  data,
  operation,
  req: { payload, user },
}) => {
  // Only try to assign customer on create
  if (operation !== 'create') return data
  
  // Only for online orders and when we have a user
  const currentUser = user as User | null
  if (data.orderType === 'online' && currentUser?.email) {
    // Try to find existing customer by email
    const existingCustomers: PaginatedDocs<Customer> = await payload.find({
      collection: 'customers',
      where: {
        email: {
          equals: currentUser.email
        }
      },
      limit: 1
    })

    if (existingCustomers.docs.length > 0 && existingCustomers.docs[0]) {
      return {
        ...data,
        customer: existingCustomers.docs[0].id,
      }
    }

    // Create new customer if none exists
    const newCustomer = await payload.create({
      collection: 'customers',
      data: {
        name: currentUser.name || currentUser.email,
        email: currentUser.email,
        customerType: 'retail',
        customerNumber: 'TMP', // Will be replaced by generateCustomerNumber hook
      }
    })

    return {
      ...data,
      customer: newCustomer.id,
    }
  }

  return data
}
