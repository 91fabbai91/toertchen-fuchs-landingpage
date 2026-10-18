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
    let geoData: {
      city: string | null;
      region: string | null;
      country: string | null;
    } = {
      city: null,
      region: null,
      country: null,
    };

    const rawGeo = event.headers['x-nf-geo'];
    if (rawGeo) {
      try {
        const parsed = JSON.parse(rawGeo);
        geoData = {
          city: parsed.city || null,
          region: parsed.subdivision?.name || null,
          country: parsed.country?.name || parsed.country?.code || null,
        };
      } catch {
        // Ignore JSON parsing failure
      }
    }

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

    const outgoingPayload = {
      event: 'page_view',
      locId: sanitizedLocId,
      device: typeof body.device === 'string' ? body.device : 'Other',
      source: sanitizedLocId !== null ? 'qr_code' : 'direct',
      geo: geoData,
      path: typeof body.path === 'string' ? body.path.slice(0, 200) : '/',
      referrer:
        typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : null,
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
