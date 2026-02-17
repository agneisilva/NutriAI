import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type OnboardingProfile = {
  goal: string;
  age: number;
  sex: 'male' | 'female' | 'other' | 'unknown';
  weight_kg: number;
  height_cm: number;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'high';
  restrictions: string[];
};

type OnboardingPayload = {
  session_id: string;
  profile: OnboardingProfile;
  bmi: number;
  summary: string;
};

type OnboardingContextValue = {
  isHydrating: boolean;
  hasCompletedAnamnese: boolean;
  lastSessionId?: string;
  profile?: OnboardingProfile;
  bmi?: number;
  summary?: string;
  setLastSessionId: (sessionId: string) => Promise<void>;
  setAnamneseResult: (payload: OnboardingPayload) => Promise<void>;
  finishOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
};

type OnboardingState = {
  hasCompletedAnamnese: boolean;
  lastSessionId?: string;
  profile?: OnboardingProfile;
  bmi?: number;
  summary?: string;
};

const STORAGE_KEY = '@nutriai:onboarding';

const OnboardingContext = createContext<OnboardingContextValue | undefined>(undefined);

function defaultState(): OnboardingState {
  return { hasCompletedAnamnese: false };
}

type OnboardingProviderProps = { children: React.ReactNode };

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [state, setState] = useState<OnboardingState>(defaultState);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) {
          return;
        }

        const parsed = JSON.parse(raw) as OnboardingState;
        setState({
          hasCompletedAnamnese: Boolean(parsed.hasCompletedAnamnese),
          lastSessionId: parsed.lastSessionId,
          profile: parsed.profile,
          bmi: parsed.bmi,
          summary: parsed.summary,
        });
      } finally {
        setIsHydrating(false);
      }
    };

    void hydrate();
  }, []);

  const persist = async (nextState: OnboardingState) => {
    setState(nextState);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  };

  const setLastSessionId = useCallback(async (sessionId: string) => {
    const nextState = {
      ...state,
      lastSessionId: sessionId,
    };
    await persist(nextState);
  }, [state]);

  const setAnamneseResult = useCallback(async (payload: OnboardingPayload) => {
    const nextState: OnboardingState = {
      ...state,
      hasCompletedAnamnese: false,
      lastSessionId: payload.session_id,
      profile: payload.profile,
      bmi: payload.bmi,
      summary: payload.summary,
    };

    await persist(nextState);
  }, [state]);

  const finishOnboarding = useCallback(async () => {
    const nextState: OnboardingState = {
      ...state,
      hasCompletedAnamnese: true,
    };

    await persist(nextState);
  }, [state]);

  const resetOnboarding = useCallback(async () => {
    const nextState = defaultState();
    setState(nextState);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      isHydrating,
      hasCompletedAnamnese: state.hasCompletedAnamnese,
      lastSessionId: state.lastSessionId,
      profile: state.profile,
      bmi: state.bmi,
      summary: state.summary,
      setLastSessionId,
      setAnamneseResult,
      finishOnboarding,
      resetOnboarding,
    }),
    [
      finishOnboarding,
      isHydrating,
      resetOnboarding,
      setAnamneseResult,
      setLastSessionId,
      state,
    ],
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error('useOnboarding deve ser usado dentro de OnboardingProvider');
  }

  return context;
}
