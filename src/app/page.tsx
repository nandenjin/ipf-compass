'use client'
import styles from './page.module.css'
import dynamic from 'next/dynamic'
import { Event, EventRow, createEvent } from '@/lib/event'
import useSWR from 'swr'
import {
  Button,
  ChakraProvider,
  Icon,
  Select,
  Stack,
  position,
} from '@chakra-ui/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import { MdAccessTime } from 'react-icons/md'

const fetcher = (path: string) =>
  fetch(path)
    .then<EventRow[]>((res) => res.json())
    .then((t) => t.map((t) => createEvent(t)))

export default function Home() {
  const params = useSearchParams()
  const apiQuery = new URLSearchParams()

  const day = params.get('day')
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
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  )
  const router = useRouter()
  return (
    <ChakraProvider>
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
        <EventMap events={events || []} />
      </main>
    </ChakraProvider>
  )
}
