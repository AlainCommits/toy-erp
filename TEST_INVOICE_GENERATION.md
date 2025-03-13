# Testing Invoice Generation

## 1. Admin Interface Testing
1. Open the Payload admin interface
2. Create a new order with:
   ```
   {
     "orderNumber": "TEST-001",
     "status": "draft",
     "billingAddress": {
       "street": "Teststraße 1",
       "zipCode": "12345",
       "city": "Berlin",
       "country": "Deutschland"
     },
     "orderItems": [
       {
         "product": {
           "name": "Test Product"
         },
         "quantity": 2,
         "unitPrice": 99.99
       }
     ],
     "subtotal": 199.98,
     "shippingCost": 5.99,
     "taxAmount": 39.19,
     "total": 245.16
   }
   ```
3. Save the order - no invoice should be generated yet
4. Change the status to "completed"
5. Save again - this should trigger invoice generation
6. Check the Documents collection for the new invoice PDF

## 2. API Testing

### Using cURL:
```bash
# 1. First create an order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderNumber": "TEST-002",
    "status": "draft",
    "billingAddress": {
      "street": "Teststraße 1",
      "zipCode": "12345",
      "city": "Berlin",
      "country": "Deutschland"
    },
    "orderItems": [
      {
        "product": {
          "name": "Test Product"
        },
        "quantity": 2,
        "unitPrice": 99.99
      }
    ],
    "subtotal": 199.98,
    "shippingCost": 5.99,
    "taxAmount": 39.19,
    "total": 245.16
  }'

# 2. Note the returned order ID, then update status to completed
curl -X PATCH http://localhost:3000/api/orders/{orderId} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'

# 3. Check documents collection for the invoice
curl http://localhost:3000/api/documents?where[documentType][equals]=invoice
```

### Using Local API:
```typescript
import payload from 'payload';

async function testInvoiceGeneration() {
  // 1. Create order
  const order = await payload.create({
    collection: 'orders',
    data: {
      orderNumber: 'TEST-003',
      status: 'draft',
      billingAddress: {
        street: 'Teststraße 1',
        zipCode: '12345',
        city: 'Berlin',
        country: 'Deutschland'
      },
      orderItems: [
        {
          product: {
            name: 'Test Product'
          },
          quantity: 2,
          unitPrice: 99.99
        }
      ],
      subtotal: 199.98,
      shippingCost: 5.99,
      taxAmount: 39.19,
      total: 245.16
    }
  });

  // 2. Update status to completed
  const updatedOrder = await payload.update({
    collection: 'orders',
    id: order.id,
    data: {
      status: 'completed'
    }
  });

  // 3. Check for invoice in documents
  const invoices = await payload.find({
    collection: 'documents',
    where: {
      'documentType': { equals: 'invoice' },
      'relatedEntity.value': { equals: order.id }
    }
  });

  console.log('Generated Invoice:', invoices.docs[0]);
}

testInvoiceGeneration().catch(console.error);
```

## Verification Points

After running any of these tests, verify:

1. The invoice PDF was created in the documents collection
2. The PDF contains:
   - Correct order number
   - Correct billing address
   - All order items with correct prices
   - Correct totals
3. The temporary file was cleaned up (check uploads/documents directory)
4. The invoice ID is stored in the context of the order operation

## Troubleshooting

If invoice generation fails:
1. Check payload logs for errors
2. Verify the uploads/documents directory exists and is writable
3. Check if the documents collection has upload enabled
4. Verify all required fields in the documents collection are being set
