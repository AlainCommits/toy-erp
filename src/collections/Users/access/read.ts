import type { Access } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { isAccessingSelf } from './isAccessingSelf'

export const readAccess: Access = ({ req, id }) => {
  if (!req?.user) {
    return false
  }

  // Wenn der Benutzer auf sein eigenes Profil zugreift
  if (isAccessingSelf({ id, user: req.user })) {
    return true
  }

  // Super-Admins können alle Benutzer sehen
  if (isSuperAdmin(req.user)) {
    return true
  }

  // Standardmäßig können Benutzer nur sich selbst sehen
  return {
    id: {
      equals: req.user.id
    }
  }
}
