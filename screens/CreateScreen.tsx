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
  Alert,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CreateScreen({ route }: any) {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<NavigationProp>();
  const { isGuest, logout } = useAuth();
  const boxIdFromParams = route?.params?.boxId;

  // Check if user is guest when screen loads
  useEffect(() => {
    if (isGuest) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Alert.alert(
        'تسجيل الدخول مطلوب',
        'يجب عليك تسجيل الدخول لإنشاء منشور',
        [
          {
            text: 'إلغاء',
            style: 'cancel',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'تسجيل الدخول',
            onPress: async () => {
              await logout();
            },
          },
        ]
      );
    }
  }, [isGuest]);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
  };

  const createOptions = [
    {
      id: '1',
      title: 'منشور نصي',
      description: 'شارك أفكارك وآرائك',
      icon: 'document-text',
      color: '#4A90E2',
      screen: 'CreateTextPost' as const,
    },
    {
      id: '2',
      title: 'منشور بصورة',
      description: 'أضف صورة مع وصف',
      icon: 'image',
      color: '#E94B3C',
      screen: 'CreateImagePost' as const,
    },
    {
      id: '3',
      title: 'منشور بفيديو',
      description: 'شارك مقطع فيديو',
      icon: 'videocam',
      color: '#9B59B6',
      screen: 'CreateVideoPost' as const,
    },
    {
      id: '4',
      title: 'رابط',
      description: 'شارك رابط مفيد',
      icon: 'link',
      color: '#50C878',
      screen: 'CreateLinkPost' as const,
    },
  ];

  const handlePress = (screen: keyof RootStackParamList) => {
    if (isGuest) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Alert.alert(
        'تسجيل الدخول مطلوب',
        'يجب عليك تسجيل الدخول لإنشاء منشور',
        [
          { text: 'إلغاء', style: 'cancel' },
          {
            text: 'تسجيل الدخول',
            onPress: async () => {
              await logout();
            },
          },
        ]
      );
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate(screen as any, { initialBoxId: boxIdFromParams } as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <LinearGradient
            colors={['#E8B86D', '#D4A574', '#C9956A']}
            style={styles.headerIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="create" size={40} color="#FFF" />
          </LinearGradient>
          <Text style={[styles.title, { color: COLORS.text }]}>إنشاء منشور</Text>
          <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
            اختر نوع المحتوى الذي تريد مشاركته
          </Text>
        </Animated.View>

        {/* Create Options */}
        <View style={styles.optionsContainer}>
          {createOptions.map((option, index) => (
            <Animated.View
              key={option.id}
              entering={FadeInUp.delay(200 + index * 100).springify()}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handlePress(option.screen)}
                style={[styles.optionCard, { backgroundColor: COLORS.cardBg }]}
              >
                <View style={styles.optionContent}>
                  <LinearGradient
                    colors={[option.color, option.color + 'CC']}
                    style={styles.optionIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name={option.icon as any} size={32} color="#FFF" />
                  </LinearGradient>
                  <View style={styles.optionText}>
                    <Text style={[styles.optionTitle, { color: COLORS.text }]}>
                      {option.title}
                    </Text>
                    <Text style={[styles.optionDescription, { color: COLORS.textSecondary }]}>
                      {option.description}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-back" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Tips Card */}
        <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.tipsContainer}>
          <View style={[styles.tipsCard, { backgroundColor: COLORS.cardBg }]}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb" size={24} color={COLORS.accent} />
              <Text style={[styles.tipsTitle, { color: COLORS.text }]}>نصائح للنشر</Text>
            </View>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <View style={[styles.tipDot, { backgroundColor: COLORS.accent }]} />
                <Text style={[styles.tipText, { color: COLORS.textSecondary }]}>
                  اختر الصندوق المناسب لمحتواك
                </Text>
              </View>
              <View style={styles.tipItem}>
                <View style={[styles.tipDot, { backgroundColor: COLORS.accent }]} />
                <Text style={[styles.tipText, { color: COLORS.textSecondary }]}>
                  اكتب عنواناً واضحاً وجذاباً
                </Text>
              </View>
              <View style={styles.tipItem}>
                <View style={[styles.tipDot, { backgroundColor: COLORS.accent }]} />
                <Text style={[styles.tipText, { color: COLORS.textSecondary }]}>
                  احترم قواعد المجتمع والصندوق
                </Text>
              </View>
            </View>
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
  optionsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  optionCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  optionContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  optionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    alignItems: 'flex-end',
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
  },
  tipsContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  tipsCard: {
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
  tipsHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },
});
