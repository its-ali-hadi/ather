import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
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
import { useAuth } from '../contexts/AuthContext';

export default function GuestProfileScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { logout } = useAuth();

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
  };

  const handleLoginPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
  };

  const handleRegisterPress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <View style={styles.content}>
        {/* Icon */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.iconContainer}>
          <LinearGradient
            colors={['#E8B86D', '#D4A574', '#C9956A']}
            style={styles.iconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="person-outline" size={80} color="#FFF" />
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.textContainer}>
          <Text style={[styles.title, { color: COLORS.text }]}>
            مرحباً بك كضيف!
          </Text>
          <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
            للوصول إلى ملفك الشخصي والتفاعل مع المنشورات، يجب عليك تسجيل الدخول أولاً
          </Text>
        </Animated.View>

        {/* Features List */}
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.featuresList}>
          <View style={[styles.featureItem, { backgroundColor: COLORS.cardBg }]}>
            <View style={[styles.featureIcon, { backgroundColor: COLORS.accent + '20' }]}>
              <Ionicons name="heart" size={24} color={COLORS.accent} />
            </View>
            <Text style={[styles.featureText, { color: COLORS.text }]}>
              إضافة إعجابات على المنشورات
            </Text>
          </View>

          <View style={[styles.featureItem, { backgroundColor: COLORS.cardBg }]}>
            <View style={[styles.featureIcon, { backgroundColor: '#4A90E2' + '20' }]}>
              <Ionicons name="chatbubble" size={24} color="#4A90E2" />
            </View>
            <Text style={[styles.featureText, { color: COLORS.text }]}>
              التعليق على المنشورات
            </Text>
          </View>

          <View style={[styles.featureItem, { backgroundColor: COLORS.cardBg }]}>
            <View style={[styles.featureIcon, { backgroundColor: '#50C878' + '20' }]}>
              <Ionicons name="bookmark" size={24} color="#50C878" />
            </View>
            <Text style={[styles.featureText, { color: COLORS.text }]}>
              حفظ المنشورات المفضلة
            </Text>
          </View>

          <View style={[styles.featureItem, { backgroundColor: COLORS.cardBg }]}>
            <View style={[styles.featureIcon, { backgroundColor: '#9B59B6' + '20' }]}>
              <Ionicons name="create" size={24} color="#9B59B6" />
            </View>
            <Text style={[styles.featureText, { color: COLORS.text }]}>
              إنشاء منشوراتك الخاصة
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.buttonsContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleLoginPress}
            style={styles.loginButton}
          >
            <LinearGradient
              colors={['#E8B86D', '#D4A574', '#C9956A']}
              style={styles.loginButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
              <Ionicons name="log-in" size={24} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleRegisterPress}
            style={[styles.registerButton, { 
              backgroundColor: COLORS.cardBg,
              borderColor: COLORS.primary,
            }]}
          >
            <Text style={[styles.registerButtonText, { color: COLORS.primary }]}>
              إنشاء حساب جديد
            </Text>
            <Ionicons name="person-add" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconGradient: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#E8B86D',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  featuresList: {
    width: '100%',
    gap: 12,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
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
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Tajawal_500Medium',
    textAlign: 'right',
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#E8B86D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  loginButtonGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  registerButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
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
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
});