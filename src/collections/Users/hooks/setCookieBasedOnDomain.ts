import type { CollectionAfterLoginHook } from 'payload'
import { mergeHeaders, generateCookie, getCookieExpiration } from 'payload'

export const setCookieBasedOnDomain: CollectionAfterLoginHook = async ({ req, user }) => {
  // Add proper host check following documentation recommendations
  const host = req.headers.get('host')
  if (!host) return user

  try {
    const relatedOrg = await req.payload.find({
      collection: 'tenants',
      depth: 0,
      limit: 1,
      where: {
        domain: {
          equals: host,
        },
      },
    })

    // If a matching tenant is found, set the 'payload-tenant' cookie
    if (relatedOrg?.docs?.length > 0 && relatedOrg.docs[0]?.id) {
      const tenantCookie = generateCookie({
        name: 'payload-tenant',
        expires: getCookieExpiration({ seconds: 7200 }),
        path: '/',
        returnCookieAsObject: false,
        value: String(relatedOrg.docs[0].id),
      })

      if (typeof tenantCookie === 'string') {
        // Merge existing responseHeaders with the new Set-Cookie header
        const newHeaders = new Headers({
          'Set-Cookie': tenantCookie,
        })

        req.responseHeaders = req.responseHeaders
          ? mergeHeaders(req.responseHeaders, newHeaders)
          : newHeaders
      }
    }
  } catch (error) {
    console.error('Error setting cookie based on domain:', error)
  }

  return user
}