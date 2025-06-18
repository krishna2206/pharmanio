import { WarningCircle } from 'phosphor-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';

import { PharmacyCard, ThemedText, ThemedView } from "@/components";
import LoadingScreen from "@/components/LoadingScreen";
import { useLocationPermissions } from "@/contexts/PermissionContext";
import { useThemeColors } from "@/hooks";
import { useNetwork } from '@/hooks/useNetwork';
import { useOnDutyPharmacies } from "@/hooks/useOnDutyPharmacies";
import { useTranslation } from "@/hooks/useTranslation";
import { cityService } from '@/services/cityService';
import type { City, Pharmacy } from "@/types/pharmacy";

export default function HomeScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { isRequestingPermission, hasLocationPermission } = useLocationPermissions();
  const { isOnline, isOffline } = useNetwork();
  const {
    pharmacyData,
    pharmacies,
    dutyPeriod,
    isLoading,
    error,
    isUsingCache,
    fetchOnDutyPharmacies,
  } = useOnDutyPharmacies({ useCache: true });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentCity, setCurrentCity] = useState<City | null>(null);

  useEffect(() => {
    const getCurrentCity = async () => {
      try {
        if (!isOnline) {
          setCurrentCity(null);
          return;
        }

        const city = await cityService.getCurrentCityFromLocation();
        setCurrentCity(city);
      } catch (err) {
        console.error('Error getting current city:', err);
        setCurrentCity(null);
      }
    };

    if (hasLocationPermission) {
      getCurrentCity();
    } else {
      setCurrentCity(null);
    }
  }, [hasLocationPermission, isOnline]);

  const groupedPharmacies = useMemo(() => {
    const groups: { [cityName: string]: Pharmacy[] } = {};

    pharmacies.forEach((pharmacy) => {
      const cityName = pharmacy.city.name;
      if (!groups[cityName]) {
        groups[cityName] = [];
      }
      groups[cityName].push(pharmacy);
    });

    // Convert to array and sort cities - prioritize user's city first
    return Object.entries(groups)
      .sort(([cityA], [cityB]) => {
        if (currentCity) {
          if (cityA === currentCity.name) return -1;
          if (cityB === currentCity.name) return 1;
        }
        return cityA.localeCompare(cityB);
      })
      .flatMap(([cityName, cityPharmacies]) => [
        { type: 'header', cityName, id: `header-${cityName}` },
        ...cityPharmacies.map(pharmacy => ({ type: 'pharmacy', pharmacy, id: pharmacy.id }))
      ]);
  }, [pharmacies, currentCity]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const getErrorMessage = () => {
    switch (error) {
      case 'database':
        return {
          title: t('home.error.database.title'),
          message: t('home.error.database.message')
        };
      case 'server':
        return {
          title: t('home.error.server.title'),
          message: t('home.error.server.message')
        };
      case 'network':
        return {
          title: t('home.error.network.title'),
          message: t('home.error.network.message')
        };
      case 'client':
        return {
          title: t('home.error.client.title'),
          message: t('home.error.client.message')
        };
      case 'offline_no_cache':
        return {
          title: t('home.error.offline_no_cache.title'),
          message: t('home.error.offline_no_cache.message')
        };
      default:
        return {
          title: t('home.error.unknown.title'),
          message: t('home.error.unknown.message')
        };
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOnDutyPharmacies();
    setIsRefreshing(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'header') {
      const headerText = currentCity && item.cityName === currentCity.name
        ? t('home.userLocation')
        : item.cityName;

      return (
        <ThemedView className="mb-3 mt-6 first:mt-0">
          <ThemedText className="text-xl font-bold text-on-surface">
            {headerText}
          </ThemedText>
        </ThemedView>
      );
    }

    return (
      <PharmacyCard
        pharmacy={item.pharmacy}
        currentCity={currentCity}
      />
    );
  };

  const renderHeader = () => {
    return (
      <ThemedView className="mb-6">
        {/* Location Permission Request */}
        {!hasLocationPermission && (
          <ThemedView className="bg-warning/10 border border-warning rounded-lg p-4 mb-4">
            <View className="flex-row items-center justify-center mb-2 px-4">
              <WarningCircle size={24} color={colors.warning} />
              <ThemedText className="text-warning text-center font-medium">
                {t('home.permission.message')}
              </ThemedText>
            </View>
          </ThemedView>
        )}

        <ThemedView className="flex-row justify-between items-center mb-4">
          {dutyPeriod && (
            <ThemedText className="text-2xl font-bold text-on-surface flex-1 text-center">
              {t('home.pharmaciesOnDuty', {
                startDate: formatDate(dutyPeriod.start_date),
                endDate: formatDate(dutyPeriod.end_date)
              })}
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>
    );
  };

  const OfflineIndicator = () => {
    if (isOnline && !isUsingCache) return null;

    return (
      <View className="bg-warning/20 border-warning border p-4 mb-4 rounded-lg flex-row items-center">
        <WarningCircle size={16} color={colors.warning} />
        <ThemedText className="text-warning text-sm flex-1 ml-2">
          {isOffline
            ? t('home.offline.message')
            : t('home.error.network_using_cache.message')
          }
        </ThemedText>
      </View>
    );
  };

  if (isRequestingPermission || isLoading) {
    return <LoadingScreen />
  }

  // Error screen
  if (error && !pharmacyData && error) {
    const errorMessage = getErrorMessage();
    return (
      <ThemedView className="flex-1 justify-center items-center p-6">
        <View className="mb-4">
          <WarningCircle size={64} color={colors.error} />
        </View>
        <ThemedText className="text-xl font-bold text-error text-center mb-4">
          {errorMessage.title}
        </ThemedText>
        <ThemedText className="text-base text-on-surface-variant text-center mb-6">
          {errorMessage.message}
        </ThemedText>
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
        />
      </ThemedView>
    );
  }

  // List empty
  if (pharmacies.length === 0) {
    return (
      <ThemedView className="flex-1 justify-center items-center p-6">
        <ThemedText className="text-xl font-bold text-on-surface text-center mb-4">
          {t('home.empty.title')}
        </ThemedText>
        <ThemedText className="text-base text-on-surface-variant text-center">
          {t('home.empty.message')}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <FlatList
        data={groupedPharmacies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <>
            {renderHeader()}
            <OfflineIndicator />
          </>
        }
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      />
      <View style={{ height: 70 }} />
    </ThemedView>
  );
}