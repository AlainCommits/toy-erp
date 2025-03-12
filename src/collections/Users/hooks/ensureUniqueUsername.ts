
import type { FieldHook } from 'payload'
import { APIError } from 'payload'

export const ensureUniqueUsername: FieldHook = async ({ data, originalDoc, req, value }) => {
  // if value is unchanged, skip validation
  if (originalDoc?.username === value) {
    return value
  }

  const findDuplicateUsers = await req.payload.find({
    collection: 'users',
    where: {
      username: {
        equals: value,
      },
    },
  })

  if (findDuplicateUsers.docs.length > 0) {
    throw new APIError(
      `Ein Benutzer mit dem Benutzernamen "${value}" existiert bereits.`,
      400,
      null,
      true
    )
  }

  return value
}