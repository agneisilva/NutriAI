import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ApiTestScreen } from '../screens/ApiTestScreen';
import { ExploreScreen } from '../screens/ExploreScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AppTabParamList } from './types';
import { HeaderActions } from './HeaderActions';
import { HeaderDrawerButton } from './HeaderDrawerButton';
import { HomeStackNavigator } from './HomeStackNavigator';
import { borderRadius, colors, shadows } from '../theme';

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerLeft: () => <HeaderDrawerButton />,
        headerRight: () => <HeaderActions />,
        headerStyle: {
          backgroundColor: colors.surface,
          ...shadows.soft,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
        },
        tabBarItemStyle: {
          borderRadius: borderRadius.md,
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconMap: Record<keyof AppTabParamList, keyof typeof Ionicons.glyphMap> = {
            Home: focused ? 'home' : 'home-outline',
            Explore: focused ? 'compass' : 'compass-outline',
            ApiTest: focused ? 'cloud-done' : 'cloud-done-outline',
            Settings: focused ? 'settings' : 'settings-outline',
          };

          return <Ionicons name={iconMap[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} options={{ title: 'Home', headerShown: false }} />
      <Tab.Screen name="Explore" component={ExploreScreen} options={{ title: 'Explore' }} />
      <Tab.Screen name="ApiTest" component={ApiTestScreen} options={{ title: 'ApiTest' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}