import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const TaxRates: CollectionConfig = {
  slug: 'taxRates',
  labels: {
    singular: 'Steuersatz',
    plural: 'Steuersätze',
  },
  admin: {
    group: 'ERP',
    useAsTitle: 'name',
    defaultColumns: ['name', 'rate', 'region', 'isActive'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
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
      name: 'rate',
      type: 'number',
      required: true,
      label: {
        de: 'Steuersatz (%)',
        en: 'Tax Rate (%)',
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
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: {
        de: 'Aktiv',
        en: 'Active',
      },
    },
    {
      name: 'region',
      type: 'text',
      label: {
        de: 'Region/Land',
        en: 'Region/Country',
      },
      defaultValue: 'Deutschland',
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      label: {
        de: 'Standard-Steuersatz',
        en: 'Default Tax Rate',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: {
        de: 'Steuerkategorie',
        en: 'Tax Category',
      },
      options: [
        {
          label: {
            de: 'Standard',
            en: 'Standard',
          },
          value: 'standard',
        },
        {
          label: {
            de: 'Ermäßigt',
            en: 'Reduced',
          },
          value: 'reduced',
        },
        {
          label: {
            de: 'Null',
            en: 'Zero',
          },
          value: 'zero',
        },
        {
          label: {
            de: 'Befreit',
            en: 'Exempt',
          },
          value: 'exempt',
        },
      ],
    },
    {
      name: 'effectiveFrom',
      type: 'date',
      label: {
        de: 'Gültig ab',
        en: 'Effective From',
      },
    },
    {
      name: 'effectiveTo',
      type: 'date',
      label: {
        de: 'Gültig bis',
        en: 'Effective To',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: {
        de: 'Interne Notizen',
        en: 'Internal Notes',
      },
    },
  ],
  timestamps: true,
}
