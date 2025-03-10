import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, PieChart } from '@/components/ui-components'
import { AlertTriangle } from 'lucide-react'
import { CustomersData } from '../../types'

type CustomerDistributionChartProps = {
  data: CustomersData
  className?: string
  title?: string
  description?: string
}

export function CustomerDistributionChart({
  data,
  className,
  title = "Kundenverteilung",
  description = "Verteilung nach Kundentyp"
}: CustomerDistributionChartProps) {
  const customerDistribution = data.byType.map(item => ({
    name: item.type,
    value: item.count
  }));

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
  )
}
