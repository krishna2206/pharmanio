import { useNetworkStore } from '@/stores/useNetworkStore';
import { useEffect } from 'react';

export function useNetwork() {
  const {
    isOnline,
    isConnected,
    connectionType,
    isInitialized,
    initialize,
  } = useNetworkStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  return {
    isOnline,
    isConnected,
    connectionType,
    isInitialized,
    isOffline: !isOnline,
  };
}