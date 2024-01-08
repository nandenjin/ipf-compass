'use client'
import { RootState } from '@/store'
import {
  Box,
  Heading,
  Grid,
  GridItem,
  Stack,
  Text,
  Center,
} from '@chakra-ui/layout'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Event, createEvent } from '@/lib/event'
import { formatDate, timeToReadableString } from '@/lib/date'
import { Card, CardBody } from '@chakra-ui/card'
import { Tag } from '@chakra-ui/tag'
import { LinkOverlay } from '@chakra-ui/layout'
import Link from 'next/link'

const dates = ['2023-08-03', '2023-08-04', '2023-08-05', '2023-08-06'].map(
  (d) => new Date(d + 'T00:00:00+09:00')
)

export default function MyPage() {
  const eventIds = useSelector<RootState, number[]>(
    (state) => state.collection?.events || []
  )
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    fetch('/api/v1/events/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ operation: 'get', ids: eventIds }),
    })
      .then((res) => res.json())
      .then((eventPayloads) => {
        const events: Event[] = eventPayloads.map(createEvent)
        events.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
        setEvents(events)
      })
  }, [eventIds])

  return (
    <Box margin={7}>
      <Heading>保存した公演</Heading>
      <Grid
        gridTemplateColumns={{
          base: '1fr',
          lg: `repeat(${dates.length}, 1fr)`,
        }}
        gap={5}
        marginTop={7}
      >
        {dates.map((date) => {
          const eventsAtTheDay = events.filter(
            (e) =>
              date.getTime() < e.startsAt.getTime() &&
              e.startsAt.getTime() < date.getTime() + 24 * 60 * 60 * 1000
          )
          return (
            <GridItem key={date.toISOString()}>
              <Box>
                <Heading size="md">{formatDate(date, 'MM月DD日')}</Heading>
                <Box marginTop={5}>
                  {eventsAtTheDay.length > 0 ? (
                    <Stack>
                      {eventsAtTheDay.map((event, i, es) => {
                        const timeFromPrevEvent =
                          i > 0
                            ? event.startsAt.getTime() -
                              (es[i - 1].startsAt.getTime() +
                                es[i - 1].duration * 60 * 1000)
                            : 0
                        return (
                          <>
                            {timeFromPrevEvent > 30 * 60 * 1000 ? (
                              <Center
                                key={event.id + '-interval'}
                                color="gray"
                                fontSize={'sm'}
                                marginTop={1}
                                marginBottom={1}
                              >
                                - {timeToReadableString(timeFromPrevEvent)} -
                              </Center>
                            ) : null}
                            <Card key={event.id}>
                              <LinkOverlay
                                href={`/locations/${event.location.id}#${event.id}`}
                                as={Link}
                              >
                                <CardBody>
                                  <Text size="xs" as="span" color="gray.500">
                                    {formatDate(event.startsAt, 'hh:mm')} -{' '}
                                    {formatDate(
                                      new Date(
                                        event.startsAt.getTime() +
                                          event.duration * 60 * 1000
                                      ),
                                      'hh:mm'
                                    )}
                                  </Text>
                                  {event.paid ? (
                                    <Tag size="sm" bg="red.200" marginLeft={2}>
                                      有料
                                    </Tag>
                                  ) : null}
                                  <Heading as="h3" size="sm">
                                    {event.company}
                                  </Heading>
                                  <Text fontSize="sm" marginTop={1}>
                                    {event.location.name}
                                  </Text>
                                </CardBody>
                              </LinkOverlay>
                            </Card>
                          </>
                        )
                      })}
                    </Stack>
                  ) : (
                    <Center color="gray" fontSize={'sm'}>
                      まだ登録していません
                    </Center>
                  )}
                </Box>
              </Box>
            </GridItem>
          )
        })}
      </Grid>
    </Box>
  )
}
