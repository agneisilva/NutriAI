import Constants from 'expo-constants';

type ExtraConfig = {
  API_URL?: string;
  APP_NAME?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as ExtraConfig;

export const ENV = {
  API_URL: extra.API_URL || 'https://example.com',
  APP_NAME: extra.APP_NAME || 'TurboTemplate',
};