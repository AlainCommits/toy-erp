# ERP System Beziehungsanalyse

## Vorhandene Collections

Basierend auf der Analyse des Projekts sind folgende Collections bereits implementiert:

1. Users
2. Products
3. Suppliers 
4. Customers
5. Orders
6. Inventory
7. Purchases
8. Invoices
9. Payments
10. Warehouses
11. ShippingMethods
12. TaxRates
13. Reports
14. Documents
15. Integrations
16. AuditLogs

## Vorhandene Beziehungen

Die folgenden Beziehungen sind bereits in den Collections implementiert:

1. **Products → Suppliers**: 
   - In `Products.ts`: `supplier` Feld (relationTo: 'suppliers')
   
2. **Products → TaxRates**: 
   - In `Products.ts`: `taxRate` Feld (relationTo: 'taxRates')
   
3. **Customers → Orders**: 
   - In `Customers.ts`: `orders` Feld (relationTo: 'orders', hasMany: true)
   
4. **Customers → Invoices**: 
   - In `Customers.ts`: `invoices` Feld (relationTo: 'invoices', hasMany: true)
   
5. **Orders → Customers**: 
   - In `Orders.ts`: `customer` Feld (relationTo: 'customers')
   
6. **Orders → Products**: 
   - In `Orders.ts`: innerhalb des `orderItems` Arrays: `product` Feld (relationTo: 'products')
   
7. **Orders → ShippingMethods**: 
   - In `Orders.ts`: `shippingMethod` Feld (relationTo: 'shippingMethods')
   
8. **Invoices → Orders**: 
   - In `Invoices.ts`: `order` Feld (relationTo: 'orders')
   
9. **Invoices → Customers**: 
   - In `Invoices.ts`: `customer` Feld (relationTo: 'customers')
   
10. **Payments → Invoices**: 
    - In `Payments.ts`: `invoice` Feld (relationTo: 'invoices')
    
11. **Payments → Customers**: 
    - In `Payments.ts`: `customer` Feld (relationTo: 'customers')
    
12. **Inventory → Products**: 
    - In `Inventory.ts`: `product` Feld (relationTo: 'products')
    
13. **Inventory → Warehouses**: 
    - In `Inventory.ts`: `warehouse` Feld (relationTo: 'warehouses')

## Fehlende Beziehungen

Basierend auf dem ER-Diagramm im Implementierungsplan fehlen folgende Beziehungen:

1. **Users → Orders**: 
   - Benutzer erstellen/bearbeiten Bestellungen
   
2. **Users → AuditLogs**:
   - Benutzeraktivitäten werden in AuditLogs protokolliert
   
3. **Documents → Orders**:
   - Dokumente können mit Bestellungen verknüpft sein
   
4. **Documents → Invoices**:
   - Dokumente können mit Rechnungen verknüpft sein
   
5. **Documents → Purchases**:
   - Dokumente können mit Einkäufen verknüpft sein
   
6. **Reports → Users**:
   - Berichte werden von Benutzern erstellt

## Implementierungsvorschläge

Um die fehlenden Beziehungen zu implementieren, sollten folgende Felder zu den entsprechenden Collections hinzugefügt werden:

1. In `Orders.ts`: 
   ```typescript
   {
     name: 'createdBy',
     type: 'relationship',
     relationTo: 'users',
     label: {
       de: 'Erstellt von',
       en: 'Created By',
     },
   }
   ```

2. In `AuditLogs.ts`:
   ```typescript
   {
     name: 'user',
     type: 'relationship',
     relationTo: 'users',
     label: {
       de: 'Benutzer',
       en: 'User',
     },
   }
   ```

3. In `Documents.ts`:
   ```typescript
   {
     name: 'relatedEntity',
     type: 'relationship',
     relationTo: ['orders', 'invoices', 'purchases'],
     label: {
       de: 'Verknüpfte Entität',
       en: 'Related Entity',
     },
   }
   ```

4. In `Reports.ts`:
   ```typescript
   {
     name: 'createdBy',
     type: 'relationship',
     relationTo: 'users',
     label: {
       de: 'Erstellt von',
       en: 'Created By',
     },
   }
   ```

Diese Ergänzungen würden alle Beziehungen implementieren, die im ER-Diagramm des Implementierungsplans aufgeführt sind.