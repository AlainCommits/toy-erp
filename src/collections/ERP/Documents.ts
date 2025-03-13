import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../../access/isSuperAdmin'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: {
    singular: 'Dokument',
    plural: 'Dokumente',
  },
  admin: {
    group: 'Dokumente & Integration',
    useAsTitle: 'title',
    defaultColumns: ['title', 'documentType', 'createdAt', 'createdBy'],
  },
  access: {
    create: () => true, // Allow hooks to create documents
    read: ({ req }) => {
      // Alle authentifizierten Benutzer können lesen, aber du kannst hier die Logik anpassen
      return req.user ? true : false;
    },
    update: ({ req }) => {
      if (isSuperAdmin(req.user) ) {
        return true;
      }
      return false;
    },
    delete: ({ req }) => {
      return isSuperAdmin(req.user);
    },
  },
  upload: {
    staticDir: 'uploads/documents',
    adminThumbnail: 'thumbnail',
    mimeTypes: ['application/pdf'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
      }
    ],
  },
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user) {
          data.createdBy = req.user.id;
        }
        return data;
      },
    ],
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
