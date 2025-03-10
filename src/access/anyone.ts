import { Access } from 'payload';

// Allows anyone to access
export const anyone: Access = () => {
  return true;
};
