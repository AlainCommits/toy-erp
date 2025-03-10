import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-components'
import { cn } from '@/utilities/ui'

type MetricCardProps = {
  title: string
  value: string
  description?: string
  icon?: React.ReactNode
  className?: string
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    value: string
  }
}

export function MetricCard({ 
  title, 
  value, 
  description, 
  icon, 
  className,
  trend
}: MetricCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {trend && (
              <span className={cn(
                "mr-1 inline-flex items-center",
                trend.direction === 'up' && "text-green-500",
                trend.direction === 'down' && "text-red-500"
              )}>
                {trend.direction === 'up' && '↑'}
                {trend.direction === 'down' && '↓'}
                {trend.direction === 'neutral' && '→'} 
                {trend.value}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
