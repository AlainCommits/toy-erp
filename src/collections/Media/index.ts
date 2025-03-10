import type { CollectionConfig } from 'payload'
import { isSuperAdmin } from '../../access/isSuperAdmin'
import { isTenantAdmin } from '../../access/isTenantAdmin'

export const Media: CollectionConfig = {
  slug: 'media',
  // ...other properties...
  access: {
    create: ({ req }) => {
      // Nur Super-Admins und Tenant-Admins dürfen Seiten erstellen
      if (isSuperAdmin(req.user) || isTenantAdmin(req.user)) {
        return true;
      }
      return false;
    },
    read: ({ req }) => {
      // Alle authentifizierten Benutzer können lesen, aber du kannst hier die Logik anpassen
      return req.user ? true : false; // Optional: Nur authentifizierte Benutzer können lesen
    },
    update: ({ req }) => {
      // Nur Super-Admins und Tenant-Admins dürfen Seiten aktualisieren
      if (isSuperAdmin(req.user) || isTenantAdmin(req.user)) {
        return true;
      }
      return false;
    },
    delete: ({ req }) => {
      // Nur Super-Admins dürfen Seiten löschen
      return isSuperAdmin(req.user);
    },
  },
  // ...remaining configuration
}
