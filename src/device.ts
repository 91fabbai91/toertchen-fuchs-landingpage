/**
 * Device detection utility for TörtchenFuchs
 * Identifies iOS, Android, Desktop, or Other based on User-Agent.
 */

export type DeviceType = 'iOS' | 'Android' | 'Desktop' | 'Other';

export function detectDevice(): DeviceType {
  const ua = (typeof navigator !== 'undefined' && navigator.userAgent) || '';

  if (!ua) {
    return 'Other';
  }

  if (/iphone|ipad|ipod/i.test(ua)) {
    return 'iOS';
  }

  if (/android/i.test(ua)) {
    return 'Android';
  }

  if (/macintosh|mac os x|windows nt|linux/i.test(ua)) {
    return 'Desktop';
  }

  return 'Other';
}
