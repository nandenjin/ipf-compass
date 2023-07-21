import sqlite3 from 'sqlite3'
import { readFile } from 'fs'
import { parse as parseCSV } from 'csv-parse/sync'

const db = new sqlite3.Database(':memory:')

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
      'CREATE TABLE events (startsAt TEXT, location TEXT, company TEXT, title TEXT, duration INTEGER, paid INTEGER)'
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

    db.each('SELECT * FROM events', (err, row) => {
      // console.log(row)
    })
  })
})
