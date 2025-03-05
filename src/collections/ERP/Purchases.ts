import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Purchases: CollectionConfig = {
  slug: 'purchases',
  labels: {
    singular: 'Einkauf',
    plural: 'Einkäufe',
  },
  admin: {
    group: 'ERP',
    useAsTitle: 'purchaseNumber',
    defaultColumns: ['purchaseNumber', 'orderDate', 'status', 'total'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
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
        de: 'Voraussichtliches Lieferdatum',
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
      label: {
        de: 'Status',
        en: 'Status',
      },
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
            de: 'Teillieferung',
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
        de: 'Lieferanteninformationen',
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
          label: {
            de: 'Zahlungsstatus',
            en: 'Payment Status',
          },
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
  ],
  timestamps: true,
}
