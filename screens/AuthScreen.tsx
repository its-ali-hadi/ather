import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';

export default function AuthScreen({ navigation }: any) {
  const colorScheme = useColorScheme();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    inputBg: colorScheme === 'dark' ? 'rgba(42, 36, 32, 0.5)' : 'rgba(255, 255, 255, 0.8)',
    border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
  };

  const handleAuth = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('خطأ', 'الرجاء ملء جميع الحقول');
      return;
    }

    // TODO: Implement authentication logic
    Alert.alert(
      'نجح',
      isLogin ? 'تم تسجيل الدخول بنجاح' : 'تم إنشاء الحساب بنجاح'
    );
  };

  const toggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Logo */}
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.logoContainer}>
            <LinearGradient
              colors={['#E8B86D', '#D4A574', '#C9956A']}
              style={styles.logoGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="bulb" size={56} color="#FFF" />
            </LinearGradient>
            <Text style={[styles.logoText, { color: COLORS.text }]}>أثر</Text>
            <Text style={[styles.logoSubtext, { color: COLORS.textSecondary }]}>
              {isLogin ? 'مرحباً بعودتك' : 'انضم إلينا اليوم'}
            </Text>
          </Animated.View>

          {/* Auth Card */}
          <Animated.View
            entering={FadeInUp.delay(200).springify()}
            style={[styles.authCard, { backgroundColor: COLORS.cardBg }]}
          >
            <LinearGradient
              colors={
                colorScheme === 'dark'
                  ? ['rgba(196, 165, 123, 0.1)', 'rgba(184, 149, 106, 0.05)']
                  : ['rgba(212, 196, 176, 0.15)', 'rgba(255, 255, 255, 0.95)']
              }
              style={styles.cardGradient}
            >
              {/* Title */}
              <Text style={[styles.cardTitle, { color: COLORS.text }]}>
                {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </Text>

              {/* Name Input (Only for Sign Up) */}
              {!isLogin && (
                <Animated.View entering={FadeInDown.delay(100).springify()}>
                  <View style={[styles.inputContainer, { backgroundColor: COLORS.inputBg }]}>
                    <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: COLORS.text }]}
                      placeholder="الاسم الكامل"
                      placeholderTextColor={COLORS.textSecondary}
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                    />
                  </View>
                </Animated.View>
              )}

              {/* Email Input */}
              <View style={[styles.inputContainer, { backgroundColor: COLORS.inputBg }]}>
                <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={[styles.input, { color: COLORS.text }]}
                  placeholder="البريد الإلكتروني"
                  placeholderTextColor={COLORS.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View style={[styles.inputContainer, { backgroundColor: COLORS.inputBg }]}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={[styles.input, { color: COLORS.text }]}
                  placeholder="كلمة المرور"
                  placeholderTextColor={COLORS.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowPassword(!showPassword);
                  }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Forgot Password (Only for Login) */}
              {isLogin && (
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('استعادة كلمة المرور', 'سيتم إضافة هذه الميزة قريباً');
                  }}
                  style={styles.forgotPassword}
                >
                  <Text style={[styles.forgotPasswordText, { color: COLORS.primary }]}>
                    نسيت كلمة المرور؟
                  </Text>
                </TouchableOpacity>
              )}

              {/* Auth Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleAuth}
                style={styles.authButton}
              >
                <LinearGradient
                  colors={['#E8B86D', '#D4A574', '#C9956A']}
                  style={styles.authButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.authButtonText}>
                    {isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}
                  </Text>
                  <Ionicons name="arrow-back" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: COLORS.border }]} />
                <Text style={[styles.dividerText, { color: COLORS.textSecondary }]}>أو</Text>
                <View style={[styles.dividerLine, { backgroundColor: COLORS.border }]} />
              </View>

              {/* Social Login */}
              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: COLORS.inputBg }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('تسجيل الدخول', 'سيتم إضافة هذه الميزة قريباً');
                  }}
                >
                  <Ionicons name="logo-google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: COLORS.inputBg }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('تسجيل الدخول', 'سيتم إضافة هذه الميزة قريباً');
                  }}
                >
                  <Ionicons name="logo-apple" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.socialButton, { backgroundColor: COLORS.inputBg }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('تسجيل الدخول', 'سيتم إضافة هذه الميزة قريباً');
                  }}
                >
                  <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
              </View>

              {/* Toggle Mode */}
              <View style={styles.toggleContainer}>
                <Text style={[styles.toggleText, { color: COLORS.textSecondary }]}>
                  {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
                </Text>
                <TouchableOpacity onPress={toggleMode}>
                  <Text style={[styles.toggleButton, { color: COLORS.accent }]}>
                    {isLogin ? 'إنشاء حساب' : 'تسجيل الدخول'}
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-end',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoGradient: {
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
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 8,
  },
  logoSubtext: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
  },
  authCard: {
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardGradient: {
    padding: 28,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
    marginBottom: 28,
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  authButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
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
  authButtonGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  authButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  divider: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
  },
  socialButtons: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  toggleText: {
    fontSize: 15,
    fontFamily: 'Tajawal_400Regular',
  },
  toggleButton: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
});