import React from 'react'
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'
import { TabsContent } from '@/components/ui-components'
import { MetricCard } from '../widgets/metrics/MetricCard'
import { RevenueChart } from '../widgets/charts/RevenueChart'
import { LowStockProducts } from '../widgets/tables/LowStockProducts'
import { CustomerDistributionChart } from '../widgets/charts/CustomerDistributionChart'
import { DashboardProps, WidgetID } from '../types'
import { formatCurrency } from '../utils/formatters'

// Korrekt typisieren mit nicht-null WidgetID-Array
type OverviewTabProps = {
  data: {
    salesData: DashboardProps['salesData']
    inventoryData: DashboardProps['inventoryData']
    customersData: DashboardProps['customersData']
    widgets: WidgetID[] // Non-null guarantee
  }
}

export function OverviewTab({ data }: OverviewTabProps) {
  // Garantiere ein Array durch Destructuring mit Default-Wert
  const { salesData, inventoryData, customersData, widgets = [] } = data
  
  // Keine Null-Checks mehr nötig, da wir ein leeres Array als Default haben
  const shouldShowWidget = (widgetId: WidgetID): boolean => {
    return widgets.includes(widgetId)
  }

  return (
    <TabsContent value="overview" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {shouldShowWidget('revenueOverview') && (
          <MetricCard
            title="Umsatz"
            value={formatCurrency(salesData?.totalRevenue)}
            description="gegenüber dem Vormonat"
            icon={<DollarSign />}
            trend={{ direction: 'up', value: '20.1%' }}
          />
        )}
        {shouldShowWidget('orderStats') && (
          <MetricCard
            title="Bestellungen"
            value={salesData?.byPeriod.reduce((sum, item) => sum + Math.round(item.revenue / 120), 0)?.toString() || "0"}
            description="gegenüber dem Vormonat"
            icon={<ShoppingCart />}
            trend={{ direction: 'up', value: '12.2%' }}
          />
        )}
        {shouldShowWidget('inventoryOverview') && (
          <MetricCard
            title="Produkte"
            value={inventoryData?.totalItems.toString() || "0"}
            description={`${inventoryData?.lowStockItems || 0} mit niedrigem Bestand`}
            icon={<Package />}
          />
        )}
        {shouldShowWidget('customerMetrics') && (
          <MetricCard
            title="Kunden"
            value={customersData?.totalCustomers.toString() || "0"}
            description={`${customersData?.newCustomers || 0} neue diese Woche`}
            icon={<Users />}
          />
        )}
      </div>

      {shouldShowWidget('revenueChart') && salesData.byPeriod.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <RevenueChart data={salesData} className="col-span-7" />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {shouldShowWidget('lowStockProducts') && (
          <LowStockProducts 
            data={inventoryData} 
            className="col-span-3" 
          />
        )}
        {shouldShowWidget('customerChart') && (
          <CustomerDistributionChart 
            data={customersData} 
            className={shouldShowWidget('lowStockProducts') ? "col-span-4" : "col-span-7"}
          />
        )}
      </div>
    </TabsContent>
  )
}
