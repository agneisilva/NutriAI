import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { AnamneseChatScreen } from '../screens/AnamneseChatScreen';
import { AnamneseResultScreen } from '../screens/AnamneseResultScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { colors, shadows } from '../theme';
import { OnboardingStackParamList } from './types';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          ...shadows.soft,
        },
        headerTitleStyle: {
          color: colors.text,
          fontWeight: '700',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'Nutrição com IA' }} />
      <Stack.Screen name="AnamneseChat" component={AnamneseChatScreen} options={{ title: 'Sua anamnese' }} />
      <Stack.Screen
        name="AnamneseResult"
        component={AnamneseResultScreen}
        options={{ title: 'Seu resultado', gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}
