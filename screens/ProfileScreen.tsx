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

export default function ProfileScreen() {
  const colorScheme = useColorScheme();

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
    { id: '1', title: 'تعديل الملف الشخصي', icon: 'create', color: '#4A90E2' },
    { id: '2', title: 'الإعدادات', icon: 'settings', color: '#50C878' },
    { id: '3', title: 'المفضلة', icon: 'heart', color: '#E94B3C' },
    { id: '4', title: 'المحفوظات', icon: 'bookmark', color: '#F39C12' },
    { id: '5', title: 'المساعدة والدعم', icon: 'help-circle', color: '#9B59B6' },
  ];

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
                onPress={handlePress}
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
            onPress={handlePress}
            style={[styles.logoutButton, { backgroundColor: COLORS.cardBg }]}
          >
            <Ionicons name="log-out-outline" size={24} color="#E94B3C" />
            <Text style={[styles.logoutText, { color: '#E94B3C' }]}>تسجيل الخروج</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 20 }} />
      </ScrollView>
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
});
