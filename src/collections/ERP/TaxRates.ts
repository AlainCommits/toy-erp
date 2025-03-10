import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'

export const TaxRates: CollectionConfig = {
  slug: 'tax-rates',
  labels: {
    singular: 'Steuersatz',
    plural: 'Steuersätze',
  },
  admin: {
    group: 'Finanzen',
    useAsTitle: 'name',
    defaultColumns: ['name', 'rate', 'region', 'isActive'],
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
      name: 'name',
      type: 'text',
      required: true,
      label: {
        de: 'Name',
        en: 'Name',
      },
    },
    {
      name: 'rate',
      type: 'number',
      required: true,
      label: {
        de: 'Steuersatz (%)',
        en: 'Tax Rate (%)',
      },
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
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: {
        de: 'Aktiv',
        en: 'Active',
      },
    },
    {
      name: 'region',
      type: 'text',
      label: {
        de: 'Region/Land',
        en: 'Region/Country',
      },
      defaultValue: 'Deutschland',
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      label: {
        de: 'Standard-Steuersatz',
        en: 'Default Tax Rate',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: {
        de: 'Steuerkategorie',
        en: 'Tax Category',
      },
      options: [
        {
          label: {
            de: 'Standard',
            en: 'Standard',
          },
          value: 'standard',
        },
        {
          label: {
            de: 'Ermäßigt',
            en: 'Reduced',
          },
          value: 'reduced',
        },
        {
          label: {
            de: 'Null',
            en: 'Zero',
          },
          value: 'zero',
        },
        {
          label: {
            de: 'Befreit',
            en: 'Exempt',
          },
          value: 'exempt',
        },
      ],
    },
    {
      name: 'effectiveFrom',
      type: 'date',
      label: {
        de: 'Gültig ab',
        en: 'Effective From',
      },
    },
    {
      name: 'effectiveTo',
      type: 'date',
      label: {
        de: 'Gültig bis',
        en: 'Effective To',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: {
        de: 'Interne Notizen',
        en: 'Internal Notes',
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
