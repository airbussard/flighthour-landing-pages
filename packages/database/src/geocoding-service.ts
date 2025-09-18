// Geocoding Service for converting addresses to coordinates
// Using OpenStreetMap's Nominatim API (free, no API key required)

interface Coordinates {
  lat: number
  lng: number
}

interface GeocodingResult {
  coordinates: Coordinates | null
  displayName?: string
  error?: string
}

// Cache for geocoding results to reduce API calls
const geocodingCache = new Map<string, GeocodingResult>()

export class GeocodingService {
  private static readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
  private static readonly USER_AGENT = 'EventHour/1.0'

  /**
   * Convert a location string (PLZ, city, or address) to coordinates
   * @param location - The location to geocode (e.g., "10115", "Berlin", "10115 Berlin")
   * @param country - Country code (default: "DE" for Germany)
   */
  static async geocode(location: string, country: string = 'DE'): Promise<GeocodingResult> {
    if (!location || location.trim().length === 0) {
      return { coordinates: null, error: 'No location provided' }
    }

    const cacheKey = `${location.toLowerCase()}_${country}`

    // Check cache first
    if (geocodingCache.has(cacheKey)) {
      return geocodingCache.get(cacheKey)!
    }

    try {
      // Build query parameters
      const params = new URLSearchParams({
        q: location,
        format: 'json',
        countrycodes: country,
        limit: '1',
        addressdetails: '1'
      })

      const response = await fetch(`${this.NOMINATIM_URL}?${params}`, {
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.length === 0) {
        const result = {
          coordinates: null,
          error: 'Location not found'
        }
        geocodingCache.set(cacheKey, result)
        return result
      }

      const firstResult = data[0]
      const result: GeocodingResult = {
        coordinates: {
          lat: parseFloat(firstResult.lat),
          lng: parseFloat(firstResult.lon)
        },
        displayName: firstResult.display_name
      }

      // Cache the result
      geocodingCache.set(cacheKey, result)

      return result
    } catch (error) {
      console.error('Geocoding error:', error)
      const result = {
        coordinates: null,
        error: error instanceof Error ? error.message : 'Geocoding failed'
      }
      // Don't cache errors
      return result
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param coord1 - First coordinate
   * @param coord2 - Second coordinate
   * @returns Distance in kilometers
   */
  static calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRad(coord2.lat - coord1.lat)
    const dLng = this.toRad(coord2.lng - coord1.lng)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(coord1.lat)) * Math.cos(this.toRad(coord2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c

    return Math.round(distance * 10) / 10 // Round to 1 decimal place
  }

  /**
   * Convert degrees to radians
   */
  private static toRad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  /**
   * Clear the geocoding cache
   */
  static clearCache(): void {
    geocodingCache.clear()
  }

  /**
   * Get German postal code coordinates from a predefined list
   * This is a fallback for common German postal codes
   */
  static getGermanPostalCodeCoordinates(postalCode: string): Coordinates | null {
    // Common German postal codes with their coordinates
    // This is a small sample - in production, you'd have a complete database
    const germanPostalCodes: Record<string, Coordinates> = {
      '10115': { lat: 52.5340, lng: 13.3850 }, // Berlin Mitte
      '10117': { lat: 52.5167, lng: 13.3833 }, // Berlin Mitte
      '10178': { lat: 52.5200, lng: 13.4050 }, // Berlin Mitte
      '10243': { lat: 52.5150, lng: 13.4550 }, // Berlin Friedrichshain
      '20095': { lat: 53.5511, lng: 10.0000 }, // Hamburg
      '80331': { lat: 48.1351, lng: 11.5820 }, // München
      '50667': { lat: 50.9375, lng: 6.9603 },  // Köln
      '60311': { lat: 50.1109, lng: 8.6821 },  // Frankfurt
      '70173': { lat: 48.7758, lng: 9.1829 },  // Stuttgart
      '40213': { lat: 51.2277, lng: 6.7735 },  // Düsseldorf
      '44137': { lat: 51.5136, lng: 7.4653 },  // Dortmund
      '45127': { lat: 51.4556, lng: 7.0116 },  // Essen
      '28195': { lat: 53.0793, lng: 8.8017 },  // Bremen
    }

    return germanPostalCodes[postalCode] || null
  }

  /**
   * Try to geocode with fallback to postal code database
   */
  static async geocodeWithFallback(location: string, country: string = 'DE'): Promise<GeocodingResult> {
    // Check if it's a German postal code
    const postalCodeMatch = location.match(/^\d{5}$/)
    if (postalCodeMatch && country === 'DE') {
      const coordinates = this.getGermanPostalCodeCoordinates(location)
      if (coordinates) {
        return {
          coordinates,
          displayName: `Postal Code ${location}, Germany`
        }
      }
    }

    // Fall back to regular geocoding
    return this.geocode(location, country)
  }
}