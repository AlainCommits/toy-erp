import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { SalesData } from '../types'
import { collectionExists } from './helpers'

// Typangabe für Payload verbessert
export async function fetchSalesData(payload: any, startDate: Date, endDate: Date): Promise<SalesData> {
  try {
    console.log('Fetching sales data...')
    
    // Check if Revenue collection exists first (preferred source)
    const revenueCollectionExists = await collectionExists(payload, 'revenue')
    if (revenueCollectionExists) {
      try {
        const revenueData = await payload.find({
          collection: 'revenue',
          where: {
            period: {
              greater_than_equal: startDate.toISOString(),
              less_than_equal: endDate.toISOString(),
            }
          },
          depth: 1,
        })
        
        console.log(`Found ${revenueData.docs.length} revenue records`)
        
        if (revenueData.docs && revenueData.docs.length > 0) {
          // Group by period for the chart data
          const revenueByPeriod = revenueData.docs.reduce((acc: Record<string, any>, item: any) => {
            if (!item.period) return acc
            
            const periodDate = new Date(item.period)
            const periodKey = format(periodDate, 'MMM', { locale: de })
            
            if (!acc[periodKey]) {
              acc[periodKey] = { period: periodKey, revenue: 0, profit: 0 }
            }
            
            acc[periodKey].revenue += typeof item.amount === 'number' ? item.amount : 0
            acc[periodKey].profit += typeof item.profit === 'number' ? item.profit : 
                                   (typeof item.amount === 'number' ? item.amount * 0.4 : 0)
            
            return acc
          }, {})
          
          const totalRevenue = revenueData.docs.reduce(
            (sum: number, item: any) => sum + (typeof item.amount === 'number' ? item.amount : 0), 
            0
          )
          
          return {
            byPeriod: Object.values(revenueByPeriod),
            totalRevenue
          }
        }
      } catch (err) {
        console.error('Error fetching from revenue collection:', err)
      }
    }
    
    // Fallback to Orders collection if available
    const ordersCollectionExists = await collectionExists(payload, 'orders')
    if (ordersCollectionExists) {
      try {
        const orders = await payload.find({
          collection: 'orders',
          where: {
            orderDate: {
              greater_than_equal: startDate.toISOString(),
              less_than_equal: endDate.toISOString(),
            }
          },
          depth: 1,
        })
        
        console.log(`Found ${orders.docs.length} order records`)
        
        if (orders.docs && orders.docs.length > 0) {
          // Process order data into sales format
          const orderData = orders.docs.map((order: any) => {
            const orderDate = order.orderDate ? new Date(order.orderDate) : new Date()
            const total = typeof order.total === 'number' ? order.total : 0
            
            return {
              period: format(orderDate, 'MMM', { locale: de }),
              revenue: total,
              profit: total * 0.4 // Geschätzte Gewinnmarge
            }
          })
          
          // Nach Perioden gruppieren
          const salesByPeriod = orderData.reduce((acc: any[], item: any) => {
            const existingPeriod = acc.find(p => p.period === item.period)
            if (existingPeriod) {
              existingPeriod.revenue += item.revenue
              existingPeriod.profit += item.profit
            } else {
              acc.push({ ...item })
            }
            return acc
          }, [])
          
          const totalRevenue = orders.docs.reduce(
            (sum: number, order: any) => sum + (typeof order.total === 'number' ? order.total : 0), 
            0
          )
          
          return {
            byPeriod: salesByPeriod,
            totalRevenue
          }
        }
      } catch (err) {
        console.error('Error fetching from orders collection:', err)
      }
    }
    
    // Fallback zu Demo-Daten
    console.log('No sales data found, generating demo data')
    return getDemoSalesData()
  } catch (error) {
    console.error('Error in fetchSalesData:', error)
    // Return empty data structure on error
    return {
      byPeriod: [],
      totalRevenue: 0
    }
  }
}

// Extrahierte Funktion für Demo-Daten zur Wiederverwendung
function getDemoSalesData(): SalesData {
  return {
    byPeriod: [
      { period: 'Jan', revenue: 45000, profit: 18000 },
      { period: 'Feb', revenue: 52000, profit: 20800 },
      { period: 'Mar', revenue: 49000, profit: 19600 },
      { period: 'Apr', revenue: 58000, profit: 23200 },
      { period: 'Mai', revenue: 63000, profit: 25200 },
      { period: 'Jun', revenue: 59000, profit: 23600 },
    ],
    totalRevenue: 326000
  }
}
