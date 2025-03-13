import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { generateCustomerNumber } from './Customers/hooks'
import { assignOrders } from './Customers/hooks/assignOrders'

export const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: 'Kunde',
    plural: 'Kunden',
  },
  admin: {
    group: 'Verkauf & CRM',
    useAsTitle: 'name',
    defaultColumns: ['customerNumber', 'name', 'email', 'customerType'],
    hidden: ({ user }) => {
      // Super admins can see everything
      if (user?.roles?.includes('super-admin')) return false
      // Show to sales department users
      if (user?.roles?.includes('Verkauf')) return false
      // Hide from everyone else
      return true
    },
  },
  access: {
    read: ({ req: { user } }) => {
      // Must be logged in
      if (!user) return false
      
      // Super admins can read everything
      if (isSuperAdmin(user)) return true
      
      // Sales department can read
      if (user.roles?.includes('Verkauf')) return true
      
      // Everyone else denied
      return false
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Verkauf') || false
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Verkauf') || false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Verkauf') || false
    },
  },
  hooks: {
    beforeChange: [
      generateCustomerNumber,
    ],
    afterChange: [
      assignOrders,
    ],
  },
  fields: [
    {
      name: 'customerNumber',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
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
      name: 'name',
      type: 'text',
      required: true,
      label: {
        de: 'Name',
        en: 'Name',
      },
    },
    {
      name: 'email',
      type: 'email',
      unique: true,
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
      required: true,
      defaultValue: 'retail',
      options: [
        {
          label: {
            de: 'Privatkunde',
            en: 'Retail',
          },
          value: 'retail',
        },
        {
          label: {
            de: 'Geschäftskunde',
            en: 'Business',
          },
          value: 'business',
        },
        {
          label: {
            de: 'Großhandel',
            en: 'Wholesale',
          },
          value: 'wholesale',
        },
      ],
      label: {
        de: 'Kundentyp',
        en: 'Customer Type',
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
    {
      name: 'companyDetails',
      type: 'group',
      label: {
        de: 'Firmendaten',
        en: 'Company Details',
      },
      admin: {
        condition: (data) => data.customerType === 'business' || data.customerType === 'wholesale',
      },
      fields: [
        {
          name: 'companyName',
          type: 'text',
          label: {
            de: 'Firmenname',
            en: 'Company Name',
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
      ],
    },
    {
      name: 'paymentTerms',
      type: 'group',
      label: {
        de: 'Zahlungsbedingungen',
        en: 'Payment Terms',
      },
      fields: [
        {
          name: 'method',
          type: 'select',
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
                de: 'Lastschrift',
                en: 'Direct Debit',
              },
              value: 'directDebit',
            },
            {
              label: {
                de: 'Kreditkarte',
                en: 'Credit Card',
              },
              value: 'creditCard',
            },
          ],
          label: {
            de: 'Zahlungsart',
            en: 'Payment Method',
          },
        },
        {
          name: 'terms',
          type: 'select',
          options: [
            {
              label: {
                de: 'Sofort',
                en: 'Immediate',
              },
              value: 'immediate',
            },
            {
              label: {
                de: '14 Tage',
                en: '14 Days',
              },
              value: 'net14',
            },
            {
              label: {
                de: '30 Tage',
                en: '30 Days',
              },
              value: 'net30',
            },
          ],
          label: {
            de: 'Zahlungsziel',
            en: 'Payment Terms',
          },
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: {
        de: 'Anmerkungen',
        en: 'Notes',
      },
    },
    {
      name: 'orders',
      type: 'relationship',
      relationTo: 'orders',
      hasMany: true,
      admin: {
        description: {
          de: 'Automatisch zugewiesene Bestellungen',
          en: 'Automatically assigned orders',
        },
        position: 'sidebar',
        readOnly: true,
      },
      label: {
        de: 'Bestellungen',
        en: 'Orders',
      },
    },
    // {
    //   name: 'tenant',
    //   type: 'relationship',
    //   relationTo: 'tenants',
    //   required: true,
    // }
  ],
  timestamps: true,
}
