import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View, Platform } from 'react-native';
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
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SeedData from '../constants/seed-data.json';

const CopilotView = walkthroughable(View);
const CopilotTouchableOpacity = walkthroughable(TouchableOpacity);

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.88;
const BANNER_HEIGHT = 280;

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const { banners, about, cards, isLogged } = SeedData;
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { start, currentStep } = useCopilot();
  const [hasSeenTutorial, setHasSeenTutorial] = useState(true);

  // Refs for scrolling
  const scrollViewRef = useRef<ScrollView>(null);
  const aboutSectionRef = useRef<View>(null);
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
          setHasSeenTutorial(false);
          // Start tutorial after a short delay
          setTimeout(() => {
            start();
          }, 1000);
          // Mark as seen
          await AsyncStorage.setItem('hasSeenTutorial', 'true');
        }
      } catch (error) {
        console.error('Error checking tutorial status:', error);
      }
    };

    checkTutorial();
  }, [start]);

  // Auto scroll based on current step
  useEffect(() => {
    if (!currentStep) return;

    const scrollToElement = () => {
      if (currentStep.order === 2 && aboutSectionRef.current) {
        // Scroll to about section - at the beginning
        aboutSectionRef.current.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({
              y: y - 20, // Small offset to show it's at the beginning
              animated: true,
            });
          },
          () => {}
        );
      } else if (currentStep.order === 3 && ctaButtonRef.current) {
        // Scroll to CTA button
        ctaButtonRef.current.measureLayout(
          scrollViewRef.current as any,
          (x, y) => {
            scrollViewRef.current?.scrollTo({
              y: y - 200, // Better offset to show the button clearly
              animated: true,
            });
          },
          () => {}
        );
      } else if (currentStep.order === 1) {
        // Scroll to top for notifications button
        scrollViewRef.current?.scrollTo({
          y: 0,
          animated: true,
        });
      }
    };

    // Delay to ensure layout is ready
    setTimeout(scrollToElement, 300);
  }, [currentStep]);

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

  const floatingStyle = useAnimatedStyle(() => {
    const translateY = interpolate(floatAnim.value, [0, 1], [0, -15]);
    const scale = interpolate(floatAnim.value, [0, 1], [1, 1.02]);
    
    return {
      transform: [
        { translateY },
        { scale }
      ],
    };
  });

  const bulbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bulbScale.value }],
    };
  });

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
        navigation.navigate('Create' as any);
        break;
      case 'تواصل مع المبدعين':
        // يبقى مثل ما هو - لا يفعل شيء
        break;
      case 'تابع المواضيع الرائجة':
        navigation.navigate('Explore' as any);
        break;
      case 'احفظ ما يهمك':
        navigation.navigate('Favorites');
        break;
      default:
        break;
    }
  };

  const handleStartJourney = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isLogged) {
      navigation.navigate('Profile' as any);
    } else {
      navigation.navigate('Auth');
    }
  };

  // Reset tutorial - for testing
  const handleResetTutorial = async () => {
    try {
      await AsyncStorage.removeItem('hasSeenTutorial');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setHasSeenTutorial(false);
      // Restart tutorial after a short delay
      setTimeout(() => {
        start();
      }, 500);
    } catch (error) {
      console.error('Error resetting tutorial:', error);
    }
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
          ref={aboutSectionRef}
          collapsable={false}
        >
          <CopilotStep
            text="هنا تقدر تتعرف على منصة أثر وميزاتها المختلفة"
            order={2}
            name="about"
          >
            <CopilotView style={[styles.aboutCard, { backgroundColor: COLORS.cardBg }]}>
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

                <Text style={[styles.aboutDescription, { color: COLORS.textSecondary }]}>
                  {about.description}
                </Text>

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

                <CopilotStep
                  text="اضغط هنا لبدء رحلتك في منصة أثر وإنشاء حسابك"
                  order={3}
                  name="startJourney"
                >
                  <CopilotTouchableOpacity 
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
                  </CopilotTouchableOpacity>
                </CopilotStep>
              </LinearGradient>
            </CopilotView>
          </CopilotStep>
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

      {/* Sticky Auth Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          navigation.navigate('Auth');
        }}
        style={[styles.stickyAuthButton, { 
          backgroundColor: COLORS.accent,
          bottom: Platform.OS === 'ios' ? 140 + insets.bottom : 120,
        }]}
      >
        <Ionicons name="person-circle" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Sticky Notifications Button */}
      <CopilotStep
        text="من هنا تقدر تشوف الإشعارات والتحديثات الجديدة"
        order={1}
        name="notifications"
      >
        <CopilotTouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate('Notifications');
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
        </CopilotTouchableOpacity>
      </CopilotStep>
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
  stickyAuthButton: {
    position: 'absolute',
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
  stickyNotificationButton: {
    position: 'absolute',
    left: 24,
    top: 60,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
