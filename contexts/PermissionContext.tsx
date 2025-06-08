import * as Device from 'expo-device';
import * as Location from 'expo-location';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface PermissionContextType {
  locationPermissionStatus: Location.PermissionStatus | null;
  isRequestingPermission: boolean;
  hasLocationPermission: boolean;
  requestLocationPermission: () => Promise<boolean>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

interface PermissionProviderProps {
  children: ReactNode;
}

const isAndroidEmulator = Platform.OS === 'android' && !Device.isDevice;

export function PermissionProvider({ children }: PermissionProviderProps) {
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (!isAndroidEmulator) {
      try {
        setIsRequestingPermission(true);

        const { status } = await Location.requestForegroundPermissionsAsync();
        setLocationPermissionStatus(status);
        const hasPermission = status === 'granted';
        setHasLocationPermission(hasPermission);

        return true;
      } catch (error) {
        console.error("Failed to request location permission : ", error);
        return false;
      } finally {
        setIsRequestingPermission(false);
      }
    } else {
      console.warn("Cannot ask permission on Android emulator");
      return false;
    }
  };

  // Check permission status on mount
  useEffect(() => {
    const checkPermissionStatus = async () => {
      if (!isAndroidEmulator) {
        try {
          const { status } = await Location.getForegroundPermissionsAsync();
          setLocationPermissionStatus(status);
          const hasPermission = status === 'granted';
          setHasLocationPermission(hasPermission);

          if (status !== 'granted') {
            await requestLocationPermission();
          }
        } catch (error) {
          console.error("Failed to check permission on initialization:", error);
        }
      }
    };

    checkPermissionStatus();
  }, []);

  const value: PermissionContextType = {
    locationPermissionStatus,
    isRequestingPermission,
    requestLocationPermission,
    hasLocationPermission,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function useLocationPermissions() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('useLocationPermissions must be used within a PermissionProvider');
  }
  return context;
}

// Export the static value if components need it
export { isAndroidEmulator };
