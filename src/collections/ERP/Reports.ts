import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Reports: CollectionConfig = {
  slug: 'reports',
  labels: {
    singular: 'Bericht',
    plural: 'Berichte',
  },
  admin: {
    group: 'ERP',
    useAsTitle: 'title',
    defaultColumns: ['title', 'reportType', 'createdAt', 'createdBy'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: {
        de: 'Titel',
        en: 'Title',
      },
    },
    {
      name: 'reportType',
      type: 'select',
      required: true,
      label: {
        de: 'Berichtstyp',
        en: 'Report Type',
      },
      options: [
        {
          label: {
            de: 'Verkaufsbericht',
            en: 'Sales Report',
          },
          value: 'sales',
        },
        {
          label: {
            de: 'Lagerbestandsbericht',
            en: 'Inventory Report',
          },
          value: 'inventory',
        },
        {
          label: {
            de: 'Finanzbericht',
            en: 'Financial Report',
          },
          value: 'financial',
        },
        {
          label: {
            de: 'Kundenbericht',
            en: 'Customer Report',
          },
          value: 'customer',
        },
        {
          label: {
            de: 'Lieferantenbericht',
            en: 'Supplier Report',
          },
          value: 'supplier',
        },
        {
          label: {
            de: 'Benutzerdefiniert',
            en: 'Custom',
          },
          value: 'custom',
        },
      ],
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
      name: 'parameters',
      type: 'json',
      label: {
        de: 'Parameter',
        en: 'Parameters',
      },
      admin: {
        description: {
          de: 'Parameter für den Bericht im JSON-Format',
          en: 'Parameters for the report in JSON format',
        },
      },
    },
    {
      name: 'dateRange',
      type: 'group',
      label: {
        de: 'Datumsbereich',
        en: 'Date Range',
      },
      fields: [
        {
          name: 'startDate',
          type: 'date',
          label: {
            de: 'Startdatum',
            en: 'Start Date',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: {
            de: 'Enddatum',
            en: 'End Date',
          },
        },
      ],
    },
    {
      name: 'results',
      type: 'json',
      label: {
        de: 'Ergebnisse',
        en: 'Results',
      },
      admin: {
        description: {
          de: 'Generierte Berichtsdaten im JSON-Format',
          en: 'Generated report data in JSON format',
        },
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
    
    {
      name: 'notes',
      type: 'textarea',
      label: {
        de: 'Notizen',
        en: 'Notes',
      },
    },
    {
      name: 'isScheduled',
      type: 'checkbox',
      label: {
        de: 'Ist geplant',
        en: 'Is Scheduled',
      },
    },
    {
      name: 'schedule',
      type: 'group',
      label: {
        de: 'Zeitplan',
        en: 'Schedule',
      },
      admin: {
        condition: (data) => Boolean(data?.isScheduled),
      },
      fields: [
        {
          name: 'frequency',
          type: 'select',
          label: {
            de: 'Häufigkeit',
            en: 'Frequency',
          },
          options: [
            {
              label: {
                de: 'Täglich',
                en: 'Daily',
              },
              value: 'daily',
            },
            {
              label: {
                de: 'Wöchentlich',
                en: 'Weekly',
              },
              value: 'weekly',
            },
            {
              label: {
                de: 'Monatlich',
                en: 'Monthly',
              },
              value: 'monthly',
            },
            {
              label: {
                de: 'Vierteljährlich',
                en: 'Quarterly',
              },
              value: 'quarterly',
            },
          ],
        },
        {
          name: 'nextRunDate',
          type: 'date',
          label: {
            de: 'Nächste Ausführung',
            en: 'Next Run Date',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
