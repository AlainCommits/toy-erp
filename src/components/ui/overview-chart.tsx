"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

interface OverviewProps {
  chartData: Array<{
    name: string
    Umsatz: number
    Gewinn: number
    [key: string]: any
  }>
}

export function Overview({ chartData }: OverviewProps) {
  // Make sure formatCurrency always returns a string
  const formatCurrency = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
    return new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(isNaN(numValue) ? 0 : numValue)
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        {/* Fix YAxis tickFormatter to always return a string */}
        <YAxis 
          tickFormatter={(value: number): string => {
            const formatted = formatCurrency(value);
            // Ensure we return just the part before the comma as a string
            return formatted.split(',')[0] || "€0";
          }} 
        />
        <Tooltip 
          // Ensure formatter returns a tuple of strings
          formatter={(value): [string, string] => [formatCurrency(Number(value)), ""]}
          labelFormatter={(value): string => `Periode: ${String(value)}`}
          contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="Umsatz"
          stroke="#0088FE"
          strokeWidth={2}
          dot={{ r: 5 }}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="Gewinn"
          stroke="#00C49F"
          strokeWidth={2}
          dot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
