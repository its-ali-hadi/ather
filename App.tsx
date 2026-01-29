import { StatusBar } from 'expo-status-bar';
import { useFonts, Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold } from '@expo-google-fonts/cairo';
import { Tajawal_300Light, Tajawal_400Regular, Tajawal_500Medium, Tajawal_700Bold } from '@expo-google-fonts/tajawal';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, Platform, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import CreateScreen from './screens/CreateScreen';
import PrivateScreen from './screens/PrivateScreen';
import ProfileScreen from './screens/ProfileScreen';
import BoxDetailScreen from './screens/BoxDetailScreen';
import CreateTextPostScreen from './screens/CreateTextPostScreen';
import CreateImagePostScreen from './screens/CreateImagePostScreen';
import CreateVideoPostScreen from './screens/CreateVideoPostScreen';
import CreateLinkPostScreen from './screens/CreateLinkPostScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import HelpSupportScreen from './screens/HelpSupportScreen';
import SettingsScreen from './screens/SettingsScreen';
import PostsListScreen from './screens/PostsListScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import MyPostsScreen from './screens/MyPostsScreen';
import AuthScreen from './screens/AuthScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import AdvancedSearchScreen from './screens/AdvancedSearchScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import ArchiveScreen from './screens/ArchiveScreen';
import TermsOfServiceScreen from './screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export type RootStackParamList = {
  MainTabs: undefined;
  BoxDetail: { boxId: string };
  CreateTextPost: undefined;
  CreateImagePost: undefined;
  CreateVideoPost: undefined;
  CreateLinkPost: undefined;
  EditProfile: undefined;
  HelpSupport: undefined;
  Settings: undefined;
  PostsList: { boxId: string };
  Favorites: undefined;
  MyPosts: undefined;
  Auth: undefined;
  PostDetail: { postId: string };
  Notifications: undefined;
  AdvancedSearch: undefined;
  UserProfile: { userId: string };
  Archive: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
};

export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Create: undefined;
  Private: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function MainTabs() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    tabBar: colorScheme === 'dark' ? 'rgba(42, 36, 32, 0.95)' : 'rgba(255, 255, 255, 0.95)',
    inactive: colorScheme === 'dark' ? '#7A6F65' : '#A8A8A8',
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: COLORS.tabBar,
          borderTopWidth: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 + insets.bottom : 75,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom + 8 : 12,
          paddingTop: 12,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarLabelStyle: {
          fontFamily: 'Cairo_600SemiBold',
          fontSize: 12,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'استكشف',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'compass' : 'compass-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarLabel: 'إنشاء',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={size + 8}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Private"
        component={PrivateScreen}
        options={{
          tabBarLabel: 'خاص',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'lock-closed' : 'lock-closed-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'الملف',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Tajawal_300Light,
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load
        if (fontsLoaded) {
          // Artificially delay for 2 seconds to show splash screen
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={splashStyles.container}>
        <LinearGradient
          colors={['#FAF8F5', '#F5E6D3', '#E8B86D']}
          style={splashStyles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View entering={FadeIn.duration(800)} style={splashStyles.content}>
            <View style={splashStyles.iconContainer}>
              <LinearGradient
                colors={['#E8B86D', '#D4A574', '#C9956A']}
                style={splashStyles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="bulb" size={80} color="#FFF" />
              </LinearGradient>
            </View>
            <Text style={splashStyles.title}>أثر</Text>
            <Text style={splashStyles.subtitle}>منصة لمشاركة الأفكار</Text>
          </Animated.View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="BoxDetail" component={BoxDetailScreen} />
          <Stack.Screen name="CreateTextPost" component={CreateTextPostScreen} />
          <Stack.Screen name="CreateImagePost" component={CreateImagePostScreen} />
          <Stack.Screen name="CreateVideoPost" component={CreateVideoPostScreen} />
          <Stack.Screen name="CreateLinkPost" component={CreateLinkPostScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="PostsList" component={PostsListScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="MyPosts" component={MyPostsScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="PostDetail" component={PostDetailScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="AdvancedSearch" component={AdvancedSearchScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="Archive" component={ArchiveScreen} />
          <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const splashStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#E8B86D',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  title: {
    fontSize: 56,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    color: '#4A3F35',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Tajawal_400Regular',
    color: '#7A6F65',
    textAlign: 'center',
  },
});
