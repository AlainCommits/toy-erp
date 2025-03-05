// Export all ERP collections for easy importing into payload.config.ts
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import { Products } from './Products'
import { Suppliers } from './Suppliers'
import { Customers } from './Customers'
import { Orders } from './Orders'
import { Inventory } from './Inventory'
import { Purchases } from './Purchases'
import { Invoices } from './Invoices'
import { Payments } from './Payments'
import { Warehouses } from './Warehouses'
import { ShippingMethods } from './ShippingMethods'
import { TaxRates } from './TaxRates'
import { Reports } from './Reports'
import { Documents } from './Documents'
import { Integrations } from './Integrations'
import { AuditLogs } from './AuditLogs'

export const ERPCollections = [
  Products,
  Suppliers,
  Customers,
  Orders,
  Inventory,
  Purchases,
  Invoices,
  Payments,
  Warehouses,
  ShippingMethods,
  TaxRates,
  Reports,
  Documents,
  Integrations,
  AuditLogs,
]