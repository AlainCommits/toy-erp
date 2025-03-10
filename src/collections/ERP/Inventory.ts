import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../../access/isSuperAdmin'
import { syncProductQuantity } from './Inventory/hooks/syncProductQuantity'

export const Inventory: CollectionConfig = {
  slug: 'inventory',
  labels: {
    singular: 'Lagerbestand',
    plural: 'Lagerbestände',
  },
  admin: {
    group: 'Lagerverwaltung',
    useAsTitle: 'inventoryId',
    defaultColumns: ['inventoryId', 'product', 'warehouse', 'quantity'],
    hidden: ({ user }) => {
      // Super admins can see everything
      if (user?.roles?.includes('super-admin')) return false
      // Show to warehouse department users
      if (user?.roles?.includes('Lager')) return false
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
      
      // Warehouse department can read
      if (user.roles?.includes('Lager')) return true
      
      // Everyone else denied
      return false
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Lager') || false
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Lager') || false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Lager') || false
    },
  },
  hooks: {
    afterChange: [
      syncProductQuantity,
    ],
  },
  fields: [
    {
      name: 'inventoryId',
      type: 'text',
      required: true,
      unique: true,
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
      defaultValue: 0,
      min: 0,
      label: {
        de: 'Menge',
        en: 'Quantity',
      },
    },
    {
      name: 'warehouse',
      type: 'relationship',
      relationTo: 'warehouses',
      required: true,
      label: {
        de: 'Lager',
        en: 'Warehouse',
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
      name: 'section',
      type: 'text',
      label: {
        de: 'Sektion',
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
