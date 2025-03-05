import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: {
    singular: 'Dokument',
    plural: 'Dokumente',
  },
  admin: {
    group: 'ERP',
    useAsTitle: 'title',
    defaultColumns: ['title', 'documentType', 'createdAt', 'createdBy'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  
  upload: {
    staticDir: '../../../uploads/documents',
    mimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
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
      name: 'documentType',
      type: 'select',
      required: true,
      label: {
        de: 'Dokumenttyp',
        en: 'Document Type',
      },
      options: [
        {
          label: {
            de: 'Rechnung',
            en: 'Invoice',
          },
          value: 'invoice',
        },
        {
          label: {
            de: 'Lieferschein',
            en: 'Delivery Note',
          },
          value: 'deliveryNote',
        },
        {
          label: {
            de: 'Bestellung',
            en: 'Order',
          },
          value: 'order',
        },
        {
          label: {
            de: 'Quittung',
            en: 'Receipt',
          },
          value: 'receipt',
        },
        {
          label: {
            de: 'Vertrag',
            en: 'Contract',
          },
          value: 'contract',
        },
        {
          label: {
            de: 'Steuerdokument',
            en: 'Tax Document',
          },
          value: 'taxDocument',
        },
        {
          label: {
            de: 'Bericht',
            en: 'Report',
          },
          value: 'report',
        },
        {
          label: {
            de: 'Sonstiges',
            en: 'Other',
          },
          value: 'other',
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
      name: 'relatedEntity',
      type: 'relationship',
      relationTo: ['orders', 'customers', 'suppliers', 'purchases', 'invoices', 'products', 'users'],
      hasMany: false,
      label: {
        de: 'Zugehörige Entität',
        en: 'Related Entity',
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
          label: {
            de: 'Tag',
            en: 'Tag',
          },
        },
      ],
    },
    {
      name: 'isPublic',
      type: 'checkbox',
      label: {
        de: 'Öffentlich',
        en: 'Public',
      },
      defaultValue: false,
    },
    {
      name: 'expiryDate',
      type: 'date',
      label: {
        de: 'Ablaufdatum',
        en: 'Expiry Date',
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
