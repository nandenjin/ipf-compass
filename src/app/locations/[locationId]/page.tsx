import { getDb } from '@/lib/db'
import { createEvent } from '@/lib/event'

export default async function LocationPage({
  params,
}: {
  params: { locationId: string }
}) {
  const db = getDb()
  const { locationId } = params

  const events = (
    await db('events')
      .where('location_id', locationId)
      .select('id', 'title', 'startsAt', 'venue', 'company', 'duration', 'paid')
  ).map(createEvent)

  return <div>{JSON.stringify(events, null, 2)}</div>
}
