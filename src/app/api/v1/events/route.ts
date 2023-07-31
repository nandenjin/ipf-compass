import { getDb } from '@/lib/db'
import { EventRow, createEvent } from '@/lib/event'
import { NextResponse } from 'next/server'
import { parse as parseQuery } from 'querystring'

export async function GET(req: Request) {
  const db = getDb()

  const query = parseQuery(req.url.split('?')[1] || '')

  const sql = db<Event>('events').leftJoin(
    'locations as l',
    'events.location_id',
    'l.id'
  )

  if (query.from && query.to) {
    sql.whereBetween('startsAt', [query.from, query.to])
  }

  const events = (
    await sql.select([
      'events.*',
      'l.name as location_name',
      'l.lat as location_lat',
      'l.lon as location_lon',
    ])
  ).map((m) => createEvent(m))
  return NextResponse.json(events)
}
