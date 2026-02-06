import '@expo/metro-runtime';
import './utils/global-error-handler';
import { Image as ExpoImage } from 'expo-image';
import api from './utils/api';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import {
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from '@expo-google-fonts/cairo';
import {
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
} from '@expo-google-fonts/tajawal';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Platform } from 'react-native';

// Screens
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import CreateScreen from './screens/CreateScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ProfileScreen from './screens/ProfileScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ArchiveScreen from './screens/ArchiveScreen';
import MyPostsScreen from './screens/MyPostsScreen';
import PrivateScreen from './screens/PrivateScreen';
import HelpSupportScreen from './screens/HelpSupportScreen';
import SupportScreen from './screens/SupportScreen';
import TermsOfServiceScreen from './screens/TermsOfServiceScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import AdvancedSearchScreen from './screens/AdvancedSearchScreen';
import BoxDetailScreen from './screens/BoxDetailScreen';
import PostsListScreen from './screens/PostsListScreen';
import CreateTextPostScreen from './screens/CreateTextPostScreen';
import CreateImagePostScreen from './screens/CreateImagePostScreen';
import CreateVideoPostScreen from './screens/CreateVideoPostScreen';
import CreateLinkPostScreen from './screens/CreateLinkPostScreen';
import GuestProfileScreen from './screens/GuestProfileScreen';
import ReportScreen from './screens/ReportScreen';
import UsersListScreen from './screens/UsersListScreen';
import LikedPostsScreen from './screens/LikedPostsScreen';
import MyCommentsScreen from './screens/MyCommentsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
export type TabParamList = {
  Home: undefined;
  Explore: undefined;
  Create: { boxId?: number };
  Private: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: { screen?: keyof TabParamList; params?: any } | undefined;
  PostDetail: { postId: string };
  UserProfile: { userId: string };
  EditProfile: undefined;
  Settings: undefined;
  Favorites: undefined;
  Archive: undefined;
  MyPosts: undefined;
  Private: undefined;
  HelpSupport: undefined;
  Support: undefined;
  TermsOfService: undefined;
  PrivacyPolicy: undefined;
  AdvancedSearch: undefined;
  BoxDetail: { boxId: string };
  PostsList: { boxId?: number; category?: string };
  CreateTextPost: { initialBoxId?: number };
  CreateImagePost: { initialBoxId?: number };
  CreateVideoPost: { initialBoxId?: number };
  CreateLinkPost: { initialBoxId?: number };
  Report: { type: 'post' | 'user' | 'comment'; id: number; title?: string };
  Notifications: undefined;
  UsersList: { type: 'followers' | 'following'; userId: string };
  LikedPosts: undefined;
  MyComments: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    tabBar: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    inactive: colorScheme === 'dark' ? '#7A6F65' : '#B8B0A8',
  };

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.tabBar,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarLabelStyle: {
          fontFamily: 'Cairo_600SemiBold',
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarLabel: 'استكشف',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarLabel: 'إنشاء',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Private"
        component={PrivateScreen}
        options={{
          tabBarLabel: 'خاص',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="lock-closed" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'الملف الشخصي',
          tabBarIcon: ({ color, size, focused }) => (
            user?.profile_image ? (
              <ExpoImage
                source={{ uri: api.getFileUrl(user.profile_image) ?? undefined }}
                style={{
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: focused ? 1.5 : 0,
                  borderColor: color
                }}
              />
            ) : (
              <Ionicons name="person" size={size} color={color} />
            )
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#B8956A" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="PostDetail" component={PostDetailScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} />
          <Stack.Screen name="Archive" component={ArchiveScreen} />
          <Stack.Screen name="MyPosts" component={MyPostsScreen} />
          <Stack.Screen name="Private" component={PrivateScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          <Stack.Screen name="Support" component={SupportScreen} />
          <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="AdvancedSearch" component={AdvancedSearchScreen} />
          <Stack.Screen name="BoxDetail" component={BoxDetailScreen} />
          <Stack.Screen name="PostsList" component={PostsListScreen} />
          <Stack.Screen name="CreateTextPost" component={CreateTextPostScreen} />
          <Stack.Screen name="CreateImagePost" component={CreateImagePostScreen} />
          <Stack.Screen name="CreateVideoPost" component={CreateVideoPostScreen} />
          <Stack.Screen name="CreateLinkPost" component={CreateLinkPostScreen} />
          <Stack.Screen name="Report" component={ReportScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="UsersList" component={UsersListScreen} />
          <Stack.Screen name="LikedPosts" component={LikedPostsScreen} />
          <Stack.Screen name="MyComments" component={MyCommentsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#B8956A" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
