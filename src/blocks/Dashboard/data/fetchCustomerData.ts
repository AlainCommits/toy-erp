import { CustomersData } from '../types'
import { collectionExists } from './helpers'

// Bessere Typangabe für payload und konsistente Fehlerbehandlung
export async function fetchCustomerData(payload: any, startDate: Date, endDate: Date): Promise<CustomersData> {
  try {
    console.log('Fetching customer data...')
    
    // Check if Customers collection exists
    const customersCollectionExists = await collectionExists(payload, 'customers')
    if (customersCollectionExists) {
      try {
        const customers = await payload.find({
          collection: 'customers',
          depth: 1,
        })
        
        console.log(`Found ${customers.docs.length} customers`)
        
        if (customers.docs && customers.docs.length > 0) {
          // Count customer types
          const typeCounts: Record<string, number> = {}
          let newCustomersCount = 0
          
          customers.docs.forEach((customer: any) => {
            const type = customer.customerType || 'retail'
            const label = type === 'retail' ? 'Privat' : 
                         type === 'wholesale' ? 'Großhandel' : 'Geschäft'
            
            typeCounts[label] = (typeCounts[label] || 0) + 1
            
            // Check if customer is new (created within the date range)
            if (customer.createdAt) {
              const createDate = new Date(customer.createdAt)
              if (createDate >= startDate && createDate <= endDate) {
                newCustomersCount++
              }
            }
          })
          
          const byType = Object.entries(typeCounts).map(([type, count]) => ({
            type,
            count
          }))
          
          // Generiere auch einige Top-Kunden für die Anzeige
          const topCustomers = generateTopCustomers(customers.docs)
          
          return {
            byType,
            totalCustomers: customers.totalDocs || customers.docs.length,
            newCustomers: newCustomersCount,
            topCustomers
          }
        }
      } catch (err) {
        console.error('Error processing customer data:', err)
      }
    }
    
    // If no data found, generate demo data
    console.log('No customer data found, generating demo data')
    return getDemoCustomerData()
  } catch (error) {
    console.error('Error in fetchCustomerData:', error)
    return getDemoCustomerData() 
  }
}

// Helper-Funktion zur Generierung von Top-Kunden aus den tatsächlichen Daten
function generateTopCustomers(customers: any[]): { id: string; name: string; total: number; orders: number }[] {
  if (!customers || customers.length === 0) return []
  
  // Versuche, echte Kundendaten zu verwenden, falls verfügbar
  const customersWithData = customers
    .filter(c => c.id && c.name)
    .slice(0, 5)
    .map(c => ({
      id: c.id,
      name: c.name || c.company || `Kunde ${c.id}`,
      // Simulierte Werte, falls echte nicht verfügbar sind
      total: c.lifetimeValue || Math.round(Math.random() * 50000 + 10000),
      orders: c.orderCount || Math.round(Math.random() * 15 + 1)
    }))
  
  return customersWithData.length > 0 ? customersWithData : getDemoTopCustomers()
}

function getDemoTopCustomers() {
  return [
    { id: 'c1', name: 'Mustermann GmbH', total: 45000, orders: 12 },
    { id: 'c2', name: 'Schmidt AG', total: 38000, orders: 8 },
    { id: 'c3', name: 'Schulze & Partner', total: 29500, orders: 10 },
    { id: 'c4', name: 'Meyer Consulting', total: 27000, orders: 7 },
    { id: 'c5', name: 'Fischer Technologie', total: 21500, orders: 5 }
  ]
}

// Extrahierte Demo-Daten
function getDemoCustomerData(): CustomersData {
  return {
    byType: [
      { type: 'Privat', count: 145 },
      { type: 'Geschäft', count: 67 },
      { type: 'Großhandel', count: 23 }
    ],
    totalCustomers: 235,
    newCustomers: 12,
    topCustomers: getDemoTopCustomers()
  }
}
