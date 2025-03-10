import { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const ReportingCategories: CollectionConfig = {
  slug: 'reporting-categories',
  admin: {
    group: 'Finanzen',
    defaultColumns: ['name', 'type'],
    useAsTitle: 'name',
  },
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  labels: {
    singular: 'Reporting-Kategorie',
    plural: 'Reporting-Kategorien',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Kategoriename',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Umsatz', value: 'revenue' },
        { label: 'Kosten', value: 'expense' },
        { label: 'Bilanz', value: 'balance' },
      ],
      required: true,
    },
    // Die Selbstreferenz ist auskommentiert, bis die Collection erstellt 
    // und die Typen aktualisiert wurden
    /*
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'reportingCategories',
      label: 'Übergeordnete Kategorie',
    },
    */
    {
      name: 'tenant',
      type: 'relationship',
      relationTo: 'tenants', // Verweist auf die Tenants-Collection
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beschreibung',
    },
    {
      name: 'color',
      type: 'text',
      label: 'Farbe (hex)',
      defaultValue: '#0088FE',
    }
  ]
}
