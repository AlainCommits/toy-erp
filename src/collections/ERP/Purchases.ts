import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { updateInventory, handleCancellation } from './Purchases/hooks'

export const Purchases: CollectionConfig = {
  slug: 'purchases',
  labels: {
    singular: 'Einkauf',
    plural: 'Einkäufe',
  },
  admin: {
    group: 'Einkauf & Lieferanten',
    useAsTitle: 'purchaseNumber',
    defaultColumns: ['purchaseNumber', 'orderDate', 'status', 'supplier'],
    hidden: ({ user }) => {
      // Super admins can see everything
      if (user?.roles?.includes('super-admin')) return false
      // Show to purchasing department users
      if (user?.roles?.includes('Einkauf')) return false
      // Hide from everyone else
      return true
    },
  },
  access: {
    read: ({ req: { user } }) => {
      // Must be logged in
      if (!user) return false
      
      // Super admins can read everything
      if (isSuperAdmin(user)) return true
      
      // Purchasing department can read
      if (user.roles?.includes('Einkauf')) return true
      
      // Everyone else denied
      return false
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Einkauf') || false
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Einkauf') || false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Einkauf') || false
    },
  },
  hooks: {
    beforeChange: [
      handleCancellation,
    ],
    afterChange: [
      updateInventory,
    ],
  },
  fields: [
    {
      name: 'purchaseNumber',
      type: 'text',
      required: true,
      label: {
        de: 'Einkaufsnummer',
        en: 'Purchase Number',
      },
    },
    {
      name: 'orderDate',
      type: 'date',
      required: true,
      label: {
        de: 'Bestelldatum',
        en: 'Order Date',
      },
    },
    {
      name: 'expectedDeliveryDate',
      type: 'date',
      label: {
        de: 'Erwartetes Lieferdatum',
        en: 'Expected Delivery Date',
      },
    },
    {
      name: 'actualDeliveryDate',
      type: 'date',
      label: {
        de: 'Tatsächliches Lieferdatum',
        en: 'Actual Delivery Date',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'ordered',
      options: [
        {
          label: {
            de: 'Bestellt',
            en: 'Ordered',
          },
          value: 'ordered',
        },
        {
          label: {
            de: 'Teilweise geliefert',
            en: 'Partially Delivered',
          },
          value: 'partiallyDelivered',
        },
        {
          label: {
            de: 'Geliefert',
            en: 'Delivered',
          },
          value: 'delivered',
        },
        {
          label: {
            de: 'Abgeschlossen',
            en: 'Completed',
          },
          value: 'completed',
        },
        {
          label: {
            de: 'Storniert',
            en: 'Cancelled',
          },
          value: 'cancelled',
        },
      ],
      label: {
        de: 'Status',
        en: 'Status',
      },
    },
    {
      name: 'supplier',
      type: 'relationship',
      relationTo: 'suppliers',
      required: true,
      label: {
        de: 'Lieferant',
        en: 'Supplier',
      },
    },
    {
      name: 'supplierInfo',
      type: 'group',
      label: {
        de: 'Lieferanten-Information',
        en: 'Supplier Information',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: {
            de: 'Name',
            en: 'Name',
          },
        },
        {
          name: 'contactPerson',
          type: 'text',
          label: {
            de: 'Ansprechpartner',
            en: 'Contact Person',
          },
        },
        {
          name: 'email',
          type: 'email',
          label: {
            de: 'E-Mail',
            en: 'Email',
          },
        },
        {
          name: 'phone',
          type: 'text',
          label: {
            de: 'Telefon',
            en: 'Phone',
          },
        },
      ],
    },
    {
      name: 'purchaseItems',
      type: 'array',
      required: true,
      label: {
        de: 'Einkaufspositionen',
        en: 'Purchase Items',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          label: {
            de: 'Produkt',
            en: 'Product',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          label: {
            de: 'Menge',
            en: 'Quantity',
          },
        },
        {
          name: 'receivedQuantity',
          type: 'number',
          min: 0,
          admin: {
            description: {
              de: 'Tatsächlich gelieferte Menge',
              en: 'Actually received quantity',
            },
          },
          label: {
            de: 'Gelieferte Menge',
            en: 'Received Quantity',
          },
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          label: {
            de: 'Einzelpreis (€)',
            en: 'Unit Price (€)',
          },
        },
        {
          name: 'discount',
          type: 'number',
          label: {
            de: 'Rabatt (%)',
            en: 'Discount (%)',
          },
        },
      ],
    },
    {
      name: 'paymentInfo',
      type: 'group',
      label: {
        de: 'Zahlungsinformationen',
        en: 'Payment Information',
      },
      fields: [
        {
          name: 'paymentTerms',
          type: 'text',
          label: {
            de: 'Zahlungsbedingungen',
            en: 'Payment Terms',
          },
        },
        {
          name: 'paymentMethod',
          type: 'text',
          label: {
            de: 'Zahlungsart',
            en: 'Payment Method',
          },
        },
        {
          name: 'paymentStatus',
          type: 'select',
          options: [
            {
              label: {
                de: 'Ausstehend',
                en: 'Pending',
              },
              value: 'pending',
            },
            {
              label: {
                de: 'Teilweise bezahlt',
                en: 'Partially Paid',
              },
              value: 'partiallyPaid',
            },
            {
              label: {
                de: 'Bezahlt',
                en: 'Paid',
              },
              value: 'paid',
            },
            {
              label: {
                de: 'Überfällig',
                en: 'Overdue',
              },
              value: 'overdue',
            },
          ],
          label: {
            de: 'Zahlungsstatus',
            en: 'Payment Status',
          },
        },
        {
          name: 'dueDate',
          type: 'date',
          label: {
            de: 'Fälligkeitsdatum',
            en: 'Due Date',
          },
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      label: {
        de: 'Zwischensumme (€)',
        en: 'Subtotal (€)',
      },
    },
    {
      name: 'taxAmount',
      type: 'number',
      label: {
        de: 'Steuerbetrag (€)',
        en: 'Tax Amount (€)',
      },
    },
    {
      name: 'shippingCost',
      type: 'number',
      label: {
        de: 'Versandkosten (€)',
        en: 'Shipping Cost (€)',
      },
    },
    {
      name: 'discount',
      type: 'number',
      label: {
        de: 'Rabatt (€)',
        en: 'Discount (€)',
      },
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      label: {
        de: 'Gesamtbetrag (€)',
        en: 'Total Amount (€)',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: {
        de: 'Anmerkungen',
        en: 'Notes',
      },
    },
    // {
    //   name: 'tenant',
    //   type: 'relationship',
    //   relationTo: 'tenants',
    //   required: true,
    // },
  ],
  timestamps: true,
}
