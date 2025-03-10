import { CollectionConfig } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'

export const Revenue: CollectionConfig = {
  slug: 'revenue',
  admin: {
    group: 'Finanzen',
    defaultColumns: ['period', 'amount', 'source', 'createdAt'],
    useAsTitle: 'period',
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
  labels: {
    singular: 'Umsatz',
    plural: 'Umsätze',
  },
  fields: [
    {
      name: 'period',
      type: 'date',
      label: 'Zeitraum',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      label: 'Betrag',
      required: true,
    },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Online-Shop', value: 'online' },
        { label: 'Ladengeschäft', value: 'store' },
        { label: 'B2B', value: 'b2b' },
        { label: 'Marktplatz', value: 'marketplace' },
        { label: 'Sonstige', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Produkte', value: 'products' },
        { label: 'Dienstleistungen', value: 'services' },
        { label: 'Abonnements', value: 'subscriptions' },
        { label: 'Sonstige', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'costs',
      type: 'number',
      label: 'Kosten',
    },
    {
      name: 'profit',
      type: 'number',
      label: 'Gewinn',
    },
    {
      name: 'tax',
      type: 'number',
      label: 'Steuern',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notizen',
    },
    {
      name: 'relatedOrder',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Zugehörige Bestellung',
    },
    {
      name: 'relatedCustomer',
      type: 'relationship',
      relationTo: 'customers',
      label: 'Zugehöriger Kunde',
    },
    // {
    //   name: 'tenant',
    //   type: 'relationship',
    //   relationTo: 'tenants',
    //   required: true,
    // }
  ]
}
