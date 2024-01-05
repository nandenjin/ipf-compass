'use client'
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon, Point } from 'leaflet'
import { Event } from '@/lib/event'
import MARKER_ICON_URL from '@/assets/marker.png'
import {
  Box,
  Button,
  Link as ChakraLink,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import NextLink from 'next/link'

const icon = new Icon({
  iconUrl: MARKER_ICON_URL.src,
  iconSize: [41, 41],
  iconAnchor: [20.5, 41],
})

const popupOffset = new Point(0, -45)

const createOfficialSearchUrl = (query: string[]) =>
  `https://www.iida-puppet.com/?s_keyword_0=${query
    .map((m) => encodeURIComponent(m))
    .join('+')}&csp=search_add`

type Prop = { events: Event[]; day?: string }

export default function EventMap({ events, day }: Prop) {
  const eventsGrouped = events.reduce((prev, current) => {
    for (const p of prev) {
      if (p[0].location.id === current.location.id) {
        p.push(current)
        return prev
      }
    }
    return [...prev, [current]]
  }, [] as Event[][])

  return (
    <MapContainer
      // bounds={[
      //   [35.43109805588201, 137.91810509245408],
      //   [35.561896082631115, 137.73458978836712],
      // ]}
      center={[35.51694329400712, 137.82745253760703]}
      zoom={14}
      zoomControl={false}
      style={{ height: '100vh', width: '100vw' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.jp/styles/maptiler-basic-ja/{z}/{x}/{y}.png"
      />
      {eventsGrouped.map((events) => (
        <Marker
          position={[events[0].location.lat, events[0].location.lon]}
          key={events[0].location.id}
          icon={icon}
        >
          <Tooltip permanent={true} direction="top" offset={popupOffset}>
            {events[0].startsAt.getHours() +
              ':' +
              ('00' + events[0].startsAt.getMinutes()).slice(-2)}
          </Tooltip>
          <Popup offset={popupOffset}>
            <Box>
              <Text>{events[0].location.name}</Text>
              <UnorderedList>
                {events.map((event) => (
                  <ListItem key={event.id}>
                    <span>{`${event.startsAt.getHours()}:${(
                      '00' + event.startsAt.getMinutes()
                    ).slice(-2)}`}</span>
                    <span>{event.company}</span>
                  </ListItem>
                ))}
              </UnorderedList>
              <ChakraLink
                // href={createOfficialSearchUrl([
                //   `${
                //     event.startsAt.getMonth() + 1
                //   }月${event.startsAt.getDate()}日`,
                //   `${event.startsAt.getHours()}:${(
                //     '00' + event.startsAt.getMinutes()
                //   ).slice(-2)}`,
                // ])}
                // rel="noreferrer"
                // target="_blank"
                as={NextLink}
                href={
                  `/locations/${events[0].location.id}` + (day ? `#${day}` : '')
                }
              >
                <Button colorScheme="red" variant="solid">
                  この会場を見る
                </Button>
              </ChakraLink>
            </Box>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
