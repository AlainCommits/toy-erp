import { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../../access/isSuperAdmin'

export const FinancialManagement: CollectionConfig = {
  slug: 'financial-management',
  admin: {
    group: 'Finanzen',
    useAsTitle: 'name',
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
    },
    {
      name: 'fiscalPeriod',
      type: 'select',
      options: [
        { label: 'Monatlich', value: 'monthly' },
        { label: 'Quartalsweise', value: 'quarterly' },
        { label: 'Jährlich', value: 'yearly' },
      ],
      required: true,
    },
    {
      name: 'budget',
      type: 'group',
      fields: [
        {
          name: 'planned',
          type: 'number',
          admin: {
            description: 'Geplantes Budget für den Zeitraum',
          },
        },
        {
          name: 'actual',
          type: 'number',
          admin: {
            description: 'Tatsächliche Ausgaben für den Zeitraum',
          },
        },
        {
          name: 'variance',
          type: 'number',
          admin: {
            description: 'Abweichung (wird automatisch berechnet)',
          },
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'reporting-categories',
      hasMany: true,
      admin: {
        description: 'Zugehörige Berichtskategorien',
      },
    },
    {
      name: 'notes',
      type: 'richText',
      admin: {
        description: 'Notizen und Anmerkungen zum Finanzmanagement',
      },
    },
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
      admin: {
        description: 'Verknüpfte Finanzdokumente',
      },
    },
    // {
    //   name: 'tenant',
    //   type: 'relationship',
    //   relationTo: 'tenants',
    //   required: true,
    // },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Entwurf', value: 'draft' },
        { label: 'In Bearbeitung', value: 'in-progress' },
        { label: 'Genehmigt', value: 'approved' },
        { label: 'Abgeschlossen', value: 'completed' },
      ],
      defaultValue: 'draft',
      required: true,
    },
  ],
}
