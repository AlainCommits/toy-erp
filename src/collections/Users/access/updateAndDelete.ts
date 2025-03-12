import type { Access } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { isAccessingSelf } from './isAccessingSelf'

export const updateAndDeleteAccess: Access = ({ req, id }) => {
  if (!req?.user) {
    return false
  }

  // Super-Admins können alle Benutzer bearbeiten/löschen
  if (isSuperAdmin(req.user)) {
    return true
  }

  // Benutzer können ihr eigenes Profil bearbeiten (aber nicht löschen)
  if (isAccessingSelf({ id, user: req.user })) {
    return true
  }

  return false
}
