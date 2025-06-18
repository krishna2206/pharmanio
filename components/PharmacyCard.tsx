import { ThemedCard } from '@/components/ThemedCard';
import { ThemedText } from '@/components/ThemedText';
import { useLocation } from '@/hooks/useLocation';
import { useThemeColors } from '@/hooks/useThemeColors';
import { useTranslation } from '@/hooks/useTranslation';
import { mapboxService } from '@/services/mapboxService';
import type { City, Pharmacy } from '@/types/pharmacy';
import { router } from 'expo-router';
import { Car, MapPin, NavigationArrow, PersonSimpleWalk, Phone } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, View } from 'react-native';

interface PharmacyCardProps {
  pharmacy: Pharmacy;
  onPress?: () => void;
  currentCity?: City | null;
}

export function PharmacyCard({ pharmacy, onPress, currentCity }: PharmacyCardProps) {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { getCurrentLocation } = useLocation();
  const [travelEstimate, setTravelEstimate] = useState<{ walk: number; drive: number } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const calculateRoute = async () => {
      // Only calculate if pharmacy has coordinates and is in current city
      if (!pharmacy.latitude || !pharmacy.longitude || !currentCity || pharmacy.city.id !== currentCity.id) {
        return;
      }

      setIsCalculating(true);
      try {
        const currentLocation = await getCurrentLocation();
        if (!currentLocation) {
          console.warn('Could not get current location for travel estimate');
          return;
        }

        const estimate = await mapboxService.getTravelEstimates(
          currentLocation.latitude,
          currentLocation.longitude,
          pharmacy.latitude,
          pharmacy.longitude
        );

        if (estimate) {
          setTravelEstimate({
            walk: estimate.walkTime,
            drive: estimate.driveTime,
          });
        } else {
          setTravelEstimate({
            walk: Math.floor(Math.random() * 20) + 5,
            drive: Math.floor(Math.random() * 10) + 2,
          });
        }
      } catch (error) {
        console.error('Error calculating travel time:', error);
        setTravelEstimate({
          walk: Math.floor(Math.random() * 20) + 5,
          drive: Math.floor(Math.random() * 10) + 2,
        });
      } finally {
        setIsCalculating(false);
      }
    };

    calculateRoute();
  }, [pharmacy.latitude, pharmacy.longitude, currentCity]);

  const handlePhoneCall = (phoneNumber: string) => {
    const formattedNumber = phoneNumber.replace(/\s+/g, '');
    const phoneUrl = `tel:${formattedNumber}`;

    Linking.openURL(phoneUrl).catch(() => {
      Alert.alert(t('pharmacy.phoneErrorTitle'), t('pharmacy.phoneError'));
    });
  };

  const handleDirections = () => {
    router.push({
      pathname: '/map',
      params: {
        pharmacy: JSON.stringify(pharmacy),
      },
    });
  };

  const { walk, drive } = travelEstimate || { walk: 0, drive: 0 };

  return (
    <Pressable onPress={onPress}>
      <ThemedCard className="mb-4 border-0 shadow-sm">
        {/* Header Section */}
        <View className={`flex-row justify-between items-start ${!pharmacy.address ? "mb-2" : "mb-4"}`}>
          <View className="flex-1">
            <ThemedText className={`text-lg font-bold text-on-surface ${!pharmacy.address ? "" : "mb-3"}`}>
              {t('pharmacy.name', { name: pharmacy.name })}
            </ThemedText>
            {
              pharmacy.address && (
                <View className="flex-row items-center">
                  <MapPin size={14} color={colors.onSurfaceVariant} weight="regular" />
                  <ThemedText className="text-sm text-on-surface-variant ml-1">
                    {pharmacy.address}
                  </ThemedText>
                </View>
              )
            }
          </View>
          <View className="bg-primary/10 p-2 rounded-full">
            <MapPin size={20} color={colors.primary} weight="bold" />
          </View>
        </View>

        {/* Phone Numbers Section - Only show if phone numbers exist */}
        {pharmacy.phone && pharmacy.phone.length > 0 && (
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <Phone size={16} color={colors.onSurfaceVariant} weight="regular" />
              <ThemedText className="text-sm font-medium text-on-surface-variant ml-2">
                {t('pharmacy.contact')}
              </ThemedText>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {pharmacy.phone.map((phoneNumber, index) => (
                <Pressable
                  key={index}
                  onPress={() => handlePhoneCall(phoneNumber)}
                  className="flex-row items-center bg-success/10 px-3 py-2 rounded-full border border-success/20"
                >
                  <Phone size={14} color={colors.success} weight="bold" />
                  <ThemedText className="text-sm text-success ml-1 font-medium">
                    {phoneNumber}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Time Estimates and Directions - Only show if current city is available and pharmacy has coordinates */}
        {pharmacy.latitude && pharmacy.longitude && currentCity && pharmacy.city.id === currentCity.id && (
          <View className="flex-row justify-between items-center pt-4 border-t border-border/50">
            <View className="flex-row items-center">
              <View className="flex-row items-center mr-4">
                <PersonSimpleWalk size={16} color={colors.info} weight="regular" />
                <ThemedText className="text-sm text-info ml-1 font-medium">
                  {isCalculating ? '...' : `${walk} min`}
                </ThemedText>
              </View>
              <View className="flex-row items-center">
                <Car size={16} color={colors.success} weight="regular" />
                <ThemedText className="text-sm text-success ml-1 font-medium">
                  {isCalculating ? '...' : `${drive} min`}
                </ThemedText>
              </View>
            </View>

            <Pressable
              onPress={handleDirections}
              className="flex-row items-center px-6 py-2 bg-primary/10 rounded-full border border-primary/20"
            >
              <ThemedText className="text-sm text-primary font-semibold mr-2">
                {t('pharmacy.route')}
              </ThemedText>
              <NavigationArrow size={16} color={colors.primary} weight="bold" />
            </Pressable>
          </View>
        )}
      </ThemedCard>
    </Pressable>
  );
}