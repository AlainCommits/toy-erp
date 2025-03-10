import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { generateArticleNumber, syncProductPrice, syncInventoryQuantity } from './Products/hooks'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Produkt',
    plural: 'Produkte',
  },
  admin: {
    group: 'Lagerverwaltung',
    useAsTitle: 'name',
    defaultColumns: ['sku', 'name', 'price', 'stockQuantity'],
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
    beforeChange: [
      generateArticleNumber,
    ],
    afterChange: [
      syncProductPrice,
      syncInventoryQuantity,
    ],
  },
  fields: [
    {
      name: 'sku',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: {
          de: 'Wird automatisch generiert',
          en: 'Auto-generated article number',
        },
      },
      label: {
        de: 'Artikelnummer',
        en: 'SKU',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: {
        de: 'Produktname',
        en: 'Product Name',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: {
        de: 'Beschreibung',
        en: 'Description',
      },
    },
    {
      name: 'supplier',
      type: 'relationship',
      relationTo: 'suppliers',
      label: {
        de: 'Lieferant',
        en: 'Supplier',
      },
      admin: {
        description: {
          de: 'Lieferant, von dem dieses Produkt bezogen wird',
          en: 'Supplier from whom this product is sourced',
        },
      },
    },
    {
      name: 'categories',
      type: 'array',
      label: {
        de: 'Kategorien',
        en: 'Categories',
      },
      fields: [
        {
          name: 'category',
          type: 'text',
          required: true,
          label: {
            de: 'Kategorie',
            en: 'Category',
          },
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: {
        de: 'Tags',
        en: 'Tags',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          label: {
            de: 'Tag',
            en: 'Tag',
          },
        },
      ],
    },
    {
      name: 'barcode',
      type: 'text',
      label: {
        de: 'Barcode/EAN',
        en: 'Barcode/EAN',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: {
        de: 'Preis (€)',
        en: 'Price (€)',
      },
    },
    {
      name: 'costPrice',
      type: 'number',
      label: {
        de: 'Einkaufspreis (€)',
        en: 'Cost Price (€)',
      },
      admin: {
        description: {
          de: 'Preis, zu dem das Produkt vom Lieferanten eingekauft wird',
          en: 'Price at which the product is purchased from supplier',
        },
      },
    },
    {
      name: 'stockQuantity',
      type: 'number',
      required: true,
      defaultValue: 0,
      min: 0,
      label: {
        de: 'Lagerbestand',
        en: 'Stock Quantity',
      },
      admin: {
        description: {
          de: 'Aktuelle Menge auf Lager',
          en: 'Current quantity in stock',
        },
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
      name: 'dimensions',
      type: 'group',
      label: {
        de: 'Abmessungen',
        en: 'Dimensions',
      },
      fields: [
        {
          name: 'length',
          type: 'number',
          label: {
            de: 'Länge (cm)',
            en: 'Length (cm)',
          },
        },
        {
          name: 'width',
          type: 'number',
          label: {
            de: 'Breite (cm)',
            en: 'Width (cm)',
          },
        },
        {
          name: 'height',
          type: 'number',
          label: {
            de: 'Höhe (cm)',
            en: 'Height (cm)',
          },
        },
        {
          name: 'weight',
          type: 'number',
          label: {
            de: 'Gewicht (kg)',
            en: 'Weight (kg)',
          },
        },
      ],
    },
    {
      name: 'taxRate',
      type: 'relationship',
      relationTo: 'tax-rates',
      label: {
        de: 'Steuersatz',
        en: 'Tax Rate',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: {
        de: 'Produktbilder',
        en: 'Product Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: {
            de: 'Bild',
            en: 'Image',
          },
        },
        {
          name: 'altText',
          type: 'text',
          label: {
            de: 'Alternativtext',
            en: 'Alt Text',
          },
        },
      ],
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
