import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/state/AuthContext';
import { NetworkProvider } from './src/state/network';
import { OnboardingProvider } from './src/state/onboarding';
import { ProfileProvider } from './src/state/profile';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <NetworkProvider>
        <OnboardingProvider>
          <ProfileProvider>
            <StatusBar style="auto" />
            <RootNavigator />
          </ProfileProvider>
        </OnboardingProvider>
      </NetworkProvider>
    </AuthProvider>
  );
}
