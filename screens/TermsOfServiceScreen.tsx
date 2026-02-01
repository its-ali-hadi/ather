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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function TermsOfServiceScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
  };

  const sections = [
    {
      id: 1,
      title: '1. القبول بالشروط',
      content: 'باستخدامك لمنصة أثر، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام المنصة.',
    },
    {
      id: 2,
      title: '2. استخدام المنصة',
      content: 'يحق لك استخدام منصة أثر لمشاركة الأفكار والمحتوى الإبداعي. يجب عليك استخدام المنصة بطريقة قانونية ومسؤولة، وعدم نشر محتوى مسيء أو غير قانوني أو ينتهك حقوق الآخرين.',
    },
    {
      id: 3,
      title: '3. حساب المستخدم',
      content: 'أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور الخاصة بك. أنت مسؤول عن جميع الأنشطة التي تحدث تحت حسابك.',
    },
    {
      id: 4,
      title: '4. المحتوى المنشور',
      content: 'أنت تحتفظ بجميع حقوق الملكية الفكرية للمحتوى الذي تنشره على المنصة. ومع ذلك، فإنك تمنح أثر ترخيصًا غير حصري لاستخدام وعرض وتوزيع المحتوى الخاص بك على المنصة.',
    },
    {
      id: 5,
      title: '5. السلوك المحظور',
      content: 'يُحظر استخدام المنصة لنشر محتوى مسيء، أو تهديدي، أو تشهيري، أو ينتهك حقوق الملكية الفكرية، أو يحتوي على فيروسات أو برامج ضارة. نحتفظ بالحق في إزالة أي محتوى ينتهك هذه الشروط.',
    },
    {
      id: 6,
      title: '6. إنهاء الحساب',
      content: 'نحتفظ بالحق في تعليق أو إنهاء حسابك في أي وقت إذا انتهكت هذه الشروط أو إذا كان استخدامك للمنصة يضر بالمستخدمين الآخرين أو بالمنصة نفسها.',
    },
    {
      id: 7,
      title: '7. إخلاء المسؤولية',
      content: 'يتم توفير المنصة "كما هي" دون أي ضمانات من أي نوع. لا نضمن أن المنصة ستكون خالية من الأخطاء أو متاحة دون انقطاع.',
    },
    {
      id: 8,
      title: '8. التعديلات على الشروط',
      content: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية، واستمرارك في استخدام المنصة بعد التعديلات يعني قبولك للشروط المعدلة.',
    },
    {
      id: 9,
      title: '9. القانون الحاكم',
      content: 'تخضع هذه الشروط وتفسر وفقًا لقوانين المملكة العربية السعودية، دون الإخلال بأحكام تنازع القوانين.',
    },
    {
      id: 10,
      title: '10. التواصل معنا',
      content: 'إذا كان لديك أي أسئلة حول هذه الشروط، يرجى التواصل معنا عبر صفحة المساعدة والدعم.',
    },
  ];

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
              colors={['#4A90E2', '#357ABD']}
              style={styles.headerIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="document-text" size={28} color="#FFF" />
            </LinearGradient>
            <Text style={[styles.headerTitle, { color: COLORS.text }]}>شروط الخدمة</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Last Updated */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.updateInfo}>
          <View style={[styles.updateCard, { backgroundColor: COLORS.accent + '15' }]}>
            <Ionicons name="time-outline" size={20} color={COLORS.accent} />
            <Text style={[styles.updateText, { color: COLORS.text }]}>
              آخر تحديث: 15 يناير 2024
            </Text>
          </View>
        </Animated.View>

        {/* Introduction */}
        <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.section}>
          <View style={[styles.introCard, { backgroundColor: COLORS.cardBg }]}>
            <Text style={[styles.introText, { color: COLORS.textSecondary }]}>
              مرحباً بك في منصة أثر. يرجى قراءة شروط الخدمة هذه بعناية قبل استخدام المنصة. 
              باستخدامك للمنصة، فإنك توافق على الالتزام بهذه الشروط والأحكام.
            </Text>
          </View>
        </Animated.View>

        {/* Terms Sections */}
        <View style={styles.termsContainer}>
          {sections.map((section, index) => (
            <Animated.View
              key={section.id}
              entering={FadeInDown.delay(300 + index * 50).springify()}
            >
              <View style={[styles.termCard, { backgroundColor: COLORS.cardBg }]}>
                <Text style={[styles.termTitle, { color: COLORS.text }]}>
                  {section.title}
                </Text>
                <Text style={[styles.termContent, { color: COLORS.textSecondary }]}>
                  {section.content}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Footer */}
        <Animated.View entering={FadeInDown.delay(800).springify()} style={styles.footer}>
          <View style={[styles.footerCard, { backgroundColor: COLORS.cardBg }]}>
            <Ionicons name="shield-checkmark" size={32} color={COLORS.accent} />
            <Text style={[styles.footerTitle, { color: COLORS.text }]}>
              نحن نهتم بحقوقك
            </Text>
            <Text style={[styles.footerText, { color: COLORS.textSecondary }]}>
              إذا كان لديك أي استفسار حول شروط الخدمة، لا تتردد في التواصل معنا
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
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
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
  updateInfo: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  updateCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  updateText: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  introCard: {
    padding: 20,
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
  introText: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },
  termsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  termCard: {
    padding: 20,
    borderRadius: 16,
    gap: 12,
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
  termTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
  },
  termContent: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },
  footer: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  footerCard: {
    padding: 32,
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
  footerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
    fontFamily: 'Tajawal_400Regular',
  },
});