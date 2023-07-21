import sqlite3 from 'sqlite3'
import { read, readFile } from 'fs'
import { join as joinPath } from 'path'
import { parse as parseCSV } from 'csv-parse/sync'

const db = new sqlite3.Database(joinPath(__dirname, '../data/db.sqlite3'))

type Event = {
  startsAt: Date
  location: string
  company: string
  title: string
  duration: number
  paid: boolean
}

/**
 *
 * @param row [date,startTime,locationName,companyName,title,durationMin,paid]
 */
const parseRow = (row: string[]): Event => ({
  startsAt: parseDateAndTime(row[0], row[1]),
  location: row[2],
  company: row[3],
  title: row[4],
  duration: parseInt(row[5]),
  paid: row[6].length > 0,
})

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

  try {
    parseDateAndTime(csv[0][0], csv[0][1]).toISOString()
  } catch (_) {
    console.warn('Removing header row...')
    csv.shift()
  }

  const events = csv.map(parseRow)

  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS events (startsAt TEXT, location TEXT, company TEXT, title TEXT, duration INTEGER, paid INTEGER)'
    )

    const stmt = db.prepare(
      'INSERT INTO events (startsAt, location, company, title, duration, paid) VALUES (?, ?, ?, ?, ?, ?)'
    )

    events.forEach((event) => {
      stmt.run(
        event.startsAt.toISOString(),
        event.location,
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

  if (isNaN(+csv[0][2])) {
    console.warn('Removing header row...')
    csv.shift()
  }

  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS locations (name TEXT, addr TEXT, lat REAL, lon REAL)'
    )
    const stmt = db.prepare(
      'INSERT INTO locations (name, addr, lat, lon) VALUES (?, ?, ?, ?)'
    )

    csv.forEach((row) => {
      stmt.run(row[0], row[1], row[2], row[3])
    })

    stmt.finalize()
  })
})

readFile('data/location_names.csv', { encoding: 'utf-8' }, (err, data) => {
  const csv: string[][] = parseCSV(data)

  console.warn('Removing header row...')
  csv.shift()

  db.serialize(() => {
    db.run(
      'CREATE TABLE IF NOT EXISTS location_names (name TEXT, original_name TEXT)'
    )
    const stmt = db.prepare(
      'INSERT INTO location_names (name, original_name) VALUES (?, ?)'
    )

    csv.forEach((row) => {
      stmt.run(row[0], row[1])
    })

    stmt.finalize()
  })
})
