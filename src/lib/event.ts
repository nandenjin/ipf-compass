export type EventRow = {
  startsAt: string
  location: string
  company: string
  title: string
  location_name: string
  location_lat: number
  location_lon: number
}

export type Event = {
  startsAt: Date
  location: string
  company: string
  title: string
  location_name: string
  location_lat: number
  location_lon: number
}

export const createEvent = (eventRow: EventRow) => {
  const {
    startsAt,
    location,
    company,
    title,
    location_name,
    location_lat,
    location_lon,
  } = eventRow
  const startsAtDate = new Date(startsAt)

  return {
    startsAt: startsAtDate,
    location,
    company,
    title,
    location_name,
    location_lat,
    location_lon,
  }
}
