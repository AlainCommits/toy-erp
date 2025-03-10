import React from 'react'
import { AlertTriangle, Package, Truck, Warehouse } from 'lucide-react'
import { TabsContent, Card, CardHeader, CardTitle, CardContent, CardDescription, BarChart } from '@/components/ui-components'
import { MetricCard } from '../widgets/metrics/MetricCard'
import { InventoryData, SuppliersData, WidgetID } from '../types'
import { formatCurrency, formatNumber } from '../utils/formatters'

// Korrekt typisieren mit nicht-null WidgetID-Array
type InventoryTabProps = {
  data: {
    inventoryData: InventoryData
    suppliersData: SuppliersData
    widgets: WidgetID[] // Non-null guarantee
  }
}

export function InventoryTab({ data }: InventoryTabProps) {
  // Garantiere ein Array durch Destructuring mit Default-Wert
  const { inventoryData, suppliersData, widgets = [] } = data
  
  // Keine Null-Checks mehr nötig, da wir ein leeres Array als Default haben
  const shouldShowWidget = (widgetId: WidgetID): boolean => {
    return widgets.includes(widgetId)
  }

  // Prepare data for charts
  const topProducts = [...inventoryData.products]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map(item => ({
      name: item.product,
      value: item.quantity
    }));

  const totalInventoryItems = inventoryData.products.reduce((sum, item) => sum + item.quantity, 0);
  
  // Top suppliers data
  const topSuppliers = [...suppliersData.list]
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 5)
    .map(supplier => ({
      name: supplier.name.length > 15 ? supplier.name.substring(0, 15) + '...' : supplier.name,
      Ausgaben: supplier.spend
    }));

  return (
    <TabsContent value="inventory" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Produkte gesamt"
          value={inventoryData?.totalItems.toString() || "0"}
          description="Gesamtanzahl der Produkte im System"
          icon={<Package className="h-4 w-4" />}
        />
        <MetricCard 
          title="Kritischer Bestand"
          value={inventoryData?.lowStockItems.toString() || "0"}
          description="Produkte mit niedrigem Bestand"
          icon={<AlertTriangle className="h-4 w-4" />}
          trend={
            inventoryData?.lowStockItems > 3 
              ? { direction: 'up', value: 'Kritisch' } 
              : { direction: 'down', value: 'Ok' }
          }
        />
        <MetricCard 
          title="Lagerbestand"
          value={formatNumber(totalInventoryItems)}
          description="Gesamtanzahl aller Einheiten"
          icon={<Warehouse className="h-4 w-4" />}
        />
        {shouldShowWidget('supplierOverview') && (
          <MetricCard 
            title="Lieferanten"
            value={suppliersData?.totalSuppliers.toString() || "0"} 
            description="Aktive Zulieferer"
            icon={<Truck className="h-4 w-4" />}
          />
        )}
      </div>
      
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {shouldShowWidget('topProducts') && (
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Top 5 Produkte</CardTitle>
              <CardDescription>
                Produkte mit dem größten Lagerbestand
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                <BarChart
                  data={topProducts.map(p => ({ name: p.name, Bestand: p.value }))}
                  categories={['Bestand']}
                  colors={['#4f46e5']}
                  valueFormatter={formatNumber}
                  height={300}
                />
              ) : (
                <div className="flex h-[200px] items-center justify-center">
                  <p className="text-muted-foreground">Keine Produktdaten verfügbar</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {shouldShowWidget('supplierOverview') && (
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Top Lieferanten</CardTitle>
              <CardDescription>
                Nach Einkaufsvolumen
              </CardDescription>
            </CardHeader>
            <CardContent>
              {topSuppliers.length > 0 ? (
                <BarChart
                  data={topSuppliers}
                  categories={['Ausgaben']}
                  colors={['#8884d8']}
                  valueFormatter={formatCurrency}
                  height={300}
                />
              ) : (
                <div className="flex h-[200px] items-center justify-center">
                  <p className="text-muted-foreground">Keine Lieferantendaten verfügbar</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {shouldShowWidget('inventoryChart') && (
        <Card>
          <CardHeader>
            <CardTitle>Lagerbestand nach Kategorie</CardTitle>
            <CardDescription>
              Verteilung des Lagerbestands nach Produktkategorie
            </CardDescription>
          </CardHeader>
          <CardContent>
            {inventoryData.products.length > 0 ? (
              <div className="h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-background">
                    <tr className="border-b">
                      <th className="text-left p-2">Produkt</th>
                      <th className="text-left p-2">Kategorie</th>
                      <th className="text-right p-2">Bestand</th>
                      <th className="text-right p-2">Min. Bestand</th>
                      <th className="text-center p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryData.products.map((product) => (
                      <tr key={product.id} className="border-b">
                        <td className="p-2">{product.product}</td>
                        <td className="p-2">{product.category}</td>
                        <td className="text-right p-2">{product.quantity}</td>
                        <td className="text-right p-2">{product.minStockLevel || 10}</td>
                        <td className="text-center p-2">
                          <span className={`inline-block h-3 w-3 rounded-full ${
                            product.quantity < (product.minStockLevel || 10) ? 'bg-red-500' : 'bg-green-500'
                          }`}></span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-muted-foreground">Keine Inventardaten verfügbar</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </TabsContent>
  )
}
