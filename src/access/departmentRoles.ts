// Definiert die Zuordnung zwischen Rollen und erlaubten Admin-Gruppen
export const departmentAccess: Record<string, string[]> = {
  'finance-staff': ['Finanzen'],
  'inventory-staff': ['Lagerverwaltung', 'Produkte'],
  'sales-staff': ['Verkauf', 'Kunden'],
  'purchase-staff': ['Einkauf', 'Lieferanten'],
  // Super-Admin braucht hier keine Einträge, da er alles sehen kann
}

// Hilfsfunktion um zu prüfen, ob ein Benutzer Zugriff auf eine bestimmte Collection-Gruppe hat
export const hasGroupAccess = (userRoles: string[] = [], collectionGroup?: string): boolean => {
  if (!collectionGroup) return false;
  
  // Für jede Rolle des Benutzers prüfen, ob sie Zugriff auf die Collection-Gruppe hat
  return userRoles.some(role => {
    const allowedGroups = departmentAccess[role];
    return allowedGroups?.includes(collectionGroup);
  });
}
