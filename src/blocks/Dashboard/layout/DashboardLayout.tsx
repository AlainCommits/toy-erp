'use client'

import React from 'react'
import { Download, RefreshCw, CalendarIcon } from 'lucide-react'
import { 
  Button, 
  Tabs, 
  TabsList, 
  TabsTrigger
} from '@/components/ui-components'
import { cn } from '@/utilities/ui'
import { TabID } from '../types'

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
}

// Vereinfachte DateRangePicker-Ersatzkomponente, die immer funktioniert
function SimpleDateRangePicker({ value, onChange }: {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
}) {
  const handleButtonClick = () => {
    try {
      // Bei einem echten Projekt könnte hier ein DatePicker-Dialog geöffnet werden
      // oder eine eigene Implementierung genutzt werden
      
      // Beispiel für automatische Datumssetzung
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      if (onChange) {
        onChange({
          from: thirtyDaysAgo,
          to: today
        });
      }
    } catch (error) {
      console.error('Fehler beim Ändern des Datumsbereichs:', error);
      // Optional: Anzeigen einer Fehlermeldung für den Benutzer
    }
  };

  // Formatiere Daten für die Anzeige
  const formatDate = (date?: Date) => {
    if (!date) return '';
    try {
      return date.toLocaleDateString('de-DE');
    } catch (error) {
      console.error('Fehler bei Datumsformatierung:', error);
      return 'Ungültiges Datum';
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleButtonClick}
      className="flex flex-row items-center"
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {value && value.from && value.to ? (
        <span>
          {formatDate(value.from)} - {formatDate(value.to)}
        </span>
      ) : (
        <span>Zeitraum wählen</span>
      )}
    </Button>
  );
}

type DashboardLayoutProps = {
  title: string
  children: React.ReactNode
  className?: string
  tabs: TabID[]
  defaultTab: TabID
  onTabChange?: (tabId: TabID) => void
  dateRange?: DateRange
  onDateRangeChange?: (range: DateRange) => void
  isRefreshing?: boolean
}

export function DashboardLayout({
  title,
  children,
  className,
  tabs,
  defaultTab,
  onTabChange,
  dateRange,
  onDateRangeChange,
  isRefreshing = false
}: DashboardLayoutProps) {
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value as TabID)
    }
  }

  const TAB_LABELS: Record<TabID, string> = {
    'overview': 'Übersicht',
    'sales': 'Umsätze',
    'inventory': 'Lager',
    'customers': 'Kunden'
  }

  return (
    <div className={cn("flex-1 space-y-4", className)}>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <div className="flex items-center space-x-2">
          {/* Ersetze die problematische Komponente mit unserer vereinfachten Version */}
          <SimpleDateRangePicker
            value={dateRange}
            onChange={onDateRangeChange}
          />
          <Button 
            size="sm"
            variant="outline"
            onClick={() => dateRange?.from && dateRange?.to && onDateRangeChange?.(dateRange)}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn(
              "mr-2 h-4 w-4",
              isRefreshing && "animate-spin"
            )} />
            Aktualisieren
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <Tabs defaultValue={defaultTab} className="space-y-4" onValueChange={handleTabChange}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {TAB_LABELS[tab]}
            </TabsTrigger>
          ))}
        </TabsList>
        {children}
      </Tabs>
    </div>
  )
}
