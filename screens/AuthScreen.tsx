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
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

export default function AuthScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSendCode = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!phoneNumber) {
      Alert.alert('خطأ', 'الرجاء إدخال رقم الهاتف');
      return;
    }

    // Validate phone number format (Iraq format)
    const phoneRegex = /^07[3-9]\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('خطأ', 'الرجاء إدخال رقم هاتف عراقي صحيح (مثال: 07701234567)');
      return;
    }

    if (!isLogin && !name) {
      Alert.alert('خطأ', 'الرجاء إدخال اسمك');
      return;
    }

    setIsLoading(true);

    try {
      const response = isLogin
        ? await api.sendLoginOTP(phoneNumber)
        : await api.sendRegistrationOTP(phoneNumber);

      if (response.success) {
        setOrderId(response.data.orderId);
        setIsCodeSent(true);
        Alert.alert('تم الإرسال', 'تم إرسال رمز التحقق إلى رقم هاتفك');
      } else {
        Alert.alert('خطأ', response.message || 'فشل إرسال رمز التحقق');
      }
    } catch (error: any) {
      Alert.alert('خطأ', error.message || 'حدث خطأ أثناء إرسال رمز التحقق');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!verificationCode) {
      Alert.alert('خطأ', 'الرجاء إدخال رمز التحقق');
      return;
    }

    if (verificationCode.length !== 6) {
      Alert.alert('خطأ', 'رمز التحقق يجب أن يكون 6 أرقام');
      return;
    }

    if (!isLogin && !password) {
      Alert.alert('خطأ', 'الرجاء إدخال كلمة المرور');
      return;
    }

    setIsLoading(true);

    try {
      let response;

      if (isLogin) {
        // Login with OTP
        response = await api.loginWithOTP({
          phone: phoneNumber,
          orderId,
          code: verificationCode,
        });
      } else {
        // Register with OTP
        response = await api.register({
          phone: phoneNumber,
          name,
          email: email || undefined,
          password,
          orderId,
          code: verificationCode,
        });
      }

      if (response.success) {
        // Save auth data
        await login(response.data.token, response.data.user);
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'نجح',
          isLogin ? 'تم تسجيل الدخول بنجاح' : 'تم إنشاء الحساب بنجاح'
        );
      } else {
        Alert.alert('خطأ', response.message || 'فشل التحقق من الرمز');
      }
    } catch (error: any) {
      Alert.alert('خطأ', error.message || 'حدث خطأ أثناء التحقق');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLogin(!isLogin);
    setPhoneNumber('');
    setVerificationCode('');
    setName('');
    setEmail('');
    setPassword('');
    setIsCodeSent(false);
    setOrderId('');
  };

  const handleResendCode = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVerificationCode('');
    await handleSendCode();
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
                          editable={!isLoading}
                        />
                      </View>
                    </Animated.View>
                  )}

                  {/* Email Input (Optional for Sign Up) */}
                  {!isLogin && (
                    <Animated.View entering={FadeInDown.delay(150).springify()}>
                      <View style={[styles.inputContainer, { backgroundColor: COLORS.inputBg }]}>
                        <Ionicons name="mail-outline" size={20} color={COLORS.textSecondary} />
                        <TextInput
                          style={[styles.input, { color: COLORS.text }]}
                          placeholder="البريد الإلكتروني (اختياري)"
                          placeholderTextColor={COLORS.textSecondary}
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          editable={!isLoading}
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
                      editable={!isLoading}
                    />
                  </View>

                  {/* Password Input (Only for Sign Up) */}
                  {!isLogin && (
                    <Animated.View entering={FadeInDown.delay(200).springify()}>
                      <View style={[styles.inputContainer, { backgroundColor: COLORS.inputBg }]}>
                        <Ionicons name="lock-closed-outline" size={20} color={COLORS.textSecondary} />
                        <TextInput
                          style={[styles.input, { color: COLORS.text }]}
                          placeholder="كلمة المرور (6 أحرف على الأقل)"
                          placeholderTextColor={COLORS.textSecondary}
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry
                          editable={!isLoading}
                        />
                      </View>
                    </Animated.View>
                  )}

                  {/* Send Code Button */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleSendCode}
                    disabled={isLoading}
                    style={styles.authButton}
                  >
                    <LinearGradient
                      colors={isLoading ? ['#999', '#777'] : ['#E8B86D', '#D4A574', '#C9956A']}
                      style={styles.authButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <>
                          <Text style={styles.authButtonText}>إرسال رمز التحقق</Text>
                          <Ionicons name="send" size={20} color="#FFF" />
                        </>
                      )}
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
                        editable={!isLoading}
                      />
                    </View>
                  </Animated.View>

                  {/* Verify Button */}
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={handleVerifyCode}
                    disabled={isLoading}
                    style={styles.authButton}
                  >
                    <LinearGradient
                      colors={isLoading ? ['#999', '#777'] : ['#E8B86D', '#D4A574', '#C9956A']}
                      style={styles.authButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <>
                          <Text style={styles.authButtonText}>
                            {isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب'}
                          </Text>
                          <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                        </>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Resend Code */}
                  <View style={styles.resendContainer}>
                    <Text style={[styles.resendText, { color: COLORS.textSecondary }]}>
                      لم تستلم الرمز؟
                    </Text>
                    <TouchableOpacity onPress={handleResendCode} disabled={isLoading}>
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
                      setOrderId('');
                    }}
                    disabled={isLoading}
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
                <TouchableOpacity onPress={toggleMode} disabled={isLoading}>
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
              <Text style={{ color: COLORS.accent, fontFamily: 'Cairo_700Bold' }}>
                شروط الخدمة
              </Text>
              {' '}و{' '}
              <Text style={{ color: COLORS.accent, fontFamily: 'Cairo_700Bold' }}>
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
    paddingTop: 40,
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