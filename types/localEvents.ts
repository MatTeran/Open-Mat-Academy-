export type LocalEventKind = 'tournament' | 'seminar' | 'camp' | 'other';

export type LocalEventFilter = 'all' | 'tournament' | 'seminar';

export interface UserGeoLocation {
  latitude: number;
  longitude: number;
  city: string | null;
  region: string | null;
  country: string | null;
  label: string;
}

export interface LocalEvent {
  id: string;
  title: string;
  kind: LocalEventKind;
  city: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  periodLabel: string;
  distanceMiles: number;
  url: string;
  coverImage: string | null;
  source: 'smoothcomp';
}

export interface LocalEventsSearchResult {
  location: UserGeoLocation;
  events: LocalEvent[];
  fetchedAt: string;
  sourceLabel: string;
}
