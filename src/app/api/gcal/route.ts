import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side proxy for Google Calendar private iCal (.ics) feeds.
 * Bypasses browser CORS restrictions safely.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const icalUrl = searchParams.get('url');

  if (!icalUrl) {
    return NextResponse.json({ error: 'Missing calendar URL' }, { status: 400 });
  }

  // Basic security check: ensure it's a calendar URL or ics feed
  if (!icalUrl.includes('google.com/calendar/ical') && !icalUrl.endsWith('.ics')) {
    return NextResponse.json(
      { error: 'Invalid calendar URL. Please provide a Google Calendar iCal link.' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(icalUrl, {
      headers: {
        'User-Agent': 'DailySystemApp/1.0',
        Accept: 'text/calendar, text/plain, */*',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Google Calendar returned status ${res.status}` },
        { status: res.status }
      );
    }

    const icsText = await res.text();
    return new NextResponse(icsText, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (err: any) {
    console.error('Failed to proxy Google Calendar:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch calendar feed' },
      { status: 500 }
    );
  }
}
