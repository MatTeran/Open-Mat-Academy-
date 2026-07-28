import type { LocalEvent, LocalEventKind } from '../../types/localEvents';
import { haversineMiles } from '../../utils/geo';

const SMOOTHCOMP_EVENTS_URL = 'https://smoothcomp.com/en/events/upcoming';

interface SmoothcompRawEvent {
  id: number;
  title: string;
  cover_image?: string;
  url: string;
  eventPeriod?: string;
  eventEnded?: boolean;
  location_country?: string;
  location_country_human?: string;
  location_city?: string;
  location_lat?: string | number;
  location_long?: string | number;
  startdate?: string;
  enddate?: string;
}

const BJJ_INCLUDE =
  /\b(bjj|jiu[\s-]?jitsu|jiujitsu|grappling|naga|ibjjf|adcc|no[\s-]?gi|submission|sjjif|agbjj|fight 2 win|f2w|combat jiu|good fight|fight to win)\b/i;

const SEMINAR_HINT = /\b(seminar|camp|clinic|workshop)\b/i;
const OTHER_SPORT =
  /\b(judo|karate|taekwondo|tkd|muay thai|boxing|mma only|wrestling)\b/i;

function classifyKind(title: string): LocalEventKind {
  if (/\bcamp\b/i.test(title)) {
    return 'camp';
  }
  if (SEMINAR_HINT.test(title)) {
    return 'seminar';
  }
  if (
    /\b(open|championship|championships|tournament|invitational|tour|nationals|worlds|gi|no[\s-]?gi)\b/i.test(
      title,
    )
  ) {
    return 'tournament';
  }
  return 'other';
}

function isRelevantBjjEvent(title: string): boolean {
  const hasBjjSignal = BJJ_INCLUDE.test(title);
  if (OTHER_SPORT.test(title) && !hasBjjSignal) {
    return false;
  }
  if (hasBjjSignal) {
    return true;
  }
  if (SEMINAR_HINT.test(title) && /\b(jiu|bjj|grappling)\b/i.test(title)) {
    return true;
  }
  // BJJ opens often omit "BJJ" in the title.
  if (/\bopen\b/i.test(title) && !OTHER_SPORT.test(title)) {
    return true;
  }
  return false;
}

function extractEventsArray(html: string): SmoothcompRawEvent[] {
  const marker = html.match(/events\s*=\s*\[/);
  if (!marker || marker.index == null) {
    throw new Error('Could not find Smoothcomp events feed.');
  }

  const start = marker.index + marker[0].length - 1;
  let depth = 0;
  let inString = false;
  let escape = false;
  let quote = '';

  for (let i = start; i < html.length; i += 1) {
    const ch = html[i];
    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === '\\') {
        escape = true;
      } else if (ch === quote) {
        inString = false;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      continue;
    }

    if (ch === '[') {
      depth += 1;
    } else if (ch === ']') {
      depth -= 1;
      if (depth === 0) {
        return JSON.parse(html.slice(start, i + 1)) as SmoothcompRawEvent[];
      }
    }
  }

  throw new Error('Smoothcomp events feed was incomplete.');
}

export async function fetchSmoothcompRawEvents(): Promise<SmoothcompRawEvent[]> {
  const response = await fetch(SMOOTHCOMP_EVENTS_URL, {
    headers: {
      Accept: 'text/html',
      'User-Agent': 'OpenMat/1.0 (local events discovery)',
    },
  });

  if (!response.ok) {
    throw new Error(`Smoothcomp returned ${response.status}.`);
  }

  const html = await response.text();
  return extractEventsArray(html);
}

export function mapNearbyLocalEvents(
  rawEvents: SmoothcompRawEvent[],
  origin: { latitude: number; longitude: number },
  radiusMiles = 250,
): LocalEvent[] {
  const mapped: LocalEvent[] = [];

  for (const event of rawEvents) {
    if (event.eventEnded) {
      continue;
    }

    const title = (event.title || '').trim();
    if (!title || !isRelevantBjjEvent(title)) {
      continue;
    }

    const latitude = Number(event.location_lat);
    const longitude = Number(event.location_long);
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      continue;
    }

    const distanceMiles = haversineMiles(
      origin.latitude,
      origin.longitude,
      latitude,
      longitude,
    );
    if (distanceMiles > radiusMiles) {
      continue;
    }

    mapped.push({
      id: `sc-${event.id}`,
      title,
      kind: classifyKind(title),
      city: (event.location_city || 'Unknown').trim(),
      country: event.location_country_human || event.location_country || '',
      countryCode: event.location_country || '',
      latitude,
      longitude,
      startDate: event.startdate || '',
      endDate: event.enddate || event.startdate || '',
      periodLabel: event.eventPeriod || event.startdate || 'TBD',
      distanceMiles,
      url: event.url,
      coverImage: event.cover_image || null,
      source: 'smoothcomp',
    });
  }

  return mapped.sort((a, b) => {
    if (a.distanceMiles !== b.distanceMiles) {
      return a.distanceMiles - b.distanceMiles;
    }
    return a.startDate.localeCompare(b.startDate);
  });
}

export function buildSmoothcompSearchUrl(query: string): string {
  const q = encodeURIComponent(query);
  return `https://smoothcomp.com/en/events/upcoming?search=${q}`;
}

export function buildWebSearchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}
