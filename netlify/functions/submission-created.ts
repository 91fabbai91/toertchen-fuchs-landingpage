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
  // Only accept POST requests from Netlify Form submission pipeline
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    let payload: any = {};
    if (event.body) {
      try {
        payload = JSON.parse(event.body);
      } catch {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid JSON payload' }),
        };
      }
    }

    // Support both root payload and nested payload structures
    const submission = payload.payload || payload;
    const data = submission.data || {};

    // Sanitize locId
    let sanitizedLocId: number | null = null;
    const rawLocId = data['loc-id'] ?? data.locId;
    if (typeof rawLocId === 'number' && !isNaN(rawLocId) && rawLocId > 0) {
      sanitizedLocId = Math.floor(rawLocId);
    } else if (typeof rawLocId === 'string' && /^\d+$/.test(rawLocId.trim())) {
      sanitizedLocId = parseInt(rawLocId.trim(), 10);
    }

    const isQr = sanitizedLocId !== null;

    // Parse coordinates if available
    let lat: number | null = null;
    let lon: number | null = null;
    if (data.geo_latitude) {
      const parsed = parseFloat(String(data.geo_latitude));
      if (!isNaN(parsed)) lat = parsed;
    }
    if (data.geo_longitude) {
      const parsed = parseFloat(String(data.geo_longitude));
      if (!isNaN(parsed)) lon = parsed;
    }

    const coordinates =
      data.geo_coordinates ||
      (lat !== null && lon !== null
        ? `${lat.toFixed(4)}, ${lon.toFixed(4)}`
        : null);

    // Extract photo URL (Netlify Forms attaches uploaded photo metadata)
    let photoUrl: string | null = null;
    if (data.photo && typeof data.photo === 'object' && data.photo.url) {
      photoUrl = data.photo.url;
    } else if (
      typeof data.photo === 'string' &&
      data.photo.startsWith('http')
    ) {
      photoUrl = data.photo;
    }

    const outgoingPayload = {
      event: 'guestbook_submission',
      formName: submission.form_name || data['form-name'] || 'contact',
      name: typeof data.name === 'string' ? data.name.trim() : '',
      email:
        typeof data.email === 'string' && data.email.trim()
          ? data.email.trim()
          : null,
      qrLocation:
        typeof data.qr_location === 'string' && data.qr_location.trim()
          ? data.qr_location.trim()
          : null,
      message: typeof data.message === 'string' ? data.message.trim() : '',
      photoUrl,
      locId: sanitizedLocId,
      locLabel: isQr ? `Location #${sanitizedLocId}` : 'Direct Visit (No QR)',
      source: isQr ? 'qr_code' : 'direct',
      device:
        typeof data.device === 'string' && data.device.trim()
          ? data.device.trim()
          : 'Other',
      geo: {
        city: data.geo_city || null,
        region: data.geo_region || null,
        country: data.geo_country || null,
        countryCode: data.geo_country_code || null,
        timezone: data.geo_timezone || null,
        latitude: lat,
        longitude: lon,
        coordinates,
      },
      ip: data.ip || null,
      userAgent: data.user_agent || null,
      referrer:
        typeof data.referrer === 'string' && data.referrer.trim()
          ? data.referrer.trim()
          : 'direct',
      submittedAt: submission.created_at || new Date().toISOString(),
    };

    const webhookUrl = process.env.WEBHOOK_URL;

    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        const webhookResponse = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'ToertchenFuchs-Guestbook/1.0',
          },
          body: JSON.stringify(outgoingPayload),
          signal: AbortSignal.timeout(5000),
        });

        console.log(
          `Guestbook webhook dispatched to ${webhookUrl}. Status: ${webhookResponse.status}`
        );
      } catch (err: any) {
        console.error(
          'Failed to forward guestbook submission to WEBHOOK_URL:',
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
      },
      body: JSON.stringify({
        success: true,
        received: true,
        formName: outgoingPayload.formName,
      }),
    };
  } catch (err: any) {
    console.error('Error processing guestbook submission:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
}
