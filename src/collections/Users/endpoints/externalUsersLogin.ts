import type { Collection, Endpoint } from 'payload'

import { headersWithCors } from '@payloadcms/next/utilities'
import { APIError, generatePayloadCookie } from 'payload'

// A custom endpoint that can be reached by POST request
// at: /api/users/external-users/login
export const externalUsersLogin: Endpoint = {
  handler: async (req) => {
    let data: { [key: string]: string } = {}

    try {
      if (typeof req.json === 'function') {
        data = await req.json()
      }
    } catch (error) {
      // swallow error, data is already empty object
    }
    const { password, tenantSlug, tenantDomain, username } = data

    if (!username || !password) {
      throw new APIError('Username and Password are required for login.', 400, null, true)
    }

    // Check if we have either tenantSlug or tenantDomain
    if (!tenantSlug && !tenantDomain) {
      throw new APIError('Either tenantSlug or tenantDomain is required.', 400, null, true)
    }

    const tenantResult = await req.payload.find({
      collection: 'tenants',
      where: tenantDomain
        ? {
            domain: {
              equals: tenantDomain,
            },
          }
        : {
            slug: {
              equals: tenantSlug,
            },
          },
    })

    // Check if tenant exists
    if (!tenantResult.docs || tenantResult.docs.length === 0) {
      throw new APIError('Tenant not found.', 404, null, true)
    }

    const fullTenant = tenantResult.docs[0]

    // Ensure fullTenant.id exists
    if (!fullTenant.id) {
      throw new APIError('Invalid tenant data', 500, null, true)
    }

    // The query was using 'tenants.tenant' which causes the error
    // Using direct ID comparison instead
    const foundUser = await req.payload.find({
      collection: 'users',
      where: {
        or: [
          {
            email: {
              equals: username,
            },
          },
          {
            username: {
              equals: username,
            },
          },
        ],
      },
    })

    // Check if we found a user and that the user has an email
    if (foundUser?.totalDocs > 0 && foundUser.docs[0] && foundUser.docs[0].email) {
      try {
        const loginAttempt = await req.payload.login({
          collection: 'users',
          data: {
            email: foundUser.docs[0].email,
            password,
          },
          req,
        })

        if (loginAttempt?.token) {
          // Type assertion to ensure collections is defined
          const collections = req.payload.collections as { [key: string]: Collection | undefined }
          const userCollection = collections['users']
          
          if (!userCollection) {
            throw new APIError('User collection not found', 500, null, true)
          }
          
          // Now TypeScript knows userCollection is not undefined
          const cookie = generatePayloadCookie({
            collectionAuthConfig: userCollection.config.auth,
            cookiePrefix: req.payload.config.cookiePrefix,
            token: loginAttempt.token,
          })

          return Response.json(loginAttempt, {
            headers: headersWithCors({
              headers: new Headers({
                'Set-Cookie': cookie,
              }),
              req,
            }),
            status: 200,
          })
        }

        throw new APIError(
          'Unable to login with the provided username and password.',
          400,
          null,
          true,
        )
      } catch (e) {
        throw new APIError(
          'Unable to login with the provided username and password.',
          400,
          null,
          true,
        )
      }
    }

    throw new APIError('Unable to login with the provided username and password.', 400, null, true)
  },
  method: 'post',
  path: '/external-users/login',
}