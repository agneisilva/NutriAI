import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { colors, shadows, spacing } from '../theme';
import { AppDrawerContent } from './AppDrawerContent';
import { AppTabsNavigator } from './AppTabsNavigator';
import { HeaderActions } from './HeaderActions';
import { HeaderDrawerButton } from './HeaderDrawerButton';
import { AppDrawerParamList } from './types';
import { ProfileScreen } from '../screens/ProfileScreen';

const Drawer = createDrawerNavigator<AppDrawerParamList>();

export function AppDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <AppDrawerContent {...props} />}
      screenOptions={{
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
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textMuted,
        drawerStyle: {
          backgroundColor: colors.surface,
        },
        drawerItemStyle: {
          borderRadius: 12,
          marginHorizontal: spacing.sm,
        },
      }}
    >
      <Drawer.Screen
        name="AppTabs"
        component={AppTabsNavigator}
        options={{ title: 'Início', drawerLabel: 'Início', headerShown: false }}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Drawer.Navigator>
  );
}