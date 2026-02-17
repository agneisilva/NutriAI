import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type NetworkContextValue = {
  isOffline: boolean;
  lastCheckedAt: Date;
};

const NetworkContext = createContext<NetworkContextValue | undefined>(undefined);

type NetworkProviderProps = {
  children: React.ReactNode;
};

function toOffline(state: NetInfoState): boolean {
  if (!state.isConnected) {
    return true;
  }

  if (state.isInternetReachable === false) {
    return true;
  }

  return false;
}

export function NetworkProvider({ children }: NetworkProviderProps) {
  const [isOffline, setIsOffline] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState(new Date());

  useEffect(() => {
    const syncState = (state: NetInfoState) => {
      setIsOffline(toOffline(state));
      setLastCheckedAt(new Date());
    };

    const unsubscribe = NetInfo.addEventListener(syncState);
    void NetInfo.fetch().then(syncState);

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      isOffline,
      lastCheckedAt,
    }),
    [isOffline, lastCheckedAt],
  );

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  const context = useContext(NetworkContext);

  if (!context) {
    throw new Error('useNetwork deve ser usado dentro de NetworkProvider');
  }

  return context;
}