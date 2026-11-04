/**
 * Автоматическое определение города посетителя по IP (для аналитики в Telegram)
 */

export interface VisitorLocation {
  city?: string;
  region?: string;
  country?: string;
  ip?: string;
  isp?: string;
}

let cachedLocation: VisitorLocation | null = null;
let isFetching = false;

export async function getVisitorLocation(): Promise<VisitorLocation | null> {
  if (cachedLocation) return cachedLocation;
  if (isFetching) return null;

  isFetching = true;
  try {
    // Бесплатный сервис геолокации по IP без ключей
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('https://freeipapi.com/api/json', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      cachedLocation = {
        city: data.cityName || data.city,
        region: data.regionName || data.region,
        country: data.countryName || 'Беларусь',
        ip: data.ipAddress,
      };
      return cachedLocation;
    }
  } catch {
    // В случае ошибки или таймаута пробуем резервный метод
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('https://ipwho.is/', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        cachedLocation = {
          city: data.city,
          region: data.region,
          country: data.country,
          isp: data.connection?.isp,
        };
        return cachedLocation;
      }
    } catch {
      // Игнорируем сетевые ограничения
    }
  } finally {
    isFetching = false;
  }

  return null;
}
