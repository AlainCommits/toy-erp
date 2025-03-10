'use client'

import React from 'react'
import { 
  Activity, 
  CreditCard, 
  DollarSign, 
  Download, 
  Package, 
  ShoppingCart, 
  Users, 
  Warehouse,
  Truck,
  AlertTriangle
} from 'lucide-react'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  CalendarDateRangePicker,
  Overview,
  RecentSales,
  InventoryTable,
  Metric,
  BarChart,
  LineChart,
  PieChart,
  BarChartHorizontal
} from '@/components/ui-components'

import { cn } from '@/utilities/ui'

// Types for Dashboard Data
type SalesData = {
  byPeriod: Array<{
    period: string
    revenue: number
    profit: number
  }>
  totalRevenue: number
}

type InventoryData = {
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
}

type CustomersData = {
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
}

type SuppliersData = {
  list: Array<{
    id?: string
    name: string
    spend: number
    purchaseCount?: number
  }>
  totalSuppliers: number
}

type Props = {
  title?: string
  description?: string
  className?: string
  salesData: SalesData
  inventoryData: InventoryData
  customersData: CustomersData
  suppliersData: SuppliersData
}

export function DashboardClient({
  title = "ERP Dashboard",
  description = "Übersicht der wichtigsten Kennzahlen und Daten Ihres ERP-Systems.",
  className,
  salesData,
  inventoryData,
  customersData,
  suppliersData,
}: Props) {
  // Formatierungsfunktionen
  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined) return '€0,00'
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(value)
  }
  
  const formatPercent = (value: number | undefined): string => {
    if (value === undefined || isNaN(value)) return '0.0%'
    return `${(value * 100).toFixed(1)}%`
  }

  // Status-Komponente für Error
  const ErrorPlaceholder = ({ message }: { message: string }) => (
    <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
      <div className="flex flex-col items-center text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">{message}</h3>
        <p className="text-sm text-muted-foreground">
          Die Daten konnten nicht geladen werden.
        </p>
      </div>
    </div>
  )

  // Ensure we have safe defaults for calculations
  const safeByPeriod = salesData?.byPeriod || []
  const safeRevenue = salesData?.totalRevenue || 0
  const safeProducts = inventoryData?.products || []
  const safeCustomers = customersData?.byType || []
  const safeSuppliers = suppliersData?.list || []

  // Calculate safely
  const orderCount = safeByPeriod.reduce((sum, item) => 
    sum + Math.round((item.revenue || 0) / 120), 0)

  const totalUnits = safeProducts.reduce((sum, p) => 
    sum + (p.quantity || 0), 0)

  // Prepare chart data
  const salesChartData = safeByPeriod.map(item => ({
    name: item.period,
    Umsatz: item.revenue,
    Gewinn: item.profit,
  }))
  
  // Top 5 products by stock
  const topProducts = [...safeProducts]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map(item => ({
      name: item.product,
      value: item.quantity
    }))
    
  // Customer distribution for pie chart
  const customerDistribution = safeCustomers.map(item => ({
    name: item.type,
    value: item.count
  }))
  
  // Top 5 suppliers by spend
  const topSuppliers = [...safeSuppliers]
    .sort((a, b) => b.spend - a.spend)
    .slice(0, 5)
    .map(item => ({
      name: item.name,
      value: item.spend
    }))

  const lowStockProducts = safeProducts
    .filter(p => p.status === 'critical' || p.quantity < (p.minStockLevel || 10))
    .slice(0, 5)

  const calculateCustomerPercentage = (customerCount: number | undefined, totalCustomers: number | undefined): number => {
    if (!customerCount || !totalCustomers || totalCustomers === 0) return 0
    return customerCount / totalCustomers
  }

  // Calculate customer type counts
  const privateCount = customerDistribution.find(c => c.name === 'Privat')?.value || 0
  const businessCount = customerDistribution.find(c => c.name === 'Geschäft')?.value || 0
  const wholesaleCount = customerDistribution.find(c => c.name === 'Großhandel')?.value || 0
  const totalCustomerCount = customersData?.totalCustomers || 1

  return (
    <div className={cn("flex-1 space-y-4", className)}>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker />
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="sales">Umsätze</TabsTrigger>
          <TabsTrigger value="inventory">Lager</TabsTrigger>
          <TabsTrigger value="customers">Kunden</TabsTrigger>
        </TabsList>
        
        {/* Übersichts-Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Metric 
              title="Umsatz"
              value={formatCurrency(safeRevenue)}
              description="+20.1% gegenüber dem Vormonat"
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            />
            <Metric 
              title="Bestellungen"
              value={orderCount.toString()}
              description="+12.2% gegenüber dem Vormonat"
              icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
            />
            <Metric 
              title="Produkte"
              value={inventoryData?.totalItems.toString() || "0"}
              description={`${inventoryData?.lowStockItems || 0} mit niedrigem Bestand`}
              icon={<Package className="h-4 w-4 text-muted-foreground" />}
            />
            <Metric 
              title="Kunden"
              value={customersData?.totalCustomers.toString() || "0"}
              description={`${customersData?.newCustomers || 0} neue diese Woche`}
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Umsatzübersicht</CardTitle>
                <CardDescription>
                  Umsatz und Gewinn im zeitlichen Verlauf
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {salesChartData.length > 0 ? (
                  <Overview chartData={salesChartData} />
                ) : (
                  <ErrorPlaceholder message="Keine Umsatzdaten verfügbar" />
                )}
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Aktuelle Verkäufe</CardTitle>
                <CardDescription>
                  Die neuesten Transaktionen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Lagerbestand & Bestellungen</CardTitle>
                <CardDescription>
                  Kritische Lagerbestände und aktueller Status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lowStockProducts.length > 0 ? (
                  <div className="space-y-4">
                    {lowStockProducts.map(product => (
                      <div key={product.id} className="flex items-center">
                        <div className="mr-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{product.product}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.quantity} auf Lager • Min: {product.minStockLevel || 10}
                          </p>
                        </div>
                        <div className={cn("ml-auto", 
                          product.quantity < (product.minStockLevel || 10)/2 ? "text-destructive" : "text-amber-500"
                        )}>
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center text-center">
                    <p className="text-sm text-muted-foreground">
                      Alle Lagerbestände sind ausreichend
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Kundenverteilung</CardTitle>
                <CardDescription>
                  Verteilung nach Kundentyp
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {customerDistribution.length > 0 ? (
                  <PieChart
                    data={customerDistribution}
                    height={240}
                    showLabel={true}
                    showLegend={true}
                  />
                ) : (
                  <ErrorPlaceholder message="Keine Kundendaten verfügbar" />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Umsätze-Tab */}
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Metric 
              title="Gesamtumsatz"
              value={formatCurrency(safeRevenue)}
              description="Gesamtumsatz im ausgewählten Zeitraum"
              icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              className="col-span-1"
            />
            <Metric 
              title="Durchschnittsumsatz"
              value={formatCurrency(
                safeByPeriod.length ? 
                  safeByPeriod.reduce((sum, item) => sum + item.revenue, 0) / safeByPeriod.length : 0
              )}
              description="Pro Monat im ausgewählten Zeitraum"
              icon={<Activity className="h-4 w-4 text-muted-foreground" />}
              className="col-span-1"
            />
            <Metric 
              title="Durchschnittsgewinn"
              value={formatCurrency(
                safeByPeriod.length ?
                  safeByPeriod.reduce((sum, item) => sum + item.profit, 0) / safeByPeriod.length : 0
              )}
              description="Pro Monat im ausgewählten Zeitraum"
              icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
              className="col-span-1"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Umsatz & Gewinn</CardTitle>
                <CardDescription>
                  Monatlicher Trend für den ausgewählten Zeitraum
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {salesChartData.length > 0 ? (
                  <LineChart
                    data={salesChartData}
                    categories={['Umsatz', 'Gewinn']}
                    colors={['#0088FE', '#00C49F']}
                    valueFormatter={formatCurrency}
                    startEndOnly={false}
                    showLegend={true}
                    showXAxis={true}
                    showYAxis={true}
                    height={350}
                  />
                ) : (
                  <ErrorPlaceholder message="Keine Umsatzdaten verfügbar" />
                )}
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Umsatzquellen</CardTitle>
                <CardDescription>
                  Umsatzverteilung nach Verkaufskanal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart
                  data={[
                    { name: 'Online-Shop', value: safeRevenue * 0.45 },
                    { name: 'Ladengeschäft', value: safeRevenue * 0.25 },
                    { name: 'B2B', value: safeRevenue * 0.20 },
                    { name: 'Marktplatz', value: safeRevenue * 0.10 },
                  ]}
                  height={350}
                  showLabel={true}
                  showLegend={true}
                  valueFormatter={formatCurrency}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Lager-Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Metric 
              title="Produkte gesamt"
              value={inventoryData?.totalItems.toString() || "0"}
              description="Gesamtanzahl der Produkte im System"
              icon={<Package className="h-4 w-4 text-muted-foreground" />}
            />
            <Metric 
              title="Kritischer Bestand"
              value={inventoryData?.lowStockItems.toString() || "0"}
              description="Produkte mit niedrigem Bestand"
              icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
            />
            <Metric 
              title="Lager"
              value={totalUnits.toString()}
              description="Gesamtanzahl aller Einheiten"
              icon={<Warehouse className="h-4 w-4 text-muted-foreground" />}
            />
            <Metric 
              title="Lieferanten"
              value={suppliersData?.totalSuppliers.toString() || "0"} 
              description="Aktive Zulieferer"
              icon={<Truck className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Top 5 Produkte</CardTitle>
                <CardDescription>
                  Produkte mit dem größten Lagerbestand
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {topProducts.length > 0 ? (
                  <BarChartHorizontal
                    data={topProducts}
                    height={320}
                    showLegend={false}
                  />
                ) : (
                  <ErrorPlaceholder message="Keine Inventardaten verfügbar" />
                )}
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Top Lieferanten</CardTitle>
                <CardDescription>
                  Nach Einkaufsvolumen
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                {topSuppliers.length > 0 ? (
                  <BarChart
                    data={topSuppliers.map(s => ({
                      name: s.name.length > 12 ? s.name.substring(0, 12) + '...' : s.name,
                      Ausgaben: s.value
                    }))}
                    categories={['Ausgaben']}
                    colors={['#8884d8']}
                    valueFormatter={formatCurrency}
                    height={320}
                  />
                ) : (
                  <ErrorPlaceholder message="Keine Lieferantendaten verfügbar" />
                )}
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Lagerbestand</CardTitle>
              <CardDescription>
                Detaillierte Übersicht aller Produkte im Lager
              </CardDescription>
            </CardHeader>
            <CardContent>
              {safeProducts.length > 0 ? (
                <InventoryTable inventory={safeProducts} />
              ) : (
                <ErrorPlaceholder message="Keine Inventardaten verfügbar" />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Kunden-Tab */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Metric 
              title="Kunden gesamt"
              value={customersData?.totalCustomers.toString() || "0"}
              description="Registrierte Kunden"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
            <Metric 
              title="Durchschn. Bestellwert"
              value={formatCurrency(safeRevenue / totalCustomerCount)}
              description="Pro Kunde"
              icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
            />
            <Metric 
              title="Neue Kunden"
              value={customersData?.newCustomers?.toString() || "0"}
              description="Im letzten Monat"
              icon={<Users className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Kundenverteilung</CardTitle>
                <CardDescription>
                  Nach Kundentyp
                </CardDescription>
              </CardHeader>
              <CardContent>
                {customerDistribution.length > 0 ? (
                  <PieChart
                    data={customerDistribution}
                    height={300}
                    showLabel={true}
                    showLegend={true}
                  />
                ) : (
                  <ErrorPlaceholder message="Keine Kundendaten verfügbar" />
                )}
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Kundenstatistik</CardTitle>
                <CardDescription>
                  Verteilung der Kundenumsätze
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded-full bg-primary" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Privatkundenanteil
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {privateCount} Kunden ({formatPercent(calculateCustomerPercentage(privateCount, totalCustomerCount))})
                        </p>
                      </div>
                      <div className="ml-auto font-medium">{formatCurrency(safeRevenue * 0.65)}</div>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: "65%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded-full bg-blue-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Geschäftskundenanteil
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {businessCount} Kunden ({formatPercent(calculateCustomerPercentage(businessCount, totalCustomerCount))})
                        </p>
                      </div>
                      <div className="ml-auto font-medium">{formatCurrency(safeRevenue * 0.25)}</div>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-blue-500" style={{ width: "25%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 rounded-full bg-green-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Großhandelsanteil
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {wholesaleCount} Kunden ({formatPercent(calculateCustomerPercentage(wholesaleCount, totalCustomerCount))})
                        </p>
                      </div>
                      <div className="ml-auto font-medium">{formatCurrency(safeRevenue * 0.10)}</div>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-green-500" style={{ width: "10%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Debug-Info */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-xs border rounded p-2">
          <summary className="font-bold cursor-pointer">Debug Info</summary>
          <pre className="whitespace-pre-wrap overflow-auto max-h-40">
            {JSON.stringify({
              salesData,
              inventoryData,
              customersData,
              suppliersData
            }, null, 2)}
          </pre>
        </details>
      )}
    </div>
  )
}
