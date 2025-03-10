'use client'

import React from 'react'
import { DashboardProps, TabID, SalesData } from './types'
import { DashboardLayout } from './layout/DashboardLayout'
import { OverviewTab } from './tabs/OverviewTab'
import { InventoryTab } from './tabs/InventoryTab'
import { SalesTab } from './tabs/SalesTab'
import { CustomersTab } from './tabs/CustomersTab'
import { getAvailableTabs } from './utils/widgetConfig'
import { ErrorPlaceholder } from './components/ErrorPlaceholder'
import { fetchSalesDataClient } from './data/api'

export function DashboardClient({
  title = "ERP Dashboard",
  description = "Übersicht der wichtigsten Kennzahlen und Daten Ihres ERP-Systems.",
  className,
  salesData: initialSalesData,
  inventoryData,
  customersData,
  suppliersData,
  widgets = [], // Stellt sicher, dass widgets immer ein Array ist
  layout = 'standard',
  department,
  userRole
}: DashboardProps & { userRole?: string }) {
  // Client-seitige Zustandsverwaltung für Daten
  const [salesData, setSalesData] = React.useState<SalesData>(initialSalesData);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedDateRange, setSelectedDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  // Saubere Typprüfung ohne Nullable-Check
  const availableTabs = getAvailableTabs(widgets);
  
  if (widgets.length === 0 || availableTabs.length === 0) {
    return (
      <div className={className}>
        <h2 className="text-3xl font-bold tracking-tight mb-4">{title}</h2>
        <ErrorPlaceholder 
          message="Keine Dashboard-Module verfügbar" 
          description="Es wurden keine anzuzeigenden Dashboard-Module konfiguriert."
        />
      </div>
    );
  }
  
  // Ensure defaultTab is always defined with a fallback to 'overview'
  const defaultTab: TabID = availableTabs.includes('overview') 
    ? 'overview' 
    : (availableTabs[0] || 'overview');
  
  const [activeTab, setActiveTab] = React.useState<TabID>(defaultTab);
  
  // Handle tab change
  const handleTabChange = (tabId: TabID) => {
    setActiveTab(tabId);
    // Could add analytics tracking here
    console.log(`Tab changed to: ${tabId}`);
  }
  
  // Funktion zum Aktualisieren der Daten basierend auf dem Datumsbereich
  const refreshData = async (from?: Date, to?: Date) => {
    if (!from || !to) return;
    
    setIsRefreshing(true);
    try {
      // Client-seitige API zum Abrufen der Daten nach Datumsbereich
      const newSalesData = await fetchSalesDataClient(from, to);
      setSalesData(newSalesData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Datumsbereich-Änderung behandeln
  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setSelectedDateRange(range);
    if (range.from && range.to) {
      refreshData(range.from, range.to);
    }
  };
  
  return (
    <DashboardLayout 
      title={title}
      className={className}
      tabs={availableTabs}
      defaultTab={defaultTab}
      onTabChange={handleTabChange}
      dateRange={selectedDateRange}
      onDateRangeChange={handleDateRangeChange}
      isRefreshing={isRefreshing}
    >
      {/* Overview Tab */}
      <OverviewTab 
        data={{ 
          salesData, 
          inventoryData, 
          customersData, 
          widgets // Garantiert ein nicht-leeres Array
        }} 
      />
      
      {/* Inventory Tab */}
      <InventoryTab 
        data={{
          inventoryData,
          suppliersData,
          widgets // Garantiert ein nicht-leeres Array
        }} 
      />
      
      {/* Sales Tab - Neue modularisierte Komponente */}
      <SalesTab
        data={{
          salesData,
          widgets // Garantiert ein nicht-leeres Array
        }}
      />
      
      {/* Customers Tab - Neue modularisierte Komponente */}
      <CustomersTab
        data={{
          customersData,
          widgets // Garantiert ein nicht-leeres Array
        }}
      />
      
      {/* Debug-Info */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-xs border rounded p-2">
          <summary className="font-bold cursor-pointer">Debug Info</summary>
          <pre className="whitespace-pre-wrap overflow-auto max-h-40">
            {JSON.stringify({
              userRole,
              selectedWidgets: widgets,
              availableTabs,
              activeTab,
              department,
              dataAvailable: {
                sales: salesData?.byPeriod?.length > 0,
                inventory: inventoryData?.products?.length > 0,
                customers: customersData?.byType?.length > 0,
                suppliers: suppliersData?.list?.length > 0
              }
            }, null, 2)}
          </pre>
        </details>
      )}
    </DashboardLayout>
  )
}
