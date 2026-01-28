import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useFonts, Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { Tajawal_300Light, Tajawal_400Regular, Tajawal_500Medium, Tajawal_700Bold } from '@expo-google-fonts/tajawal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useState } from 'react';

import HomeScreen from './screens/HomeScreen';
import BoxDetailScreen from './screens/BoxDetailScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'boxDetail'>('home');
  const [selectedBox, setSelectedBox] = useState<any>(null);

  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Tajawal_300Light,
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const navigateToBoxDetail = (box: any) => {
    setSelectedBox(box);
    setCurrentScreen('boxDetail');
  };

  const navigateToHome = () => {
    setCurrentScreen('home');
    setSelectedBox(null);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {currentScreen === 'home' ? (
          <HomeScreen onBoxPress={navigateToBoxDetail} />
        ) : (
          <BoxDetailScreen box={selectedBox} onBack={navigateToHome} />
        )}
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});