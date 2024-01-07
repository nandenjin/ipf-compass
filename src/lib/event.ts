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
  duration: number
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
  duration: number
}

export const createEvent = (src: EventRow | Event): Event => {
  let id: number
  let startsAt: Date
  let venue: string
  let location_id: number
  let company: string
  let title: string
  let location_name: string
  let location_lat: number
  let location_lon: number
  let paid: boolean
  let duration: number
  let location: Location

  id = src.id
  venue = src.venue
  company = src.company
  title = src.title
  paid = !!src.paid
  duration = src.duration

  if (src.startsAt instanceof Date) {
    startsAt = src.startsAt
  } else {
    startsAt = new Date(src.startsAt)
  }

  if ('location_id' in src) {
    location = {
      id: src.location_id,
      name: src.location_name,
      lat: src.location_lat,
      lon: src.location_lon,
    }
  } else {
    location = src.location
  }

  return {
    id,
    startsAt,
    company,
    title,
    venue,
    paid: !!paid,
    duration,
    location,
  }
}
