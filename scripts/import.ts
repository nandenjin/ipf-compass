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
  const csv: string[][] = parseCSV(data)

  const header = csv[0]
  console.warn('Removing header row...')
  csv.shift()

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
      'INSERT INTO events (id, startsAt, venue, location_id, company, title, duration, paid) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT DO NOTHING'
    )

    events.forEach((event) => {
      stmt.run(
        event.id,
        event.startsAt.toISOString(),
        event.venue,
        event.locationId,
        event.company,
        event.title,
        event.duration,
        event.paid ? 1 : 0
      )
    })

    stmt.finalize()
  })
})

readFile('data/locations.csv', { encoding: 'utf-8' }, (err, data) => {
  const csv: string[][] = parseCSV(data)

  const header = csv[0]
  console.warn('Removing header row...')
  csv.shift()

  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS locations (id INTEGER, name TEXT, addr TEXT, lat REAL, lon REAL, PRIMARY KEY (id))'
    )
    const stmt = db.prepare(
      'INSERT INTO locations (id, name, addr, lat, lon) VALUES (?, ?, ?, ?, ?) ON CONFLICT DO NOTHING'
    )

    csv.forEach((row) => {
      stmt.run(
        row[header.indexOf(LocationHeader.id)],
        row[header.indexOf(LocationHeader.name)],
        row[header.indexOf(LocationHeader.address)],
        row[header.indexOf(LocationHeader.lat)],
        row[header.indexOf(LocationHeader.lon)]
      )
    })

    stmt.finalize()
  })
})

readFile('data/venues.csv', { encoding: 'utf-8' }, (err, data) => {
  const csv: string[][] = parseCSV(data)

  const header = csv[0]

  console.warn('Removing header row...')
  csv.shift()

  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS venues (name TEXT, location_id INTEGER, PRIMARY KEY (name))'
    )
    const stmt = db.prepare(
      'INSERT INTO venues (name, location_id) VALUES (?, ?) ON CONFLICT DO NOTHING'
    )

    csv.forEach((row) => {
      stmt.run(
        row[header.indexOf(VenueHeader.name)],
        row[header.indexOf(VenueHeader.locationId)]
      )
    })

    stmt.finalize()
  })
})
