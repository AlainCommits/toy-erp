import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'

export const Payments: CollectionConfig = {
  slug: 'payments',
  labels: {
    singular: 'Zahlung',
    plural: 'Zahlungen',
  },
  admin: {
    group: 'Finanzen',
    useAsTitle: 'paymentReference',
    defaultColumns: ['paymentNumber', 'paymentDate', 'amount', 'status'],
    hidden: ({ user }) => {
      // Super admins can see everything
      if (user?.roles?.includes('super-admin')) return false
      // Show to finance department users
      if (user?.roles?.includes('Finanzen')) return false
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
      
      // Finance department can read
      if (user.roles?.includes('Finanzen')) return true
      
      // Everyone else denied
      return false
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Finanzen') || false
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Finanzen') || false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Finanzen') || false
    },
  },
  fields: [
    {
      name: 'paymentNumber',
      type: 'text',
      required: true,
      label: {
        de: 'Zahlungsnummer',
        en: 'Payment Number',
      },
    },
    {
      name: 'paymentDate',
      type: 'date',
      required: true,
      label: {
        de: 'Zahlungsdatum',
        en: 'Payment Date',
      },
    },
    {
      name: 'invoice',
      type: 'relationship',
      relationTo: 'invoices',
      required: true,
      label: {
        de: 'Rechnung',
        en: 'Invoice',
      },
    },
    {
      name: 'invoiceInfo',
      type: 'group',
      label: {
        de: 'Rechnungsinformationen',
        en: 'Invoice Information',
      },
      fields: [
        {
          name: 'invoiceNumber',
          type: 'text',
          label: {
            de: 'Rechnungsnummer',
            en: 'Invoice Number',
          },
        },
        {
          name: 'invoiceDate',
          type: 'date',
          label: {
            de: 'Rechnungsdatum',
            en: 'Invoice Date',
          },
        },
      ],
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: {
        de: 'Betrag (€)',
        en: 'Amount (€)',
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      label: {
        de: 'Zahlungsart',
        en: 'Payment Method',
      },
      options: [
        {
          label: {
            de: 'Barzahlung',
            en: 'Cash',
          },
          value: 'cash',
        },
        {
          label: {
            de: 'Kreditkarte',
            en: 'Credit Card',
          },
          value: 'creditCard',
        },
        {
          label: {
            de: 'Banküberweisung',
            en: 'Bank Transfer',
          },
          value: 'bankTransfer',
        },
        {
          label: {
            de: 'PayPal',
            en: 'PayPal',
          },
          value: 'paypal',
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
            de: 'Scheck',
            en: 'Check',
          },
          value: 'check',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: {
        de: 'Status',
        en: 'Status',
      },
      defaultValue: 'completed',
      options: [
        {
          label: {
            de: 'Abgeschlossen',
            en: 'Completed',
          },
          value: 'completed',
        },
        {
          label: {
            de: 'In Bearbeitung',
            en: 'Processing',
          },
          value: 'processing',
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
            de: 'Erstattet',
            en: 'Refunded',
          },
          value: 'refunded',
        },
      ],
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      label: {
        de: 'Kunde',
        en: 'Customer',
      },
    },
    {
      name: 'customerInfo',
      type: 'group',
      label: {
        de: 'Kundeninformationen',
        en: 'Customer Information',
      },
      fields: [
        {
          name: 'customerNumber',
          type: 'text',
          label: {
            de: 'Kundennummer',
            en: 'Customer Number',
          },
        },
        {
          name: 'name',
          type: 'text',
          label: {
            de: 'Name',
            en: 'Name',
          },
        },
      ],
    },
    {
      name: 'paymentReference',
      type: 'text',
      label: {
        de: 'Zahlungsreferenz',
        en: 'Payment Reference',
      },
    },
    {
      name: 'transactionId',
      type: 'text',
      label: {
        de: 'Transaktions-ID',
        en: 'Transaction ID',
      },
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
      name: 'processedBy',
      type: 'text',
      label: {
        de: 'Verarbeitet von',
        en: 'Processed By',
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
