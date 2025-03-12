import type { Access } from 'payload'
import { isSuperAdmin } from '@/access/isSuperAdmin'

export const createAccess: Access = ({ req }) => {
  // Nur Super-Admins können neue Benutzer erstellen
  return isSuperAdmin(req.user)
}
