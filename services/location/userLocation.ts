import * as Location from 'expo-location';

import type { UserGeoLocation } from '../../types/localEvents';

/** Default to My Gi academy area when permission is denied. */
export const FALLBACK_LOCATION: UserGeoLocation = {
  latitude: 37.7397,
  longitude: -121.4252,
  city: 'Tracy',
  region: 'California',
  country: 'United States',
  label: 'Tracy, CA',
};

function buildLabel(parts: {
  city: string | null;
  region: string | null;
  country: string | null;
}): string {
  const chunks = [parts.city, parts.region].filter(Boolean);
  if (chunks.length > 0) {
    return chunks.join(', ');
  }
  return parts.country || 'Your area';
}

export async function requestUserLocation(): Promise<{
  location: UserGeoLocation;
  permission: 'granted' | 'denied' | 'unavailable';
  usedFallback: boolean;
}> {
  try {
    const current = await Location.getForegroundPermissionsAsync();
    let status = current.status;

    if (status !== Location.PermissionStatus.GRANTED) {
      const requested = await Location.requestForegroundPermissionsAsync();
      status = requested.status;
    }

    if (status !== Location.PermissionStatus.GRANTED) {
      return {
        location: FALLBACK_LOCATION,
        permission: 'denied',
        usedFallback: true,
      };
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const places = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    const place = places[0];
    const city = place?.city || place?.subregion || null;
    const region = place?.region || null;
    const country = place?.country || null;

    const location: UserGeoLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      city,
      region,
      country,
      label: buildLabel({ city, region, country }),
    };

    return {
      location,
      permission: 'granted',
      usedFallback: false,
    };
  } catch {
    return {
      location: FALLBACK_LOCATION,
      permission: 'unavailable',
      usedFallback: true,
    };
  }
}
