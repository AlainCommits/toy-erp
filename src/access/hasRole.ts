import type { User } from '../payload-types'
import type { Access, Where } from 'payload'

type Role =
  | 'super-admin'
  | 'user'
  | 'Lager'
  | 'Finanzen'
  | 'Personal'
  | 'Einkauf'
  | 'Verkauf'
  | 'Produktion'
  | 'Qualität'
  | 'Instandhaltung'
  | 'Logistik'
  | 'Marketing'
  | 'IT'
  | 'Geschäftsführung'

export const hasRole = (user: User | null, roles: Role | Role[]): boolean => {
  if (!user?.roles) return false

  if (Array.isArray(roles)) {
    return roles.some(role => user.roles?.includes(role))
  }

  return user.roles.includes(roles)
}

type CollectionGroup =
  | 'finance'
  | 'warehouse'
  | 'sales'
  | 'hr'
  | 'purchasing'
  | 'production'
  | 'quality'
  | 'maintenance'
  | 'logistics'
  | 'marketing'
  | 'it'
  | 'management'

const ALL_GROUPS: CollectionGroup[] = [
  'finance',
  'warehouse',
  'sales',
  'hr',
  'purchasing',
  'production',
  'quality',
  'maintenance',
  'logistics',
  'marketing',
  'it',
  'management'
]

export const getCollectionGroups = (user: User | null): CollectionGroup[] => {
  if (!user?.roles) return []

  if (user.roles.includes('super-admin')) {
    return ALL_GROUPS
  }

  const groups: CollectionGroup[] = []

  if (user.roles.includes('Finanzen')) groups.push('finance')
  if (user.roles.includes('Lager')) groups.push('warehouse')
  if (user.roles.includes('Verkauf')) groups.push('sales')
  if (user.roles.includes('Personal')) groups.push('hr')
  if (user.roles.includes('Einkauf')) groups.push('purchasing')
  if (user.roles.includes('Produktion')) groups.push('production')
  if (user.roles.includes('Qualität')) groups.push('quality')
  if (user.roles.includes('Instandhaltung')) groups.push('maintenance')
  if (user.roles.includes('Logistik')) groups.push('logistics')
  if (user.roles.includes('Marketing')) groups.push('marketing')
  if (user.roles.includes('IT')) groups.push('it')
  if (user.roles.includes('Geschäftsführung')) groups.push('management')

  return groups
}

// Map collections to their groups
export const collectionGroups: Record<string, CollectionGroup> = {
  'financial-management': 'finance',
  revenue: 'finance',
  invoices: 'finance',
  payments: 'finance',
  'tax-rates': 'finance',
  'reporting-categories': 'finance',
  
  inventory: 'warehouse',
  warehouses: 'warehouse',
  products: 'warehouse',
  
  orders: 'sales',
  customers: 'sales',
  'shipping-methods': 'sales',
  
  suppliers: 'purchasing',
  purchases: 'purchasing',
  
  documents: 'management',
  reports: 'management',
  'audit-logs': 'management',
  integrations: 'management',
}

export const createCollectionAccess = (collectionSlug: string): Access => {
  return ({ req: { user } }) => {
    if (!user) return false
    
    // Super admin has access to everything
    if (user.roles?.includes('super-admin')) return true
    
    // Get the group this collection belongs to
    const collectionGroup = collectionGroups[collectionSlug]
    if (!collectionGroup) return true // If collection isn't restricted to a group, allow access
    
    // Get the groups this user has access to
    const userGroups = getCollectionGroups(user)
    
    return userGroups.includes(collectionGroup)
  }
}

export const createAdminAccess = (collectionSlug: string) => {
  return {
    hidden: ({ user }: { user: User | null }) => {
      if (!user) return true
      
      if (user.roles?.includes('super-admin')) return false
      
      const collectionGroup = collectionGroups[collectionSlug]
      if (!collectionGroup) return false
      
      const userGroups = getCollectionGroups(user)
      return !userGroups.includes(collectionGroup)
    }
  }
}
