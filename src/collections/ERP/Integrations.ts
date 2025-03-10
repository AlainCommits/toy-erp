import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Integrations: CollectionConfig = {
  slug: 'integrations',
  labels: {
    singular: 'Integration',
    plural: 'Integrationen',
  },
  admin: {
    group: 'Dokumente & Integration',
    useAsTitle: 'name',
    defaultColumns: ['name', 'integrationType', 'status', 'lastSyncAt'],
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
      name: 'integrationType',
      type: 'select',
      required: true,
      label: {
        de: 'Integrationstyp',
        en: 'Integration Type',
      },
      options: [
        {
          label: {
            de: 'Elster (Steuerberichterstattung)',
            en: 'Elster (Tax Reporting)',
          },
          value: 'elster',
        },
        {
          label: {
            de: 'Buchhaltungssoftware',
            en: 'Accounting Software',
          },
          value: 'accounting',
        },
        {
          label: {
            de: 'Zahlungs-Gateway',
            en: 'Payment Gateway',
          },
          value: 'payment',
        },
        {
          label: {
            de: 'Versanddienstleister',
            en: 'Shipping Carrier',
          },
          value: 'shipping',
        },
        {
          label: {
            de: 'E-Mail Marketing',
            en: 'Email Marketing',
          },
          value: 'email',
        },
        {
          label: {
            de: 'CRM',
            en: 'CRM',
          },
          value: 'crm',
        },
        {
          label: {
            de: 'Marktplatz',
            en: 'Marketplace',
          },
          value: 'marketplace',
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
      name: 'connectionDetails',
      type: 'group',
      label: {
        de: 'Verbindungsdetails',
        en: 'Connection Details',
      },
      fields: [
        {
          name: 'apiUrl',
          type: 'text',
          label: {
            de: 'API-URL',
            en: 'API URL',
          },
        },
        {
          name: 'authType',
          type: 'select',
          label: {
            de: 'Authentifizierungstyp',
            en: 'Authentication Type',
          },
          options: [
            {
              label: {
                de: 'API-Schlüssel',
                en: 'API Key',
              },
              value: 'apiKey',
            },
            {
              label: {
                de: 'OAuth',
                en: 'OAuth',
              },
              value: 'oauth',
            },
            {
              label: {
                de: 'Benutzername/Passwort',
                en: 'Username/Password',
              },
              value: 'basic',
            },
            {
              label: {
                de: 'Token',
                en: 'Token',
              },
              value: 'token',
            },
          ],
        },
        {
          name: 'credentials',
          type: 'json',
          label: {
            de: 'Anmeldeinformationen (verschlüsselt)',
            en: 'Credentials (encrypted)',
          },
          admin: {
            description: {
              de: 'Alle Anmeldeinformationen werden verschlüsselt gespeichert',
              en: 'All credentials are stored encrypted',
            },
          },
        },
      ],
    },
    
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'inactive',
      label: {
        de: 'Status',
        en: 'Status',
      },
      options: [
        {
          label: {
            de: 'Aktiv',
            en: 'Active',
          },
          value: 'active',
        },
        {
          label: {
            de: 'Inaktiv',
            en: 'Inactive',
          },
          value: 'inactive',
        },
        {
          label: {
            de: 'Fehlgeschlagen',
            en: 'Failed',
          },
          value: 'failed',
        },
        {
          label: {
            de: 'In Wartung',
            en: 'Maintenance',
          },
          value: 'maintenance',
        },
      ],
    },
    {
      name: 'lastSyncAt',
      type: 'date',
      label: {
        de: 'Letzte Synchronisierung',
        en: 'Last Sync',
      },
    },
    {
      name: 'syncFrequency',
      type: 'select',
      label: {
        de: 'Synchronisierungshäufigkeit',
        en: 'Sync Frequency',
      },
      options: [
        {
          label: {
            de: 'Manuell',
            en: 'Manual',
          },
          value: 'manual',
        },
        {
          label: {
            de: 'Stündlich',
            en: 'Hourly',
          },
          value: 'hourly',
        },
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
      ],
    },
    {
      name: 'nextSyncAt',
      type: 'date',
      label: {
        de: 'Nächste geplante Synchronisierung',
        en: 'Next Scheduled Sync',
      },
    },
    {
      name: 'mappings',
      type: 'json',
      label: {
        de: 'Feld-Mappings',
        en: 'Field Mappings',
      },
      admin: {
        description: {
          de: 'Konfiguration zur Zuordnung von Feldern zwischen Systemen',
          en: 'Configuration for mapping fields between systems',
        },
      },
    },
    {
      name: 'errorLog',
      type: 'array',
      label: {
        de: 'Fehlerprotokoll',
        en: 'Error Log',
      },
      fields: [
        {
          name: 'timestamp',
          type: 'date',
          label: {
            de: 'Zeitstempel',
            en: 'Timestamp',
          },
        },
        {
          name: 'errorMessage',
          type: 'text',
          label: {
            de: 'Fehlermeldung',
            en: 'Error Message',
          },
        },
        {
          name: 'details',
          type: 'textarea',
          label: {
            de: 'Details',
            en: 'Details',
          },
        },
      ],
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
