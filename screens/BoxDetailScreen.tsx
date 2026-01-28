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
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../App';

import SeedData from '../constants/seed-data.json';

const { width } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BoxDetail'>;
type BoxDetailRouteProp = RouteProp<RootStackParamList, 'BoxDetail'>;

const getIconForCategory = (category: string) => {
  const icons: { [key: string]: any } = {
    'تقنية': 'laptop',
    'فن': 'color-palette',
    'أدب': 'book',
    'رياضة': 'fitness',
    'سفر': 'airplane',
    'أعمال': 'briefcase',
  };
  return icons[category] || 'cube';
};

export default function BoxDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<BoxDetailRouteProp>();
  const { boxId } = route.params;
  const colorScheme = useColorScheme();
  const [isScrolled, setIsScrolled] = useState(false);

  const box = SeedData.cards.find(card => card.id === boxId);

  const scrollY = useSharedValue(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollY.value = withSpring(1);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!box) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>الصندوق غير موجود</Text>
      </SafeAreaView>
    );
  }

  // Theme Colors
  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    secondary: colorScheme === 'dark' ? '#D4B896' : '#C9A876',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const handleCreatePost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Navigate to create post screen
  };

  const handleViewAllPosts = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Navigate to all posts screen
  };

  const contentRules = [
    { icon: 'image', text: 'صورة', color: '#E8B86D' },
    { icon: 'videocam', text: 'فيديو', color: '#C4A57B' },
    { icon: 'document-text', text: 'نص', color: '#D4B896' },
    { icon: 'link', text: 'رابط', color: '#B8956A' },
  ];

  const participationRules = [
    'احترم آراء الآخرين وكن لطيفاً في التعليقات',
    'شارك محتوى أصلي وذو قيمة للمجتمع',
    'تجنب المحتوى المسيء أو المخالف',
    'استخدم العناوين الواضحة والوصفية',
    'أضف الوسوم المناسبة لتسهيل البحث',
  ];

  const writingTips = [
    {
      title: 'ابدأ بعنوان جذاب',
      description: 'اختر عنواناً واضحاً يلخص فكرتك الرئيسية',
      icon: 'create',
    },
    {
      title: 'اكتب بأسلوب واضح',
      description: 'استخدم لغة بسيطة ومباشرة لإيصال أفكارك',
      icon: 'text',
    },
    {
      title: 'أضف أمثلة عملية',
      description: 'دعم أفكارك بأمثلة واقعية تجعلها أكثر وضوحاً',
      icon: 'bulb',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header with Back Button */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={[
            styles.header,
            { 
              backgroundColor: isScrolled 
                ? COLORS.cardBg 
                : 'transparent',
            }
          ]}
        >
          <TouchableOpacity 
            onPress={handleBack}
            style={[styles.backButton, { backgroundColor: COLORS.cardBg }]}
          >
            <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>
            {isScrolled ? box.title : ''}
          </Text>
          <View style={{ width: 40 }} />
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={(e) => {
            const offsetY = e.nativeEvent.contentOffset.y;
            setIsScrolled(offsetY > 200);
          }}
          scrollEventThrottle={16}
        >
          {/* Hero Banner */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <View style={styles.heroBanner}>
              <ExpoImage
                source={{ uri: box.image }}
                style={styles.heroImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
                style={styles.heroGradient}
              />
              
              {/* Hero Content */}
              <View style={styles.heroContent}>
                <View style={[styles.heroIconContainer, { backgroundColor: COLORS.primary }]}>
                  <Ionicons 
                    name={getIconForCategory(box.category)} 
                    size={40} 
                    color="#FFF" 
                  />
                </View>
                
                <Text style={styles.heroTitle}>{box.title}</Text>
                <Text style={styles.heroDescription}>{box.description}</Text>
                
                <View style={styles.heroStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="people" size={20} color="#E8B86D" />
                    <Text style={styles.statText}>2.5k متابع</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Ionicons name="document-text" size={20} color="#E8B86D" />
                    <Text style={styles.statText}>156 منشور</Text>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* View All Posts Button */}
          <Animated.View 
            entering={FadeInUp.delay(300).springify()}
            style={styles.section}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleViewAllPosts}
              style={styles.viewAllButton}
            >
              <LinearGradient
                colors={['#C9A876', '#B8956A', '#A8855A']}
                style={styles.viewAllGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="grid" size={24} color="#FFF" />
                <Text style={styles.viewAllText}>عرض جميع المنشورات</Text>
                <Ionicons name="arrow-back" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Extended Description Card */}
          <Animated.View 
            entering={FadeInUp.delay(400).springify()}
            style={styles.section}
          >
            <View style={[styles.card, { backgroundColor: COLORS.cardBg }]}>
              <LinearGradient
                colors={colorScheme === 'dark'
                  ? ['rgba(196, 165, 123, 0.1)', 'rgba(184, 149, 106, 0.05)']
                  : ['rgba(212, 196, 176, 0.15)', 'rgba(255, 255, 255, 0.95)']}
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconBg, { backgroundColor: COLORS.primary }]}>
                    <Ionicons name="information-circle" size={24} color="#FFF" />
                  </View>
                  <Text style={[styles.cardTitle, { color: COLORS.text }]}>
                    عن الصندوق
                  </Text>
                </View>
                
                <Text style={[styles.extendedDescription, { color: COLORS.textSecondary }]}>
                  {box.description}
                  {'\n\n'}
                  هذا الصندوق مخصص لمشاركة الأفكار والمحتوى المتعلق بـ{box.category}. 
                  انضم إلى مجتمع من المهتمين والمبدعين في هذا المجال، وشارك تجاربك وأفكارك 
                  مع الآخرين. نرحب بجميع المستويات من المبتدئين إلى المحترفين.
                </Text>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Participation Rules */}
          <Animated.View 
            entering={FadeInUp.delay(500).springify()}
            style={styles.section}
          >
            <View style={[styles.card, { backgroundColor: COLORS.cardBg }]}>
              <LinearGradient
                colors={colorScheme === 'dark'
                  ? ['rgba(196, 165, 123, 0.1)', 'rgba(184, 149, 106, 0.05)']
                  : ['rgba(212, 196, 176, 0.15)', 'rgba(255, 255, 255, 0.95)']}
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconBg, { backgroundColor: COLORS.primary }]}>
                    <Ionicons name="shield-checkmark" size={24} color="#FFF" />
                  </View>
                  <Text style={[styles.cardTitle, { color: COLORS.text }]}>
                    قواعد المشاركة
                  </Text>
                </View>

                {/* Content Types */}
                <Text style={[styles.sectionSubtitle, { color: COLORS.text }]}>
                  أنواع المحتوى المسموح
                </Text>
                <View style={styles.contentTypesGrid}>
                  {contentRules.map((rule, index) => (
                    <Animated.View
                      key={index}
                      entering={FadeInRight.delay(600 + index * 80).springify()}
                    >
                      <View style={[styles.contentTypeItem, { backgroundColor: colorScheme === 'dark' ? 'rgba(196, 165, 123, 0.12)' : 'rgba(184, 149, 106, 0.08)' }]}>
                        <View style={[styles.contentTypeIcon, { backgroundColor: rule.color }]}>
                          <Ionicons name={rule.icon as any} size={20} color="#FFF" />
                        </View>
                        <Text style={[styles.contentTypeText, { color: COLORS.text }]}>
                          {rule.text}
                        </Text>
                      </View>
                    </Animated.View>
                  ))}
                </View>

                {/* Rules List */}
                <Text style={[styles.sectionSubtitle, { color: COLORS.text, marginTop: 20 }]}>
                  القواعد الأساسية
                </Text>
                <View style={styles.rulesList}>
                  {participationRules.map((rule, index) => (
                    <Animated.View
                      key={index}
                      entering={FadeInRight.delay(700 + index * 80).springify()}
                    >
                      <View style={styles.ruleItem}>
                        <View style={[styles.ruleBullet, { backgroundColor: COLORS.accent }]}>
                          <Text style={styles.ruleBulletText}>{index + 1}</Text>
                        </View>
                        <Text style={[styles.ruleText, { color: COLORS.textSecondary }]}>
                          {rule}
                        </Text>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Writing Tips */}
          <Animated.View 
            entering={FadeInUp.delay(800).springify()}
            style={styles.section}
          >
            <View style={[styles.card, { backgroundColor: COLORS.cardBg }]}>
              <LinearGradient
                colors={colorScheme === 'dark'
                  ? ['rgba(196, 165, 123, 0.1)', 'rgba(184, 149, 106, 0.05)']
                  : ['rgba(212, 196, 176, 0.15)', 'rgba(255, 255, 255, 0.95)']}
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.cardIconBg, { backgroundColor: COLORS.primary }]}>
                    <Ionicons name="bulb" size={24} color="#FFF" />
                  </View>
                  <Text style={[styles.cardTitle, { color: COLORS.text }]}>
                    نصائح للكتابة في هذا الصندوق
                  </Text>
                </View>

                <View style={styles.tipsList}>
                  {writingTips.map((tip, index) => (
                    <Animated.View
                      key={index}
                      entering={FadeInUp.delay(900 + index * 100).springify()}
                    >
                      <View style={[styles.tipCard, { backgroundColor: colorScheme === 'dark' ? 'rgba(196, 165, 123, 0.12)' : 'rgba(184, 149, 106, 0.08)' }]}>
                        <View style={[styles.tipIconBg, { backgroundColor: COLORS.primary }]}>
                          <Ionicons name={tip.icon as any} size={24} color="#FFF" />
                        </View>
                        <View style={styles.tipContent}>
                          <Text style={[styles.tipTitle, { color: COLORS.text }]}>
                            {tip.title}
                          </Text>
                          <Text style={[styles.tipDescription, { color: COLORS.textSecondary }]}>
                            {tip.description}
                          </Text>
                        </View>
                      </View>
                    </Animated.View>
                  ))}
                </View>
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Bottom Spacing for Sticky Button */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Sticky Create Post Button */}
        <Animated.View 
          entering={FadeInUp.delay(1000).springify()}
          style={styles.stickyButtonContainer}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCreatePost}
            style={styles.createPostButton}
          >
            <LinearGradient
              colors={['#E8B86D', '#D4A574', '#C9956A']}
              style={styles.createPostGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="add-circle" size={28} color="#FFF" />
              <Text style={styles.createPostText}>إنشاء منشور</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    flex: 1,
    textAlign: 'center',
  },

  // Hero Banner
  heroBanner: {
    width: '100%',
    height: 400,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    alignItems: 'center',
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Cairo_700Bold',
  },
  heroDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Tajawal_400Regular',
  },
  heroStats: {
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
    fontSize: 14,
    color: '#FFF',
    fontFamily: 'Tajawal_500Medium',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    flex: 1,
    textAlign: 'center',
  },

  // Card
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#B8956A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
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
    marginBottom: 20,
  },
  cardIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    flex: 1,
    textAlign: 'right',
  },
  extendedDescription: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },

  // Section Subtitle
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_600SemiBold',
    marginBottom: 16,
    textAlign: 'right',
  },

  // Content Types
  contentTypesGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 12,
  },
  contentTypeItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  contentTypeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentTypeText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Tajawal_500Medium',
  },

  // Rules List
  rulesList: {
    gap: 12,
  },
  ruleItem: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 12,
  },
  ruleBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  ruleBulletText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  ruleText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },

  // Tips List
  tipsList: {
    gap: 16,
  },
  tipCard: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 16,
    padding: 16,
    borderRadius: 20,
  },
  tipIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 6,
    textAlign: 'right',
  },
  tipDescription: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },

  // Sticky Button
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  createPostButton: {
    borderRadius: 24,
    overflow: 'hidden',
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
  createPostGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
  createPostText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
});