import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View, Platform } from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeInUp,
  FadeInRight,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 320;

type BoxDetailScreenProps = {
  box: any;
  onBack: () => void;
};

export default function BoxDetailScreen({ box, onBack }: BoxDetailScreenProps) {
  const colorScheme = useColorScheme();

  // Use the passed box data or fallback to mock data
  const boxData = box || {
    id: '1',
    title: 'صندوق التقنية والبرمجة',
    shortDescription: 'أحدث الأفكار والمشاريع في عالم التقنية',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80',
    category: 'تقنية',
    postsCount: 1247,
    membersCount: 8542,
    fullDescription: 'صندوق التقنية والبرمجة هو مساحة مخصصة لمشاركة أحدث الأفكار والمشاريع في عالم التقنية والبرمجة والذكاء الاصطناعي. انضم إلى مجتمع من المطورين والمبرمجين المحترفين وشارك خبراتك وتعلم من الآخرين.',
    rules: {
      required: [
        { type: 'image', label: 'صورة توضيحية', icon: 'image' },
        { type: 'text', label: 'وصف تفصيلي', icon: 'document-text' },
        { type: 'code', label: 'كود برمجي (اختياري)', icon: 'code-slash' },
        { type: 'link', label: 'رابط المشروع', icon: 'link' },
      ],
      guidelines: [
        'يجب أن يكون المحتوى متعلقاً بالتقنية والبرمجة',
        'احترم حقوق الملكية الفكرية',
        'استخدم لغة واضحة ومهنية',
        'شارك مصادر موثوقة فقط',
        'تجنب المحتوى الترويجي المباشر',
      ],
    },
    suggestions: [
      {
        id: '1',
        title: 'مشاريع الذكاء الاصطناعي',
        description: 'شارك مشاريعك في مجال الذكاء الاصطناعي والتعلم الآلي',
        icon: 'bulb',
      },
      {
        id: '2',
        title: 'تطوير تطبيقات الموبايل',
        description: 'أفكار وتجارب في تطوير تطبيقات iOS و Android',
        icon: 'phone-portrait',
      },
      {
        id: '3',
        title: 'تطوير الويب',
        description: 'أحدث التقنيات والأدوات في تطوير المواقع',
        icon: 'globe',
      },
      {
        id: '4',
        title: 'أمن المعلومات',
        description: 'نصائح وأفضل الممارسات في أمن المعلومات',
        icon: 'shield-checkmark',
      },
    ],
  };

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    secondary: colorScheme === 'dark' ? '#D4B896' : '#C9A876',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Banner */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <View style={styles.bannerContainer}>
            <ExpoImage 
              source={{ uri: boxData.image }} 
              style={styles.bannerImage}
              contentFit="cover"
            />
            
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
              style={styles.bannerGradient}
            />

            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <BlurView intensity={40} tint="dark" style={styles.backButtonBlur}>
                <Ionicons name="arrow-forward" size={24} color="#FFF" />
              </BlurView>
            </TouchableOpacity>

            {/* Banner Content */}
            <View style={styles.bannerContent}>
              <View style={styles.categoryBadge}>
                <LinearGradient
                  colors={['#E8B86D', '#D4A574']}
                  style={styles.categoryBadgeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="pricetag" size={14} color="#FFF" />
                  <Text style={styles.categoryBadgeText}>{boxData.category}</Text>
                </LinearGradient>
              </View>

              <Text style={styles.bannerTitle}>{boxData.title}</Text>
              <Text style={styles.bannerDescription}>{boxData.shortDescription || boxData.description}</Text>

              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Ionicons name="document-text" size={20} color="#E8B86D" />
                  <Text style={styles.statText}>{(boxData.postsCount || 1247).toLocaleString()} منشور</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Ionicons name="people" size={20} color="#E8B86D" />
                  <Text style={styles.statText}>{(boxData.membersCount || 8542).toLocaleString()} عضو</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* View All Posts Button */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.section}>
          <TouchableOpacity 
            activeOpacity={0.85}
            onPress={handlePress}
            style={styles.viewAllButton}
          >
            <LinearGradient
              colors={['#C9A876', '#B8956A', '#A8855A']}
              style={styles.viewAllGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="grid" size={22} color="#FFF" />
              <Text style={styles.viewAllText}>عرض جميع المنشورات</Text>
              <View style={styles.viewAllIconBg}>
                <Ionicons name="arrow-back" size={18} color="#B8956A" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Full Description Card */}
        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.section}>
          <View style={[styles.card, { backgroundColor: COLORS.cardBg }]}>
            <LinearGradient
              colors={colorScheme === 'dark'
                ? ['rgba(196, 165, 123, 0.1)', 'rgba(184, 149, 106, 0.05)']
                : ['rgba(212, 196, 176, 0.15)', 'rgba(255, 255, 255, 0.95)']}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconContainer, { backgroundColor: COLORS.primary }]}>
                  <Ionicons name="information-circle" size={24} color="#FFF" />
                </View>
                <Text style={[styles.cardTitle, { color: COLORS.text }]}>
                  عن الصندوق
                </Text>
              </View>

              <Text style={[styles.cardDescription, { color: COLORS.textSecondary }]}>
                {boxData.fullDescription}
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Rules Card */}
        <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.section}>
          <View style={[styles.card, { backgroundColor: COLORS.cardBg }]}>
            <LinearGradient
              colors={colorScheme === 'dark'
                ? ['rgba(196, 165, 123, 0.1)', 'rgba(184, 149, 106, 0.05)']
                : ['rgba(212, 196, 176, 0.15)', 'rgba(255, 255, 255, 0.95)']}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconContainer, { backgroundColor: COLORS.primary }]}>
                  <Ionicons name="shield-checkmark" size={24} color="#FFF" />
                </View>
                <Text style={[styles.cardTitle, { color: COLORS.text }]}>
                  قواعد المشاركة
                </Text>
              </View>

              {/* Required Items */}
              <Text style={[styles.sectionSubtitle, { color: COLORS.text }]}>
                المتطلبات الأساسية:
              </Text>
              <View style={styles.requiredItemsGrid}>
                {boxData.rules.required.map((item, index) => (
                  <Animated.View
                    key={index}
                    entering={FadeInRight.delay(500 + index * 80).springify()}
                  >
                    <View style={[styles.requiredItem, { 
                      backgroundColor: colorScheme === 'dark' 
                        ? 'rgba(196, 165, 123, 0.12)' 
                        : 'rgba(184, 149, 106, 0.08)' 
                    }]}>
                      <View style={[styles.requiredIconBg, { backgroundColor: COLORS.primary }]}>
                        <Ionicons name={item.icon as any} size={20} color="#FFF" />
                      </View>
                      <Text style={[styles.requiredItemText, { color: COLORS.text }]}>
                        {item.label}
                      </Text>
                    </View>
                  </Animated.View>
                ))}
              </View>

              {/* Guidelines */}
              <Text style={[styles.sectionSubtitle, { color: COLORS.text, marginTop: 24 }]}>
                الإرشادات:
              </Text>
              <View style={styles.guidelinesList}>
                {boxData.rules.guidelines.map((guideline, index) => (
                  <Animated.View
                    key={index}
                    entering={FadeInRight.delay(600 + index * 60).springify()}
                  >
                    <View style={styles.guidelineItem}>
                      <View style={[styles.bulletPoint, { backgroundColor: COLORS.accent }]} />
                      <Text style={[styles.guidelineText, { color: COLORS.textSecondary }]}>
                        {guideline}
                      </Text>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Content Suggestions Card */}
        <Animated.View entering={FadeInUp.delay(700).springify()} style={styles.section}>
          <View style={[styles.card, { backgroundColor: COLORS.cardBg }]}>
            <LinearGradient
              colors={colorScheme === 'dark'
                ? ['rgba(196, 165, 123, 0.1)', 'rgba(184, 149, 106, 0.05)']
                : ['rgba(212, 196, 176, 0.15)', 'rgba(255, 255, 255, 0.95)']}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconContainer, { backgroundColor: COLORS.primary }]}>
                  <Ionicons name="bulb" size={24} color="#FFF" />
                </View>
                <Text style={[styles.cardTitle, { color: COLORS.text }]}>
                  مقترحات للمحتوى
                </Text>
              </View>

              <Text style={[styles.cardDescription, { color: COLORS.textSecondary, marginBottom: 20 }]}>
                إليك بعض الأفكار التي يمكنك مشاركتها في هذا الصندوق:
              </Text>

              <View style={styles.suggestionsList}>
                {boxData.suggestions.map((suggestion, index) => (
                  <Animated.View
                    key={suggestion.id}
                    entering={FadeInUp.delay(800 + index * 100).springify()}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={handlePress}
                      style={[styles.suggestionItem, { 
                        backgroundColor: colorScheme === 'dark' 
                          ? 'rgba(196, 165, 123, 0.12)' 
                          : 'rgba(184, 149, 106, 0.08)' 
                      }]}
                    >
                      <View style={[styles.suggestionIconBg, { backgroundColor: COLORS.primary }]}>
                        <Ionicons name={suggestion.icon as any} size={24} color="#FFF" />
                      </View>
                      <View style={styles.suggestionContent}>
                        <Text style={[styles.suggestionTitle, { color: COLORS.text }]}>
                          {suggestion.title}
                        </Text>
                        <Text style={[styles.suggestionDescription, { color: COLORS.textSecondary }]}>
                          {suggestion.description}
                        </Text>
                      </View>
                      <Ionicons name="chevron-back" size={20} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Banner
  bannerContainer: {
    height: BANNER_HEIGHT,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  backButtonBlur: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  categoryBadgeGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryBadgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'right',
    marginBottom: 8,
    fontFamily: 'Cairo_700Bold',
  },
  bannerDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'right',
    marginBottom: 16,
    fontFamily: 'Tajawal_400Regular',
  },
  statsContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // Section
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },

  // View All Button
  viewAllButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#B8956A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  viewAllGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  viewAllText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    flex: 1,
    textAlign: 'center',
  },
  viewAllIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Card
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#B8956A',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardGradient: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Cairo_700Bold',
  },
  cardDescription: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },

  // Rules Section
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 16,
    fontFamily: 'Cairo_600SemiBold',
  },
  requiredItemsGrid: {
    gap: 12,
  },
  requiredItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
  },
  requiredIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requiredItemText: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Tajawal_500Medium',
  },
  guidelinesList: {
    gap: 12,
  },
  guidelineItem: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 12,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  guidelineText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },

  // Suggestions
  suggestionsList: {
    gap: 12,
  },
  suggestionItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 20,
  },
  suggestionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 4,
    fontFamily: 'Cairo_700Bold',
  },
  suggestionDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },
});
