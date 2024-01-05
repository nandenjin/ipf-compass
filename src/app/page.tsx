'use client'
import styles from './page.module.css'
import dynamic from 'next/dynamic'
import { Event } from '@/lib/event'
import useSWR from 'swr'
import {
  Button,
  Center,
  ChakraProvider,
  Icon,
  Select,
  Spinner,
  Stack,
} from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { MdAccessTime } from 'react-icons/md'

const fetcher = (path: string) =>
  fetch(path)
    .then((res) => res.json())
    .then<Event[]>((rows: Record<keyof Event, any>[]) => {
      for (const row of rows) {
        row.startsAt = new Date(row.startsAt)
      }
      return rows
    })

export default function Home() {
  const params = useSearchParams()
  const apiQuery = new URLSearchParams()

  const day = params.get('day') || '2023-08-03'
  const dayFormat = day?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (dayFormat) {
    const [_, yyyy, mm, dd] = dayFormat
    apiQuery.set('from', `${yyyy}-${mm}-${dd}T00:00:00+09:00`)
    apiQuery.set('to', `${yyyy}-${mm}-${dd}T23:59:59+09:00`)
  }

  const { data: events } = useSWR(
    '/api/v1/events?' + apiQuery.toString(),
    fetcher
  )

  const EventMap = useMemo(
    () =>
      dynamic(() => import('@/components/EventMap'), {
        loading: () => (
          <Center h="100vh" bg="lightgray">
            <Spinner size="lg" />
          </Center>
        ),
        ssr: false,
      }),
    []
  )
  const router = useRouter()
  return (
    <main className={styles.main}>
      <Stack
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1000,
          width: '10rem',
        }}
      >
        <Select
          fontWeight={600}
          bg="background"
          onChange={(event) => {
            router.replace('/?day=' + event.target?.value)
          }}
          value={day}
        >
          <option value="2023-08-03">3日（木）</option>
          <option value="2023-08-04">4日（金）</option>
          <option value="2023-08-05">5日（土）</option>
          <option value="2023-08-06">6日（日）</option>
        </Select>
        <Button leftIcon={<Icon as={MdAccessTime} />} bg="background">
          終日
        </Button>
      </Stack>
      <EventMap events={events || []} day={day || undefined} />
    </main>
  )
}
