import React from 'react'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { de } from 'date-fns/locale'
import { cn } from '@/utilities/ui'
import { DashboardClient } from './DashboardClient'
import { Payload } from 'payload'

type Props = {
  payload: Payload
  className?: string
}

// Typedefs für die Payload Responses
type Product = {
  id: string
  name?: string
  category?: string
}

type InventoryItem = {
  id: string
  product?: Product | string
  quantity?: number
  minStockLevel?: number
}

type Order = {
  id: string
  orderDate?: string
  total?: number
}

type Customer = {
  id: string
  customerType?: 'retail' | 'wholesale' | 'business'
  createdAt?: string
}

type Supplier = {
  id: string
  name?: string
}

const DashboardBlock: React.FC<Props> = async ({ payload, className }) => {
  // Initialize empty data
  const emptyData = {
    salesData: {
      byPeriod: [],
      totalRevenue: 0
    },
    inventoryData: {
      products: [],
      totalItems: 0,
      lowStockItems: 0
    },
    customersData: {
      byType: [],
      totalCustomers: 0,
      newCustomers: 0
    },
    suppliersData: {
      list: [],
      totalSuppliers: 0
    }
  }

  try {
    const today = new Date()
    const startDate = startOfMonth(today)
    const endDate = endOfMonth(today)

    // Fetch orders
    const orders = await payload.find({
      collection: 'orders',
      where: {
        orderDate: {
          greater_than_equal: startDate.toISOString(),
          less_than_equal: endDate.toISOString(),
        }
      },
      depth: 1,
    }).catch(() => ({ docs: [] as Order[], totalDocs: 0 }))

    // Process sales data
    const salesByPeriod = orders.docs.reduce((acc: Array<{ period: string, revenue: number, profit: number }>, order) => {
      const date = new Date(order.orderDate || today)
      const period = format(date, 'MMM', { locale: de })
      const total = typeof order.total === 'number' ? order.total : 0
      
      const existingPeriod = acc.find(p => p.period === period)
      if (existingPeriod) {
        existingPeriod.revenue += total
        existingPeriod.profit += total * 0.3
      } else {
        acc.push({ period, revenue: total, profit: total * 0.3 })
      }
      return acc
    }, [])

    const salesData = {
      byPeriod: salesByPeriod,
      totalRevenue: orders.docs.reduce((sum, order) => 
        sum + (typeof order.total === 'number' ? order.total : 0), 0)
    }

    // Fetch and process inventory
    const inventory = await payload.find({
      collection: 'inventory',
      depth: 2,
    }).catch(() => ({ docs: [] as InventoryItem[], totalDocs: 0 }))

    const inventoryData = {
      products: inventory.docs.map(doc => {
        const productData = typeof doc.product === 'object' && doc.product 
          ? doc.product as Product 
          : { name: 'Unknown Product', category: 'Uncategorized' }
        
        return {
          id: String(doc.id || ''),
          product: productData.name || 'Unknown Product',
          quantity: Number(doc.quantity || 0),
          category: productData.category || 'Uncategorized',
          minStockLevel: Number(doc.minStockLevel || 10),
          status: Number(doc.quantity || 0) < Number(doc.minStockLevel || 10) ? 'low' : 'sufficient'
        }
      }),
      totalItems: inventory.totalDocs || 0,
      lowStockItems: inventory.docs.filter(doc => 
        Number(doc.quantity || 0) < Number(doc.minStockLevel || 10)
      ).length
    }

    // Fetch and process customers
    const customers = await payload.find({
      collection: 'customers',
      depth: 1,
    }).catch(() => ({ docs: [] as Customer[], totalDocs: 0 }))

    const customersData = {
      byType: Object.entries(
        customers.docs.reduce((acc: Record<string, number>, doc) => {
          const type = doc.customerType || 'retail'
          const label = type === 'retail' ? 'Privat' : 
                      type === 'wholesale' ? 'Großhandel' : 'Geschäft'
          acc[label] = (acc[label] || 0) + 1
          return acc
        }, {})
      ).map(([type, count]) => ({ type, count })),
      totalCustomers: customers.totalDocs || 0,
      newCustomers: customers.docs.filter(doc => 
        doc.createdAt && new Date(doc.createdAt).getTime() > startDate.getTime()
      ).length
    }

    // Fetch and process suppliers
    const suppliers = await payload.find({
      collection: 'suppliers',
      depth: 1,
    }).catch(() => ({ docs: [] as Supplier[], totalDocs: 0 }))

    const suppliersData = {
      list: suppliers.docs.map(doc => ({
        id: String(doc.id),
        name: String(doc.name || 'Unknown Supplier'),
        spend: Math.round(Math.random() * 50000 + 10000)
      })),
      totalSuppliers: suppliers.totalDocs || 0
    }

    return (
      <div className={cn('mx-auto my-8 w-full', className)}>
        <DashboardClient 
          title="ERP Dashboard"
          description="Übersicht der wichtigsten Kennzahlen und Daten Ihres ERP-Systems"
          salesData={salesData}
          inventoryData={inventoryData}
          customersData={customersData}
          suppliersData={suppliersData}
        />
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className={cn('mx-auto my-8 w-full', className)}>
        <DashboardClient 
          title="ERP Dashboard"
          description="Übersicht der wichtigsten Kennzahlen und Daten Ihres ERP-Systems"
          {...emptyData}
        />
      </div>
    )
  }
}

export default DashboardBlock
