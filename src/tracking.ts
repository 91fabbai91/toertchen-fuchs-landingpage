import { detectDevice } from './device';

export interface TrackingData {
  locId: number | null;
  device: string;
  source: 'qr_code' | 'direct';
  timestamp: string;
}

const STORAGE_KEY = 'tf_loc_id';

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
}

export async function sendPageTracking(): Promise<void> {
  const locId = extractLocationId();
  const device = detectDevice();
  const isQr = locId !== null;

  const payload = {
    event: 'page_view',
    locId,
    device,
    source: isQr ? 'qr_code' : 'direct',
    path: window.location.pathname,
    referrer: document.referrer || null,
    timestamp: new Date().toISOString(),
  };

  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Tracking is non-blocking; silently ignore network failures
  }
}
