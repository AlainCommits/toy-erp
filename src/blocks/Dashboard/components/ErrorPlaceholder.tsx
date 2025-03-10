import React from 'react'
import { AlertTriangle } from 'lucide-react'

type ErrorPlaceholderProps = {
  message: string
  className?: string
  description?: string
}

export function ErrorPlaceholder({ 
  message, 
  className,
  description = "Die Daten konnten nicht geladen werden."
}: ErrorPlaceholderProps) {
  return (
    <div className={`flex h-[200px] items-center justify-center rounded-md border border-dashed ${className}`}>
      <div className="flex flex-col items-center text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">{message}</h3>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
