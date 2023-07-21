import styles from './page.module.css'
import { AsyncDatabase } from 'promised-sqlite3'
import { join as joinPath } from 'path'
import dynamic from 'next/dynamic'
import { EventRow, createEvent } from '@/lib/event'

const DB_PATH = joinPath(__dirname, '../../../data/db.sqlite3')

export default async function Home() {
  const db = await AsyncDatabase.open(DB_PATH)
  const events = (
    await db.all<EventRow>(
      `SELECT 
    e.*, 
    ln.name as location_name,
    l.lat as location_lat, 
    l.lon as location_lon
FROM 
    events e 
LEFT JOIN 
    location_names ln ON e.location = ln.original_name
LEFT JOIN 
    locations l ON ln.name = l.name`
    )
  ).map((m) => createEvent(m))
  const EventMap = dynamic(() => import('@/components/EventMap'), {
    loading: () => <p>A map is loading</p>,
    ssr: false,
  })
  return (
    <main className={styles.main}>
      <EventMap events={events} />
    </main>
  )
}
