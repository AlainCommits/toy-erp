import type { CollectionConfig } from 'payload'

import { createAccess } from './access/create'
import { readAccess } from './access/read'
import { updateAndDeleteAccess } from './access/updateAndDelete'
import { externalUsersLogin } from './endpoints/externalUsersLogin'
import { ensureUniqueUsername } from './hooks/ensureUniqueUsername'
import { isSuperAdmin } from '@/access/isSuperAdmin'

const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: ({ req }) => {
      if (isSuperAdmin(req.user)) return true
      return createAccess({ req })
    },
    read: ({ req }) => {
      if (isSuperAdmin(req.user)) return true
      return readAccess({ req })
    },
    update: ({ req }) => {
      if (isSuperAdmin(req.user)) return true
      return updateAndDeleteAccess({ req })
    },
    delete: ({ req }) => {
      if (isSuperAdmin(req.user)) return true
      return updateAndDeleteAccess({ req })
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'username', 'roles'],
  },
  auth: true,
  endpoints: [externalUsersLogin],
  fields: [
    {
      admin: {
        position: 'sidebar',
      },
      name: 'roles',
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      options: [
        'super-admin',
        'user',
        'Lager',
        'Finanzen',
        'Personal',
        'Einkauf',
        'Verkauf',
        'Produktion',
        'Qualität',
        'Instandhaltung',
        'Logistik',
        'Marketing',
        'IT',
        'Geschäftsführung'
      ],
      access: {
        update: ({ req }) => isSuperAdmin(req.user),
      },
    },
    {
      name: 'username',
      type: 'text',
      hooks: {
        beforeValidate: [ensureUniqueUsername],
      },
      index: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    }
  ],
}

export default Users


