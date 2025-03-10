import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui-components'
import { cn } from '@/utilities/ui'
import { InventoryData } from '../../types'

type LowStockProductsProps = {
  data: InventoryData
  className?: string
  title?: string
  description?: string
  limit?: number
}

export function LowStockProducts({
  data,
  className,
  title = "Lagerbestand & Bestellungen",
  description = "Kritische Lagerbestände und aktueller Status",
  limit = 5
}: LowStockProductsProps) {
  const lowStockProducts = data.products
    .filter(p => p.status === 'critical' || p.quantity < (p.minStockLevel || 10))
    .slice(0, limit);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
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
  )
}
