import 'dotenv/config';
import type { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const appName = process.env.APP_NAME?.trim() || 'TurboTemplate';
  const apiUrl = process.env.API_URL?.trim() || 'https://7tewq45bpd.execute-api.us-east-1.amazonaws.com';

  return {
    ...config,
    name: appName,
    slug: 'nutriai-template',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      API_URL: apiUrl,
      APP_NAME: appName,
    },
  };
};