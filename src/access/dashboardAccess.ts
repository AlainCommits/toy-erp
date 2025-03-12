import type { User } from '../payload-types'
import { DASHBOARD_CONFIGS } from '../components/Dashboard/config'

export const getDashboardAccess = (user: User | null): string[] => {
  if (!user) return []
  
  // Super-Admin Check basierend auf der tatsächlichen User-Struktur
  if (user.roles?.includes('super-admin')) {
    return Object.keys(DASHBOARD_CONFIGS)
  }

  return Object.entries(DASHBOARD_CONFIGS)
    .filter(([_, config]) => user.roles?.includes(config.role))
    .map(([key]) => key)
}

export const canAccessDashboard = (user: User | null, dashboardKey: string): boolean => {
  if (!user) return false
  if (user.roles?.includes('super-admin')) return true
  return user.roles?.includes(DASHBOARD_CONFIGS[dashboardKey]?.role) || false
}