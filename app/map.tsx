import MapboxGL, { Camera, LineLayer, MapView, MarkerView, ShapeSource } from '@rnmapbox/maps';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft, Car,
  CaretDown,
  CaretUp,
  MapPin,
  NavigationArrow,
  PersonSimpleWalk
} from 'phosphor-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Linking, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedButton, ThemedText, ThemedView } from '@/components';
import LoadingScreen from '@/components/LoadingScreen';
import { useLocation } from '@/hooks/useLocation';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslation } from '@/hooks/useTranslation';
import { mapboxService, type RouteStep } from '@/services/mapboxService';
import type { Pharmacy } from '@/types/pharmacy';

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || '');

interface TravelEstimate {
  distance: string;
  duration: string;
}

export default function MapScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { getCurrentLocation, currentLocation, isLoading: isLoadingLocation, error } = useLocation();
  const { language, t } = useTranslation();

  const isMountedRef = useRef(true);
  const mapViewRef = useRef<MapView>(null);
  const cameraRef = useRef<Camera>(null);

  const [isMapReady, setIsMapReady] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState<number[][]>([]);
  const [walkingEstimate, setWalkingEstimate] = useState<TravelEstimate | null>(null);
  const [drivingEstimate, setDrivingEstimate] = useState<TravelEstimate | null>(null);
  const [routeSteps, setRouteSteps] = useState<RouteStep[]>([]);
  const [showInstructions, setShowInstructions] = useState(false);

  const pharmacy: Pharmacy = useMemo(() => {
    return params.pharmacy ? JSON.parse(params.pharmacy as string) : null;
  }, [params.pharmacy]);

  const mapCenter: [number, number] = useMemo(() => {
    if (currentLocation && pharmacy?.latitude && pharmacy?.longitude) {
      return [
        (currentLocation.longitude + pharmacy.longitude) / 2,
        (currentLocation.latitude + pharmacy.latitude) / 2
      ];
    }
    if (pharmacy?.latitude && pharmacy?.longitude) {
      return [pharmacy.longitude, pharmacy.latitude];
    }
    // Default to (Guess where ?)
    return [-21.455766, 47.096050];
  }, [currentLocation, pharmacy?.latitude, pharmacy?.longitude]);

  const handleMapReady = useCallback(() => {
    if (isMountedRef.current) {
      console.log('Map is ready');
      setIsMapReady(true);
    }
  }, []);

  const getDirections = useCallback(() => {
    if (!currentLocation || !pharmacy?.latitude || !pharmacy?.longitude) return;

    const url = Platform.select({
      ios: `maps:saddr=${currentLocation.latitude},${currentLocation.longitude}&daddr=${pharmacy.latitude},${pharmacy.longitude}`,
      android: `google.navigation:q=${pharmacy.latitude},${pharmacy.longitude}`,
      default: `https://maps.google.com/maps?saddr=${currentLocation.latitude},${currentLocation.longitude}&daddr=${pharmacy.latitude},${pharmacy.longitude}`
    });

    Linking.openURL(url);
  }, [currentLocation, pharmacy]);

  // Calculate route when user location is available
  const calculateRoute = useCallback(async () => {
    if (!isMountedRef.current || !currentLocation || !pharmacy?.latitude || !pharmacy?.longitude) return;

    try {
      const [walkingRouteData, estimates] = await Promise.all([
        mapboxService.getWalkingRoute(
          currentLocation.latitude,
          currentLocation.longitude,
          pharmacy.latitude,
          pharmacy.longitude,
          language === 'mg' ? 'fr' : language
        ),
        mapboxService.getTravelEstimates(
          currentLocation.latitude,
          currentLocation.longitude,
          pharmacy.latitude,
          pharmacy.longitude
        )
      ]);

      if (!isMountedRef.current) return;

      if (walkingRouteData) {
        setRouteCoordinates(walkingRouteData.coordinates);
        setRouteSteps(walkingRouteData.steps || []);
        setWalkingEstimate({
          distance: mapboxService.formatDistance(walkingRouteData.distance),
          duration: mapboxService.formatDuration(walkingRouteData.duration)
        });
      } else if (estimates) {
        console.warn('No walking route found, using straight line');
        const coordinates = [
          [currentLocation.longitude, currentLocation.latitude],
          [pharmacy.longitude, pharmacy.latitude]
        ];
        setRouteCoordinates(coordinates);
        setRouteSteps([]);
        setWalkingEstimate({
          distance: `${estimates.walkDistance.toFixed(1)} km`,
          duration: `${estimates.walkTime} min`
        });
      }

      if (estimates && isMountedRef.current) {
        setDrivingEstimate({
          distance: `${estimates.driveDistance.toFixed(1)} km`,
          duration: `${estimates.driveTime} min`
        });
      }
    } catch (error) {
      console.error('Error calculating route:', error);

      if (!isMountedRef.current) return;

      const coordinates = [
        [currentLocation.longitude, currentLocation.latitude],
        [pharmacy.longitude, pharmacy.latitude]
      ];

      setRouteCoordinates(coordinates);

      const estimate = await mapboxService.getTravelEstimates(
        currentLocation.latitude,
        currentLocation.longitude,
        pharmacy.latitude,
        pharmacy.longitude
      );

      if (estimate && isMountedRef.current) {
        setWalkingEstimate({
          distance: `${estimate.walkDistance.toFixed(1)} km`,
          duration: `${estimate.walkTime} min`
        });
        setDrivingEstimate({
          distance: `${estimate.driveDistance.toFixed(1)} km`,
          duration: `${estimate.driveTime} min`
        });
      }
    }
  }, [currentLocation, pharmacy?.latitude, pharmacy?.longitude, language]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!isMountedRef.current) return;

      const location = await getCurrentLocation();
      if (!location && error && isMountedRef.current) {
        Alert.alert(t('map.permissionDenied'), t('map.locationRequired'));
      }
    };

    fetchLocation();
  }, [getCurrentLocation, error, t]);

  useEffect(() => {
    if (isMapReady && currentLocation && pharmacy?.latitude && pharmacy?.longitude) {
      calculateRoute();
    }
  }, [isMapReady, currentLocation, pharmacy?.latitude, pharmacy?.longitude, calculateRoute]);

  if (!pharmacy) {
    return (
      <ThemedView className="flex-1 justify-center items-center">
        <ThemedText>{t('map.invalidPharmacy')}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      {/* Custom Header */}
      <View
        className="bg-surface/95 border-b border-border/50 px-4 py-3 flex-row items-center absolute top-0 left-0 right-0 z-20"
        style={{
          paddingTop: insets.top,
        }}
      >
        <ThemedButton
          variant="surface"
          onPress={() => router.back()}
          className="bg-transparent border-0"
        >
          <ArrowLeft size={24} color={colors.onSurface} />
        </ThemedButton>

        <View className="flex-1 justify-center items-center">
          <ThemedText className="text-lg font-bold text-center">{t('pharmacy.name', { name: pharmacy.name })}</ThemedText>
          {pharmacy.address && (
            <ThemedText className="text-sm text-on-surface-variant text-center mt-1">
              {pharmacy.address}
            </ThemedText>
          )}
        </View>

        <View className="w-12 h-12" />
      </View>

      {/* Map */}
      {isLoadingLocation ? (
        <LoadingScreen />
      ) : (
        <MapView
          ref={mapViewRef}
          style={{ flex: 1 }}
          styleURL={MapboxGL.StyleURL.Street}
          zoomEnabled={true}
          scrollEnabled={true}
          pitchEnabled={false}
          rotateEnabled={false}
          onDidFinishLoadingMap={handleMapReady}
        >
          <Camera
            ref={cameraRef}
            zoomLevel={13}
            centerCoordinate={mapCenter}
            animationMode="flyTo"
            animationDuration={0}
          />

          {/* User Location Marker */}
          {currentLocation && (
            <MarkerView id="user" coordinate={[currentLocation.longitude, currentLocation.latitude]}>
              <View
                className="bg-info border-4 border-white rounded-full"
                style={{
                  width: 24,
                  height: 24,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4
                }}
              />
            </MarkerView>
          )}

          {/* Pharmacy Marker */}
          {pharmacy.latitude && pharmacy.longitude && (
            <MarkerView id="pharmacy" coordinate={[pharmacy.longitude, pharmacy.latitude]}>
              <View
                className="bg-primary border-4 border-white rounded-full items-center justify-center"
                style={{
                  width: 32,
                  height: 32,
                  shadowColor: colors.shadow,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 4
                }}
              >
                <MapPin size={16} color="white" weight="fill" />
              </View>
            </MarkerView>
          )}

          {/* Route Line */}
          {routeCoordinates.length > 0 && (
            <ShapeSource
              id="route"
              shape={{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: routeCoordinates
                }
              }}
            >
              <LineLayer
                id="routeLine"
                style={{
                  lineColor: colors.primary,
                  lineWidth: 4,
                  lineOpacity: 0.8,
                  lineJoin: 'round',
                  lineCap: 'round'
                }}
              />
            </ShapeSource>
          )}
        </MapView>
      )}

      {/* Navigation Instructions Panel */}
      {routeSteps.length > 0 && (
        <View
          className="absolute left-4 right-4"
          style={{
            bottom: insets.bottom + 155,
          }}
        >
          <View className="bg-surface/95 border border-border/30 rounded-2xl overflow-hidden">
            <TouchableOpacity
              onPress={() => setShowInstructions(!showInstructions)}
              className="px-4 py-3 flex-row items-center"
            >
              <View className="w-8 h-8 items-center justify-center mr-3">
                <NavigationArrow size={20} color={colors.primary} />
              </View>

              <View className="flex-1">
                <ThemedText className="text-sm font-semibold" numberOfLines={1}>
                  {routeSteps[0]?.instruction || t('map.startNavigation')}
                </ThemedText>
                {routeSteps[0]?.distance && (
                  <ThemedText className="text-xs text-on-surface-variant mt-1">
                    {mapboxService.formatDistance(routeSteps[0].distance)}
                  </ThemedText>
                )}
              </View>

              <TouchableOpacity
                onPress={() => setShowInstructions(!showInstructions)}
                className="ml-2 px-3 py-1 bg-primary/10 rounded-full flex-row items-center"
              >
                <ThemedText className="text-xs font-semibold text-primary">
                  {showInstructions ? t('map.hide') : t('map.show')}
                </ThemedText>
                {showInstructions ? (
                  <CaretUp size={12} color={colors.primary} style={{ marginLeft: 4 }} />
                ) : (
                  <CaretDown size={12} color={colors.primary} style={{ marginLeft: 4 }} />
                )}
              </TouchableOpacity>
            </TouchableOpacity>

            {showInstructions && (
              <View className="border-t border-border/30">
                <ScrollView
                  className="max-h-64"
                  showsVerticalScrollIndicator={false}
                >
                  {routeSteps.map((step, index) => (
                    <View
                      key={index}
                      className={`px-4 py-3 flex-row items-center ${index !== routeSteps.length - 1 ? 'border-b border-border/20' : ''
                        }`}
                    >
                      <View className="w-8 h-8 items-center justify-center mr-3">
                        <View className="w-6 h-6 bg-primary/10 rounded-full items-center justify-center">
                          <ThemedText className="text-xs font-bold text-primary">
                            {index + 1}
                          </ThemedText>
                        </View>
                      </View>

                      <View className="flex-1">
                        <ThemedText className="text-sm font-medium">
                          {step.instruction}
                        </ThemedText>
                        <View className="flex-row items-center mt-1">
                          <ThemedText className="text-xs text-on-surface-variant">
                            {mapboxService.formatDistance(step.distance)}
                          </ThemedText>
                          <ThemedText className="text-xs text-on-surface-variant mx-2">•</ThemedText>
                          <ThemedText className="text-xs text-on-surface-variant">
                            {mapboxService.formatDuration(step.duration)}
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Floating Travel Info */}
      {(walkingEstimate || drivingEstimate) && (
        <View
          className="absolute left-4 right-4"
          style={{
            bottom: insets.bottom + 75,
          }}
        >
          <View className="bg-surface/95 border border-border/30 px-4 py-3 rounded-2xl">
            <View className="flex-row justify-between items-center">
              <View className="flex-1 items-center">
                <NavigationArrow size={20} color={colors.onSurfaceVariant} />
                <ThemedText className="text-sm font-semibold mt-2">
                  {walkingEstimate?.distance || drivingEstimate?.distance || '--'}
                </ThemedText>
              </View>

              <View className="flex-1 items-center">
                <PersonSimpleWalk size={20} color={colors.onSurfaceVariant} />
                <ThemedText className="text-sm font-semibold mt-2">
                  {walkingEstimate?.duration || '--'}
                </ThemedText>
              </View>

              <View className="flex-1 items-center">
                <Car size={20} color={colors.onSurfaceVariant} />
                <ThemedText className="text-sm font-semibold mt-2">
                  {drivingEstimate?.duration || '--'}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Floating Get Directions Button */}
      {currentLocation && (
        <View
          className="absolute left-4 right-4"
          style={{
            bottom: insets.bottom + 16,
          }}
        >
          <ThemedButton
            variant="primary"
            onPress={getDirections}
            className="flex-row items-center justify-center py-4 rounded-2xl"
          >
            <NavigationArrow size={18} color="white" />
            <ThemedText className="font-semibold text-white ml-2">
              {t('map.getDirections')}
            </ThemedText>
          </ThemedButton>
        </View>
      )}
    </ThemedView>
  );
}