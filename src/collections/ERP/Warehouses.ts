import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'

export const Warehouses: CollectionConfig = {
  slug: 'warehouses',
  labels: {
    singular: 'Lagerhaus',
    plural: 'Lagerhäuser',
  },
  admin: {
    group: 'Lagerverwaltung',
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'address.city', 'isActive'],
    hidden: ({ user }) => {
      // Super admins can see everything
      if (user?.roles?.includes('super-admin')) return false
      // Show to warehouse department users
      if (user?.roles?.includes('Lager')) return false
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
      
      // Warehouse department can read
      if (user.roles?.includes('Lager')) return true
      
      // Everyone else denied
      return false
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Lager') || false
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Lager') || false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Lager') || false
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: {
        de: 'Lagerhaus-Name',
        en: 'Warehouse Name',
      },
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      label: {
        de: 'Lagerhaus-Code',
        en: 'Warehouse Code',
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
      name: 'contact',
      type: 'group',
      label: {
        de: 'Kontakt',
        en: 'Contact',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          label: {
            de: 'Name',
            en: 'Name',
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
          name: 'email',
          type: 'email',
          label: {
            de: 'E-Mail',
            en: 'Email',
          },
        },
      ],
    },
    {
      name: 'size',
      type: 'number',
      label: {
        de: 'Größe (m²)',
        en: 'Size (m²)',
      },
    },
    {
      name: 'capacity',
      type: 'number',
      label: {
        de: 'Kapazität',
        en: 'Capacity',
      },
      admin: {
        description: {
          de: 'Maximale Kapazität (Palettenplätze oder ähnliches)',
          en: 'Maximum capacity (pallet spaces or similar)',
        },
      },
    },
    {
      name: 'currentUsage',
      type: 'number',
      label: {
        de: 'Aktuelle Auslastung (%)',
        en: 'Current Usage (%)',
      },
    },
    {
      name: 'sections',
      type: 'array',
      label: {
        de: 'Lagerbereiche',
        en: 'Sections',
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
          name: 'code',
          type: 'text',
          required: true,
          label: {
            de: 'Code',
            en: 'Code',
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
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: {
        de: 'Notizen',
        en: 'Notes',
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
