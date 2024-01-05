export type EventRow = {
  id: number
  startsAt: string
  venue: string
  location_id: number
  company: string
  title: string
  location_name: string
  location_lat: number
  location_lon: number
  paid: number
}

export type Location = {
  id: number
  name: string
  lat: number
  lon: number
}

export type Event = {
  id: number
  startsAt: Date
  company: string
  title: string
  venue: string
  location: Location
  paid: boolean
}

export const createEvent = (eventRow: EventRow): Event => {
  const {
    id,
    startsAt,
    venue,
    location_id,
    company,
    title,
    location_name,
    location_lat,
    location_lon,
    paid,
  } = eventRow
  const startsAtDate = new Date(startsAt)

  return {
    id,
    startsAt: startsAtDate,
    company,
    title,
    venue,
    paid: !!paid,
    location: {
      id: location_id,
      name: location_name,
      lat: location_lat,
      lon: location_lon,
    },
  }
}
