import { getDb } from '@/lib/db'
import { EventRow, createEvent } from '@/lib/event'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const db = await getDb()
  const events = (
    await db.all<EventRow>(
      `SELECT 
    e.*, 
    ln.name as location_name,
    l.lat as location_lat, 
    l.lon as location_lon
FROM 
    events e 
LEFT JOIN 
    location_names ln ON e.location = ln.original_name
LEFT JOIN 
    locations l ON ln.name = l.name`
    )
  ).map((m) => createEvent(m))
  return NextResponse.json(events)
}
