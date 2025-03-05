# ERP System Enhancement Plan

## Overview
This document outlines the planned changes and implementation details for enhancing our ERP system collections using PayloadCMS hooks.

## Collection Changes & Implementation

### 1. Products Collection
**Required Changes:**
- Auto-incrementing article number
- Price synchronization across collections

**Implementation:**
```typescript
// src/collections/ERP/Products/hooks/generateArticleNumber.ts
BeforeOperationHook for auto-incrementing SKU
- Finds highest existing SKU
- Generates next number
- Format: ART-XXXXX

// src/collections/ERP/Products/hooks/syncProductPrice.ts
AfterChangeHook for price updates
- Updates prices in draft orders
- Updates inventory valuations
```

### 2. Customers Collection
**Required Changes:**
- Auto-incrementing customer number

**Implementation:**
```typescript
// src/collections/ERP/Customers/hooks/generateCustomerNumber.ts
BeforeOperationHook for customer numbering
- Finds highest existing customer number
- Generates next number
- Format: CUST-XXXXX
```

### 3. Orders Collection
**Required Changes:**
- Auto-incrementing order number
- Automatic customer assignment
- Auto-populate item prices
- Inventory management

**Implementation:**
```typescript
// src/collections/ERP/Orders/hooks/generateOrderNumber.ts
BeforeOperationHook for order numbering
- Format: ORD-XXXXX

// src/collections/ERP/Orders/hooks/assignCustomer.ts
BeforeChangeHook for customer assignment
- Online: Uses logged-in user
- In-person: Uses selected customer file

// src/collections/ERP/Orders/hooks/populateItemPrices.ts
BeforeChangeHook for price population
- Fetches current product prices
- Updates line items

// src/collections/ERP/Orders/hooks/updateInventory.ts
AfterChangeHook for inventory
- Updates stock levels
- Triggers reorder notifications
```

### 4. Inventory Collection
**Required Changes:**
- Automatic quantity tracking
- Enhanced product display
- Stock calculations

**Implementation:**
```typescript
// src/collections/ERP/Inventory/hooks/calculateQuantities.ts
AfterChangeHook for stock management
- Updates total quantities
- Calculates valuations

// src/collections/ERP/Inventory/hooks/populateProductDetails.ts
AfterReadHook for product info
- Populates full product details
- Includes current pricing
```

### 5. Purchases Collection
**Required Changes:**
- Auto-incrementing purchase number
- Supplier info auto-population
- Payment method selection
- Invoice file handling

**Implementation:**
```typescript
// src/collections/ERP/Purchases/hooks/generatePurchaseNumber.ts
BeforeOperationHook for numbering
- Format: PUR-XXXXX

// src/collections/ERP/Purchases/hooks/populateSupplierInfo.ts
AfterReadHook for supplier details
- Populates current supplier data

Collection Config Changes:
- Add select field for payment methods
- Add upload field for invoices
```

### 6. Invoices Collection
**Required Changes:**
- Automatic generation from orders
- Exportable document creation
- Auto-populate customer information
- Editable billing details

**Implementation:**
```typescript
// src/collections/ERP/Invoices/hooks/generateInvoice.ts
AfterChangeHook on Orders
- Triggered when order status changes
- Creates PDF document
- Assigns invoice number

// src/collections/ERP/Invoices/hooks/populateCustomerInfo.ts
BeforeChangeHook for customer data
- Populates billing information
- Allows manual overrides

// src/collections/ERP/Invoices/hooks/createDocument.ts
AfterChangeHook for document generation
- Creates exportable invoice document
- Updates document when changes made
```

## Implementation Flow
1. Create hook directories for each collection
2. Implement hooks in order of dependency (Products → Customers → Orders → etc.)
3. Test each hook individually
4. Integrate with existing collection configurations
5. Add necessary UI fields (payment selects, file uploads, etc.)
6. Test complete workflow end-to-end

## Technical Approach
- Use BeforeOperationHook for auto-incrementing fields
- Use AfterChangeHook for cascading updates
- Use AfterReadHook for data population
- Implement proper error handling and logging
- Ensure data consistency across collections
- Add proper TypeScript types for all hooks
