import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Bestellung',
    plural: 'Bestellungen',
  },
  admin: {
    group: 'ERP',
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'orderDate', 'status', 'total'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
 
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      label: {
        de: 'Bestellnummer',
        en: 'Order Number',
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
      name: 'status',
      type: 'select',
      required: true,
      label: {
        de: 'Status',
        en: 'Status',
      },
      defaultValue: 'new',
      options: [
        {
          label: {
            de: 'Neu',
            en: 'New',
          },
          value: 'new',
        },
        {
          label: {
            de: 'In Bearbeitung',
            en: 'Processing',
          },
          value: 'processing',
        },
        {
          label: {
            de: 'Versendet',
            en: 'Shipped',
          },
          value: 'shipped',
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
        {
          label: {
            de: 'Zurückerstattet',
            en: 'Refunded',
          },
          value: 'refunded',
        },
      ],
    },
    {
      name: 'orderType',
      type: 'select',
      required: true,
      label: {
        de: 'Bestellart',
        en: 'Order Type',
      },
      options: [
        {
          label: {
            de: 'Online',
            en: 'Online',
          },
          value: 'online',
        },
        {
          label: {
            de: 'Im Geschäft',
            en: 'In-store',
          },
          value: 'instore',
        },
        {
          label: {
            de: 'Telefon',
            en: 'Phone',
          },
          value: 'phone',
        },
      ],
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      label: {
        de: 'Kunde',
        en: 'Customer',
      },
    },
    {
      name: 'orderItems',
      type: 'array',
      label: {
        de: 'Bestellpositionen',
        en: 'Order Items',
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
      name: 'shippingAddress',
      type: 'group',
      label: {
        de: 'Lieferadresse',
        en: 'Shipping Address',
      },
      fields: [
        {
          name: 'street',
          type: 'text',
          label: {
            de: 'Straße',
            en: 'Street',
          },
        },
        {
          name: 'zipCode',
          type: 'text',
          label: {
            de: 'PLZ',
            en: 'Zip Code',
          },
        },
        {
          name: 'city',
          type: 'text',
          label: {
            de: 'Stadt',
            en: 'City',
          },
        },
        {
          name: 'country',
          type: 'text',
          label: {
            de: 'Land',
            en: 'Country',
          },
          defaultValue: 'Deutschland',
        },
      ],
    },
    {
      name: 'billingAddress',
      type: 'group',
      label: {
        de: 'Rechnungsadresse',
        en: 'Billing Address',
      },
      fields: [
        {
          name: 'sameAsShipping',
          type: 'checkbox',
          label: {
            de: 'Identisch mit Lieferadresse',
            en: 'Same as shipping address',
          },
        },
        {
          name: 'street',
          type: 'text',
          label: {
            de: 'Straße',
            en: 'Street',
          },
        },
        {
          name: 'zipCode',
          type: 'text',
          label: {
            de: 'PLZ',
            en: 'Zip Code',
          },
        },
        {
          name: 'city',
          type: 'text',
          label: {
            de: 'Stadt',
            en: 'City',
          },
        },
        {
          name: 'country',
          type: 'text',
          label: {
            de: 'Land',
            en: 'Country',
          },
          defaultValue: 'Deutschland',
        },
      ],
    },
    {
      name: 'shippingMethod',
      type: 'relationship',
      relationTo: 'shippingMethods',
      label: {
        de: 'Versandart',
        en: 'Shipping Method',
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
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      label: {
        de: 'Erstellt von',
        en: 'Created By',
      },
    },
  ],
  timestamps: true,
}
