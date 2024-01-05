import { getHHMM, getYYYYMMDD } from '@/lib/date'
import { getDb } from '@/lib/db'
import { createEvent } from '@/lib/event'
import { Card, CardBody } from '@chakra-ui/card'
import { Box, Stack, Heading, Divider, Grid, GridItem } from '@chakra-ui/layout'
import { Tag } from '@chakra-ui/tag'
import { Event } from '@/lib/event'
import SiteHeader from '@/components/SiteHeader'
import { EventSaveButton } from '@/components/EventSaveButton'

export default async function LocationPage({
  params,
}: {
  params: { locationId: string }
}) {
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
    <>
      <SiteHeader />
      <div style={{ margin: '15px' }}>
        <Heading as="h1">{location.name}</Heading>
        <Stack gap={5}>
          {eventsGrouped.map((evts) => (
            <>
              <Heading as="h2" size="lg" id={getYYYYMMDD(evts[0].startsAt)}>
                {evts[0].startsAt.toLocaleDateString()}
              </Heading>
              <Card key={getYYYYMMDD(evts[0].startsAt)}>
                <CardBody>
                  <Stack gap={2} divider={<Divider />}>
                    {evts.map((event) => (
                      <Grid key={event.id} templateColumns="1fr auto" gap={5}>
                        <GridItem>
                          <Box>
                            {getHHMM(event.startsAt)}~
                            {event.paid ? <Tag>有料</Tag> : null}
                          </Box>
                          <Heading as="h3" size="md">
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
            </>
          ))}
        </Stack>
      </div>
    </>
  )
}
