import { getDb } from '@/lib/db'
import { createEvent } from '@/lib/event'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body: {
    operation: 'get'
    ids: number[]
  } = await req.json()

  if (body.operation !== 'get') {
    return NextResponse.json(
      {
        error: 'Unsupported operation',
      },
      {
        status: 400,
      }
    )
  }

  const db = getDb()
  const sql = db<Event>('events').leftJoin(
    'locations as l',
    'events.location_id',
    'l.id'
  )

  const events = (
    await sql
      .select([
        'events.*',
        'l.name as location_name',
        'l.lat as location_lat',
        'l.lon as location_lon',
      ])
      .whereIn('events.id', body.ids)
  ).map(createEvent)

  return NextResponse.json(events)
}
