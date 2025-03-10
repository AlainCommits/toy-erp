import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Overview } from '@/components/ui-components'
import { SalesData } from '../../types'
import { AlertTriangle } from 'lucide-react'

type RevenueChartProps = {
  data: SalesData
  title?: string
  description?: string
  className?: string
}

export function RevenueChart({ 
  data, 
  title = "Umsatzübersicht", 
  description = "Umsatz und Gewinn im zeitlichen Verlauf",
  className 
}: RevenueChartProps) {
  const chartData = data?.byPeriod.map(item => ({
    name: item.period,
    Umsatz: item.revenue,
    Gewinn: item.profit,
  })) || [];

  // Error placeholder component
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        {chartData.length > 0 ? (
          <Overview chartData={chartData} />
        ) : (
          <ErrorPlaceholder message="Keine Umsatzdaten verfügbar" />
        )}
      </CardContent>
    </Card>
  )
}
