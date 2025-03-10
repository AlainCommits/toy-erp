import { hasGroupAccess } from './departmentRoles';
import { isSuperAdmin } from './isSuperAdmin';
import { Access, CollectionConfig } from 'payload';

export const departmentCollectionAccess: Access = ({ req }) => {
  // Super-Admins haben vollen Zugriff
  if (isSuperAdmin(req.user)) {
    return true;
  }
  
  // Ohne Benutzer kein Zugriff
  if (!req.user) {
    return false;
  }
  
  // In access control functions, we need to get the collection info differently
  // Since we don't have direct access to the collection slug through req.collection
  
  // We can create a function that's specifically bound to a collection
  // when it's used in the collection config
  
  return false; // Default: Deny access
};

// Helper function to create collection-specific access control
export const createDepartmentAccess = (collectionGroup: string): Access => {
  return ({ req }) => {
    // Super-Admins haben vollen Zugriff
    if (isSuperAdmin(req.user)) {
      return true;
    }
    
    // Ohne Benutzer kein Zugriff
    if (!req.user || !req.user.roles) {
      return false;
    }
    
    // Prüfen, ob der Benutzer Zugriff auf diese Gruppe hat
    if (hasGroupAccess(req.user.roles, collectionGroup)) {
      return true;
    }
    
    return false;
  };
};
