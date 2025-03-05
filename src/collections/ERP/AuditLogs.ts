import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const AuditLogs: CollectionConfig = {
  slug: 'auditLogs',
  labels: {
    singular: 'Änderungsprotokoll',
    plural: 'Änderungsprotokolle',
  },
  admin: {
    group: 'ERP',
    useAsTitle: 'action',
    defaultColumns: ['action', 'user', 'entityType', 'createdAt'],
    description: {
      de: 'Protokolliert alle Änderungen innerhalb des Systems für Audit-Zwecke',
      en: 'Logs all changes within the system for audit purposes',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated, // Although audit logs shouldn't typically be updated
  },
  
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: {
        de: 'Benutzer',
        en: 'User',
      },
    },
    {
      name: 'action',
      type: 'select',
      required: true,
      label: {
        de: 'Aktion',
        en: 'Action',
      },
      options: [
        {
          label: {
            de: 'Erstellen',
            en: 'Create',
          },
          value: 'create',
        },
        {
          label: {
            de: 'Aktualisieren',
            en: 'Update',
          },
          value: 'update',
        },
        {
          label: {
            de: 'Löschen',
            en: 'Delete',
          },
          value: 'delete',
        },
        {
          label: {
            de: 'Anmelden',
            en: 'Login',
          },
          value: 'login',
        },
        {
          label: {
            de: 'Abmelden',
            en: 'Logout',
          },
          value: 'logout',
        },
        {
          label: {
            de: 'Export',
            en: 'Export',
          },
          value: 'export',
        },
        {
          label: {
            de: 'Import',
            en: 'Import',
          },
          value: 'import',
        },
        {
          label: {
            de: 'Berechtigung ändern',
            en: 'Change Permission',
          },
          value: 'changePermission',
        },
        {
          label: {
            de: 'Zahlungsabwicklung',
            en: 'Process Payment',
          },
          value: 'processPayment',
        },
        {
          label: {
            de: 'Sonstige',
            en: 'Other',
          },
          value: 'other',
        },
      ],
    },
    {
      name: 'entityType',
      type: 'text',
      required: true,
      label: {
        de: 'Entitätstyp',
        en: 'Entity Type',
      },
      admin: {
        description: {
          de: 'Die Art der Entität, die geändert wurde (z.B. Produkt, Bestellung)',
          en: 'The type of entity that was changed (e.g. product, order)',
        },
      },
    },
    {
      name: 'entityId',
      type: 'text',
      label: {
        de: 'Entitäts-ID',
        en: 'Entity ID',
      },
      admin: {
        description: {
          de: 'Die ID der betroffenen Entität',
          en: 'The ID of the affected entity',
        },
      },
    },
    {
      name: 'details',
      type: 'textarea',
      label: {
        de: 'Details',
        en: 'Details',
      },
      admin: {
        description: {
          de: 'Zusätzliche Informationen zur Aktion',
          en: 'Additional information about the action',
        },
      },
    },
    {
      name: 'changes',
      type: 'json',
      label: {
        de: 'Änderungen',
        en: 'Changes',
      },
      admin: {
        description: {
          de: 'Speichert die genauen Änderungen (vorher/nachher)',
          en: 'Stores the exact changes (before/after)',
        },
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      label: {
        de: 'IP-Adresse',
        en: 'IP Address',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      label: {
        de: 'User-Agent',
        en: 'User Agent',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: {
        de: 'Status',
        en: 'Status',
      },
      options: [
        {
          label: {
            de: 'Erfolgreich',
            en: 'Success',
          },
          value: 'success',
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
            de: 'Warnung',
            en: 'Warning',
          },
          value: 'warning',
        },
      ],
    },
  ],
  timestamps: true,
}
