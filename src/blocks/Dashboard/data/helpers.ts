/**
 * Gemeinsame Hilfsfunktionen für Dashboard-Datenoperationen
 */

// Verbesserte Payload-Typisierung und Fehlerbehandlung
export async function collectionExists(payload: any, collectionSlug: string): Promise<boolean> {
  if (!payload || !collectionSlug) {
    console.warn('Ungültige Parameter für collectionExists:', { payload: !!payload, collectionSlug })
    return false
  }
  
  try {
    await payload.find({
      collection: collectionSlug,
      limit: 1
    })
    return true
  } catch (error) {
    if (error instanceof Error && error.message.includes('Collection not found')) {
      console.log(`Collection '${collectionSlug}' does not exist`)
      return false
    }
    
    // For other errors, we assume the collection exists but there's a different issue
    console.error(`Error checking collection '${collectionSlug}':`, error)
    return true
  }
}

/**
 * Formatiert ein Datum in ein lesbares Format
 */
export function formatDate(date: Date | string | undefined): string {
  if (!date) return '-'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Deutsches Datumsformat: Tag.Monat.Jahr
  return dateObj.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
