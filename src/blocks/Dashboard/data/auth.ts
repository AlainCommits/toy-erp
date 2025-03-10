import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Hilfsfunktion zum Abrufen des aktuellen Benutzers
export async function getCurrentUser() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Versuche, den Benutzer über die Authentifizierung zu identifizieren
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const payloadToken = cookieStore.get('payload-token')?.value
    
    if (!payloadToken) {
      console.log('Kein Authentifizierungstoken gefunden')
      return null
    }
    
    // Benutzer mit Token abfragen
    try {
      // TypeScript-Fehler umgehen mit Type Assertion
      const { user } = await (payload as any).findByToken({
        collection: 'users',
        token: payloadToken,
      })
      
      return user
    } catch (error) {
      console.error('Fehler beim Abfragen des Benutzers mit Token:', error)
      return null
    }
  } catch (error) {
    console.error('Fehler beim Initialisieren von Payload:', error)
    return null
  }
}

// Zusätzliche Hilfsfunktion zur Prüfung von Benutzerrollen
export function hasRole(user: any, role: string): boolean {
  if (!user || !user.roles || !Array.isArray(user.roles)) return false
  
  return user.roles.includes(role)
}
