import type { Pharmacy, PharmacyResponse } from '@/types/pharmacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface PharmacyCacheState {
  cachedPharmacies: Pharmacy[];
  cachedDutyPeriod: PharmacyResponse['duty_period'];
  cachedTotalCount: number;
  cachedPharmacyIds: number[];
  lastUpdated: string | null;
  
  setCachedData: (data: PharmacyResponse) => void;
  getCachedData: () => { 
    pharmacies: Pharmacy[]; 
    duty_period: PharmacyResponse['duty_period']; 
    total_count: number;
    pharmacy_ids: number[];
  } | PharmacyResponse | null;
  clearCache: () => void;
}

export const usePharmacyCacheStore = create<PharmacyCacheState>()(
  persist(
    (set, get) => ({
      cachedPharmacies: [],
      cachedDutyPeriod: {
        start_date: "",
        end_date: "",
        created_at: "",
        updated_at: "",
      },
      cachedTotalCount: 0,
      cachedPharmacyIds: [],
      lastUpdated: null,

      setCachedData: (data: PharmacyResponse) => {
        set({
          cachedPharmacies: data.pharmacies,
          cachedDutyPeriod: data.duty_period,
          cachedTotalCount: data.total_count,
          cachedPharmacyIds: data.pharmacy_ids,
          lastUpdated: new Date().toISOString(),
        });
      },

      getCachedData: () => {
        const state = get();
        
        return {
          duty_period: state.cachedDutyPeriod,
          pharmacies: state.cachedPharmacies,
          total_count: state.cachedTotalCount,
          pharmacy_ids: state.cachedPharmacyIds
        };
      },

      clearCache: () => {
        set({
          cachedPharmacies: [],
          cachedDutyPeriod: {
            start_date: "",
            end_date: "",
            created_at: "",
            updated_at: "",
          },
          cachedTotalCount: 0,
          cachedPharmacyIds: [],
          lastUpdated: null,
        });
      },
    }),
    {
      name: 'pharmacy-cache-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);