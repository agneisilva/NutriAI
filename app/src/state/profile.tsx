import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Profile = {
  name: string;
  photoUri?: string;
};

type UpdateProfileInput = {
  name: string;
  photoUri?: string;
};

type ProfileContextValue = {
  name: string;
  photoUri?: string;
  updateProfile: (payload: UpdateProfileInput) => Promise<void>;
};

const PROFILE_STORAGE_KEY = '@nutriai:profile';

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

type ProfileProviderProps = {
  children: React.ReactNode;
};

export function ProfileProvider({ children }: ProfileProviderProps) {
  const [profile, setProfile] = useState<Profile>({ name: '' });

  useEffect(() => {
    const restoreProfile = async () => {
      const saved = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as Profile;
        setProfile({
          name: parsed.name ?? '',
          photoUri: parsed.photoUri,
        });
      }
    };

    void restoreProfile();
  }, []);

  const updateProfile = async ({ name, photoUri }: UpdateProfileInput) => {
    const nextProfile: Profile = {
      name: name.trim(),
      photoUri,
    };

    setProfile(nextProfile);
    await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
  };

  const value = useMemo(
    () => ({
      name: profile.name,
      photoUri: profile.photoUri,
      updateProfile,
    }),
    [profile],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfile deve ser usado dentro de ProfileProvider');
  }

  return context;
}