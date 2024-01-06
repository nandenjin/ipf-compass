'use client'
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet'
import MARKER_ICON_URL from '@/assets/marker.png'
import 'leaflet/dist/leaflet.css'
import { Location } from '@/lib/event'
import { Icon, Point } from 'leaflet'

type Prop = {
  location: Location
}

const icon = new Icon({
  iconUrl: MARKER_ICON_URL.src,
  iconSize: [41, 41],
  iconAnchor: [20.5, 41],
})
const popupOffset = new Point(0, -45)

export default function LocationMap({ location }: Prop) {
  return (
    <MapContainer
      center={[location.lat, location.lon]}
      zoom={16}
      zoomControl={false}
      dragging={false}
      scrollWheelZoom={'center'}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.jp/styles/maptiler-basic-ja/{z}/{x}/{y}.png"
      />
      <Marker position={[location.lat, location.lon]} icon={icon}>
        <Tooltip direction="top" offset={popupOffset} permanent>
          {location.name}
        </Tooltip>
      </Marker>
    </MapContainer>
  )
}
