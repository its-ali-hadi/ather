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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AuthScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<NavigationProp>();
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [name, setName] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

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

  const handleSendCode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!phoneNumber) {
      Alert.alert('خطأ', 'الرجاء إدخال رقم الهاتف');
      return;
    }

    // Validate phone number format (Iraq format)
    // Iraqi phone numbers: 07xxxxxxxxx (11 digits) or 7xxxxxxxxx (10 digits)
    const phoneRegex = /^(07|7)[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('خطأ', 'الرجاء إدخال رقم هاتف صحيح (مثال: 07701234567)');
      return;
    }

    // TODO: Implement send verification code logic
    setIsCodeSent(true);
    Alert.alert('تم الإرسال', 'تم إرسال رمز التحقق إلى رقم هاتفك');
  };

  const handleVerifyCode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!verificationCode) {
      Alert.alert('خطأ', 'الرجاء إدخال رمز التحقق');
      return;
    }

    if (!isLogin && !name) {
      Alert.alert('خطأ', 'الرجاء إدخال اسمك');
      return;
    }

    // TODO: Implement verification logic
    Alert.alert(
      'نجح',
      isLogin ? 'تم تسجيل الدخول بنجاح' : 'تم إنشاء الحساب بنجاح'
    );
  };

  const toggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLogin(!isLogin);
    setPhoneNumber('');
    setVerificationCode('');
    setName('');
    setIsCodeSent(false);
  };

  const handleResendCode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement resend code logic
    Alert.alert('تم الإرسال', 'تم إعادة إرسال رمز التحقق');
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

              {/* Info Text */}
              <View style={[styles.infoBox, { backgroundColor: COLORS.accent + '15' }]}>
                <Ionicons name="information-circle" size={20} color={COLORS.accent} />
                <Text style={[styles.infoText, { color: COLORS.text }]}>
                  {isCodeSent
                    ? 'أدخل رمز التحقق المرسل إلى رقم هاتفك'
                    : 'سنرسل لك رمز التحقق عبر رسالة نصية'}
                </Text>
              </View>

              {!isCodeSent ? (
                <>
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

                  {/* Phone Number Input */}
                  <View style={[styles.inputContainer, { backgroundColor: COLORS.inputBg }]}>
                    <Ionicons name="call-outline" size={20} color={COLORS.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: COLORS.text }]}
                      placeholder="رقم الهاتف (مثال: 07701234567)"
                      placeholderTextColor={COLORS.textSecondary}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                      maxLength={11}
                    />
                  </View>

                  {/* Send Code Button */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleSendCode}
                    style={styles.authButton}
                  >
                    <LinearGradient
                      colors={['#E8B86D', '#D4A574', '#C9956A']}
                      style={styles.authButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.authButtonText}>إرسال رمز التحقق</Text>
                      <Ionicons name="send" size={20} color="#FFF" />
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {/* Verification Code Input */}
                  <Animated.View entering={FadeInDown.delay(100).springify()}>
                    <View style={[styles.inputContainer, { backgroundColor: COLORS.inputBg }]}>
                      <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.textSecondary} />
                      <TextInput
                        style={[styles.input, { color: COLORS.text }]}
                        placeholder="رمز التحقق (6 أرقام)"
                        placeholderTextColor={COLORS.textSecondary}
                        value={verificationCode}
                        onChangeText={setVerificationCode}
                        keyboardType="number-pad"
                        maxLength={6}
                      />
                    </View>
                  </Animated.View>

                  {/* Verify Button */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleVerifyCode}
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
                      <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Resend Code */}
                  <View style={styles.resendContainer}>
                    <Text style={[styles.resendText, { color: COLORS.textSecondary }]}>
                      لم تستلم الرمز؟
                    </Text>
                    <TouchableOpacity onPress={handleResendCode}>
                      <Text style={[styles.resendButton, { color: COLORS.accent }]}>
                        إعادة الإرسال
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Change Number */}
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setIsCodeSent(false);
                      setVerificationCode('');
                    }}
                    style={styles.changeNumberButton}
                  >
                    <Ionicons name="create-outline" size={18} color={COLORS.primary} />
                    <Text style={[styles.changeNumberText, { color: COLORS.primary }]}>
                      تغيير رقم الهاتف
                    </Text>
                  </TouchableOpacity>
                </>
              )}

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

          {/* Privacy Notice */}
          <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.privacyNotice}>
            <Text style={[styles.privacyText, { color: COLORS.textSecondary }]}>
              بالمتابعة، أنت توافق على{' '}
              <Text 
                style={{ color: COLORS.accent, fontFamily: 'Cairo_700Bold' }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.navigate('TermsOfService');
                }}
              >
                شروط الخدمة
              </Text>
              {' '}و{' '}
              <Text 
                style={{ color: COLORS.accent, fontFamily: 'Cairo_700Bold' }}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  navigation.navigate('PrivacyPolicy');
                }}
              >
                سياسة الخصوصية
              </Text>
            </Text>
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
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    lineHeight: 22,
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
  authButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
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
  resendContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  resendText: {
    fontSize: 15,
    fontFamily: 'Tajawal_400Regular',
  },
  resendButton: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  changeNumberButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    marginBottom: 24,
  },
  changeNumberText: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
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
  privacyNotice: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  privacyText: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
});
