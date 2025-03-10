import React from 'react'
import { Activity, CreditCard, DollarSign } from 'lucide-react'
import { TabsContent, Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui-components'
import { MetricCard } from '../widgets/metrics/MetricCard'
import { SalesData, WidgetID } from '../types'
import { formatCurrency } from '../utils/formatters'
import { ErrorPlaceholder } from '../components/ErrorPlaceholder'

// Korrekt typisieren mit nicht-null WidgetID-Array
type SalesTabProps = {
  data: {
    salesData: SalesData
    widgets: WidgetID[] // Non-null guarantee
  }
}

export function SalesTab({ data }: SalesTabProps) {
  // Garantiere ein Array durch Destructuring mit Default-Wert
  const { salesData, widgets = [] } = data
  
  // Keine Null-Checks mehr nötig, da wir ein leeres Array als Default haben
  const shouldShowWidget = (widgetId: WidgetID): boolean => {
    return widgets.includes(widgetId)
  }

  // Berechne Gesamteinnahmen und Durchschnitte
  const totalRevenue = salesData?.totalRevenue || 0;
  const averageRevenue = salesData?.byPeriod.length > 0 
    ? salesData?.byPeriod.reduce((sum, item) => sum + item.revenue, 0) / salesData?.byPeriod.length 
    : 0;
  const averageProfit = salesData?.byPeriod.length > 0 
    ? salesData?.byPeriod.reduce((sum, item) => sum + item.profit, 0) / salesData?.byPeriod.length 
    : 0;
  
  // Bereite Daten für die Kategorie-Grafik vor (simulierte Daten, da wir keine echten haben)
  const revenueByCategoryData = [
    { name: 'Elektronik', value: Math.round(totalRevenue * 0.35) },
    { name: 'Möbel', value: Math.round(totalRevenue * 0.25) },
    { name: 'Bürobedarf', value: Math.round(totalRevenue * 0.20) },
    { name: 'Software', value: Math.round(totalRevenue * 0.15) },
    { name: 'Sonstiges', value: Math.round(totalRevenue * 0.05) },
  ];

  return (
    <TabsContent value="sales" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard 
          title="Gesamtumsatz"
          value={formatCurrency(salesData?.totalRevenue)}
          description="Gesamtumsatz im ausgewählten Zeitraum"
          icon={<DollarSign className="h-4 w-4" />}
          className="col-span-1"
        />
        <MetricCard 
          title="Durchschnittsumsatz"
          value={formatCurrency(averageRevenue)}
          description="Pro Monat im ausgewählten Zeitraum"
          icon={<Activity className="h-4 w-4" />}
          className="col-span-1"
        />
        <MetricCard 
          title="Durchschnittsgewinn"
          value={formatCurrency(averageProfit)}
          description="Pro Monat im ausgewählten Zeitraum"
          icon={<CreditCard className="h-4 w-4" />}
          className="col-span-1"
        />
      </div>
      
      {shouldShowWidget('revenueByCategoryChart') && (
        <Card>
          <CardHeader>
            <CardTitle>Umsatz nach Kategorie</CardTitle>
            <CardDescription>Umsatzverteilung nach Produktkategorie</CardDescription>
          </CardHeader>
          <CardContent>
            {salesData?.byPeriod.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Kategorie</th>
                        <th className="text-right p-2">Umsatz</th>
                        <th className="text-right p-2">% Anteil</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueByCategoryData.map((item) => (
                        <tr key={item.name} className="border-b">
                          <td className="p-2">{item.name}</td>
                          <td className="text-right p-2">{formatCurrency(item.value)}</td>
                          <td className="text-right p-2">
                            {((item.value / totalRevenue) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="w-full h-[200px] bg-muted flex items-center justify-center rounded-md">
                    [Kreisdiagramm der Kategorieanteile]
                  </div>
                </div>
              </div>
            ) : (
              <ErrorPlaceholder message="Keine Umsatzdaten verfügbar" />
            )}
          </CardContent>
        </Card>
      )}
      
      {shouldShowWidget('cashFlowForecast') && (
        <Card>
          <CardHeader>
            <CardTitle>Cashflow-Prognose</CardTitle>
            <CardDescription>Erwarteter Cashflow für die kommenden 3 Monate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] bg-muted flex items-center justify-center rounded-md">
              [Cashflow-Prognose-Chart - Wird in einer zukünftigen Version implementiert]
            </div>
          </CardContent>
        </Card>
      )}
      
      {shouldShowWidget('outstandingInvoices') && (
        <Card>
          <CardHeader>
            <CardTitle>Offene Rechnungen</CardTitle>
            <CardDescription>Überfällige und bald fällige Rechnungen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] bg-muted flex items-center justify-center rounded-md">
              [Offene Rechnungen-Tabelle - Wird in einer zukünftigen Version implementiert]
            </div>
          </CardContent>
        </Card>
      )}
    </TabsContent>
  )
}
