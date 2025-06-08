import { City } from '@/types/pharmacy';
import * as Location from 'expo-location';

const MADAGASCAR_CITIES: City[] = [
  { id: 1, name: 'Antananarivo', coordinates: { latitude: -18.8792, longitude: 47.5079 } },
  { id: 4, name: 'Fianarantsoa', coordinates: { latitude: -21.4379, longitude: 47.1021 } },
  { id: 5, name: 'Mahajanga', coordinates: { latitude: -15.7167, longitude: 46.3167 } },
  { id: 6, name: 'Toamasina', coordinates: { latitude: -18.1492, longitude: 49.4028 } },
  { id: 7, name: 'Toliara', coordinates: { latitude: -23.3540, longitude: 43.6720 } },
];

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
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return null;
      }

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
      // Try reverse geocoding first
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        const cityName = address.city || address.subregion || address.region;
        
        if (cityName) {
          // Try to match with known Madagascar cities
          const matchedCity = this.findCityByName(cityName);
          if (matchedCity) {
            return matchedCity;
          }
        }
      }

      // Fallback: Find nearest city by distance
      return this.findNearestCity(latitude, longitude);
    } catch (error) {
      console.error('Error getting city from coordinates:', error);
      return this.findNearestCity(latitude, longitude);
    }
  }

  // Find city by name (case insensitive)
  private findCityByName(cityName: string): City | null {
    const normalizedName = cityName.toLowerCase();
    return MADAGASCAR_CITIES.find(city => 
      city.name.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(city.name.toLowerCase())
    ) || null;
  }

  // Find the nearest city by calculating distances
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

    return nearestCity;
  }

  // Calculate distance between two coordinates using Haversine formula
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export const cityService = CityService.getInstance();