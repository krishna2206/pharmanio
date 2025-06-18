import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface NetworkState {
  isOnline: boolean;
  isConnected: boolean;
  connectionType: string | null;
  isInitialized: boolean;
  
  setNetworkStatus: (isOnline: boolean, isConnected: boolean, connectionType: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  initialize: () => Promise<void>;
}

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set, get) => ({
      isOnline: true,
      isConnected: true,
      connectionType: null,
      isInitialized: false,

      setNetworkStatus: (isOnline, isConnected, connectionType) => {
        set({ isOnline, isConnected, connectionType });
      },

      setInitialized: (initialized) => {
        set({ isInitialized: initialized });
      },

      initialize: async () => {
        try {
          // Get initial network state
          const netInfoState = await NetInfo.fetch();
          
          set({
            isOnline: netInfoState.isConnected ?? false,
            isConnected: netInfoState.isConnected ?? false,
            connectionType: netInfoState.type,
            isInitialized: true,
          });

          // Subscribe to network state changes
          const unsubscribe = NetInfo.addEventListener(state => {
            set({
              isOnline: state.isConnected ?? false,
              isConnected: state.isConnected ?? false,
              connectionType: state.type,
            });
          });

          // Store unsubscribe function for cleanup
          (get() as any)._unsubscribe = unsubscribe;
        } catch (error) {
          console.error('Failed to initialize network monitoring:', error);
          set({ isInitialized: true });
        }
      },
    }),
    {
      name: 'network-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isOnline: state.isOnline,
        isConnected: state.isConnected,
        connectionType: state.connectionType,
      }),
    }
  )
);