import { pharmacyService } from '@/services/pharmacyService';
import type { PharmacyResponse } from '@/types/pharmacy';
import { useCallback, useEffect, useState } from 'react';

interface UsePharmacyOptions {
  autoFetch?: boolean;
}

export function useOnDutyPharmacies(options: UsePharmacyOptions = {}) {
  const { autoFetch = true } = options;
  
  const [pharmacyData, setPharmacyData] = useState<PharmacyResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOnDutyPharmacies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await pharmacyService.getOnDutyPharmacies();
      setPharmacyData(data);
    } catch (err: any) {
      console.error('Error fetching pharmacies:', err);
      
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
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchOnDutyPharmacies();
    }
  }, [autoFetch, fetchOnDutyPharmacies]);

  return {
    pharmacyData,
    pharmacies: pharmacyData?.pharmacies ?? [],
    dutyPeriod: pharmacyData?.duty_period,
    totalCount: pharmacyData?.total_count ?? 0,
    
    isLoading,
    error,
    
    fetchOnDutyPharmacies,
  };
}