export interface NetlifyEvent {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  body: string | null;
}

export interface NetlifyResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

export interface GeoData {
  city: string | null;
  region: string | null;
  regionCode: string | null;
  country: string | null;
  countryCode: string | null;
  timezone: string | null;
  latitude: number | null;
  longitude: number | null;
  coordinates: string | null;
}

/**
 * Safely decodes and parses Netlify's geolocation header.
 * On Netlify production, `x-nf-geo` is a Base64-encoded JSON string.
 * Also supports direct JSON string parsing for local dev or mocked testing.
 */
export function parseNetlifyGeo(rawGeo: string | undefined): any {
  if (!rawGeo || typeof rawGeo !== 'string') return null;
  const trimmed = rawGeo.trim();
  if (!trimmed) return null;

  // 1. Try decoding Base64 (Netlify production default)
  try {
    const decoded = Buffer.from(trimmed, 'base64').toString('utf8');
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch {
    // Not valid base64 JSON, continue to fallback
  }

  // 2. Try parsing directly as JSON (for local mocks, unit tests, or direct proxies)
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch {
    // Ignore JSON parsing failure
  }

  return null;
}

export async function handler(event: NetlifyEvent): Promise<NetlifyResponse> {
  // CORS Preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    let body: any = {};
    if (event.body) {
      try {
        body = JSON.parse(event.body);
      } catch {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid JSON payload' }),
        };
      }
    }

    // Extract Netlify IP Geo metadata safely without storing raw IP (GDPR compliant)
    const rawGeo = event.headers['x-nf-geo'] || event.headers['X-Nf-Geo'];
    const parsedGeo = parseNetlifyGeo(rawGeo);

    // Extract numeric coordinates
    let lat: number | null = null;
    let lon: number | null = null;

    if (parsedGeo) {
      if (
        typeof parsedGeo.latitude === 'number' &&
        !isNaN(parsedGeo.latitude)
      ) {
        lat = parsedGeo.latitude;
      } else if (parsedGeo.latitude) {
        const parsedLat = parseFloat(String(parsedGeo.latitude));
        if (!isNaN(parsedLat)) lat = parsedLat;
      }

      if (
        typeof parsedGeo.longitude === 'number' &&
        !isNaN(parsedGeo.longitude)
      ) {
        lon = parsedGeo.longitude;
      } else if (parsedGeo.longitude) {
        const parsedLon = parseFloat(String(parsedGeo.longitude));
        if (!isNaN(parsedLon)) lon = parsedLon;
      }
    }

    // Format coordinates string if both lat & lon exist
    const coordinates =
      lat !== null && lon !== null
        ? `${lat.toFixed(4)}, ${lon.toFixed(4)}`
        : null;

    // Use client-reported timezone as fallback if Netlify geo doesn't specify one
    const fallbackTimezone =
      typeof body.clientTimezone === 'string' && body.clientTimezone.trim()
        ? body.clientTimezone.trim().slice(0, 100)
        : null;

    const geoData: GeoData = {
      city: parsedGeo?.city || null,
      region:
        parsedGeo?.subdivision?.name || parsedGeo?.subdivision?.code || null,
      regionCode: parsedGeo?.subdivision?.code || null,
      country: parsedGeo?.country?.name || null,
      countryCode: parsedGeo?.country?.code || null,
      timezone: parsedGeo?.timezone || fallbackTimezone,
      latitude: lat,
      longitude: lon,
      coordinates,
    };

    // Sanitize locId (must be a valid integer or null)
    let sanitizedLocId: number | null = null;
    if (
      typeof body.locId === 'number' &&
      !isNaN(body.locId) &&
      body.locId > 0
    ) {
      sanitizedLocId = Math.floor(body.locId);
    } else if (
      typeof body.locId === 'string' &&
      /^\d+$/.test(body.locId.trim())
    ) {
      sanitizedLocId = parseInt(body.locId.trim(), 10);
    }

    const isQr = sanitizedLocId !== null;

    const outgoingPayload = {
      event: 'page_view',
      locId: sanitizedLocId,
      locLabel: isQr ? `Location #${sanitizedLocId}` : 'Direct Visit',
      device: typeof body.device === 'string' ? body.device : 'Other',
      source: isQr ? 'qr_code' : 'direct',
      geo: geoData,
      path: typeof body.path === 'string' ? body.path.slice(0, 200) : '/',
      referrer:
        typeof body.referrer === 'string' && body.referrer.trim() !== ''
          ? body.referrer.slice(0, 500)
          : 'direct',
      language:
        typeof body.clientLanguage === 'string'
          ? body.clientLanguage.slice(0, 30)
          : null,
      timestamp: body.timestamp || new Date().toISOString(),
    };

    const webhookUrl = process.env.WEBHOOK_URL;

    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'ToertchenFuchs-Telemetry/1.0',
          },
          body: JSON.stringify(outgoingPayload),
          signal: AbortSignal.timeout(4000), // 4s timeout to keep function snappy
        });

        console.log(
          `Webhook dispatched to ${webhookUrl}. Status: ${webhookResponse.status}`
        );
      } catch (err: any) {
        console.error(
          'Failed to forward payload to WEBHOOK_URL:',
          err?.message || err
        );
      }
    } else {
      console.log(
        'WEBHOOK_URL is not configured. Running in mock mode:',
        outgoingPayload
      );
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        tracked: true,
        locId: sanitizedLocId,
        geo: geoData,
        mock: !webhookUrl,
      }),
    };
  } catch (err: any) {
    console.error('Error processing tracking request:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}
