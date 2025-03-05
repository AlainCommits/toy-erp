import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Inventory: CollectionConfig = {
  slug: 'inventory',
  labels: {
    singular: 'Lagerbestand',
    plural: 'Lagerbestände',
  },
  admin: {
    group: 'ERP',
    useAsTitle: 'inventoryId',
    defaultColumns: ['inventoryId', 'quantity', 'location', 'updatedAt'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
 
  fields: [
    {
      name: 'inventoryId',
      type: 'text',
      required: true,
      label: {
        de: 'Lagerbestand-ID',
        en: 'Inventory ID',
      },
    },
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
      label: {
        de: 'Menge',
        en: 'Quantity',
      },
    },
    {
      name: 'availableQuantity',
      type: 'number',
      label: {
        de: 'Verfügbare Menge',
        en: 'Available Quantity',
      },
      admin: {
        description: {
          de: 'Menge, die nicht reserviert ist',
          en: 'Quantity that is not reserved',
        },
      },
    },
    {
      name: 'reservedQuantity',
      type: 'number',
      label: {
        de: 'Reservierte Menge',
        en: 'Reserved Quantity',
      },
      admin: {
        description: {
          de: 'Menge, die für Bestellungen reserviert ist',
          en: 'Quantity that is reserved for orders',
        },
      },
    },
    {
      name: 'location',
      type: 'text',
      label: {
        de: 'Lagerort',
        en: 'Location',
      },
    },
    {
      name: 'warehouse',
      type: 'relationship',
      relationTo: 'warehouses',
      label: {
        de: 'Lagerhaus',
        en: 'Warehouse',
      },
    },
    {
      name: 'section',
      type: 'text',
      label: {
        de: 'Bereich',
        en: 'Section',
      },
    },
    {
      name: 'shelf',
      type: 'text',
      label: {
        de: 'Regal',
        en: 'Shelf',
      },
    },
    {
      name: 'bin',
      type: 'text',
      label: {
        de: 'Fach',
        en: 'Bin',
      },
    },
    {
      name: 'minStockLevel',
      type: 'number',
      label: {
        de: 'Mindestbestand',
        en: 'Minimum Stock Level',
      },
    },
    {
      name: 'reorderPoint',
      type: 'number',
      label: {
        de: 'Nachbestellpunkt',
        en: 'Reorder Point',
      },
    },
    {
      name: 'reorderQuantity',
      type: 'number',
      label: {
        de: 'Nachbestellmenge',
        en: 'Reorder Quantity',
      },
    },
    {
      name: 'lastStockTake',
      type: 'date',
      label: {
        de: 'Letzte Inventur',
        en: 'Last Stock Take',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: {
            de: 'Ausreichend',
            en: 'Sufficient',
          },
          value: 'sufficient',
        },
        {
          label: {
            de: 'Niedrig',
            en: 'Low',
          },
          value: 'low',
        },
        {
          label: {
            de: 'Kritisch',
            en: 'Critical',
          },
          value: 'critical',
        },
        {
          label: {
            de: 'Ausverkauft',
            en: 'Out of Stock',
          },
          value: 'outOfStock',
        },
        {
          label: {
            de: 'Bestellt',
            en: 'On Order',
          },
          value: 'onOrder',
        },
      ],
      label: {
        de: 'Status',
        en: 'Status',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: {
        de: 'Notizen',
        en: 'Notes',
      },
    },
  ],
  timestamps: true,
}
