import { User } from '../payload-types'

export const isTenantAdmin = (user: User | null): boolean => {
  // Check if the user has tenant-admin role in any tenant
  if (!user || !user.tenants || !Array.isArray(user.tenants)) return false;
  
  return user.tenants.some(tenant => 
    tenant && Array.isArray(tenant.roles) && tenant.roles.includes('tenant-admin')
  );
}
