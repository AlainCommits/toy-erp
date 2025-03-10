import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'

export const ShippingMethods: CollectionConfig = {
  slug: 'shipping-methods',
  labels: {
    singular: 'Versandart',
    plural: 'Versandarten',
  },
  admin: {
    group: 'Verkauf & CRM',
    useAsTitle: 'name',
    defaultColumns: ['name', 'carrier', 'price', 'isActive'],
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
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: {
        de: 'Versandart-Name',
        en: 'Shipping Method Name',
      },
    },
    {
      name: 'carrier',
      type: 'text',
      label: {
        de: 'Versanddienstleister',
        en: 'Carrier',
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
      name: 'price',
      type: 'number',
      required: true,
      label: {
        de: 'Preis (€)',
        en: 'Price (€)',
      },
    },
    {
      name: 'estimatedDeliveryDays',
      type: 'group',
      label: {
        de: 'Geschätzte Lieferzeit',
        en: 'Estimated Delivery Time',
      },
      fields: [
        {
          name: 'min',
          type: 'number',
          label: {
            de: 'Minimum (Tage)',
            en: 'Minimum (days)',
          },
        },
        {
          name: 'max',
          type: 'number',
          label: {
            de: 'Maximum (Tage)',
            en: 'Maximum (days)',
          },
        },
      ],
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
      name: 'isDefault',
      type: 'checkbox',
      label: {
        de: 'Standard-Versandart',
        en: 'Default Shipping Method',
      },
    },
    {
      name: 'trackingAvailable',
      type: 'checkbox',
      label: {
        de: 'Sendungsverfolgung verfügbar',
        en: 'Tracking Available',
      },
    },
    {
      name: 'trackingUrlFormat',
      type: 'text',
      label: {
        de: 'Sendungsverfolgung-URL Format',
        en: 'Tracking URL Format',
      },
      admin: {
        description: {
          de: 'URL-Format mit {tracking_number} als Platzhalter',
          en: 'URL format with {tracking_number} as placeholder',
        },
      },
    },
    {
      name: 'restrictions',
      type: 'group',
      label: {
        de: 'Einschränkungen',
        en: 'Restrictions',
      },
      fields: [
        {
          name: 'minWeight',
          type: 'number',
          label: {
            de: 'Mindestgewicht (kg)',
            en: 'Minimum Weight (kg)',
          },
        },
        {
          name: 'maxWeight',
          type: 'number',
          label: {
            de: 'Maximalgewicht (kg)',
            en: 'Maximum Weight (kg)',
          },
        },
        {
          name: 'minOrderAmount',
          type: 'number',
          label: {
            de: 'Mindestbestellwert (€)',
            en: 'Minimum Order Amount (€)',
          },
        },
        {
          name: 'countries',
          type: 'array',
          label: {
            de: 'Länder (leer = alle)',
            en: 'Countries (empty = all)',
          },
          fields: [
            {
              name: 'country',
              type: 'text',
              required: true,
              label: {
                de: 'Land',
                en: 'Country',
              },
            },
          ],
        },
      ],
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
