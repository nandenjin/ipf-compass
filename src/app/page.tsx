'use client'
import styles from './page.module.css'
import dynamic from 'next/dynamic'
import { Event, EventRow, createEvent } from '@/lib/event'
import useSWR from 'swr'

const fetcher = (path: string) =>
  fetch(path)
    .then<EventRow[]>((res) => res.json())
    .then((t) => t.map((t) => createEvent(t)))

export default function Home() {
  const events = useSWR('/api/v1/events', fetcher).data
  const EventMap = dynamic(() => import('@/components/EventMap'), {
    loading: () => <p>A map is loading</p>,
    ssr: false,
  })
  return (
    <main className={styles.main}>
      {events ? <EventMap events={events} /> : 'Loading...'}
    </main>
  )
}
