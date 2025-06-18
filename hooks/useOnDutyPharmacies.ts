import { useNetwork } from '@/hooks/useNetwork';
import { pharmacyService } from '@/services/pharmacyService';
import { usePharmacyCacheStore } from '@/stores/usePharmacyCacheStore';
import type { PharmacyResponse } from '@/types/pharmacy';
import { useCallback, useEffect, useState } from 'react';

interface UsePharmacyOptions {
  autoFetch?: boolean;
  useCache?: boolean;
}

export function useOnDutyPharmacies(options: UsePharmacyOptions = {}) {
  const { autoFetch = true, useCache = true } = options;
  const { isOnline } = useNetwork();
  const { setCachedData, getCachedData } = usePharmacyCacheStore();
  
  const [pharmacyData, setPharmacyData] = useState<PharmacyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUsingCache, setIsUsingCache] = useState(false);

  const fetchOnDutyPharmacies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsUsingCache(false);

      if (!isOnline && useCache) {
        const cachedData = getCachedData();
        if (cachedData && cachedData.duty_period) {
          setPharmacyData(cachedData);
          setIsUsingCache(true);
          return;
        } else {
          setError('offline_no_cache');
          setPharmacyData(null);
          return;
        }
      }

      const data = await pharmacyService.getOnDutyPharmacies();
      setPharmacyData(data);
      
      if (useCache) {
        setCachedData(data);
      }
    } catch (err: any) {
      console.error('Error fetching pharmacies:', err);
      
      if (useCache) {
        const cachedData = getCachedData();
        if (cachedData) {
          setPharmacyData(cachedData);
          setIsUsingCache(true);
          return;
        }
      }
      
      // Handle different error types based on API response
      if (err?.response?.status === 500) {
        if (err?.response?.data?.detail?.includes('Database error')) {
          setError('database');
        } else {
          setError('server');
        }
      } else if (err?.response?.status >= 400) {
        setError('client');
      } else if (err?.code === 'NETWORK_ERROR' || !err?.response) {
        setError('network');
      } else {
        setError('unknown');
      }
      
      setPharmacyData(null);
    } finally {
      setIsLoading(false);
    }
  }, [isOnline, useCache, getCachedData, setCachedData]);

  // Check for cached data on mount if we're offline
  useEffect(() => {
    if (!isOnline && useCache && autoFetch) {
      const cachedData = getCachedData();
      if (cachedData) {
        setPharmacyData(cachedData);
        setIsUsingCache(true);
      }
    }
  }, [isOnline, useCache, autoFetch, getCachedData]);

  useEffect(() => {
    if (autoFetch && isOnline) {
      fetchOnDutyPharmacies();
    }
  }, [autoFetch, isOnline, fetchOnDutyPharmacies]);

  return {
    pharmacyData,
    pharmacies: pharmacyData?.pharmacies ?? [],
    dutyPeriod: pharmacyData?.duty_period,
    totalCount: pharmacyData?.total_count ?? 0,
    
    isLoading,
    error,
    isUsingCache,
    isOnline,
    
    fetchOnDutyPharmacies,
  };
}