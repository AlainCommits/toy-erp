import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { generateCustomerNumber } from './Customers/hooks'

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: 'Kunde',
    plural: 'Kunden',
  },
  admin: {
    group: 'ERP',
    useAsTitle: 'name',
    defaultColumns: ['name', 'customerNumber', 'email', 'phone'],
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
        de: 'Kundenname',
        en: 'Customer Name',
      },
    },
    {
      name: 'customerNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        disabled: true,
        description: {
          de: 'Wird automatisch generiert',
          en: 'Auto-generated customer number',
        },
      },
      label: {
        de: 'Kundennummer',
        en: 'Customer Number',
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
      name: 'customerType',
      type: 'select',
      options: [
        {
          label: {
            de: 'Einzelhandel',
            en: 'Retail',
          },
          value: 'retail',
        },
        {
          label: {
            de: 'Großhandel',
            en: 'Wholesale',
          },
          value: 'wholesale',
        },
        {
          label: {
            de: 'Geschäftskunde',
            en: 'Business',
          },
          value: 'business',
        },
      ],
      label: {
        de: 'Kundentyp',
        en: 'Customer Type',
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
      name: 'orders',
      type: 'relationship',
      relationTo: 'orders',
      hasMany: true,
      label: {
        de: 'Bestellungen',
        en: 'Orders',
      },
    },
    {
      name: 'invoices',
      type: 'relationship',
      relationTo: 'invoices',
      hasMany: true,
      label: {
        de: 'Rechnungen',
        en: 'Invoices',
      },
    },
    {
      name: 'billingAddress',
      type: 'group',
      label: {
        de: 'Rechnungsadresse',
        en: 'Billing Address',
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
      name: 'shippingAddress',
      type: 'group',
      label: {
        de: 'Lieferadresse',
        en: 'Shipping Address',
      },
      fields: [
        {
          name: 'sameAsBilling',
          type: 'checkbox',
          label: {
            de: 'Identisch mit Rechnungsadresse',
            en: 'Same as billing address',
          },
        },
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
  ],
  hooks: {
    beforeChange: [
      generateCustomerNumber,
    ],
  },
  timestamps: true,
}
