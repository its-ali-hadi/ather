import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Platform,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivateScreen() {
  const colorScheme = useColorScheme();

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <LinearGradient
            colors={['#9B59B6', '#8E44AD']}
            style={styles.headerIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="lock-closed" size={40} color="#FFF" />
          </LinearGradient>
          <Text style={[styles.title, { color: COLORS.text }]}>المحتوى الخاص</Text>
          <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
            منشوراتك ومحتواك الخاص بك فقط
          </Text>
        </Animated.View>

        {/* Empty State */}
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.emptyContainer}>
          <View style={[styles.emptyCard, { backgroundColor: COLORS.cardBg }]}>
            <LinearGradient
              colors={[COLORS.primary + '20', COLORS.accent + '10']}
              style={styles.emptyIconBg}
            >
              <Ionicons name="folder-open-outline" size={64} color={COLORS.textSecondary} />
            </LinearGradient>
            <Text style={[styles.emptyTitle, { color: COLORS.text }]}>
              لا يوجد محتوى خاص بعد
            </Text>
            <Text style={[styles.emptyText, { color: COLORS.textSecondary }]}>
              المنشورات التي تحفظها كخاصة ستظهر هنا
            </Text>
          </View>
        </Animated.View>

        {/* Info Card */}
        <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.infoContainer}>
          <View style={[styles.infoCard, { backgroundColor: COLORS.cardBg }]}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={24} color={COLORS.accent} />
              <Text style={[styles.infoTitle, { color: COLORS.text }]}>
                عن المحتوى الخاص
              </Text>
            </View>
            <Text style={[styles.infoText, { color: COLORS.textSecondary }]}>
              المحتوى الخاص هو مساحة شخصية لك فقط. يمكنك حفظ المنشورات والأفكار التي تريد
              الاحتفاظ بها بشكل خاص دون مشاركتها مع الآخرين.
            </Text>
          </View>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#9B59B6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'center',
  },
  emptyContainer: {
    paddingHorizontal: 24,
  },
  emptyCard: {
    padding: 48,
    borderRadius: 24,
    alignItems: 'center',
    gap: 16,
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
  emptyIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  infoContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  infoCard: {
    padding: 24,
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
  infoHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  infoText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },
});
