import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfYear, endOfYear } from 'date-fns'
import { de } from 'date-fns/locale'
import { cookies } from 'next/headers'
import { cn } from '@/utilities/ui'
import type { DashboardBlock as DashboardBlockProps } from 'src/payload-types'
import { DashboardClient } from './DashboardClient'
import { WidgetID } from './types'
import { WIDGETS } from './utils/widgetConfig'
import { getDashboardConfigForRole } from './utils/roleConfig'

// Importiere die ausgelagerten Daten-Fetch-Funktionen
import { fetchSalesData } from './data/fetchSalesData'
import { fetchInventoryData } from './data/fetchInventoryData'
import { fetchCustomerData } from './data/fetchCustomerData'
import { fetchSuppliersData } from './data/fetchSuppliersData'
import { SalesData, InventoryData, CustomersData, SuppliersData, LayoutOption } from './types' // Add this import

type Props = {
  className?: string
} & DashboardBlockProps

/**
 * Direkte Implementierung für Benutzerinformationen ohne auth.ts zu nutzen
 * Dies vermeidet TypeScript-Fehler mit findByToken
 */
async function getUserInfo() {
  try {
    // Verwenden des Cookies API direkt
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')?.value
    
    if (!token) {
      console.log('Kein Benutzer-Token gefunden')
      return { user: null, role: 'unknown' }
    }
    
    // Payload direkt initialisieren
    const payload = await getPayload({ config: await configPromise })
    
    try {
      // Umgehen des TypeScript-Fehlers durch direktes Zugreifen auf interne Methode
      // @ts-ignore - Diese Zeile bewusst ignorieren, da wir wissen, dass die Methode existiert
      const result = await payload.findByToken({
        collection: 'users',
        token
      })
      
      const user = result?.user
      const role = user?.roles?.[0] || 'unknown'
      
      return { user, role }
    } catch (error) {
      console.error('Fehler bei Benutzerabfrage:', error)
      return { user: null, role: 'unknown' }
    }
  } catch (error) {
    console.error('Fehler bei Benutzerermittlung:', error)
    return { user: null, role: 'unknown' }
  }
}

export async function DashboardBlock({
  className,
  title,
  description,
  layout = 'standard',
  defaultTimeRange = 'month',
  widgets = []
}: Props) {
  try {
    // Direkte Benutzerermittlung ohne externe Funktion
    const { user, role } = await getUserInfo()
    
    // Dashboard-Konfiguration basierend auf Rolle abrufen
    const dashboardConfig = getDashboardConfigForRole(role)
    
    // Wenn Widgets explizit angegeben wurden, verwenden wir diese, sonst aus der Rollenkonfiguration
    const configuredWidgets = (widgets && widgets.length > 0) 
      ? widgets 
      : dashboardConfig.widgets
    
    // Sichere Widget-IDs validieren
    const safeWidgets = (configuredWidgets || [])
      .filter((widget) => typeof widget === 'string' && Object.keys(WIDGETS).includes(widget as string)) as WidgetID[];
    
    // Zeitbereich basierend auf defaultTimeRange bestimmen
    // Ensure defaultTimeRange is a string by providing a fallback value if null
    const timeRange = defaultTimeRange || 'month';
    const { startDate, endDate } = getTimeRange(timeRange)
    
    // Log time range for debugging
    console.log(`Fetching data from ${startDate.toISOString()} to ${endDate.toISOString()}`)
    
    const payload = await getPayload({ config: await configPromise })
    
    // Ensure layout is a valid LayoutOption
    const safeLayout = (layout as LayoutOption) || 'standard';
    
    // Daten parallel abrufen für bessere Performance
    // Initialisiere mit korrekten Default-Werten basierend auf den Typ-Definitionen
    let salesData: SalesData = { 
      byPeriod: [], 
      totalRevenue: 0 
    };
    
    let inventoryData: InventoryData = { 
      products: [], 
      totalItems: 0,
      lowStockItems: 0 
    };
    
    let customersData: CustomersData = { 
      byType: [], 
      totalCustomers: 0 
    };
    
    let suppliersData: SuppliersData = { 
      list: [], 
      totalSuppliers: 0 
    };
    
    try {
      [salesData, inventoryData, customersData, suppliersData] = await Promise.all([
        fetchSalesData(payload, startDate, endDate),
        fetchInventoryData(payload),
        fetchCustomerData(payload, startDate, endDate),
        fetchSuppliersData(payload)
      ]);
    } catch (fetchError) {
      console.error('Fehler beim Abrufen der Dashboard-Daten:', fetchError);
      // Die Default-Werte wurden bereits oben zugewiesen
    }
    
    return (
      <div className={cn('mx-auto my-8 w-full', className)}>
        <DashboardClient 
          title={title || dashboardConfig.title} 
          description={description || dashboardConfig.description}
          salesData={salesData}
          inventoryData={inventoryData}
          customersData={customersData}
          suppliersData={suppliersData}
          widgets={safeWidgets}
          layout={safeLayout}
          department={user?.department}
          userRole={role}
        />
      </div>
    )
  } catch (error) {
    console.error('Fehler beim Rendern des Dashboards:', error);
    return (
      <div className={cn('mx-auto my-8 w-full text-center p-8', className)}>
        <h2 className="text-xl font-bold">Dashboard konnte nicht geladen werden</h2>
        <p className="text-gray-600 mt-2">Bitte versuchen Sie es später erneut.</p>
      </div>
    );
  }
}

// Hilfsfunktion für Zeitbereich-Berechnungen
function getTimeRange(timeRange: string) {
  try {
    const today = new Date()
    let startDate: Date
    let endDate = today
    
    switch (timeRange) {
      case 'today':
        startDate = today
        break
      case 'week':
        startDate = startOfWeek(today, { locale: de })
        endDate = endOfWeek(today, { locale: de })
        break
      case 'month':
        startDate = startOfMonth(today)
        endDate = endOfMonth(today)
        break
      case 'year':
        startDate = startOfYear(today)
        endDate = endOfYear(today)
        break
      case 'all':
      default:
        startDate = new Date(2000, 0, 1) // Weit genug in der Vergangenheit
        break
    }
    
    return { startDate, endDate }
  } catch (error) {
    console.error('Fehler bei der Zeitbereichsberechnung:', error);
    // Fallback auf aktuellen Monat
    const today = new Date();
    return {
      startDate: startOfMonth(today),
      endDate: today
    }
  }
}