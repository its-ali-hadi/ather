import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Dimensions, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  useColorScheme, 
  View, 
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  FadeInUp,
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { useEffect, useState, useRef } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList, TabParamList } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

import OnboardingOverlay, { OnboardingStep } from '../components/OnboardingOverlay';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.88;
const BANNER_HEIGHT = 280;

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

// Static data for banners and about section
const STATIC_DATA = {
  banners: [
    {
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80',
      text: 'شارك أفكارك مع العالم',
      icon: 'bulb'
    },
    {
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      text: 'تواصل مع المبدعين',
      icon: 'people'
    },
    {
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80',
      text: 'اكتشف مواضيع جديدة',
      icon: 'compass'
    }
  ],
  about: {
    title: 'عن منصة أثر',
    description: 'أثر هي مساحة مخصصة لنشر الأفكار ومشاركتها مع الآخرين. اكتشف مواضيع متنوعة وشارك إبداعاتك مع مجتمع من المفكرين والمبدعين واترك أثرك في العالم',
    list: [
      { icon: 'create', text: 'انشر أفكارك بحرية' },
      { icon: 'people-circle', text: 'تواصل مع المبدعين' },
      { icon: 'trending-up', text: 'تابع المواضيع الرائجة' },
      { icon: 'bookmark', text: 'احفظ ما يهمك' }
    ],
    button: 'ابدأ رحلتك'
  },
  cards: [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80',
      title: 'صندوق التقنية والبرمجة',
      description: 'أحدث الأفكار والمشاريع في عالم التقنية والبرمجة والذكاء الاصطناعي',
      category: 'تقنية',
      icon: 'code-slash'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?w=800&q=80',
      title: 'صندوق الفن والإبداع',
      description: 'مساحة للفنانين والمبدعين لمشاركة أعمالهم وإلهام الآخرين',
      category: 'فن',
      icon: 'color-palette'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
      title: 'صندوق الكتابة والأدب',
      description: 'قصص وأفكار أدبية من كتّاب موهوبين حول العالم',
      category: 'أدب',
      icon: 'book'
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
      title: 'صندوق الرياضة واللياقة',
      description: 'نصائح وتجارب رياضية لحياة صحية ونشطة',
      category: 'رياضة',
      icon: 'fitness'
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
      title: 'صندوق السفر والمغامرات',
      description: 'تجارب سفر مذهلة ووجهات سياحية من حول العالم',
      category: 'سفر',
      icon: 'airplane'
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
      title: 'صندوق ريادة الأعمال',
      description: 'أفكار ونصائح لرواد الأعمال والمشاريع الناشئة',
      category: 'أعمال',
      icon: 'briefcase'
    }
  ]
};

