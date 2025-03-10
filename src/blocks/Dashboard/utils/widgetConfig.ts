import { TabID, Widget } from '../types'

// Define all available widgets with their properties
export const WIDGETS: Record<string, Widget> = {
  // Overview tab widgets
  'revenueOverview': { 
    id: 'revenueOverview', 
    label: 'Umsatzübersicht', 
    tab: 'overview' 
  },
  'orderStats': { 
    id: 'orderStats', 
    label: 'Bestellungsstatistik', 
    tab: 'overview' 
  },
  'inventoryOverview': { 
    id: 'inventoryOverview', 
    label: 'Lagerbestandsübersicht', 
    tab: 'overview' 
  },
  'customerMetrics': { 
    id: 'customerMetrics', 
    label: 'Kundenzahlen', 
    tab: 'overview' 
  },
  'revenueChart': { 
    id: 'revenueChart', 
    label: 'Umsatz-Zeitverlauf', 
    tab: 'overview' 
  },
  'recentOrders': { 
    id: 'recentOrders', 
    label: 'Aktuelle Bestellungen', 
    tab: 'overview' 
  },
  'lowStockProducts': { 
    id: 'lowStockProducts', 
    label: 'Produkte mit niedrigem Bestand', 
    tab: 'overview' 
  },
  'customerChart': { 
    id: 'customerChart', 
    label: 'Kundenverteilung', 
    tab: 'overview' 
  },
  'activityLog': { 
    id: 'activityLog', 
    label: 'Aktivitätsprotokoll', 
    tab: 'overview',
    departments: ['Management', 'IT'] 
  },
  
  // Sales tab widgets
  'revenueByCategoryChart': { 
    id: 'revenueByCategoryChart', 
    label: 'Umsatz nach Kategorie', 
    tab: 'sales',
    departments: ['Finance', 'Management']
  },
  'cashFlowForecast': { 
    id: 'cashFlowForecast', 
    label: 'Cash-Flow-Prognose', 
    tab: 'sales',
    departments: ['Finance', 'Management'] 
  },
  'outstandingInvoices': { 
    id: 'outstandingInvoices', 
    label: 'Offene Rechnungen', 
    tab: 'sales',
    departments: ['Finance', 'Management'] 
  },
  'ordersByStatusChart': { 
    id: 'ordersByStatusChart', 
    label: 'Bestellungen nach Status', 
    tab: 'sales',
    departments: ['Sales', 'Management'] 
  },
  
  // Inventory tab widgets
  'topProducts': { 
    id: 'topProducts', 
    label: 'Top-Produkte', 
    tab: 'inventory',
    departments: ['Logistics', 'Purchasing'] 
  },
  'inventoryChart': { 
    id: 'inventoryChart', 
    label: 'Lagerbestandsgrafik', 
    tab: 'inventory',
    departments: ['Logistics', 'Purchasing'] 
  },
  'supplierOverview': { 
    id: 'supplierOverview', 
    label: 'Lieferantenübersicht', 
    tab: 'inventory',
    departments: ['Purchasing'] 
  },
  
  // Customer tab widgets
  'topCustomers': { 
    id: 'topCustomers', 
    label: 'Top-Kunden', 
    tab: 'customers',
    departments: ['Sales', 'Customer Service'] 
  },
  'customerDistribution': { 
    id: 'customerDistribution', 
    label: 'Kundenverteilung', 
    tab: 'customers',
    departments: ['Sales', 'Marketing'] 
  },
}

// Helper function to get available tabs based on selected widgets
export function getAvailableTabs(widgets: string[]): TabID[] {
  const tabs = new Set<TabID>();
  
  widgets.forEach(widgetId => {
    const widget = WIDGETS[widgetId];
    if (widget) {
      tabs.add(widget.tab);
    }
  });
  
  return Array.from(tabs);
}

// Helper function to filter widgets by department
export function getWidgetsByDepartment(department?: string): string[] {
  if (!department) return Object.keys(WIDGETS);
  
  return Object.values(WIDGETS)
    .filter(widget => !widget.departments || widget.departments.includes(department))
    .map(widget => widget.id);
}
