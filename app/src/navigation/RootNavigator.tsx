import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppDrawerNavigator } from './AppDrawerNavigator';
import { AuthStackNavigator } from './AuthStackNavigator';
import { OnboardingStackNavigator } from './OnboardingStackNavigator';
import { useAuth } from '../state/AuthContext';
import { useOnboarding } from '../state/onboarding';
import { colors } from '../theme';
import { AuthenticatedRootParamList } from './types';

const Stack = createNativeStackNavigator<AuthenticatedRootParamList>();

const navigationTheme: Theme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    border: colors.border,
    notification: colors.primary2,
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '700',
    },
  },
};

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasCompletedAnamnese, isHydrating } = useOnboarding();

  if (isLoading || isHydrating) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {isAuthenticated ? (
        <Stack.Navigator
          initialRouteName={hasCompletedAnamnese ? 'App' : 'Onboarding'}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Onboarding" component={OnboardingStackNavigator} />
          <Stack.Screen name="App" component={AppDrawerNavigator} />
        </Stack.Navigator>
      ) : (
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});