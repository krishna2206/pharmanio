import { useLocationPermissions } from '@/contexts/PermissionContext';
import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface UseLocationReturn {
  currentLocation: LocationCoordinates | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<LocationCoordinates | null>;
  requestPermission: () => Promise<boolean>;
}

export function useLocation(): UseLocationReturn {
  const { hasLocationPermission, requestLocationPermission } = useLocationPermissions();
  
  const [currentLocation, setCurrentLocation] = useState<LocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setError(null);
      const granted = await requestLocationPermission();
      if (!granted) {
        setError('Location permission denied');
      }
      return granted;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request location permission';
      setError(errorMessage);
      return false;
    }
  }, [requestLocationPermission]);

  const getCurrentLocation = useCallback(async (): Promise<LocationCoordinates | null> => {
    try {
      setIsLoading(true);
      setError(null);

      // Check permission first
      if (!hasLocationPermission) {
        const granted = await requestPermission();
        if (!granted) {
          return null;
        }
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
      });

      const coordinates: LocationCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setCurrentLocation(coordinates);
      return coordinates;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get current location';
      console.error('Error getting current location:', err);
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [hasLocationPermission, requestPermission]);

  return {
    currentLocation,
    isLoading,
    error,
    getCurrentLocation,
    requestPermission,
  };
}