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

export default function PrivacyPolicyScreen() {
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
      title: '1. المعلومات التي نجمعها',
      content: 'نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند إنشاء حساب، مثل الاسم ورقم الهاتف والبريد الإلكتروني. كما نجمع المعلومات حول استخدامك للمنصة، مثل المنشورات التي تنشرها والتفاعلات التي تقوم بها.',
    },
    {
      id: 2,
      title: '2. كيفية استخدام المعلومات',
      content: 'نستخدم المعلومات التي نجمعها لتوفير وتحسين خدماتنا، والتواصل معك، وتخصيص تجربتك على المنصة. كما نستخدمها لضمان أمان المنصة ومنع الاستخدام غير المصرح به.',
    },
    {
      id: 3,
      title: '3. مشاركة المعلومات',
      content: 'لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية: بموافقتك الصريحة، للامتثال للقوانين واللوائح، أو لحماية حقوقنا وسلامة مستخدمينا.',
    },
    {
      id: 4,
      title: '4. أمان المعلومات',
      content: 'نتخذ تدابير أمنية معقولة لحماية معلوماتك من الوصول غير المصرح به أو الاستخدام أو الكشف. ومع ذلك، لا يمكن ضمان أمان أي نقل للبيانات عبر الإنترنت بنسبة 100%.',
    },
    {
      id: 5,
      title: '5. ملفات تعريف الارتباط (Cookies)',
      content: 'نستخدم ملفات تعريف الارتباط وتقنيات مشابهة لتحسين تجربتك على المنصة وتحليل استخدام الموقع. يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك.',
    },
    {
      id: 6,
      title: '6. حقوقك',
      content: 'لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها أو حذفها. يمكنك أيضًا الاعتراض على معالجة معلوماتك أو طلب تقييد استخدامها. للقيام بذلك، يرجى التواصل معنا.',
    },
    {
      id: 7,
      title: '7. الاحتفاظ بالبيانات',
      content: 'نحتفظ بمعلوماتك الشخصية طالما كان حسابك نشطًا أو حسب الحاجة لتقديم خدماتنا. قد نحتفظ ببعض المعلومات للامتثال للالتزامات القانونية أو لحل النزاعات.',
    },
    {
      id: 8,
      title: '8. خصوصية الأطفال',
      content: 'منصتنا غير موجهة للأطفال دون سن 13 عامًا. لا نجمع عن قصد معلومات شخصية من الأطفال. إذا علمنا أننا جمعنا معلومات من طفل، سنتخذ خطوات لحذف تلك المعلومات.',
    },
    {
      id: 9,
      title: '9. التغييرات على سياسة الخصوصية',
      content: 'قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنخطرك بأي تغييرات جوهرية عن طريق نشر السياسة الجديدة على المنصة وتحديث تاريخ "آخر تحديث".',
    },
    {
      id: 10,
      title: '10. التواصل معنا',
      content: 'إذا كان لديك أي أسئلة أو مخاوف بشأن سياسة الخصوصية هذه، يرجى التواصل معنا عبر صفحة المساعدة والدعم.',
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
              colors={['#50C878', '#3FA463']}
              style={styles.headerIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="shield-checkmark" size={28} color="#FFF" />
            </LinearGradient>
            <Text style={[styles.headerTitle, { color: COLORS.text }]}>سياسة الخصوصية</Text>
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
              نحن في منصة أثر نحترم خصوصيتك ونلتزم بحماية معلوماتك الشخصية. 
              توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك عند استخدام منصتنا.
            </Text>
          </View>
        </Animated.View>

        {/* Privacy Sections */}
        <View style={styles.privacyContainer}>
          {sections.map((section, index) => (
            <Animated.View
              key={section.id}
              entering={FadeInDown.delay(300 + index * 50).springify()}
            >
              <View style={[styles.privacyCard, { backgroundColor: COLORS.cardBg }]}>
                <Text style={[styles.privacyTitle, { color: COLORS.text }]}>
                  {section.title}
                </Text>
                <Text style={[styles.privacyContent, { color: COLORS.textSecondary }]}>
                  {section.content}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* Footer */}
        <Animated.View entering={FadeInDown.delay(800).springify()} style={styles.footer}>
          <View style={[styles.footerCard, { backgroundColor: COLORS.cardBg }]}>
            <Ionicons name="lock-closed" size={32} color={COLORS.accent} />
            <Text style={[styles.footerTitle, { color: COLORS.text }]}>
              خصوصيتك مهمة لنا
            </Text>
            <Text style={[styles.footerText, { color: COLORS.textSecondary }]}>
              نحن ملتزمون بحماية معلوماتك الشخصية وضمان أمانها
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
  privacyContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  privacyCard: {
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
  privacyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
  },
  privacyContent: {
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