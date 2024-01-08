import sqlite3 from 'sqlite3'
import { readFile } from 'fs'
import { join as joinPath } from 'path'
import { parse as parseCSV } from 'csv-parse/sync'

const db = new sqlite3.Database(joinPath(__dirname, '../data/db.sqlite3'))

type Event = {
  id: number
  startsAt: Date
  venue: string
  locationId: number
  company: string
  title: string
  duration: number
  paid: boolean
}

enum EventHeader {
  id = 'id',
  date = 'date',
  startsAt = 'starts_at',

  venueName = 'venue_name',
  locationId = 'location_id',
  companyName = 'company_name',
  title = 'title',
  durationMin = 'duration_min',
  paid = 'paid',
}

enum LocationHeader {
  id = 'id',
  name = 'name',
  address = 'addr',
  lat = 'lat',
  lon = 'lon',
}

enum VenueHeader {
  name = 'name',
  locationId = 'location_id',
}

const parseDateAndTime = (date: string, time: string): Date => {
  const [year, month, day] = date.split('/').map((s) => parseInt(s))
  const [hour, minute] = time.split(':').map((s) => parseInt(s))

  const padZero = (n: number) => ('00' + n).slice(-2)
  return new Date(
    `${year}-${padZero(month)}-${padZero(day)}T${padZero(hour)}:${padZero(
      minute
    )}:00+09:00`
  )
}

readFile('data/2023.csv', { encoding: 'utf-8' }, (err, data) => {
  if (err) {
    console.error('Failed to read event file.')
    throw err
  }

  const csv: string[][] = parseCSV(data)

  const header = csv[0]
  console.warn('Removing header row...')
  csv.shift()
  console.info(`Importing ${csv.length} rows from event...`)

  /**
   *
   * @param row [id,date,startTime,locationName,companyName,title,durationMin,paid]
   */
  const parseRow = (row: string[]): Event => ({
    id: parseInt(row[header.indexOf(EventHeader.id)]),
    startsAt: parseDateAndTime(
      row[header.indexOf(EventHeader.date)],
      row[header.indexOf(EventHeader.startsAt)]
    ),
    venue: row[header.indexOf(EventHeader.venueName)],
    locationId: parseInt(row[header.indexOf(EventHeader.locationId)]),
    company: row[header.indexOf(EventHeader.companyName)],
    title: row[header.indexOf(EventHeader.title)],
    duration: parseInt(row[header.indexOf(EventHeader.durationMin)]),
    paid: row[header.indexOf(EventHeader.paid)].length > 0,
  })

  const events = csv.map(parseRow)
  console.info(`Parsed ${events.length} events.`)

  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS events (
        id INTEGER,
        startsAt TEXT,
        venue TEXT,
        location_id INTEGER,
        company TEXT,
        title TEXT,
        duration
        INTEGER,
        paid INTEGER,
        PRIMARY KEY (id)
      )`
    )

    const stmt = db.prepare(
      'INSERT INTO events (id, startsAt, venue, location_id, company, title, duration, paid) VALUES ($id, $startsAt, $venue, $locationId, $company, $title, $duration, $paid) ON CONFLICT DO UPDATE SET startsAt = $startsAt, venue = $venue, location_id = $locationId, company = $company, title = $title, duration = $duration, paid = $paid'
    )

    events.forEach((event) => {
      stmt.run({
        $id: event.id,
        $startsAt: event.startsAt.toISOString(),
        $venue: event.venue,
        $locationId: event.locationId,
        $company: event.company,
        $title: event.title,
        $duration: event.duration,
        $paid: event.paid ? 1 : 0,
      })
    })

    console.log(`Writing ${events.length} events...`)
    stmt.finalize()
  })
})

readFile('data/locations.csv', { encoding: 'utf-8' }, (err, data) => {
  if (err) {
    console.error('Failed to read location file.')
    throw err
  }

  const csv: string[][] = parseCSV(data)

  const header = csv[0]
  console.warn('Removing header row...')
  csv.shift()
  console.log(`Importing ${csv.length} rows from location...`)

  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS locations (id INTEGER, name TEXT, addr TEXT, lat REAL, lon REAL, PRIMARY KEY (id))'
    )
    const stmt = db.prepare(
      'INSERT INTO locations (id, name, addr, lat, lon) VALUES ($id, $name, $addr, $lat, $lon) ON CONFLICT DO UPDATE SET name = $name, addr = $addr, lat = $lat, lon = $lon'
    )

    csv.forEach((row) => {
      stmt.run({
        $id: row[header.indexOf(LocationHeader.id)],
        $name: row[header.indexOf(LocationHeader.name)],
        $addr: row[header.indexOf(LocationHeader.address)],
        $lat: row[header.indexOf(LocationHeader.lat)],
        $lon: row[header.indexOf(LocationHeader.lon)],
      })
    })

    console.log(`Writing ${csv.length} locations...`)
    stmt.finalize()
  })
})

readFile('data/venues.csv', { encoding: 'utf-8' }, (err, data) => {
  if (err) {
    console.error('Failed to read venue file.')
    throw err
  }

  const csv: string[][] = parseCSV(data)

  const header = csv[0]

  console.warn('Removing header row...')
  csv.shift()

  console.log(`Importing ${csv.length} rows from venue...`)

  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS venues (name TEXT, location_id INTEGER, PRIMARY KEY (name))'
    )
    const stmt = db.prepare(
      'INSERT INTO venues (name, location_id) VALUES ($name, $locationId) ON CONFLICT DO UPDATE SET location_id = $locationId'
    )

    csv.forEach((row) => {
      stmt.run({
        $name: row[header.indexOf(VenueHeader.name)],
        $locationId: row[header.indexOf(VenueHeader.locationId)],
      })
    })

    console.log(`Writing ${csv.length} venues...`)
    stmt.finalize()
  })
})
