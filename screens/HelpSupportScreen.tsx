import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HelpSupportScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
  };

  const faqItems = [
    {
      id: 1,
      question: 'كيف أقوم بإنشاء منشور جديد؟',
      answer: 'اضغط على تبويب "إنشاء" في الشريط السفلي، ثم اختر نوع المنشور الذي تريد إنشاءه (نصي، صورة، فيديو، أو رابط).',
    },
    {
      id: 2,
      question: 'كيف يمكنني تعديل ملفي الشخصي؟',
      answer: 'اذهب إلى صفحة الملف الشخصي، ثم اضغط على "تعديل الملف الشخصي" لتغيير صورتك واسمك ونبذتك.',
    },
    {
      id: 3,
      question: 'ما هي الصناديق؟',
      answer: 'الصناديق هي مجموعات موضوعية تساعدك على تنظيم المحتوى واكتشاف المنشورات المتعلقة باهتماماتك مثل التقنية والفن والأدب.',
    },
    {
      id: 4,
      question: 'كيف أتواصل مع الدعم الفني؟',
      answer: 'يمكنك إرسال رسالة عبر نموذج الاتصال أعلاه، أو التواصل معنا مباشرة عبر الهاتف أو البريد الإلكتروني.',
    },
  ];

  const contactInfo = [
    {
      id: 1,
      icon: 'call',
      title: 'رقم الهاتف الأول',
      value: '+966 50 123 4567',
      color: '#4A90E2',
      action: () => Linking.openURL('tel:+966501234567'),
    },
    {
      id: 2,
      icon: 'call',
      title: 'رقم الهاتف الثاني',
      value: '+966 55 987 6543',
      color: '#50C878',
      action: () => Linking.openURL('tel:+966559876543'),
    },
    {
      id: 3,
      icon: 'mail',
      title: 'البريد الإلكتروني',
      value: 'support@athar.app',
      color: '#E94B3C',
      action: () => Linking.openURL('mailto:support@athar.app'),
    },
  ];

  const handleSubmit = () => {
    if (!subject.trim() || !description.trim()) {
      Alert.alert('خطأ', 'الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('تم الإرسال', 'شكراً لتواصلك معنا! سنرد عليك في أقرب وقت ممكن.', [
      { 
        text: 'حسناً', 
        onPress: () => {
          setSubject('');
          setDescription('');
        }
      }
    ]);
  };

  const toggleFaq = (id: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleContactPress = (action: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    action();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <LinearGradient
              colors={['#9B59B6', '#8E44AD']}
              style={styles.headerIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="help-circle" size={28} color="#FFF" />
            </LinearGradient>
            <Text style={[styles.headerTitle, { color: COLORS.text }]}>المساعدة والدعم</Text>
          </View>
        </View>

        {/* Contact Form */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="mail-outline" size={24} color={COLORS.accent} />
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>تواصل معنا</Text>
          </View>

          <View style={[styles.formCard, { backgroundColor: COLORS.cardBg }]}>
            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: COLORS.text }]}>
                العنوان <Text style={{ color: '#E94B3C' }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: COLORS.background,
                    color: COLORS.text,
                    borderColor: COLORS.border,
                  }
                ]}
                placeholder="اكتب عنوان رسالتك"
                placeholderTextColor={COLORS.textSecondary}
                value={subject}
                onChangeText={setSubject}
                textAlign="right"
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={[styles.label, { color: COLORS.text }]}>
                الوصف <Text style={{ color: '#E94B3C' }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  { 
                    backgroundColor: COLORS.background,
                    color: COLORS.text,
                    borderColor: COLORS.border,
                  }
                ]}
                placeholder="اشرح مشكلتك أو استفسارك بالتفصيل..."
                placeholderTextColor={COLORS.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                textAlign="right"
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              activeOpacity={0.8}
              style={styles.submitButton}
            >
              <LinearGradient
                colors={['#E8B86D', '#D4A574']}
                style={styles.submitGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="send" size={20} color="#FFF" />
                <Text style={styles.submitText}>إرسال الرسالة</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* FAQ Section */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="help-buoy-outline" size={24} color={COLORS.accent} />
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>الأسئلة الشائعة</Text>
          </View>

          <View style={styles.faqContainer}>
            {faqItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.8}
                onPress={() => toggleFaq(item.id)}
                style={[styles.faqItem, { backgroundColor: COLORS.cardBg }]}
              >
                <View style={styles.faqHeader}>
                  <Ionicons 
                    name={expandedFaq === item.id ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color={COLORS.textSecondary} 
                  />
                  <Text style={[styles.faqQuestion, { color: COLORS.text }]}>
                    {item.question}
                  </Text>
                </View>
                {expandedFaq === item.id && (
                  <Text style={[styles.faqAnswer, { color: COLORS.textSecondary }]}>
                    {item.answer}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Terms of Use */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('شروط الاستخدام', 'سيتم إضافة صفحة شروط الاستخدام قريباً');
            }}
            style={[styles.termsCard, { backgroundColor: COLORS.cardBg }]}
          >
            <View style={styles.termsContent}>
              <Ionicons name="document-text-outline" size={24} color={COLORS.primary} />
              <Text style={[styles.termsText, { color: COLORS.text }]}>شروط الاستخدام</Text>
            </View>
            <Ionicons name="chevron-back" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Contact Cards */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="chatbubbles-outline" size={24} color={COLORS.accent} />
            <Text style={[styles.sectionTitle, { color: COLORS.text }]}>طرق التواصل</Text>
          </View>

          <View style={styles.contactCardsContainer}>
            {contactInfo.map((contact, index) => (
              <TouchableOpacity
                key={contact.id}
                activeOpacity={0.8}
                onPress={() => handleContactPress(contact.action)}
                style={[styles.contactCard, { backgroundColor: COLORS.cardBg }]}
              >
                <View style={[styles.contactIconContainer, { backgroundColor: contact.color + '20' }]}>
                  <Ionicons name={contact.icon as any} size={28} color={contact.color} />
                </View>
                <Text style={[styles.contactTitle, { color: COLORS.text }]}>
                  {contact.title}
                </Text>
                <Text style={[styles.contactValue, { color: COLORS.textSecondary }]}>
                  {contact.value}
                </Text>
                <View style={[styles.contactButton, { backgroundColor: contact.color }]}>
                  <Ionicons name="arrow-back" size={16} color="#FFF" />
                </View>
              </TouchableOpacity>
            ))}
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
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  formCard: {
    padding: 20,
    borderRadius: 20,
    gap: 20,
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
  fieldContainer: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_600SemiBold',
    textAlign: 'right',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    minHeight: 150,
  },
  submitButton: {
    marginTop: 8,
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
  submitGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  submitText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    color: '#FFF',
  },
  faqContainer: {
    gap: 12,
  },
  faqItem: {
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
  faqHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Tajawal_500Medium',
    textAlign: 'right',
  },
  faqAnswer: {
    fontSize: 15,
    lineHeight: 24,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  termsCard: {
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
  termsContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  termsText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Tajawal_500Medium',
  },
  contactCardsContainer: {
    gap: 16,
  },
  contactCard: {
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    gap: 12,
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
  contactIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'center',
  },
  contactValue: {
    fontSize: 15,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'center',
  },
  contactButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
});