import { InventoryData } from '../types'
import { collectionExists } from './helpers'

export async function fetchInventoryData(payload: any): Promise<InventoryData> {
  try {
    console.log('Fetching inventory data...')
    
    // Check if Inventory collection exists
    const inventoryCollectionExists = await collectionExists(payload, 'inventory')
    if (inventoryCollectionExists) {
      const inventory = await payload.find({
        collection: 'inventory',
        depth: 2,
        limit: 100,
      }).catch((err: Error) => { // Explizite Typisierung hinzugefügt
        console.error('Error fetching inventory:', err)
        return { docs: [], totalDocs: 0 }
      })
      
      console.log(`Found ${inventory.docs.length} inventory items`)
      
      if (inventory.docs && inventory.docs.length > 0) {
        // Produktdaten mit Details
        const products = await Promise.all(inventory.docs.map(async (item: any) => {
          let productName = "Unbekanntes Produkt"
          let quantity = typeof item.quantity === 'number' ? item.quantity : 0
          let category = "Keine Kategorie"
          
          // Wenn product ein Objekt ist
          if (item.product && typeof item.product === 'object') {
            if ('name' in item.product) {
              productName = String(item.product.name || "Unbekanntes Produkt")
            }
            
            // Versuche Kategorie zu extrahieren
            if ('categories' in item.product && Array.isArray(item.product.categories) && item.product.categories.length > 0) {
              const firstCategory = item.product.categories[0]
              if (typeof firstCategory === 'object' && firstCategory && 'category' in firstCategory) {
                category = String(firstCategory.category || "Keine Kategorie")
              }
            }
          } 
          // Wenn product eine ID ist
          else if (item.product && typeof item.product === 'string') {
            try {
              const product = await payload.findByID({
                collection: 'products',
                id: item.product,
                depth: 1
              })
              
              if (product) {
                if ('name' in product) {
                  productName = String(product.name || "Unbekanntes Produkt")
                }
                
                if ('categories' in product && Array.isArray(product.categories) && product.categories.length > 0) {
                  const firstCategory = product.categories[0]
                  if (typeof firstCategory === 'object' && firstCategory && 'category' in firstCategory) {
                    category = String(firstCategory.category || "Keine Kategorie")
                  }
                }
              }
            } catch (e) {
              console.error('Fehler beim Abrufen des Produkts:', e)
            }
          }
          
          return {
            id: item.id,
            product: productName,
            quantity: quantity,
            category,
            minStockLevel: typeof item.minStockLevel === 'number' ? item.minStockLevel : 10,
            status: item.status || 'sufficient'
          }
        }))
        
        // Berechne die niedrigen Lagerbestände
        const lowStockItems = products.filter(item => {
          return item.quantity < item.minStockLevel
        })
        
        return {
          products,
          totalItems: inventory.totalDocs || inventory.docs.length,
          lowStockItems: lowStockItems.length
        }
      }
    }
    
    // If no data found, generate demo data
    console.log('No inventory data found, generating demo data')
    const demoProducts = [
      { id: 'p1', product: 'Laptop Pro 15"', quantity: 24, category: 'Electronics', minStockLevel: 10, status: 'sufficient' },
      { id: 'p2', product: 'Office Chair Deluxe', quantity: 8, category: 'Furniture', minStockLevel: 15, status: 'critical' },
      { id: 'p3', product: 'Wireless Mouse', quantity: 45, category: 'Accessories', minStockLevel: 20, status: 'sufficient' },
      { id: 'p4', product: 'USB-C Cable 2m', quantity: 12, category: 'Accessories', minStockLevel: 30, status: 'critical' },
      { id: 'p5', product: 'Monitor 27"', quantity: 17, category: 'Electronics', minStockLevel: 5, status: 'sufficient' },
    ]
    
    return {
      products: demoProducts,
      totalItems: demoProducts.length,
      lowStockItems: demoProducts.filter(item => item.quantity < item.minStockLevel).length
    }
  } catch (error) {
    console.error('Error in fetchInventoryData:', error)
    return {
      products: [],
      totalItems: 0,
      lowStockItems: 0
    }
  }
}
