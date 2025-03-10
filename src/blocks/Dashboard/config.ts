import { Block } from 'payload'

export const DashboardBlock: Block = {
  slug: 'dashboard',
  interfaceName: 'DashboardBlock',
  labels: {
    singular: 'Dashboard Block',
    plural: 'Dashboard Blocks',
  },
  fields: [
    {
      name: 'title',
      label: 'Titel',
      type: 'text',
      required: true,
      defaultValue: 'ERP System Dashboard'
    },
    {
      name: 'description',
      label: 'Beschreibung',
      type: 'text',
      defaultValue: 'Übersicht der wichtigsten Kennzahlen'
    },
    {
      name: 'layout',
      label: 'Layout',
      type: 'select',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Erweitert', value: 'advanced' },
        { label: 'Finanzen', value: 'finance' },
        { label: 'Vertrieb', value: 'sales' },
        { label: 'Lager', value: 'inventory' }
      ],
      defaultValue: 'standard',
      required: true
    },
    {
      name: 'defaultTimeRange',
      label: 'Standard-Zeitraum',
      type: 'select',
      options: [
        { label: 'Heute', value: 'today' },
        { label: 'Diese Woche', value: 'week' },
        { label: 'Diesen Monat', value: 'month' },
        { label: 'Dieses Jahr', value: 'year' },
        { label: 'Alle Zeiten', value: 'all' }
      ],
      defaultValue: 'month',
    },
    {
      name: 'widgets',
      label: 'Widget-Auswahl',
      type: 'select',
      hasMany: true,
      options: [
        // Kennzahlen
        { label: 'Umsatzübersicht', value: 'revenueOverview' },
        { label: 'Bestellungsstatistik', value: 'orderStats' },
        { label: 'Lagerbestandsübersicht', value: 'inventoryOverview' },
        { label: 'Kundenzahlen', value: 'customerMetrics' },
        
        // Charts
        { label: 'Umsatz-Zeitverlauf', value: 'revenueChart' },
        { label: 'Umsatz nach Kategorie', value: 'revenueByCategoryChart' },
        { label: 'Bestellungen nach Status', value: 'ordersByStatusChart' },
        { label: 'Lagerbestand nach Kategorie', value: 'inventoryChart' },
        { label: 'Kundenverteilung', value: 'customerChart' },
        
        // Tabellen
        { label: 'Aktuelle Bestellungen', value: 'recentOrders' },
        { label: 'Produkte mit niedrigem Bestand', value: 'lowStockProducts' },
        { label: 'Top-Kunden', value: 'topCustomers' },
        { label: 'Top-Produkte', value: 'topProducts' },
        
        // Erweiterte Widgets
        { label: 'Cash-Flow-Prognose', value: 'cashFlowForecast' },
        { label: 'Offene Rechnungen', value: 'outstandingInvoices' },
        { label: 'Aktivitätsprotokoll', value: 'activityLog' }
      ],
      defaultValue: [
        'revenueOverview', 
        'orderStats', 
        'revenueChart', 
        'recentOrders', 
        'inventoryOverview', 
        'customerMetrics',
        'supplierOverview'
      ],
    }
  ],
}
