import React from 'react'
import { Users } from 'lucide-react'
import { TabsContent, Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui-components'
import { MetricCard } from '../widgets/metrics/MetricCard'
import { CustomerDistributionChart } from '../widgets/charts/CustomerDistributionChart'
import { CustomersData, WidgetID } from '../types'
import { formatCurrency } from '../utils/formatters'
import { ErrorPlaceholder } from '../components/ErrorPlaceholder'

// Korrekt typisieren mit nicht-null WidgetID-Array
type CustomersTabProps = {
  data: {
    customersData: CustomersData
    widgets: WidgetID[] // Non-null guarantee
  }
}

export function CustomersTab({ data }: CustomersTabProps) {
  // Garantiere ein Array durch Destructuring mit Default-Wert
  const { customersData, widgets = [] } = data
  
  // Keine Null-Checks mehr nötig, da wir ein leeres Array als Default haben
  const shouldShowWidget = (widgetId: WidgetID): boolean => {
    return widgets.includes(widgetId)
  }

  // Beispielhafte Top-Kunden (in einer realen Implementierung würden diese aus den Daten kommen)
  const topCustomersData = [
    { id: 'c1', name: 'Mustermann GmbH', total: 45000, orders: 12 },
    { id: 'c2', name: 'Schmidt AG', total: 38000, orders: 8 },
    { id: 'c3', name: 'Schulze & Partner', total: 29500, orders: 10 },
    { id: 'c4', name: 'Meyer Consulting', total: 27000, orders: 7 },
    { id: 'c5', name: 'Fischer Technologie', total: 21500, orders: 5 },
  ];

  return (
    <TabsContent value="customers" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard 
          title="Kunden gesamt"
          value={customersData?.totalCustomers?.toString() || "0"}
          description="Registrierte Kunden"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard 
          title="Neue Kunden"
          value={customersData?.newCustomers?.toString() || "0"}
          description="Im letzten Monat"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard 
          title="Durchschn. Kundenwert" 
          // Simulierte Berechnung des durchschnittlichen Kundenwerts
          value={formatCurrency(customersData?.totalCustomers ? 15000 : 0)}
          description="Durchschnittlicher Lifetime Value"
          icon={<Users className="h-4 w-4" />}
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {shouldShowWidget('customerDistribution') && (
          <CustomerDistributionChart
            data={customersData}
            className="col-span-1"
          />
        )}
        
        {shouldShowWidget('topCustomers') && (
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Top Kunden</CardTitle>
              <CardDescription>Nach Gesamtumsatz</CardDescription>
            </CardHeader>
            <CardContent>
              {topCustomersData.length > 0 ? (
                <div className="space-y-2">
                  {topCustomersData.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-2 border-b">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-xs text-muted-foreground">{customer.orders} Bestellungen</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(customer.total)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <ErrorPlaceholder message="Keine Kundendaten verfügbar" />
              )}
            </CardContent>
          </Card>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Kundendetails</CardTitle>
          <CardDescription>Eine Übersicht aller Kunden mit Details</CardDescription>
        </CardHeader>
        <CardContent>
          {customersData?.byType.length > 0 ? (
            <div className="h-[300px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b">
                    <th className="text-left p-2">Kunde</th>
                    <th className="text-left p-2">Kundentyp</th>
                    <th className="text-right p-2">Bestellungen</th>
                    <th className="text-right p-2">Gesamtwert</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Hier würden wir eine Liste der tatsächlichen Kunden anzeigen */}
                  {/* Da wir nur Kundentypzahlen haben, zeigen wir Platzhalter */}
                  <tr className="border-b">
                    <td colSpan={4} className="p-2 text-center text-muted-foreground">
                      Detaillierte Kundendaten werden in einer zukünftigen Version angezeigt
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <ErrorPlaceholder message="Keine Kundendaten verfügbar" />
          )}
        </CardContent>
      </Card>
    </TabsContent>
  )
}
