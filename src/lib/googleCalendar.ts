import { GoogleCalendarEvent, ScheduleBlock } from '../types';

const STORAGE_KEY = 'dsa_os_gcal_ical_url';

export const googleCalendarService = {
  getStoredUrl: (): string => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(STORAGE_KEY) || '';
  },

  saveStoredUrl: (url: string) => {
    if (typeof window === 'undefined') return;
    if (url && url.trim()) {
      localStorage.setItem(STORAGE_KEY, url.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  /**
   * Fetches and parses Google Calendar events via our server-side API proxy.
   */
  fetchEvents: async (icalUrl: string): Promise<GoogleCalendarEvent[]> => {
    if (!icalUrl || !icalUrl.trim()) return [];

    try {
      // Use local API proxy to avoid browser CORS blocks
      const proxyUrl = `/api/gcal?url=${encodeURIComponent(icalUrl.trim())}`;
      const res = await fetch(proxyUrl);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${res.status} from calendar proxy`);
      }

      const icsText = await res.text();
      return parseICalEvents(icsText);
    } catch (err: any) {
      console.error('Failed to load Google Calendar events:', err);
      throw err;
    }
  },

  /**
   * Generates a direct 1-click Google Calendar web link to add a task/block.
   */
  generateQuickAddLink: (
    title: string,
    timeStr?: string,
    description?: string
  ): string => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;

    let startIso = `${dateStr}T090000`;
    let endIso = `${dateStr}T100000`;

    if (timeStr) {
      const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
      if (match) {
        let hour = parseInt(match[1]);
        const minute = match[2] ? match[2] : '00';
        const meridiem = match[3] ? match[3].toUpperCase() : '';

        if (meridiem === 'PM' && hour < 12) hour += 12;
        if (meridiem === 'AM' && hour === 12) hour = 0;

        const hStr = String(hour).padStart(2, '0');
        const endHStr = String(Math.min(23, hour + 1)).padStart(2, '0');

        startIso = `${dateStr}T${hStr}${minute}00`;
        endIso = `${dateStr}T${endHStr}${minute}00`;
      }
    }

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${startIso}/${endIso}`,
      details: description || 'Created from Daily Operating System',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  },
};

/**
 * Lightweight, robust parser for RFC 5545 iCalendar (ICS) event format.
 */
export function parseICalEvents(icsText: string): GoogleCalendarEvent[] {
  const events: GoogleCalendarEvent[] = [];
  const lines = icsText.split(/\r?\n/);

  let inEvent = false;
  let currentEvent: Partial<GoogleCalendarEvent> & { dtStartRaw?: string; dtEndRaw?: string } = {};

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Handle folded lines (RFC 5545: lines beginning with space or tab continue previous line)
    while (i + 1 < lines.length && (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t'))) {
      i++;
      line += lines[i].slice(1);
    }

    if (line.startsWith('BEGIN:VEVENT')) {
      inEvent = true;
      currentEvent = { id: `gcal-${Date.now()}-${Math.random().toString(36).substr(2, 6)}` };
      continue;
    }

    if (line.startsWith('END:VEVENT')) {
      if (inEvent && currentEvent.title) {
        const { date, startTime, endTime, isAllDay } = parseICalDateTime(
          currentEvent.dtStartRaw,
          currentEvent.dtEndRaw
        );
        events.push({
          id: currentEvent.id || `gcal-${Math.random()}`,
          title: currentEvent.title,
          date,
          startTime,
          endTime,
          description: currentEvent.description,
          location: currentEvent.location,
          isAllDay,
        });
      }
      inEvent = false;
      currentEvent = {};
      continue;
    }

    if (!inEvent) continue;

    if (line.startsWith('SUMMARY:')) {
      currentEvent.title = unescapeICal(line.slice(8).trim());
    } else if (line.startsWith('DESCRIPTION:')) {
      currentEvent.description = unescapeICal(line.slice(12).trim());
    } else if (line.startsWith('LOCATION:')) {
      currentEvent.location = unescapeICal(line.slice(9).trim());
    } else if (line.startsWith('DTSTART')) {
      const val = line.split(':').slice(1).join(':').trim();
      currentEvent.dtStartRaw = val;
    } else if (line.startsWith('DTEND')) {
      const val = line.split(':').slice(1).join(':').trim();
      currentEvent.dtEndRaw = val;
    }
  }

  return events;
}

function unescapeICal(str: string): string {
  return str
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

function parseICalDateTime(
  startRaw?: string,
  endRaw?: string
): { date: string; startTime: string; endTime?: string; isAllDay: boolean } {
  const today = new Date();
  const fallbackDate = today.toISOString().split('T')[0];

  if (!startRaw) {
    return { date: fallbackDate, startTime: '09:00 AM', isAllDay: false };
  }

  // All-day event: YYYYMMDD (length 8)
  if (startRaw.length === 8 && /^\d{8}$/.test(startRaw)) {
    const y = startRaw.slice(0, 4);
    const m = startRaw.slice(4, 6);
    const d = startRaw.slice(6, 8);
    return { date: `${y}-${m}-${d}`, startTime: 'All Day', isAllDay: true };
  }

  // DateTime event: YYYYMMDDTHHMMSS[Z]
  const dateMatch = startRaw.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?/);
  if (dateMatch) {
    const [, y, m, d, hh, mm] = dateMatch;
    let hour = parseInt(hh, 10);
    const minute = mm;

    // Convert to 12-hour format
    const meridiem = hour >= 12 ? 'PM' : 'AM';
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;

    const startTime = `${String(hour).padStart(2, '0')}:${minute} ${meridiem}`;

    let endTime: string | undefined = undefined;
    if (endRaw) {
      const endMatch = endRaw.match(/T(\d{2})(\d{2})/);
      if (endMatch) {
        let eHour = parseInt(endMatch[1], 10);
        const eMin = endMatch[2];
        const eMeridiem = eHour >= 12 ? 'PM' : 'AM';
        if (eHour > 12) eHour -= 12;
        if (eHour === 0) eHour = 12;
        endTime = `${String(eHour).padStart(2, '0')}:${eMin} ${eMeridiem}`;
      }
    }

    return {
      date: `${y}-${m}-${d}`,
      startTime,
      endTime,
      isAllDay: false,
    };
  }

  return { date: fallbackDate, startTime: '09:00 AM', isAllDay: false };
}
