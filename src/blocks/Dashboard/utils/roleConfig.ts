import { WidgetID, TabID } from '../types'

export interface DashboardConfig {
  tabs: TabID[];
  widgets: WidgetID[];
  defaultTab: TabID;
  title: string;
  description: string;
}

// Standard Dashboard-Konfiguration für alle Benutzer
export const DEFAULT_DASHBOARD: DashboardConfig = {
  tabs: ['overview', 'sales', 'inventory', 'customers'],
  widgets: [
    // Overview widgets
    'revenueOverview', 
    'orderStats', 
    'inventoryOverview', 
    'customerMetrics',
    'revenueChart', 
    'recentOrders', 
    'lowStockProducts',
    'customerChart',
    // Sales tab widgets
    'revenueByCategoryChart',
    'cashFlowForecast',
    // Inventory tab widgets
    'topProducts', 
    'inventoryChart',
    'supplierOverview',
    // Customer tab widgets
    'topCustomers',
    'customerDistribution'
  ],
  defaultTab: 'overview',
  title: "ERP Dashboard",
  description: "Übersicht der wichtigsten Kennzahlen und Daten Ihres ERP-Systems."
}

// Rollenbasierte Dashboard-Konfigurationen
export const ROLE_DASHBOARDS: Record<string, DashboardConfig> = {
  'super-admin': {
    tabs: ['overview', 'sales', 'inventory', 'customers'],
    widgets: [
      // Overview widgets - alle
      'revenueOverview', 'orderStats', 'inventoryOverview', 'customerMetrics',
      'revenueChart', 'recentOrders', 'lowStockProducts', 'customerChart', 'activityLog',
      // Sales tab - alle
      'revenueByCategoryChart', 'cashFlowForecast', 'outstandingInvoices', 'ordersByStatusChart',
      // Inventory tab - alle
      'topProducts', 'inventoryChart', 'supplierOverview',
      // Customer tab - alle
      'topCustomers', 'customerDistribution'
    ],
    defaultTab: 'overview',
    title: "Admin Dashboard",
    description: "Vollständige System-Übersicht mit allen Kennzahlen."
  },
  
  'finance': {
    tabs: ['overview', 'sales'],
    widgets: [
      // Overview
      'revenueOverview', 'orderStats', 'revenueChart',
      // Sales tab - alle
      'revenueByCategoryChart', 'cashFlowForecast', 'outstandingInvoices', 'ordersByStatusChart',
    ],
    defaultTab: 'sales',
    title: "Finanz-Dashboard",
    description: "Umsatzübersicht und finanzielle Kennzahlen."
  },
  
  'inventory-manager': {
    tabs: ['overview', 'inventory'],
    widgets: [
      // Overview
      'inventoryOverview', 'lowStockProducts',
      // Inventory tab - alle
      'topProducts', 'inventoryChart', 'supplierOverview',
    ],
    defaultTab: 'inventory',
    title: "Lager-Dashboard",
    description: "Übersicht über Lagerbestände und Lieferanten."
  },
  
  'sales': {
    tabs: ['overview', 'sales', 'customers'],
    widgets: [
      // Overview
      'revenueOverview', 'orderStats', 'customerMetrics', 'revenueChart', 'recentOrders', 'customerChart',
      // Sales tab - teilweise
      'revenueByCategoryChart', 'ordersByStatusChart',
      // Customer tab - alle
      'topCustomers', 'customerDistribution'
    ],
    defaultTab: 'customers',
    title: "Vertriebs-Dashboard",
    description: "Umsätze und Kundeninformationen."
  }
}

/**
 * Gibt die Dashboard-Konfiguration für eine bestimmte Rolle zurück.
 * Wenn keine spezifische Konfiguration existiert, wird die Standard-Konfiguration zurückgegeben.
 */
export function getDashboardConfigForRole(role?: string): DashboardConfig {
  if (!role) return DEFAULT_DASHBOARD;
  
  return ROLE_DASHBOARDS[role] || DEFAULT_DASHBOARD;
}
