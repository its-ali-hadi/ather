import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { useAuth } from '../contexts/AuthContext';
import GuestProfileScreen from './GuestProfileScreen';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<NavigationProp>();
  const { user, isGuest } = useAuth();

  // Show GuestProfileScreen if user is a guest
  if (isGuest) {
    return <GuestProfileScreen />;
  }

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
  };

  const stats = [
    { label: 'المنشورات', value: '0', icon: 'document-text' },
    { label: 'المتابعون', value: '0', icon: 'people' },
    { label: 'المتابَعون', value: '0', icon: 'person-add' },
  ];

  const menuItems = [
    {
      id: '1',
      icon: 'notifications',
      title: 'الإشعارات',
      subtitle: 'إدارة إشعاراتك',
      color: '#E8B86D',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('Notifications');
      },
    },
    {
      id: '2',
      icon: 'search',
      title: 'البحث المتقدم',
      subtitle: 'ابحث عن منشورات ومستخدمين',
      color: '#4A90E2',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('AdvancedSearch');
      },
    },
    {
      id: '3',
      icon: 'heart',
      title: 'المفضلات',
      subtitle: 'المنشورات المحفوظة',
      color: '#E94B3C',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('Favorites');
      },
    },
    {
      id: '4',
      icon: 'document-text',
      title: 'منشوراتي',
      subtitle: 'جميع منشوراتك',
      color: '#50C878',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('MyPosts');
      },
    },
    {
      id: '5',
      icon: 'create',
      title: 'تعديل الملف الشخصي',
      subtitle: 'تحديث معلوماتك',
      color: '#9B59B6',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('EditProfile');
      },
    },
    {
      id: '6',
      icon: 'settings',
      title: 'الإعدادات',
      subtitle: 'إعدادات التطبيق',
      color: '#34495E',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('Settings');
      },
    },
    {
      id: '7',
      icon: 'help-circle',
      title: 'المساعدة والدعم',
      subtitle: 'تواصل معنا',
      color: '#F39C12',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('HelpSupport');
      },
    },
    {
      id: '8',
      icon: 'document-text',
      title: 'شروط الخدمة',
      subtitle: 'اقرأ شروط الاستخدام',
      color: '#4A90E2',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('TermsOfService');
      },
    },
    {
      id: '9',
      icon: 'shield-checkmark',
      title: 'سياسة الخصوصية',
      subtitle: 'كيف نحمي بياناتك',
      color: '#50C878',
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        navigation.navigate('PrivacyPolicy');
      },
    },
  ];

  const handlePress = (screen: keyof RootStackParamList | null) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (screen) {
      navigation.navigate(screen as any);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
      >
        {/* Profile Header */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.profileHeader}>
          <LinearGradient
            colors={['#E8B86D', '#D4A574', '#C9956A']}
            style={styles.avatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="person" size={48} color="#FFF" />
          </LinearGradient>
          <Text style={[styles.username, { color: COLORS.text }]}>مستخدم جديد</Text>
          <Text style={[styles.bio, { color: COLORS.textSecondary }]}>
            مرحباً بك في منصة أثر
          </Text>
        </Animated.View>

        {/* Stats */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.statsContainer}>
          <View style={[styles.statsCard, { backgroundColor: COLORS.cardBg }]}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statItem}>
                <Ionicons name={stat.icon as any} size={24} color={COLORS.primary} />
                <Text style={[styles.statValue, { color: COLORS.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.delay(300 + index * 80).springify()}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={item.onPress}
                style={[styles.menuItem, { backgroundColor: COLORS.cardBg }]}
              >
                <View style={styles.menuContent}>
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <Text style={[styles.menuTitle, { color: COLORS.text }]}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-back" size={20} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Logout Button */}
        <Animated.View entering={FadeInUp.delay(700).springify()} style={styles.logoutContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handlePress(null)}
            style={[styles.logoutButton, { backgroundColor: COLORS.cardBg }]}
          >
            <Ionicons name="log-out-outline" size={24} color="#E94B3C" />
            <Text style={[styles.logoutText, { color: '#E94B3C' }]}>تسجيل الخروج</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Sticky Notifications Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate('Notifications');
        }}
        style={[styles.stickyNotificationButton, { 
          backgroundColor: COLORS.accent,
        }]}
      >
        <Ionicons name="notifications" size={28} color="#FFF" />
        {/* Notification Badge */}
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationBadgeText}>3</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#E8B86D',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsCard: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
  },
  menuContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  menuContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Tajawal_500Medium',
  },
  logoutContainer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  logoutButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E94B3C',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  stickyNotificationButton: {
    position: 'absolute',
    left: 24,
    top: 60,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#E8B86D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#E94B3C',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  notificationBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
});
