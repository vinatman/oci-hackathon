import { env } from "../config/env.js";

export interface ReverseLocationResult {
  city?: string;
  state?: string;
  country?: string;
  displayName?: string;
  latitude: number;
  longitude: number;
}

interface ReverseGeocodingProvider {
  name: string;
  reverse(latitude: number, longitude: number): Promise<ReverseLocationResult>;
}

const demoCities = [
  { city: "New York", state: "NY", country: "USA", latitude: 40.7128, longitude: -74.006 },
  { city: "San Francisco", state: "CA", country: "USA", latitude: 37.7749, longitude: -122.4194 },
  { city: "Los Angeles", state: "CA", country: "USA", latitude: 34.0522, longitude: -118.2437 },
  { city: "Chicago", state: "IL", country: "USA", latitude: 41.8781, longitude: -87.6298 },
  { city: "Dallas", state: "TX", country: "USA", latitude: 32.7767, longitude: -96.797 },
  { city: "Boston", state: "MA", country: "USA", latitude: 42.3601, longitude: -71.0589 },
  { city: "Seattle", state: "WA", country: "USA", latitude: 47.6062, longitude: -122.3321 },
  { city: "Las Vegas", state: "NV", country: "USA", latitude: 36.1716, longitude: -115.1391 }
];

function coordinateOnly(latitude: number, longitude: number): ReverseLocationResult {
  return { latitude, longitude };
}

function haversineKm(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }) {
  const earthRadiusKm = 6371;
  const dLat = degreesToRadians(to.latitude - from.latitude);
  const dLon = degreesToRadians(to.longitude - from.longitude);
  const lat1 = degreesToRadians(from.latitude);
  const lat2 = degreesToRadians(to.latitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}

class DemoCityReverseGeocodingProvider implements ReverseGeocodingProvider {
  name = "demo-city-reverse-geocoding";

  async reverse(latitude: number, longitude: number) {
    const nearest = demoCities
      .map((city) => ({
        ...city,
        distanceKm: haversineKm({ latitude, longitude }, city)
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)[0];

    if (!nearest || nearest.distanceKm > 75) {
      return coordinateOnly(latitude, longitude);
    }

    return {
      city: nearest.city,
      state: nearest.state,
      country: nearest.country,
      displayName: `${nearest.city}, ${nearest.state}`,
      latitude,
      longitude
    };
  }
}

class CoordinateOnlyReverseGeocodingProvider implements ReverseGeocodingProvider {
  name = "coordinate-only-reverse-geocoding";

  async reverse(latitude: number, longitude: number) {
    return coordinateOnly(latitude, longitude);
  }
}

class NominatimReverseGeocodingProvider implements ReverseGeocodingProvider {
  name = "nominatim-reverse-geocoding";

  async reverse(latitude: number, longitude: number) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), env.REVERSE_GEOCODING_TIMEOUT_MS);
    const params = new URLSearchParams({
      format: "jsonv2",
      lat: String(latitude),
      lon: String(longitude),
      addressdetails: "1"
    });

    try {
      // Nominatim is a free OpenStreetMap service with usage-policy limits. Keep it optional,
      // server-side, timeout-bound, and configured with a real app User-Agent before production use.
      const response = await fetch(`${env.REVERSE_GEOCODING_ENDPOINT}?${params}`, {
        headers: { "User-Agent": env.REVERSE_GEOCODING_USER_AGENT },
        signal: controller.signal
      });

      if (!response.ok) {
        return coordinateOnly(latitude, longitude);
      }

      const data = (await response.json()) as {
        display_name?: string;
        address?: {
          city?: string;
          town?: string;
          village?: string;
          municipality?: string;
          county?: string;
          state?: string;
          country?: string;
        };
      };
      const address = data.address ?? {};
      const city = address.city ?? address.town ?? address.village ?? address.municipality ?? address.county;

      return {
        city,
        state: address.state,
        country: address.country,
        displayName: data.display_name,
        latitude,
        longitude
      };
    } catch {
      return coordinateOnly(latitude, longitude);
    } finally {
      clearTimeout(timeout);
    }
  }
}

function getReverseGeocodingProvider(): ReverseGeocodingProvider {
  if (env.REVERSE_GEOCODING_PROVIDER === "nominatim") {
    return new NominatimReverseGeocodingProvider();
  }
  if (env.REVERSE_GEOCODING_PROVIDER === "none") {
    return new CoordinateOnlyReverseGeocodingProvider();
  }
  return new DemoCityReverseGeocodingProvider();
}

export async function reverseGeocodeLocation(latitude: number, longitude: number) {
  return getReverseGeocodingProvider().reverse(latitude, longitude);
}
