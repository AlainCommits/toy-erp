import { Access, FieldAccess } from 'payload';
import { User } from '../payload-types';

export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  // Return true if user has admin role or is the same user
  if (user?.roles?.includes('super-admin')) return true;
  return user?.id === id;
};

export const isAdminOrSelfFieldLevel: FieldAccess = ({ req: { user }, id }) => {
  // Return true if user has admin role or is the same user
  if (user?.roles?.includes('super-admin')) return true;
  return user?.id === id;
};
