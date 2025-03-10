"use client"

import {
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  PieChart as RechartsPieChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

interface ChartProps {
  data: Array<{
    name: string
    [key: string]: any
  }>
  height?: number
  categories?: string[]
  colors?: string[]
  valueFormatter?: (value: number) => string
  startEndOnly?: boolean
  showLegend?: boolean
  showXAxis?: boolean
  showYAxis?: boolean
}

export function LineChart({
  data,
  height = 300,
  categories,
  colors = COLORS,
  valueFormatter = (value) => `${value}`,
  startEndOnly = true,
  showLegend = true,
  showXAxis = true,
  showYAxis = true,
}: ChartProps) {
  if (!data?.length || !categories?.length) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        {showXAxis && (
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#888888" }}
            tickMargin={10}
            tickFormatter={(value, index) => {
              if (startEndOnly) {
                return index === 0 || index === data.length - 1 ? String(value) : ""
              }
              return String(value)
            }}
          />
        )}
        {showYAxis && (
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#888888" }}
            tickMargin={10}
            tickFormatter={(value) => {
              const formatted = valueFormatter(Number(value)) || "0";
              return formatted as string;
            }}
          />
        )}
        <Tooltip
          formatter={(value) => {
            const formatted = valueFormatter(Number(value)) || "0";
            return [formatted, ""] as [string, string];
          }}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "none",
          }}
        />
        {showLegend && <Legend />}
        {categories.map((category, index) => (
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[index % colors.length]}
            activeDot={{ r: 8 }}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

export function BarChart({
  data,
  height = 300,
  categories,
  colors = COLORS,
  valueFormatter = (value) => `${value}`,
  showLegend = true,
}: ChartProps) {
  if (!data?.length || !categories?.length) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#888888" }}
          tickMargin={10}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#888888" }}
          tickMargin={10}
          tickFormatter={(value) => {
            const formatted = valueFormatter(Number(value)) || "0";
            return formatted as string;
          }}
        />
        <Tooltip
          formatter={(value) => {
            const formatted = valueFormatter(Number(value)) || "0";
            return [formatted, ""] as [string, string];
          }}
          cursor={{ fillOpacity: 0.1 }}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "none",
          }}
        />
        {showLegend && <Legend />}
        {categories.map((category, index) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export function BarChartHorizontal({
  data,
  height = 300,
  showLegend = false,
}: {
  data: Array<{ name: string; value: number }>
  height?: number
  showLegend?: boolean
}) {
  if (!data?.length) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout="vertical"
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          width={120}
        />
        <Tooltip
          cursor={{ fillOpacity: 0.1 }}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "none",
          }}
        />
        {showLegend && <Legend />}
        <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} maxBarSize={30} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export function PieChart({
  data,
  height = 300,
  showLabel = false,
  showLegend = true,
  valueFormatter = (value) => `${value}`,
}: {
  data: Array<{ name: string; value: number }>
  height?: number
  showLabel?: boolean
  showLegend?: boolean
  valueFormatter?: (value: number) => string
}) {
  if (!data?.length) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={showLabel}
          label={showLabel ? (props) => {
            const name = props.name || "";
            const percent = props.percent || 0;
            return `${String(name)}: ${(percent * 100).toFixed(0)}%`;
          } : undefined}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => {
            const formatted = valueFormatter(Number(value)) || "0";
            return [formatted, ""] as [string, string];
          }}
          contentStyle={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            border: "none",
          }}
        />
        {showLegend && <Legend />}
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}
