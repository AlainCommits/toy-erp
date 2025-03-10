# ERP Zugriffskontrolle Implementierung

Diese Dokumentation beschreibt die Implementierung der rollenbasierten Zugriffskontrolle (RBAC) im ERP-System.

## Grundstruktur

Die Zugriffskontrolle wurde in folgende Abteilungsgruppen unterteilt:

1. Finanzen (`Finanzen`)
2. Verkauf (`Verkauf`)
3. Lager (`Lager`)
4. Einkauf (`Einkauf`)
5. IT (`IT`)

## Implementierung pro Collection

Jede Collection verwendet das folgende Grundmuster:

```typescript
import { isSuperAdmin } from '@/access/isSuperAdmin'

export const Collection: CollectionConfig = {
  // ... andere Konfiguration
  
  admin: {
    group: 'Gruppename', // z.B. 'Finanzen', 'Verkauf & CRM' etc.
    hidden: ({ user }) => {
      if (user?.roles?.includes('super-admin')) return false
      if (user?.roles?.includes('Abteilungsrolle')) return false
      return true
    },
  },
  
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false
      if (isSuperAdmin(user)) return true
      if (user.roles?.includes('Abteilungsrolle')) return true
      return false
    },
    create: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Abteilungsrolle') || false
    },
    update: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Abteilungsrolle') || false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      return isSuperAdmin(user) || user.roles?.includes('Abteilungsrolle') || false
    },
  },
}
```

## Abteilungsspezifischer Zugriff

### Finanzen (`Finanzen`)
- FinancialManagement
- Revenue (Umsätze)  
- Invoices (Rechnungen)
- Payments (Zahlungen)
- TaxRates (Steuersätze)

### Verkauf (`Verkauf`)
- Orders (Bestellungen)
- Customers (Kunden)
- ShippingMethods (Versandarten)

### Lager (`Lager`)
- Products (Produkte)
- Inventory (Lagerbestand)
- Warehouses (Lagerhäuser)

### Einkauf (`Einkauf`)
- Purchases (Einkäufe)
- Suppliers (Lieferanten)

### IT (`IT`)
- AuditLogs (Änderungsprotokolle)

## Admin UI Gruppen verstecken

Um die Admin-UI-Gruppen für bestimmte Rollen zu verstecken, gibt es zwei Möglichkeiten:

### 1. Auf Collection-Ebene

Jede Collection hat eine `hidden` Eigenschaft:

```typescript
admin: {
  hidden: ({ user }) => {
    // Super-Admins sehen alles
    if (user?.roles?.includes('super-admin')) return false
    
    // Abteilungsspezifischer Zugriff
    if (user?.roles?.includes('Finanzen')) return false
    
    // Für alle anderen verstecken
    return true
  },
}
```

### 2. Auf Gruppenebene (Global)

Sie können auch eine globale Navigation-Middleware erstellen, um ganze Gruppen zu filtern:

```typescript
// src/admin/components/BeforeDashboard.tsx
import { useUser } from 'payload/components/utilities'

export const BeforeDashboard = () => {
  const { user } = useUser()
  
  // Entfernen Sie Navigationsgruppen basierend auf Rollen
  useEffect(() => {
    const groups = document.querySelectorAll('.nav-group')
    groups.forEach(group => {
      const groupName = group.getAttribute('data-group')
      
      // Finanz-Gruppe verstecken wenn nicht Finanz-Mitarbeiter
      if (groupName === 'Finanzen' && !user?.roles?.includes('Finanzen')) {
        group.style.display = 'none'
      }
      
      // Weitere Gruppen...
    })
  }, [user])
  
  return null
}
```

## Multi-Tenant Unterstützung

- Tenant-Feld in allen relevanten Collections
- Wird automatisch durch das Multi-Tenant Plugin verwaltet
- Zugriffslogik berücksichtigt Tenant-Kontext

## Best Practices

1. **Rollen prüfen:**
   - Immer zuerst auf `super-admin` prüfen
   - Dann abteilungsspezifische Rolle prüfen
   - Standardmäßig Zugriff verweigern

2. **UI Sichtbarkeit:**
   - Collections in logische Gruppen einteilen
   - Gruppen/Collections für nicht-berechtigte Benutzer verstecken
   - Konsistente Gruppenbezeichnungen verwenden

3. **Sicherheit:**
   - Authentifizierung immer prüfen (`if (!user) return false`)
   - Keine sensiblen Daten in der UI zeigen
   - Zugriffskontrolle sowohl im Frontend als auch Backend

4. **Multi-Tenant:**
   - Tenant-Kontext immer berücksichtigen
   - Tenant-übergreifende Aktionen nur für Super-Admins

## Wartung & Erweiterung

- Neue Collections sollten diesem Muster folgen
- Rollen in `src/collections/Users/index.ts` pflegen
- Zugriffskontrolle regelmäßig überprüfen
- Bei Änderungen Dokumentation aktualisieren
