import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Invoices: CollectionConfig = {
  slug: 'invoices',
  labels: {
    singular: 'Rechnung',
    plural: 'Rechnungen',
  },
  admin: {
    group: 'ERP',
    useAsTitle: 'invoiceNumber',
    defaultColumns: ['invoiceNumber', 'invoiceDate', 'dueDate', 'status', 'total'],
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
 
  fields: [
    {
      name: 'invoiceNumber',
      type: 'text',
      required: true,
      label: {
        de: 'Rechnungsnummer',
        en: 'Invoice Number',
      },
    },
    {
      name: 'invoiceDate',
      type: 'date',
      required: true,
      label: {
        de: 'Rechnungsdatum',
        en: 'Invoice Date',
      },
    },
    {
      name: 'dueDate',
      type: 'date',
      required: true,
      label: {
        de: 'Fälligkeitsdatum',
        en: 'Due Date',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: {
        de: 'Status',
        en: 'Status',
      },
      defaultValue: 'unpaid',
      options: [
        {
          label: {
            de: 'Unbezahlt',
            en: 'Unpaid',
          },
          value: 'unpaid',
        },
        {
          label: {
            de: 'Teilweise bezahlt',
            en: 'Partially Paid',
          },
          value: 'partiallyPaid',
        },
        {
          label: {
            de: 'Bezahlt',
            en: 'Paid',
          },
          value: 'paid',
        },
        {
          label: {
            de: 'Überfällig',
            en: 'Overdue',
          },
          value: 'overdue',
        },
        {
          label: {
            de: 'Storniert',
            en: 'Cancelled',
          },
          value: 'cancelled',
        },
      ],
    },
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      label: {
        de: 'Bestellung',
        en: 'Order',
      },
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
          required: true,
          label: {
            de: 'Name',
            en: 'Name',
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
      name: 'paymentTerms',
      type: 'text',
      label: {
        de: 'Zahlungsbedingungen',
        en: 'Payment Terms',
      },
    },
    {
      name: 'paymentMethod',
      type: 'text',
      label: {
        de: 'Zahlungsart',
        en: 'Payment Method',
      },
    },
    {
      name: 'subtotal',
      type: 'number',
      label: {
        de: 'Zwischensumme (€)',
        en: 'Subtotal (€)',
      },
    },
    {
      name: 'taxAmount',
      type: 'number',
      label: {
        de: 'Steuerbetrag (€)',
        en: 'Tax Amount (€)',
      },
    },
    {
      name: 'shippingCost',
      type: 'number',
      label: {
        de: 'Versandkosten (€)',
        en: 'Shipping Cost (€)',
      },
    },
    {
      name: 'discount',
      type: 'number',
      label: {
        de: 'Rabatt (€)',
        en: 'Discount (€)',
      },
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      label: {
        de: 'Gesamtbetrag (€)',
        en: 'Total Amount (€)',
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
      name: 'issuedBy',
      type: 'text',
      label: {
        de: 'Ausgestellt von',
        en: 'Issued By',
      },
    },
  ],
  timestamps: true,
}
