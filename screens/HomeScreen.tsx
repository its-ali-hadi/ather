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
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import SeedData from '../constants/seed-data.json';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.88;
const BANNER_HEIGHT = 280;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function HomeScreen() {
  const { banners, about, cards } = SeedData;
  const colorScheme = useColorScheme();

  // Animated values
  const floatAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(0);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 }),
        withTiming(0, { duration: 3000 })
      ),
      -1,
      true
    );

    pulseAnim.value = withRepeat(
      withSequence(
        withSpring(1.1, { damping: 2, stiffness: 100 }),
        withSpring(1, { damping: 2, stiffness: 100 })
      ),
      -1,
      true
    );
  }, []);

  // Theme Colors - Premium
  const COLORS = {
    primary: colorScheme === 'dark' ? '#D4A574' : '#6F4E37',
    secondary: colorScheme === 'dark' ? '#C19A6B' : '#8B6F47',
    accent: '#FFD700',
    background: colorScheme === 'dark' ? '#1A0F0A' : '#FFF9F5',
    cardBg: colorScheme === 'dark' ? '#2D1810' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#3E2723',
    textSecondary: colorScheme === 'dark' ? '#C4A57B' : '#6F5E53',
    overlay: colorScheme === 'dark' ? 'rgba(26, 15, 10, 0.95)' : 'rgba(255, 255, 255, 0.95)',
  };

  const floatingStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: interpolate(floatAnim.value, [0, 1], [0, -15]) },
        { scale: interpolate(floatAnim.value, [0, 1], [1, 1.02]) }
      ],
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnim.value }],
    };
  });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        {/* Hero Header with Gradient */}
        <LinearGradient
          colors={colorScheme === 'dark' 
            ? ['#3E2723', '#2D1810', COLORS.background] 
            : ['#D4A574', '#C19A6B', COLORS.background]}
          style={styles.heroSection}
        >
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.heroContent}>
            <View style={styles.heroIconContainer}>
              <Animated.View style={pulseStyle}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500', '#FF8C00']}
                  style={styles.heroIconGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="cafe" size={48} color="#FFF" />
                </LinearGradient>
              </Animated.View>
            </View>
            
            <Text style={[styles.heroTitle, { color: colorScheme === 'dark' ? '#F5E6D3' : '#FFF' }]}>
              عالم القهوة الفاخرة
            </Text>
            <Text style={[styles.heroSubtitle, { color: colorScheme === 'dark' ? '#C4A57B' : 'rgba(255,255,255,0.9)' }]}>
              اكتشف أجود أنواع القهوة المختارة بعناية
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* Premium Banners */}
        <View style={styles.section}>
          <Animated.View entering={FadeInRight.delay(200).springify()} style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={[styles.sectionDot, { backgroundColor: COLORS.accent }]} />
              <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
                عروض مميزة
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
                      colors={['#FFD700', '#FFA500']}
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
                        colors={['rgba(255, 215, 0, 0.3)', 'rgba(255, 165, 0, 0.2)']}
                        style={styles.bannerIconBg}
                      >
                        <Ionicons name={item.icon as any || 'cafe'} size={28} color="#FFD700" />
                      </LinearGradient>
                    </View>
                    <Text style={styles.bannerTitle}>{item.text}</Text>
                    <View style={styles.bannerArrow}>
                      <Ionicons name="arrow-back" size={20} color="#FFD700" />
                    </View>
                  </BlurView>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* About Section - Premium Card */}
        <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.section}>
          <View style={[styles.aboutCard, { backgroundColor: COLORS.cardBg }]}>
            <LinearGradient
              colors={colorScheme === 'dark'
                ? ['rgba(212, 165, 116, 0.1)', 'rgba(139, 111, 71, 0.05)']
                : ['rgba(212, 165, 116, 0.08)', 'rgba(255, 255, 255, 0.95)']}
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
                  <Ionicons name="cafe" size={32} color="#FFF" />
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
                      onPress={handlePress}
                      style={[styles.featureItem, { 
                        backgroundColor: colorScheme === 'dark' 
                          ? 'rgba(212, 165, 116, 0.12)' 
                          : 'rgba(111, 78, 55, 0.06)' 
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
                onPress={handlePress}
                style={styles.ctaButton}
              >
                <LinearGradient
                  colors={['#8B6F47', '#6F4E37', '#5C3D2E']}
                  style={styles.ctaGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.ctaText}>{about.button}</Text>
                  <View style={styles.ctaIconBg}>
                    <Ionicons name="arrow-back" size={18} color="#6F4E37" />
                  </View>
                </LinearGradient>
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
                صناديقك المميزة
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
                  onPress={handlePress}
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
                          colors={['#FFD700', '#FFA500']}
                          style={styles.premiumBadgeGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Ionicons name="star" size={12} color="#FFF" />
                          <Text style={styles.premiumBadgeText}>Premium</Text>
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
                        ? ['rgba(45, 24, 16, 0.98)', 'rgba(26, 15, 10, 0.95)']
                        : ['rgba(255, 255, 255, 0.98)', 'rgba(245, 245, 220, 0.95)']}
                      style={styles.cardContentWrapper}
                    >
                      <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: COLORS.text }]} numberOfLines={1}>
                          {card.title}
                        </Text>
                        <View style={[styles.ratingBadge, { backgroundColor: COLORS.primary }]}>
                          <Ionicons name="star" size={12} color="#FFD700" />
                          <Text style={styles.ratingText}>4.9</Text>
                        </View>
                      </View>

                      <Text style={[styles.cardDescription, { color: COLORS.textSecondary }]} numberOfLines={2}>
                        {card.description}
                      </Text>

                      <View style={styles.cardFooter}>
                        <View style={[styles.categoryTag, { backgroundColor: colorScheme === 'dark' ? 'rgba(212, 165, 116, 0.15)' : 'rgba(111, 78, 55, 0.08)' }]}>
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
        <View style={{ height: 40 }} />
      </ScrollView>
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
        shadowColor: '#FFD700',
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
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter_300Light',
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
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Inter_400Regular',
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
    fontSize: 12,
    fontWeight: 'bold',
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
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  bannerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'right',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  bannerArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
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
        shadowColor: '#6F4E37',
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
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
    fontFamily: 'PlayfairDisplay_700Bold',
  },
  aboutDescription: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'right',
    marginBottom: 24,
    fontFamily: 'Inter_300Light',
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
    fontFamily: 'Inter_400Regular',
  },
  ctaButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#6F4E37',
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
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Inter_400Regular',
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
    fontSize: 11,
    fontWeight: 'bold',
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
    fontFamily: 'PlayfairDisplay_700Bold',
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
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'right',
    marginBottom: 16,
    fontFamily: 'Inter_300Light',
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
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Inter_400Regular',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});