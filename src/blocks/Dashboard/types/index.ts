/**
 * Dashboard Block Typen
 */

// Verfügbare Tab-IDs
export type TabID = 'overview' | 'sales' | 'inventory' | 'customers';

// Verfügbare Widget-IDs
export type WidgetID = 
  // Overview tab widgets
  | 'revenueOverview'
  | 'orderStats'
  | 'inventoryOverview'
  | 'customerMetrics'
  | 'revenueChart'
  | 'recentOrders'
  | 'lowStockProducts'
  | 'customerChart'
  | 'activityLog'
  // Sales tab widgets
  | 'revenueByCategoryChart'
  | 'cashFlowForecast'
  | 'outstandingInvoices'
  | 'ordersByStatusChart'
  // Inventory tab widgets
  | 'topProducts'
  | 'inventoryChart'
  | 'supplierOverview'
  // Customer tab widgets
  | 'topCustomers'
  | 'customerDistribution';

// Widget-Konfiguration
export interface Widget {
  id: WidgetID;
  label: string;
  tab: TabID;
  departments?: string[];
}

// Verkaufs- und Umsatzdaten
export type SalesData = {
  byPeriod: Array<{
    period: string
    revenue: number
    profit: number
  }>
  totalRevenue: number
};

// Lagerbestandsdaten
export type InventoryData = {
  products: Array<{
    id?: string
    product: string
    quantity: number
    category?: string
    minStockLevel?: number
    status?: string
  }>
  totalItems: number
  lowStockItems: number
};

// Kundendaten
export type CustomersData = {
  byType: Array<{
    type: string
    count: number
  }>
  totalCustomers: number
  newCustomers?: number
  topCustomers?: Array<{
    id: string
    name: string
    total: number
    orders: number
  }>
};

// Lieferantendaten
export type SuppliersData = {
  list: Array<{
    id?: string
    name: string
    spend: number
    purchaseCount?: number
  }>
  totalSuppliers: number
};

// Layout-Optionen
export type LayoutOption = 'standard' | 'compact' | 'detailed';

// Zeitsbereich-Optionen
export type TimeRange = 'today' | 'week' | 'month' | 'year' | 'all';

// Dashboard-Block-Props für den Client
export interface DashboardProps {
  title?: string;
  description?: string;
  className?: string;
  salesData: SalesData;
  inventoryData: InventoryData;
  customersData: CustomersData;
  suppliersData: SuppliersData;
  widgets: WidgetID[];
  layout: LayoutOption;
  department?: string;
}
