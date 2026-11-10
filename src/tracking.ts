import { detectDevice } from './device';

export interface TrackingData {
  locId: number | null;
  device: string;
  source: 'qr_code' | 'direct';
  timestamp: string;
}

export interface GeoData {
  city: string | null;
  region: string | null;
  regionCode?: string | null;
  country: string | null;
  countryCode: string | null;
  timezone: string | null;
  latitude: number | null;
  longitude: number | null;
  coordinates: string | null;
}

const STORAGE_KEY = 'tf_loc_id';
const GEO_STORAGE_KEY = 'tf_geo_data';

export function extractLocationId(): number | null {
  if (typeof window === 'undefined') return null;

  try {
    const params = new URLSearchParams(window.location.search);
    const rawLocId = params.get('loc-id');

    // Strict validation: must be digits only
    if (rawLocId && /^\d+$/.test(rawLocId.trim())) {
      const parsed = parseInt(rawLocId.trim(), 10);
      if (!isNaN(parsed) && parsed > 0) {
        // Save to sessionStorage for cross-anchor / reload persistence
        sessionStorage.setItem(STORAGE_KEY, String(parsed));
        return parsed;
      }
    }

    // Fallback: check if stored earlier in this browsing session
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored && /^\d+$/.test(stored.trim())) {
      const parsed = parseInt(stored.trim(), 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  } catch {
    // Graceful fallback for environments with blocked storage
  }

  return null;
}

export function getStoredGeoData(): GeoData | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(GEO_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === 'object') {
        return parsed as GeoData;
      }
    }
  } catch {
    // Graceful fallback
  }
  return null;
}

export function storeGeoData(geo: GeoData): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(geo));
  } catch {
    // Graceful fallback
  }
}

export function populateFormGeoFields(geo: GeoData): void {
  const setField = (
    selector: string,
    value: string | number | null | undefined
  ) => {
    const el = document.querySelector<HTMLInputElement>(selector);
    if (el) {
      el.value = value !== null && value !== undefined ? String(value) : '';
    }
  };

  setField('#form-geo-city', geo.city);
  setField('#form-geo-region', geo.region);
  setField('#form-geo-country', geo.country);
  setField('#form-geo-country-code', geo.countryCode);
  setField('#form-geo-timezone', geo.timezone);
  setField('#form-geo-latitude', geo.latitude);
  setField('#form-geo-longitude', geo.longitude);
  setField('#form-geo-coordinates', geo.coordinates);
}

export function populateFormHiddenFields(): void {
  const locId = extractLocationId();
  const device = detectDevice();

  const locInput = document.querySelector<HTMLInputElement>('#form-loc-id');
  if (locInput) {
    locInput.value = locId !== null ? String(locId) : '';
  }

  const deviceInput = document.querySelector<HTMLInputElement>('#form-device');
  if (deviceInput) {
    deviceInput.value = device;
  }

  // Populate Geo fields from session storage if available
  const storedGeo = getStoredGeoData();
  if (storedGeo) {
    populateFormGeoFields(storedGeo);
  }
}

export async function sendPageTracking(): Promise<GeoData | null> {
  const locId = extractLocationId();
  const device = detectDevice();
  const isQr = locId !== null;

  let clientTimezone: string | null = null;
  try {
    clientTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch {
    // Graceful fallback
  }

  const payload = {
    event: 'page_view',
    locId,
    device,
    source: isQr ? 'qr_code' : 'direct',
    path: window.location.pathname,
    referrer: document.referrer || null,
    clientTimezone,
    clientLanguage:
      typeof navigator !== 'undefined' ? navigator.language : null,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.geo) {
        storeGeoData(data.geo);
        populateFormGeoFields(data.geo);
        return data.geo as GeoData;
      }
    }
  } catch {
    // Tracking is non-blocking; silently ignore network failures
  }

  return null;
}
