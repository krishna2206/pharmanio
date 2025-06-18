import { MapboxGeocodingFeature, MapboxGeocodingResponse } from '@/types/mapbox';
import { City } from '@/types/pharmacy';
import * as Location from 'expo-location';
import { mapboxService } from './mapboxService';

const MADAGASCAR_CITIES: City[] = [
  { id: 1, name: 'Antananarivo', coordinates: { latitude: -18.91, longitude: 47.525 } },
  { id: 2, name: 'Antsirabe', coordinates: { latitude: -19.866667, longitude: 47.033333 } },
  { id: 3, name: 'Antsiranana', coordinates: { latitude: -12.3, longitude: 49.283333 } },
  { id: 4, name: 'Fianarantsoa', coordinates: { latitude: -21.4379, longitude: 47.1021 } },
  { id: 5, name: 'Mahajanga', coordinates: { latitude: -15.716667, longitude: 46.316667 } },
  { id: 6, name: 'Toamasina', coordinates: { latitude: -18.155, longitude: 49.41 } },
  { id: 7, name: 'Toliara', coordinates: { latitude: -23.35, longitude: 43.666667 } },
];

const REGION_TO_CITY_MAPPING: Record<string, string> = {
  'vakinankaratra': 'Antsirabe',
  'analamanga': 'Antananarivo',
  'diana': 'Antsiranana',
  'haute matsiatra': 'Fianarantsoa',
  'boeny': 'Mahajanga',
  'atsinanana': 'Toamasina',
  'atsimo-andrefana': 'Toliara',
  'atsimo andrefana': 'Toliara',
  'antananarivo': 'Antananarivo',
  'antsirabe': 'Antsirabe',
  'antsiranana': 'Antsiranana',
  'fianarantsoa': 'Fianarantsoa',
  'mahajanga': 'Mahajanga',
  'toamasina': 'Toamasina',
  'toliara': 'Toliara',
} as const;

const CITY_ALIASES: Record<string, string> = {
  'tananarive': 'Antananarivo',
  'tana': 'Antananarivo',
  'diego suarez': 'Antsiranana',
  'diego-suarez': 'Antsiranana',
  'tamatave': 'Toamasina',
  'majunga': 'Mahajanga',
  'tulear': 'Toliara',
  'fort dauphin': 'Toliara'
} as const;

const EARTH_RADIUS_KM = 6371;

class CityService {
  private static instance: CityService;

  static getInstance(): CityService {
    if (!CityService.instance) {
      CityService.instance = new CityService();
    }
    return CityService.instance;
  }

  async getCurrentCityFromLocation(): Promise<City | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (!location) {
        return null;
      }

      const city = await this.getCityFromCoordinates(
        location.coords.latitude,
        location.coords.longitude
      );
      
      return city;
    } catch (err) {
      console.error('Error getting city from location:', err);
      return null;
    }
  }

  async getCityFromCoordinates(latitude: number, longitude: number): Promise<City | null> {
    try {
      let cityName: string | null = null;
      let matchedCity: City | null = null;

      const mapboxResponse = await mapboxService.reverseGeocode(
        latitude,
        longitude,
        {
          country: 'mg',
          types: ['region'],
          language: 'fr',
          limit: 3,
        }
      );

      if (mapboxResponse) {
        cityName = this.extractCityFromGeocodingResponse(mapboxResponse);
        console.log(`Mapbox extracted city name :`, cityName);
        
        if (cityName) {
          matchedCity = this.findCityByName(cityName);
          if (matchedCity) {
            return matchedCity;
          }
        }
      }

      console.log('Using distance-based city detection');
      const nearestCity = this.findNearestCity(latitude, longitude);
      if (nearestCity) {
        console.log(`Found nearest city: ${nearestCity.name}`);
      }
      return nearestCity;
    } catch (error) {
      console.error('Error getting city from coordinates:', error);
      return this.findNearestCity(latitude, longitude);
    }
  }

  private extractCityFromGeocodingResponse(response: MapboxGeocodingResponse): string | null {
    if (!response?.features?.length) {
      return null;
    }

    for (const feature of response.features) {
      const cityName = this.extractCityNameFromFeature(feature);
      if (cityName) {
        return cityName;
      }
    }

    // Fallback to first feature's raw name
    return response.features[0]?.properties?.name || null;
  }

  private extractCityNameFromFeature(feature: MapboxGeocodingFeature): string | null {
    if (!feature.properties) return null;

    const possibleNames = this.getPossibleNamesFromProperties(feature.properties);
    
    for (const name of possibleNames) {
      const cityName = this.findCityNameFromString(name);
      if (cityName) {
        return cityName;
      }
    }

    return null;
  }

  private getPossibleNamesFromProperties(properties: NonNullable<MapboxGeocodingFeature['properties']>): string[] {
    return [
      properties.name,
      properties.name_preferred,
      properties.text,
      properties.place_name,
      properties.context?.region?.name,
      properties.context?.place?.name,
      properties.context?.district?.name,
    ].filter((name): name is string => Boolean(name));
  }

  private findCityNameFromString(name: string): string | null {
    const normalizedName = name.toLowerCase().trim();
    
    // Check region mapping
    const mappedCity = REGION_TO_CITY_MAPPING[normalizedName];
    if (mappedCity) {
      console.log(`Mapped region "${name}" to city "${mappedCity}"`);
      return mappedCity;
    }

    // Check direct match
    const directMatch = MADAGASCAR_CITIES.find(city => 
      city.name.toLowerCase() === normalizedName
    );
    if (directMatch) {
      console.log(`Direct match found: "${name}"`);
      return directMatch.name;
    }

    return null;
  }

  private findCityByName(cityName: string): City | null {
    const normalizedName = cityName.toLowerCase().trim();
    
    let matchedCity = MADAGASCAR_CITIES.find(city => 
      city.name.toLowerCase() === normalizedName ||
      city.name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(city.name.toLowerCase())
    );
    
    if (matchedCity) return matchedCity;
    
    const alias = CITY_ALIASES[normalizedName];
    if (alias) {
      return MADAGASCAR_CITIES.find(city => city.name === alias) || null;
    }
    
    return null;
  }

  private findNearestCity(latitude: number, longitude: number): City | null {
    if (MADAGASCAR_CITIES.length === 0) return null;

    let nearestCity = MADAGASCAR_CITIES[0];
    let minDistance = this.calculateDistance(
      latitude, 
      longitude, 
      nearestCity.coordinates.latitude, 
      nearestCity.coordinates.longitude
    );

    for (const city of MADAGASCAR_CITIES) {
      const distance = this.calculateDistance(
        latitude, 
        longitude, 
        city.coordinates.latitude, 
        city.coordinates.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    }

    console.log(`Nearest city: ${nearestCity.name} (${minDistance.toFixed(2)}km away)`);
    return nearestCity;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const cityService = CityService.getInstance();