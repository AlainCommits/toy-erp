# ERP Dashboard Implementation Guide

This document explains the current implementation, data sources, and future enhancement plans for the ERP Dashboard block.

## Overview

The ERP Dashboard provides a comprehensive view of key business metrics by fetching and visualizing data from various collections in the system. It includes visualizations for:

- Sales and revenue data
- Inventory status
- Customer information
- Supplier overview

## Data Sources

The dashboard attempts to fetch data from these collections:

| Dashboard Section | Primary Collection | Fallback Collection | Fields Used |
|-------------------|-------------------|---------------------|------------|
| Sales Data | `revenue` | `orders` | revenue.amount, revenue.period, orders.total, orders.orderDate |
| Inventory Data | `inventory` | Demo data | inventory.quantity, inventory.product, inventory.minStockLevel |
| Customer Data | `customers` | Demo data | customers.customerType, customers.createdAt |
| Supplier Data | `suppliers`, `purchases` | Demo data | suppliers.name, purchases.supplier, purchases.total |

## Implementation Details

### Data Fetching Process

1. **Collection Existence Check**: Before attempting to query any collection, the code checks if it exists.
2. **Primary Source Query**: Attempts to fetch data from the primary collection.
3. **Fallback Strategy**: If primary collection doesn't exist or returns no data, uses fallback collection or generates demo data.
4. **Data Transformation**: Normalizes data into the expected format for the client component.
5. **Error Handling**: Comprehensive error handling ensures the dashboard always returns valid data structures.

### Typing

The dashboard implementation uses TypeScript types to ensure data consistency:

```typescript
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
```

## User Authentication and Role-Based Access

The dashboard now supports role-based access with different configurations per role:

### Authentication Method

The dashboard uses the following process to authenticate users:

1. **Token-Based Authentication**: Reads the `payload-token` cookie to identify the current user
2. **User Lookup**: Uses `payload.findByToken()` to retrieve the authenticated user
3. **Role Extraction**: Extracts the user's role from the `roles` array
4. **Dashboard Configuration**: Loads a role-specific dashboard configuration

### Adding or Modifying Roles

To add or modify role-based dashboards:

1. Edit the `ROLE_DASHBOARDS` object in `src/blocks/Dashboard/utils/roleConfig.ts`
2. Define which tabs and widgets should be visible for each role
3. Set default tab and title/description for the role

```typescript
// Example role configuration
export const ROLE_DASHBOARDS: Record<string, DashboardConfig> = {
  'finance': {
    tabs: ['overview', 'sales'],
    widgets: ['revenueOverview', 'orderStats', 'revenueChart', 'cashFlowForecast'],
    defaultTab: 'sales',
    title: "Finanz-Dashboard",
    description: "Umsatzübersicht und finanzielle Kennzahlen."
  },
  // Additional roles...
}
```

## Future Enhancement Plan

### Phase 2: Widget Configuration

Make the widget selection in the admin interface actually control what data is fetched and displayed.

### Phase 3: Advanced Data Processing

Implement more sophisticated data processing:
- Time-based trend analysis
- Financial performance metrics (gross margin, net profit)
- Inventory valuation and turnover metrics
- Customer segmentation by value

### Phase 4: Add New Data Sources

Integrate data from additional collections:
- `financialManagement` for financial metrics
- `auditLogs` for activity tracking
- `reportingCategories` for enhanced categorization

### Phase 5: Dynamic Dashboard Settings

Add ability to:
- Save different dashboard configurations by user
- Set default time range preferences
- Configure alert thresholds for metrics

## Troubleshooting

If the dashboard shows demo data instead of real data:

1. Check that the required collections exist
2. Verify the collections have documents
3. Ensure the data structure matches what the fetcher functions expect
4. Check server logs for specific error messages
