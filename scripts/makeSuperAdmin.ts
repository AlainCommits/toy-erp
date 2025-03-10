import { getPayload } from 'payload'
import config from '@payload-config'
import 'dotenv/config';

const makeSuperAdmin = async () => {
  const payload = await getPayload({ config })

  const { docs: users } = await payload.find({
    collection: 'users',
    where: { email: { equals: 'toy@toy.de' } },
  })

  if (!users || users.length === 0) {
    console.log('❌ Benutzer nicht gefunden.')
    process.exit(1)
  }

  await payload.update({
    collection: 'users',
    id: users[0].id,
    data: { roles: ['super-admin'] },
  })

  console.log('✅ Benutzer erfolgreich als Super-Admin gesetzt!')
  process.exit(0)
}

makeSuperAdmin().catch((err) => {
  console.error('❌ Fehler beim Aktualisieren:', err)
  process.exit(1)
})