export default function HomeScreen({ navigation }: Props) {
  const { banners, about, cards } = STATIC_DATA;
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { isGuest, logout, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Refs for measuring positions
  const scrollViewRef = useRef<ScrollView>(null);
  const notificationButtonRef = useRef<View>(null);
  const aboutDescriptionRef = useRef<View>(null);
  const ctaButtonRef = useRef<View>(null);

  // Animated values
  const floatAnim = useSharedValue(0);
  const bulbScale = useSharedValue(1.5);

  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 }),
        withTiming(0, { duration: 3000 })
      ),
      -1,
      true
    );

    bulbScale.value = withSpring(1, {
      damping: 8,
      stiffness: 100,
      mass: 1,
    });
  }, [floatAnim, bulbScale]);

  // Check if user has seen tutorial
  useEffect(() => {
    const checkTutorial = async () => {
      try {
        const seen = await AsyncStorage.getItem('hasSeenTutorial');
        if (!seen) {
          setTimeout(() => {
            setShowOnboarding(true);
          }, 1000);
          await AsyncStorage.setItem('hasSeenTutorial', 'true');
        }
      } catch (error) {
        console.error('Error checking tutorial status:', error);
      }
    };

    checkTutorial();
  }, []);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    secondary: colorScheme === 'dark' ? '#D4B896' : '#C9A876',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    overlay: colorScheme === 'dark' ? 'rgba(26, 22, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
  };

  // Onboarding steps
  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'مرحباً بك في أثر! 👋',
      description: 'منصة لمشاركة الأفكار والإبداع. دعنا نأخذك في جولة سريعة',
    },
    {
      id: 'explore',
      title: 'استكشف الأفكار 🔍',
      description: 'تصفح الأفكار المميزة واكتشف محتوى جديد من المبدعين',
    },
    {
      id: 'create',
      title: 'شارك إبداعك ✨',
      description: 'انشر أفكارك وشارك إبداعك مع المجتمع',
    },
    {
      id: 'navigation',
      title: 'التنقل السهل 🎯',
      description: 'استخدم شريط التنقل للوصول السريع لجميع الأقسام',
    },
  ];

  const floatingStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(floatAnim.value, [0, 1], [0, -15]) },
        { scale: interpolate(floatAnim.value, [0, 1], [1, 1.02]) }
      ],
    };
  });

  const bulbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bulbScale.value }],
    };
  });

  const handleGuestAction = async (actionName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'تسجيل الدخول مطلوب',
      `يجب عليك تسجيل الدخول لـ${actionName}`,
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
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCardPress = (boxId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('BoxDetail', { boxId });
  };

  const handleFeaturePress = (featureText: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    switch (featureText) {
      case 'انشر أفكارك بحرية':
        if (isGuest) {
          handleGuestAction('إنشاء منشور');
          return;
        }
        navigation.navigate('Create' as any);
        break;
      case 'تواصل مع المبدعين':
        break;
      case 'تابع المواضيع الرائجة':
        navigation.navigate('Explore' as any);
        break;
      case 'احفظ ما يهمك':
        if (isGuest) {
          handleGuestAction('حفظ المنشورات');
          return;
        }
        navigation.navigate('Favorites');
        break;
      default:
        break;
    }
  };

  const handleStartJourney = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (user && !isGuest) {
      navigation.navigate('Profile' as any);
    } else {
      handleGuestAction('الوصول للملف الشخصي');
    }
  };

  const handleResetTutorial = async () => {
    try {
      await AsyncStorage.removeItem('hasSeenTutorial');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCurrentStepIndex(0);
      setShowOnboarding(true);
    } catch (error) {
      console.error('Error resetting tutorial:', error);
    }
  };

  const handleOnboardingNext = () => {
    if (currentStepIndex < onboardingSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleOnboardingPrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    setCurrentStepIndex(0);
  };

  const handleOnboardingFinish = () => {
    setShowOnboarding(false);
    setCurrentStepIndex(0);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 120 + insets.bottom : 100 }}
      >
        {/* Hero Header with Gradient */}
        <LinearGradient
          colors={colorScheme === 'dark' 
            ? ['#3A3228', '#2A2420', COLORS.background] 
            : ['#D4C4B0', '#C9B89E', COLORS.background]}
          style={styles.heroSection}
        >
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.heroContent}>
            <TouchableOpacity 
              onLongPress={handleResetTutorial}
              activeOpacity={0.8}
              style={styles.heroIconContainer}
            >
              <Animated.View style={bulbStyle}>
                <LinearGradient
                  colors={['#E8B86D', '#D4A574', '#C9956A']}
                  style={styles.heroIconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="bulb" size={48} color="#FFF" />
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
            
            <Text style={[styles.heroTitle, { color: colorScheme === 'dark' ? '#F5E6D3' : '#FFF' }]}>
              أثر
            </Text>
            <Text style={[styles.heroSubtitle, { color: colorScheme === 'dark' ? '#D4C4B0' : 'rgba(255,255,255,0.95)' }]}>
              شارك أفكارك واترك أثرك في العالم
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* Premium Banners */}
        <View style={styles.section}>
          <Animated.View entering={FadeInRight.delay(200).springify()} style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={[styles.sectionDot, { backgroundColor: COLORS.accent }]} />
              <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
                مميز اليوم
              </Text>
            </View>
            <TouchableOpacity onPress={handlePress}>
              <Text style={[styles.seeAll, { color: COLORS.primary }]}>
                عرض الكل
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 20}
            decelerationRate="fast"
            contentContainerStyle={styles.bannersContainer}
          >
            {banners.map((item, index) => (
              <Animated.View 
                key={index}
                entering={FadeInRight.delay(300 + index * 100).springify()}
              >
                <TouchableOpacity 
                  activeOpacity={0.9}
                  onPress={handlePress}
                  style={[styles.bannerCard, { width: CARD_WIDTH }]}
                >
                  <ExpoImage 
                    source={{ uri: item.image }} 
                    style={styles.bannerImage}
                    contentFit="cover"
                  />
                  
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
                    style={styles.bannerGradient}
                  />

                  <View style={styles.bannerBadge}>
                    <LinearGradient
                      colors={['#E8B86D', '#D4A574']}
                      style={styles.badgeGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name="star" size={14} color="#FFF" />
                      <Text style={styles.badgeText}>جديد</Text>
                    </LinearGradient>
                  </View>

                  <BlurView intensity={30} tint="dark" style={styles.bannerContent}>
                    <View style={styles.bannerIconWrapper}>
                      <LinearGradient
                        colors={['rgba(232, 184, 109, 0.3)', 'rgba(212, 165, 116, 0.2)']}
                        style={styles.bannerIconBg}
                      >
                        <Ionicons name={item.icon as any || 'bulb'} size={28} color="#E8B86D" />
                      </LinearGradient>
                    </View>
                    <Text style={styles.bannerTitle}>{item.text}</Text>
                    <View style={styles.bannerArrow}>
                      <Ionicons name="arrow-back" size={20} color="#E8B86D" />
                    </View>
                  </BlurView>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* About Section - Premium Card */}
        <Animated.View 
          entering={FadeInUp.delay(500).springify()} 
          style={styles.section}
        >
          <View style={[styles.aboutCard, { backgroundColor: COLORS.cardBg }]}>
            <LinearGradient
              colors={colorScheme === 'dark'
                ? ['rgba(196, 165, 123, 0.1)', 'rgba(184, 149, 106, 0.05)']
                : ['rgba(212, 196, 176, 0.15)', 'rgba(255, 255, 255, 0.95)']}
              style={styles.aboutGradient}
            >
              {/* Decorative Elements */}
              <View style={styles.decorativeTop}>
                <View style={[styles.decorativeLine, { backgroundColor: COLORS.accent }]} />
                <Ionicons name="diamond" size={16} color={COLORS.accent} />
                <View style={[styles.decorativeLine, { backgroundColor: COLORS.accent }]} />
              </View>

              <View style={styles.aboutHeader}>
                <View style={[styles.aboutIconContainer, { backgroundColor: COLORS.primary }]}>
                  <Ionicons name="bulb" size={32} color="#FFF" />
                </View>
                <Text style={[styles.aboutTitle, { color: COLORS.text }]}>
                  {about.title}
                </Text>
              </View>

              <View ref={aboutDescriptionRef} collapsable={false}>
                <Text style={[styles.aboutDescription, { color: COLORS.textSecondary }]}>
                  {about.description}
                </Text>
              </View>

              <View style={styles.featuresList}>
                {about.list.map((item, index) => (
                  <Animated.View
                    key={index}
                    entering={FadeInRight.delay(600 + index * 80).springify()}
                  >
                    <TouchableOpacity 
                      activeOpacity={0.8}
                      onPress={() => handleFeaturePress(item.text)}
                      style={[styles.featureItem, { 
                        backgroundColor: colorScheme === 'dark' 
                          ? 'rgba(196, 165, 123, 0.12)' 
                          : 'rgba(184, 149, 106, 0.08)' 
                      }]}
                    >
                      <View style={[styles.featureIconBg, { backgroundColor: COLORS.primary }]}>
                        <Ionicons name={item.icon as any} size={20} color="#FFF" />
                      </View>
                      <Text style={[styles.featureText, { color: COLORS.text }]}>
                        {item.text}
                      </Text>
                      <Ionicons name="chevron-back" size={18} color={COLORS.textSecondary} />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>

              <TouchableOpacity 
                activeOpacity={0.85}
                onPress={handleStartJourney}
                style={styles.ctaButton}
              >
                <View ref={ctaButtonRef} collapsable={false}>
                  <LinearGradient
                    colors={['#C9A876', '#B8956A', '#A8855A']}
                    style={styles.ctaGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.ctaText}>{about.button}</Text>
                    <View style={styles.ctaIconBg}>
                      <Ionicons name="arrow-back" size={18} color="#B8956A" />
                    </View>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Premium Cards Grid */}
        <View style={styles.section}>
          <Animated.View entering={FadeInRight.delay(700).springify()} style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={[styles.sectionDot, { backgroundColor: COLORS.accent }]} />
              <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
                صناديق الأفكار
              </Text>
            </View>
            <View style={[styles.countBadge, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.countText}>{cards.length}</Text>
            </View>
          </Animated.View>

          <View style={styles.cardsGrid}>
            {cards.map((card, index) => (
              <Animated.View
                key={index}
                entering={FadeInUp.delay(800 + index * 120).springify()}
                style={styles.cardWrapper}
              >
                <TouchableOpacity
                  activeOpacity={0.92}
                  onPress={() => handleCardPress(card.id)}
                >
                  <Animated.View style={[floatingStyle, styles.premiumCard, { backgroundColor: COLORS.cardBg }]}>
                    {/* Card Image */}
                    <View style={styles.cardImageWrapper}>
                      <ExpoImage
                        source={{ uri: card.image }}
                        style={styles.cardImage}
                        contentFit="cover"
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.4)']}
                        style={styles.cardImageOverlay}
                      />
                      
                      {/* Premium Badge */}
                      <View style={styles.premiumBadge}>
                        <LinearGradient
                          colors={['#E8B86D', '#D4A574']}
                          style={styles.premiumBadgeGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Ionicons name="star" size={12} color="#FFF" />
                          <Text style={styles.premiumBadgeText}>مميز</Text>
                        </LinearGradient>
                      </View>

                      {/* Favorite Icon */}
                      <TouchableOpacity 
                        style={styles.favoriteButton}
                        onPress={handlePress}
                      >
                        <BlurView intensity={40} tint="dark" style={styles.favoriteBlur}>
                          <Ionicons name="heart-outline" size={20} color="#FFF" />
                        </BlurView>
                      </TouchableOpacity>
                    </View>

                    {/* Card Content */}
                    <LinearGradient
                      colors={colorScheme === 'dark'
                        ? ['rgba(42, 36, 32, 0.98)', 'rgba(26, 22, 18, 0.95)']
                        : ['rgba(255, 255, 255, 0.98)', 'rgba(250, 248, 245, 0.95)']}
                      style={styles.cardContentWrapper}
                    >
                      <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: COLORS.text }]} numberOfLines={1}>
                          {card.title}
                        </Text>
                        <View style={[styles.ratingBadge, { backgroundColor: COLORS.primary }]}>
                          <Ionicons name="star" size={12} color="#E8B86D" />
                          <Text style={styles.ratingText}>4.9</Text>
                        </View>
                      </View>

                      <Text style={[styles.cardDescription, { color: COLORS.textSecondary }]} numberOfLines={2}>
                        {card.description}
                      </Text>

                      <View style={styles.cardFooter}>
                        <View style={[styles.categoryTag, { backgroundColor: colorScheme === 'dark' ? 'rgba(196, 165, 123, 0.15)' : 'rgba(184, 149, 106, 0.12)' }]}>
                          <Ionicons name="pricetag" size={12} color={COLORS.primary} />
                          <Text style={[styles.categoryText, { color: COLORS.primary }]}>
                            {card.category}
                          </Text>
                        </View>

                        <View style={[styles.actionButton, { backgroundColor: COLORS.primary }]}>
                          <Ionicons name="arrow-back" size={16} color="#FFF" />
                        </View>
                      </View>
                    </LinearGradient>
                  </Animated.View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Sticky Notifications Button - Only show for logged in users */}
      {!isGuest && user && (
        <TouchableOpacity
          ref={notificationButtonRef}
          activeOpacity={0.85}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate('Notifications' as any);
          }}
          style={[styles.stickyNotificationButton, { 
            backgroundColor: COLORS.accent,
          }]}
        >
          <Ionicons name="notifications" size={28} color="#FFF" />
          {/* Notification Badge */}
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Onboarding Overlay */}
      <OnboardingOverlay
        visible={showOnboarding}
        steps={onboardingSteps}
        currentStepIndex={currentStepIndex}
        onNext={handleOnboardingNext}
        onPrevious={handleOnboardingPrevious}
        onSkip={handleOnboardingSkip}
        onFinish={handleOnboardingFinish}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Hero Section
  heroSection: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroIconContainer: {
    marginBottom: 20,
  },
  heroIconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
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
  heroTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Cairo_700Bold',
    letterSpacing: 2,
  },
  heroSubtitle: {
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'Tajawal_400Regular',
  },

  // Section
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  sectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  seeAll: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Tajawal_500Medium',
  },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },

  // Banners
  bannersContainer: {
    paddingHorizontal: 24,
    gap: 20,
  },
  bannerCard: {
    height: BANNER_HEIGHT,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
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
    height: '70%',
  },
  bannerBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  bannerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
    overflow: 'hidden',
  },
  bannerIconWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  bannerIconBg: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(232, 184, 109, 0.3)',
  },
  bannerTitle: {
    flex: 1,
    fontSize: 21,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'right',
    fontFamily: 'Cairo_700Bold',
  },
  bannerArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(232, 184, 109, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // About Card
  aboutCard: {
    marginHorizontal: 24,
    borderRadius: 28,
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
  aboutGradient: {
    padding: 28,
  },
  decorativeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  decorativeLine: {
    width: 40,
    height: 2,
    borderRadius: 1,
  },
  aboutHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  aboutIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Cairo_700Bold',
  },
  aboutDescription: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'right',
    marginBottom: 24,
    fontFamily: 'Tajawal_400Regular',
  },
  featuresList: {
    gap: 12,
    marginBottom: 28,
  },
  featureItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 20,
  },
  featureIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
    fontFamily: 'Tajawal_500Medium',
  },
  ctaButton: {
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
  ctaGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  ctaText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  ctaIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Premium Cards
  cardsGrid: {
    paddingHorizontal: 24,
    gap: 20,
  },
  cardWrapper: {
    marginBottom: 4,
  },
  premiumCard: {
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardImageWrapper: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  premiumBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  premiumBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  premiumBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  favoriteBlur: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardContentWrapper: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Cairo_700Bold',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    marginBottom: 16,
    fontFamily: 'Tajawal_400Regular',
  },
  cardFooter: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryTag: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyNotificationButton: {
    position: 'absolute',
    left: 24,
    top: 60,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: '#E8B86D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#E94B3C',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  notificationBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
});
