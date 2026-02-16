import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { DetailsScreen } from '../screens/DetailsScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { HeaderActions } from './HeaderActions';
import { HeaderDrawerButton } from './HeaderDrawerButton';
import { HomeStackParamList } from './types';
import { colors, shadows } from '../theme';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator
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
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detalhes' }} />
    </Stack.Navigator>
  );
}