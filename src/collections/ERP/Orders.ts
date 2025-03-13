import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { 
  generateOrderNumber, 
  populateItemPrices, 
  validateOrderItems,
  assignCustomer,
  updateInventory,
  handleStatusChange,
  
} from './Orders/hooks'

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Bestellung',
    plural: 'Bestellungen',
  },
  admin: {
    group: 'Verkauf & CRM',
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'orderDate', 'status', 'total'],
    hidden: ({ user }) => {
      // Super admins can see everything
      if (user?.roles?.includes('super-admin')) return false
      // Show to sales department users
      if (user?.roles?.includes('Verkauf')) return false
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
      
      // Sales department can read
      if (user.roles?.includes('Verkauf')) return true
      
      // Everyone else denied
      return false
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Verkauf') || false
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Verkauf') || false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Verkauf') || false
    },
  },
  hooks: {
    beforeChange: [
      assignCustomer,
      generateOrderNumber,
      populateItemPrices,
      validateOrderItems,
      handleStatusChange,
    ],
    afterChange: [
      updateInventory,
    ],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: {
          de: 'Wird automatisch generiert',
          en: 'Auto-generated order number',
        },
      },
      label: {
        de: 'Bestellnummer',
        en: 'Order Number',
      },
    },
    {
      name: 'orderDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString().split('T')[0],
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
      required: true,
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
          hasMany: false,
          admin: {
            description: {
              de: 'Bei unzureichendem Lagerbestand wird das Feld rot markiert',
              en: 'Field will turn red if stock is insufficient',
            },
          },
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
          admin: {
            readOnly: true,
            description: {
              de: 'Wird automatisch aus dem Produkt übernommen',
              en: 'Automatically populated from product',
            },
          },
          label: {
            de: 'Einzelpreis (€)',
            en: 'Unit Price (€)',
          },
        },
        {
          name: 'discount',
          type: 'number',
          min: 0,
          max: 100,
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
      relationTo: 'shipping-methods',
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
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      label: {
        de: 'Zwischensumme (€)',
        en: 'Subtotal (€)',
      },
    },
    {
      name: 'taxAmount',
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      label: {
        de: 'Steuerbetrag (€)',
        en: 'Tax Amount (€)',
      },
    },
    {
      name: 'shippingCost',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
      label: {
        de: 'Versandkosten (€)',
        en: 'Shipping Cost (€)',
      },
    },
    {
      name: 'discount',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
      label: {
        de: 'Rabatt (€)',
        en: 'Discount (€)',
      },
    },
    {
      name: 'total',
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
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
