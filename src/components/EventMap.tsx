'use client'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon, Point } from 'leaflet'
import { Event } from '@/lib/event'
import MARKER_ICON_URL from '@/assets/marker.png'

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
  return (
    <MapContainer
      bounds={[
        [35.43109805588201, 137.91810509245408],
        [35.561896082631115, 137.73458978836712],
      ]}
      style={{ height: '100vh', width: '100vw' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.jp/styles/maptiler-basic-ja/{z}/{x}/{y}.png"
      />
      {events.map((event) => (
        <Marker
          position={[event.location_lat, event.location_lon]}
          key={event.company + event.startsAt}
          icon={icon}
        >
          <Popup offset={popupOffset}>
            <p>
              <a
                href={createOfficialSearchUrl([event.company])}
                rel="noreferrer"
                target="_blank"
              >
                {event.company}
              </a>
            </p>
            <p>{event.title}</p>
            <p>{event.location}</p>
            <a
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
              公式
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
