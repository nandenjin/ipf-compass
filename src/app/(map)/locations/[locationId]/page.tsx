import { formatDate, getHHMM, getYYYYMMDD } from '@/lib/date'
import { getDb } from '@/lib/db'
import { createEvent } from '@/lib/event'
import { Card, CardBody } from '@chakra-ui/card'
import {
  Box,
  Stack,
  Heading,
  Divider,
  Grid,
  GridItem,
  Center,
} from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { Tag } from '@chakra-ui/tag'
import { Event } from '@/lib/event'
import { EventSaveButton } from '@/components/EventSaveButton'
import { useMemo } from 'react'
import dynamic from 'next/dynamic'

export default async function LocationPage({
  params,
}: {
  params: { locationId: string }
}) {
  const LocationMap = dynamic(() => import('@/components/LocationMap'), {
    loading: () => (
      <Center h="100%" bg="lightgray">
        <Spinner size="lg" />
      </Center>
    ),
    ssr: false,
  })

  const db = getDb()
  const { locationId } = params

  const location = await db('locations').where('id', locationId).first()

  const events = (
    await db('events')
      .where('location_id', locationId)
      .select('id', 'title', 'startsAt', 'venue', 'company', 'duration', 'paid')
  ).map(createEvent)

  const eventsGrouped = events
    .reduce<Event[][]>((prev, current) => {
      for (const p of prev) {
        if (getYYYYMMDD(p[0].startsAt) === getYYYYMMDD(current.startsAt)) {
          p.push(current)
          return prev
        }
      }

      return [...prev, [current]]
    }, [])
    .sort((a, b) => a[0].startsAt.getTime() - b[0].startsAt.getTime())

  return (
    <Box margin={7} position="relative">
      <Box
        marginRight={{
          base: 0,
          lg: '50vw',
        }}
      >
        <Heading as="h1">{location.name}</Heading>
        <Stack gap={5}>
          {eventsGrouped.map((evts) => (
            <Box key={evts[0].id}>
              <Heading
                as="h2"
                size="md"
                id={getYYYYMMDD(evts[0].startsAt)}
                // アンカーリンクでアクセスされたときに、ヘッダーで見出しが隠れないようにするハック
                // https://stackoverflow.com/a/11842865
                marginTop="calc(1em - 100px)"
                paddingTop="100px"
              >
                {formatDate(evts[0].startsAt, 'MM月DD日')}
              </Heading>
              <Card key={getYYYYMMDD(evts[0].startsAt)}>
                <CardBody>
                  <Stack gap={2} divider={<Divider />}>
                    {evts.map((event) => (
                      <Grid
                        key={event.id}
                        templateColumns="1fr auto"
                        gap={5}
                        id={event.id.toString()}
                        marginTop="-100px"
                        paddingTop="100px"
                      >
                        <GridItem>
                          <Box>
                            {getHHMM(event.startsAt)}~
                            {event.paid ? (
                              <Tag bg="red.200" marginLeft={2}>
                                有料
                              </Tag>
                            ) : null}
                          </Box>
                          <Heading
                            as="h3"
                            size="md"
                            marginTop={1}
                            marginBottom={1}
                          >
                            {event.company}
                          </Heading>
                          <Box>{event.venue}</Box>
                        </GridItem>
                        <GridItem>
                          <EventSaveButton event={event} />
                        </GridItem>
                      </Grid>
                    ))}
                  </Stack>
                </CardBody>
              </Card>
            </Box>
          ))}
        </Stack>
        <Box
          position={{
            base: 'static',
            lg: 'fixed',
          }}
          top={{
            base: 'auto',
            lg: '80px',
          }}
          right={{
            base: 'auto',
            lg: 0,
          }}
          width={{
            base: 'auto',
            lg: 'calc(50vw - 15px)',
          }}
          height={{
            base: '300px',
            lg: 'calc(100vh - 80px)',
          }}
          marginTop="7"
        >
          <LocationMap location={location} />
        </Box>
      </Box>
    </Box>
  )
}
