'use client'
import { MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon, Point } from 'leaflet'
import { Event } from '@/lib/event'
import MARKER_ICON_URL from '@/assets/marker.png'
import { Box, Button, Link } from '@chakra-ui/react'

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

export default function EventMap({ events }: { events: Event[] }) {
  const eventsGrouped = events.reduce((prev, current) => {
    for (const p of prev) {
      if (p[0].location_name === current.location_name) {
        p.push(current)
        return prev
      }
    }
    return [...prev, [current]]
  }, [] as Event[][])

  return (
    <MapContainer
      bounds={[
        [35.43109805588201, 137.91810509245408],
        [35.561896082631115, 137.73458978836712],
      ]}
      zoomControl={false}
      style={{ height: '100vh', width: '100vw' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.jp/styles/maptiler-basic-ja/{z}/{x}/{y}.png"
      />
      {eventsGrouped.map((events) => (
        <Marker
          position={[events[0].location_lat, events[0].location_lon]}
          key={events[0].location_name}
          icon={icon}
        >
          <Tooltip permanent={true} direction="top" offset={popupOffset}>
            {events[0].startsAt.getHours() +
              ':' +
              ('00' + events[0].startsAt.getMinutes()).slice(-2)}
          </Tooltip>
          <Popup offset={popupOffset}>
            <Box>
              {/* <p>
                <a
                  href={createOfficialSearchUrl([events[0].company])}
                  rel="noreferrer"
                  target="_blank"
                >
                  {events[0].company}
                </a>
              </p>
              <p>{event.title}</p>
              <p>{event.location}</p>
              <Link
                href={createOfficialSearchUrl([
                  `${
                    event.startsAt.getMonth() + 1
                  }月${event.startsAt.getDate()}日`,
                  `${event.startsAt.getHours()}:${(
                    '00' + event.startsAt.getMinutes()
                  ).slice(-2)}`,
                ])}
                rel="noreferrer"
                target="_blank"
              >
                <Button colorScheme="red" variant="solid">
                  公式サイトでみる
                </Button>
              </Link> */}
            </Box>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
