import type {
  LocalEvent,
  LocalEventFilter,
  LocalEventsSearchResult,
} from '../../types/localEvents';
import { requestUserLocation } from '../location/userLocation';
import {
  buildSmoothcompSearchUrl,
  buildWebSearchUrl,
  fetchSmoothcompRawEvents,
  mapNearbyLocalEvents,
} from './smoothcomp';

export async function searchLocalEvents(options?: {
  radiusMiles?: number;
}): Promise<LocalEventsSearchResult & {
  permission: 'granted' | 'denied' | 'unavailable';
  usedFallback: boolean;
}> {
  const radiusMiles = options?.radiusMiles ?? 250;
  const { location, permission, usedFallback } = await requestUserLocation();
  const raw = await fetchSmoothcompRawEvents();
  const events = mapNearbyLocalEvents(raw, location, radiusMiles);

  return {
    location,
    events,
    fetchedAt: new Date().toISOString(),
    sourceLabel: 'Smoothcomp',
    permission,
    usedFallback,
  };
}

export function filterLocalEvents(
  events: LocalEvent[],
  filter: LocalEventFilter,
): LocalEvent[] {
  if (filter === 'all') {
    return events;
  }
  if (filter === 'seminar') {
    return events.filter(
      (event) => event.kind === 'seminar' || event.kind === 'camp',
    );
  }
  return events.filter((event) => event.kind === 'tournament');
}

export function getExternalSearchLinks(locationLabel: string): Array<{
  label: string;
  url: string;
}> {
  const tournamentQuery = `BJJ tournaments near ${locationLabel}`;
  const seminarQuery = `BJJ seminars near ${locationLabel}`;
  return [
    {
      label: 'Smoothcomp nearby',
      url: buildSmoothcompSearchUrl(locationLabel),
    },
    {
      label: 'Web: tournaments',
      url: buildWebSearchUrl(tournamentQuery),
    },
    {
      label: 'Web: seminars',
      url: buildWebSearchUrl(seminarQuery),
    },
  ];
}
