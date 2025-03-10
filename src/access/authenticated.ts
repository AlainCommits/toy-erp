import { Access } from 'payload'

import type { User } from '@/payload-types'

// Only allows authenticated users to access
export const authenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}
