export interface TravelEstimate {
  walkTime: number; // in minutes
  driveTime: number; // in minutes
  walkDistance: number; // in kilometers
  driveDistance: number; // in kilometers
}

export interface RouteStep {
  instruction: string;
  distance: number; // in meters
  duration: number; // in seconds
  maneuver: {
    type: string;
    modifier?: string;
    bearing_after?: number;
    bearing_before?: number;
    location: [number, number];
  };
}

export interface RouteData {
  coordinates: number[][];
  distance: number; // in meters
  duration: number; // in seconds
  steps?: RouteStep[];
}

class MapboxService {
  private readonly accessToken: string;
  private readonly baseUrl: string;
  private readonly directionsApiUrl: string;

  constructor() {
    this.accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || '';
    this.baseUrl = process.env.EXPO_PUBLIC_MAPBOX_BASE_URL || 'https://api.mapbox.com';
    this.directionsApiUrl = `${this.baseUrl}/directions/v5/mapbox`;
    
    if (!this.accessToken) {
      console.warn('Mapbox access token not found');
    }
  }

  private async calculateRoute(
    fromLng: number,
    fromLat: number,
    toLng: number,
    toLat: number,
    profile: 'walking' | 'driving'
  ): Promise<RouteData | null> {
    if (!this.accessToken) {
      console.warn('Mapbox access token not available');
      return null;
    }

    try {
      const url = `${this.directionsApiUrl}/${profile}/${fromLng},${fromLat};${toLng},${toLat}?geometries=geojson&steps=true&voice_instructions=true&access_token=${this.accessToken}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        console.error('Mapbox API error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        console.warn('No routes found in Mapbox response');
        return null;
      }

      const route = data.routes[0];
      const steps = route.legs?.[0]?.steps?.map((step: any) => ({
        instruction: step.maneuver.instruction || step.name || 'Continue',
        distance: step.distance,
        duration: step.duration,
        maneuver: {
          type: step.maneuver.type,
          modifier: step.maneuver.modifier,
          bearing_after: step.maneuver.bearing_after,
          bearing_before: step.maneuver.bearing_before,
          location: step.maneuver.location,
        },
      })) || [];

      return {
        coordinates: route.geometry.coordinates,
        distance: route.distance,
        duration: route.duration,
        steps,
      };
    } catch (error) {
      console.error(`Error calculating ${profile} route:`, error);
      return null;
    }
  }

  async getTravelEstimates(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number
  ): Promise<TravelEstimate | null> {
    try {
      const [walkingRoute, drivingRoute] = await Promise.all([
        this.calculateRoute(fromLng, fromLat, toLng, toLat, 'walking'),
        this.calculateRoute(fromLng, fromLat, toLng, toLat, 'driving'),
      ]);

      if (walkingRoute && drivingRoute) {
        return {
          walkTime: Math.round(walkingRoute.duration / 60),
          driveTime: Math.round(drivingRoute.duration / 60),
          walkDistance: walkingRoute.distance / 1000,
          driveDistance: drivingRoute.distance / 1000,
        };
      }

      // Fallback to distance-based calculation if API fails
      const fallbackEstimate = this.calculateFallbackEstimate(fromLat, fromLng, toLat, toLng);
      return fallbackEstimate;
    } catch (error) {
      console.error('Error getting travel estimates:', error);
      return this.calculateFallbackEstimate(fromLat, fromLng, toLat, toLng);
    }
  }

  async getWalkingRoute(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
    language: string = 'fr'
  ): Promise<RouteData | null> {
    try {
      
      const response = await fetch(
        `${this.directionsApiUrl}/walking/${startLng},${startLat};${endLng},${endLat}?` +
        `steps=true&geometries=geojson&access_token=${this.accessToken}&` +
        `language=${language}`
      );

      if (!response.ok) {
        console.error('Mapbox API error:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        console.warn('No routes found in Mapbox response');
        return null;
      }

      const route = data.routes[0];
      const steps = route.legs?.[0]?.steps?.map((step: any) => ({
        instruction: step.maneuver.instruction || step.name || 'Continue',
        distance: step.distance,
        duration: step.duration,
        maneuver: {
          type: step.maneuver.type,
          modifier: step.maneuver.modifier,
          bearing_after: step.maneuver.bearing_after,
          bearing_before: step.maneuver.bearing_before,
          location: step.maneuver.location,
        },
      })) || [];

      return {
        coordinates: route.geometry.coordinates,
        distance: route.distance,
        duration: route.duration,
        steps,
      };
    } catch (error) {
      console.error('Error fetching walking route:', error);
      return null;
    }
  }

  async getDrivingRoute(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number
  ): Promise<RouteData | null> {
    return this.calculateRoute(fromLng, fromLat, toLng, toLat, 'driving');
  }

  /**
   * Fallback calculation using Haversine formula
   */
  private calculateFallbackEstimate(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number
  ): TravelEstimate {
    const distance = this.calculateHaversineDistance(fromLat, fromLng, toLat, toLng);
    
    // Walking speed: ~4 km/h, Driving speed: ~30 km/h in city
    const walkTime = Math.round(distance * 15); // 15 minutes per km
    const driveTime = Math.round(distance * 2); // 2 minutes per km

    return {
      walkTime: Math.max(walkTime, 1), // Minimum 1 minute
      driveTime: Math.max(driveTime, 1), // Minimum 1 minute
      walkDistance: distance,
      driveDistance: distance,
    };
  }

  private calculateHaversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Format duration from seconds to human-readable string
   */
  formatDuration(seconds: number): string {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  }

  /**
   * Format distance from meters to human-readable string
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    const kilometers = meters / 1000;
    return `${kilometers.toFixed(1)} km`;
  }

  /**
   * Get the appropriate icon name for a maneuver type
   */
  getManeuverIcon(maneuverType: string, modifier?: string): string {
    const type = maneuverType.toLowerCase();
    const mod = modifier?.toLowerCase();

    switch (type) {
      case 'depart':
        return 'arrow-up';
      case 'turn':
        if (mod === 'left') return 'arrow-bend-left-up';
        if (mod === 'right') return 'arrow-bend-right-up';
        if (mod === 'sharp left') return 'arrow-elbow-left';
        if (mod === 'sharp right') return 'arrow-elbow-right';
        if (mod === 'slight left') return 'arrow-bend-left-up';
        if (mod === 'slight right') return 'arrow-bend-right-up';
        return 'arrow-up';
      case 'new way':
      case 'continue':
        return 'arrow-up';
      case 'arrive':
        return 'map-pin';
      case 'roundabout':
      case 'rotary':
        return 'arrow-clockwise';
      case 'roundabout turn':
        if (mod === 'left') return 'arrow-counter-clockwise';
        return 'arrow-clockwise';
      case 'merge':
        return 'arrow-fat-up';
      case 'on ramp':
      case 'off ramp':
        return 'arrow-bend-right-up';
      case 'fork':
        return 'arrow-fat-up';
      default:
        return 'arrow-up';
    }
  }
}

export const mapboxService = new MapboxService();