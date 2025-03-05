import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Suppliers: CollectionConfig = {
  slug: 'suppliers',
  labels: {
    singular: 'Lieferant',
    plural: 'Lieferanten',
  },
  admin: {
    group: 'ERP',
    useAsTitle: 'name',
    defaultColumns: ['name', 'contactPerson', 'email', 'phone'],
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
        de: 'Lieferantenname',
        en: 'Supplier Name',
      },
    },
    {
      name: 'contactPerson',
      type: 'text',
      label: {
        de: 'Ansprechpartner',
        en: 'Contact Person',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: {
        de: 'E-Mail',
        en: 'Email',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: {
        de: 'Telefon',
        en: 'Phone',
      },
    },
    {
      name: 'website',
      type: 'text',
      label: {
        de: 'Webseite',
        en: 'Website',
      },
    },
    {
      name: 'taxId',
      type: 'text',
      label: {
        de: 'Steuernummer',
        en: 'Tax ID',
      },
    },
    {
      name: 'vatId',
      type: 'text',
      label: {
        de: 'USt-IdNr.',
        en: 'VAT ID',
      },
    },
    {
      name: 'paymentTerms',
      type: 'text',
      label: {
        de: 'Zahlungsbedingungen',
        en: 'Payment Terms',
      },
      admin: {
        description: {
          de: 'z.B. 30 Tage netto',
          en: 'e.g. Net 30 days',
        },
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
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: {
        de: 'Gelieferte Produkte',
        en: 'Products Supplied',
      },
      admin: {
        description: {
          de: 'Produkte, die von diesem Lieferanten bezogen werden',
          en: 'Products sourced from this supplier',
        },
      },
    },
    {
      name: 'pricingTerms',
      type: 'textarea',
      label: {
        de: 'Preiskonditionen',
        en: 'Pricing Terms',
      },
    },
    {
      name: 'contractInfo',
      type: 'group',
      label: {
        de: 'Vertragsinformationen',
        en: 'Contract Information',
      },
      fields: [
        {
          name: 'contractNumber',
          type: 'text',
          label: {
            de: 'Vertragsnummer',
            en: 'Contract Number',
          },
        },
        {
          name: 'startDate',
          type: 'date',
          label: {
            de: 'Vertragsbeginn',
            en: 'Start Date',
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: {
            de: 'Vertragsende',
            en: 'End Date',
          },
        },
        {
          name: 'autoRenew',
          type: 'checkbox',
          label: {
            de: 'Automatische Verlängerung',
            en: 'Auto-renew',
          },
        },
        {
          name: 'contractDocument',
          type: 'relationship',
          relationTo: 'documents',
          label: {
            de: 'Vertragsdokument',
            en: 'Contract Document',
          },
        },
      ],
    },
    {
      name: 'address',
      type: 'group',
      label: {
        de: 'Adresse',
        en: 'Address',
      },
      fields: [
        {
          name: 'street',
          type: 'text',
          label: {
            de: 'Straße',
            en: 'Street',
          },
        },
        {
          name: 'zipCode',
          type: 'text',
          label: {
            de: 'PLZ',
            en: 'Zip Code',
          },
        },
        {
          name: 'city',
          type: 'text',
          label: {
            de: 'Stadt',
            en: 'City',
          },
        },
        {
          name: 'country',
          type: 'text',
          label: {
            de: 'Land',
            en: 'Country',
          },
          defaultValue: 'Deutschland',
        },
      ],
    },
    {
      name: 'bankInfo',
      type: 'group',
      label: {
        de: 'Bankverbindung',
        en: 'Bank Information',
      },
      fields: [
        {
          name: 'accountHolder',
          type: 'text',
          label: {
            de: 'Kontoinhaber',
            en: 'Account Holder',
          },
        },
        {
          name: 'iban',
          type: 'text',
          label: {
            de: 'IBAN',
            en: 'IBAN',
          },
        },
        {
          name: 'bic',
          type: 'text',
          label: {
            de: 'BIC',
            en: 'BIC',
          },
        },
        {
          name: 'bankName',
          type: 'text',
          label: {
            de: 'Bankname',
            en: 'Bank Name',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
