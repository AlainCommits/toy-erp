import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { generateArticleNumber, syncProductPrice } from './Products/hooks'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Produkt',
    plural: 'Produkte',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'ERP',
    useAsTitle: 'name',
    defaultColumns: ['name', 'sku', 'price', 'stockQuantity'],
  },
  fields: [
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
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        disabled: true,
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
      relationTo: 'taxRates',
      label: {
        de: 'Steuersatz',
        en: 'Tax Rate',
      },
      admin: {
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
  ],
  hooks: {
    beforeChange: [
      generateArticleNumber,
    ],
    afterChange: [
      syncProductPrice,
    ],
  },
  timestamps: true,
}
