import { cn } from "@/utilities/ui"

interface MetricProps {
  title: string
  value: string
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function Metric({ title, value, description, icon, className }: MetricProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 text-card-foreground shadow-sm", className)}>
      <div className="flex justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <div className="opacity-70">{icon}</div>}
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  )
}
