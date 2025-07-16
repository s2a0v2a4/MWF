import { NextResponse } from 'next/server';

type Event = {
  id: string;
  position: [number, number];
  name: string;
  people: number;
  time: string;
  type: string;
  comments: string[];
};

// In-memory Events Speicher
let events: Event[] = [];

export async function GET() {
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const newEvent = await request.json();

  if (
    !newEvent ||
    typeof newEvent.name !== 'string' ||
    !Array.isArray(newEvent.position) ||
    newEvent.position.length !== 2
  ) {
    return NextResponse.json({ error: 'Ungültige Daten' }, { status: 400 });
  }
  // events.push;
  const event: Event = {
    id: `event_${Date.now()}`, // ID generieren
    name: newEvent.name,
    position: [Number(newEvent.position[0]), Number(newEvent.position[1])],
    people: newEvent.people ?? 1,
    time: newEvent.time ?? 'now',
    type: newEvent.type ?? 'generic',
    comments: [],
  };

  events.push(event);
  return NextResponse.json(event, { status: 201 });
}