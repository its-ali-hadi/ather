import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withRepeat,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { useEffect } from 'react';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import SeedData from '@/constants/seed-data.json';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const { banners, about, cards } = SeedData;
  const colorScheme = useColorScheme();

  // Animated values for floating effect
  const floatAnim = useSharedValue(0);

  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withSpring(1, { damping: 2, stiffness: 80 }),
        withSpring(0, { damping: 2, stiffness: 80 })
      ),
      -1,
      true
    );
  }, []);

  // Theme Colors - Enhanced
  const COFFEE_PRIMARY = '#6F4E37';
  const COFFEE_SECONDARY = '#A67B5B';
  const COFFEE_ACCENT = '#D4A574';
  const COFFEE_LIGHT = '#F5F5DC';
  const COFFEE_TEXT = colorScheme === 'dark' ? '#FFE4C4' : '#4B3621';
  const BG_COLOR = colorScheme === 'dark' ? '#2C1810' : '#FFF8F0';
  const CARD_BG = colorScheme === 'dark' ? '#3E2723' : '#FFFFFF';

  const floatingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: floatAnim.value * 10 }],
    };
  });

  const handleCardPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D2B48C', dark: '#3E2723' }}
      headerImage={
        <LinearGradient
          colors={colorScheme === 'dark' 
            ? ['#6F4E37', '#3E2723', '#2C1810'] 
            : ['#D4A574', '#C19A6B', '#A67B5B']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Animated.View style={[floatingStyle, styles.logoContainer]}>
            <ExpoImage
              source={require('@/assets/images/partial-react-logo.png')}
              style={[styles.reactLogo, { tintColor: 'rgba(255, 255, 255, 0.3)' }]}
            />
          </Animated.View>
        </LinearGradient>
      }>

      <View style={[styles.contentContainer, { backgroundColor: BG_COLOR }]}>
        {/* Banner Section with Enhanced Design */}
        <ThemedView style={[styles.sectionContainer, { backgroundColor: 'transparent' }]}>
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <ThemedText type="subtitle" style={[styles.mainTitle, { color: COFFEE_PRIMARY }]}>
              ☕ اكتشف عالم القهوة
            </ThemedText>
          </Animated.View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            snapToInterval={width * 0.85 + 20} 
            decelerationRate="fast"
            contentContainerStyle={styles.bannerScrollContent}
          >
            {banners.map((item, index) => (
              <Animated.View 
                key={index} 
                entering={FadeInRight.delay(200 + index * 100).springify()}
              >
                <TouchableOpacity 
                  activeOpacity={0.95}
                  onPress={handleCardPress}
                  style={[styles.bannerCard, { width: width * 0.85 }]}
                >
                  <ExpoImage source={{ uri: item.image }} style={styles.bannerImage} />
                  
                  {/* Gradient Overlay */}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(62, 39, 35, 0.95)']}
                    style={styles.bannerGradient}
                  />
                  
                  {/* Glass Effect Overlay */}
                  <BlurView intensity={20} tint="dark" style={styles.bannerOverlay}>
                    <View style={styles.bannerContent}>
                      <View style={styles.iconCircle}>
                        <Ionicons name={item.icon as any || 'cafe'} size={32} color="#FFD700" />
                      </View>
                      <Text style={styles.bannerText}>{item.text}</Text>
                    </View>
                  </BlurView>

                  {/* Decorative Corner */}
                  <View style={styles.cornerDecoration}>
                    <Ionicons name="sparkles" size={16} color="#FFD700" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </ThemedView>

        {/* About Section with Glass Effect */}
        <Animated.View entering={FadeInDown.delay(400).springify()}>
          <ThemedView style={[styles.sectionContainer, { backgroundColor: 'transparent' }]}>
            <View style={[styles.aboutCard, { backgroundColor: CARD_BG }]}>
              <LinearGradient
                colors={colorScheme === 'dark' 
                  ? ['rgba(111, 78, 55, 0.2)', 'rgba(62, 39, 35, 0.1)'] 
                  : ['rgba(212, 165, 116, 0.15)', 'rgba(255, 255, 255, 0.9)']}
                style={styles.aboutGradient}
              >
                {/* Decorative Top Bar */}
                <View style={styles.decorativeBar}>
                  <View style={[styles.barDot, { backgroundColor: COFFEE_PRIMARY }]} />
                  <View style={[styles.barLine, { backgroundColor: COFFEE_ACCENT }]} />
                  <View style={[styles.barDot, { backgroundColor: COFFEE_PRIMARY }]} />
                </View>

                <View style={styles.aboutHeader}>
                  <Ionicons name="cafe" size={32} color={COFFEE_PRIMARY} />
                  <ThemedText type="subtitle" style={[styles.sectionTitle, { color: COFFEE_PRIMARY }]}>
                    {about.title}
                  </ThemedText>
                </View>
                
                <ThemedText style={[styles.aboutDescription, { color: COFFEE_SECONDARY }]}>
                  {about.description}
                </ThemedText>

                <View style={styles.listContainer}>
                  {about.list.map((item, index) => (
                    <Animated.View 
                      key={index} 
                      entering={FadeInRight.delay(500 + index * 100).springify()}
                      style={[styles.listItem, { backgroundColor: colorScheme === 'dark' ? 'rgba(111, 78, 55, 0.2)' : 'rgba(245, 245, 220, 0.5)' }]}
                    >
                      <View style={[styles.listIconContainer, { backgroundColor: COFFEE_LIGHT }]}>
                        <Ionicons name={item.icon as any || 'checkmark-circle'} size={22} color={COFFEE_PRIMARY} />
                      </View>
                      <ThemedText style={[styles.listItemText, { color: COFFEE_TEXT }]}>
                        {item.text}
                      </ThemedText>
                    </Animated.View>
                  ))}
                </View>

                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={handleCardPress}
                  style={styles.buttonContainer}
                >
                  <LinearGradient
                    colors={['#8B6F47', COFFEE_PRIMARY, '#5C3D2E']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>{about.button}</Text>
                    <Ionicons name="arrow-back" size={20} color="#FFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </ThemedView>
        </Animated.View>

        {/* Cards Section with Premium Design */}
        <ThemedView style={[styles.sectionContainer, { backgroundColor: 'transparent' }]}>
          <Animated.View entering={FadeInDown.delay(600).springify()}>
            <View style={styles.cardsHeader}>
              <ThemedText type="subtitle" style={[styles.sectionTitle, { color: COFFEE_PRIMARY }]}>
                صناديقك المميزة
              </ThemedText>
              <Ionicons name="gift" size={28} color={COFFEE_PRIMARY} />
            </View>
          </Animated.View>

          {cards.map((card, index) => (
            <Animated.View 
              key={index}
              entering={FadeInDown.delay(700 + index * 150).springify()}
            >
              <Link href={`/box/${card.id || index}`} asChild>
                <AnimatedTouchable 
                  activeOpacity={0.95}
                  onPress={handleCardPress}
                >
                  <View style={[styles.card, { backgroundColor: CARD_BG }]}>
                    {/* Image with Gradient Overlay */}
                    <View style={styles.cardImageContainer}>
                      <ExpoImage 
                        source={{ uri: card.image }} 
                        style={styles.cardImage} 
                        contentFit="cover" 
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.3)']}
                        style={styles.cardImageGradient}
                      />
                      
                      {/* Floating Badge */}
                      <View style={[styles.floatingBadge, { backgroundColor: COFFEE_PRIMARY }]}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.badgeText}>مميز</Text>
                      </View>
                    </View>

                    {/* Card Content with Glass Effect */}
                    <LinearGradient
                      colors={colorScheme === 'dark' 
                        ? ['rgba(62, 39, 35, 0.95)', 'rgba(44, 24, 16, 0.98)'] 
                        : ['rgba(255, 255, 255, 0.98)', 'rgba(245, 245, 220, 0.95)']}
                      style={styles.cardContent}
                    >
                      <View style={styles.cardHeader}>
                        <ThemedText type="defaultSemiBold" style={[styles.cardTitle, { color: COFFEE_PRIMARY }]}>
                          {card.title}
                        </ThemedText>
                        <Ionicons name="chevron-back" size={24} color={COFFEE_ACCENT} />
                      </View>
                      
                      <ThemedText style={[styles.cardDescription, { color: COFFEE_SECONDARY }]}>
                        {card.description}
                      </ThemedText>
                      
                      <View style={styles.cardFooter}>
                        <View style={[styles.categoryBadge, { backgroundColor: COFFEE_LIGHT }]}>
                          <Ionicons name="pricetag" size={14} color={COFFEE_PRIMARY} />
                          <Text style={[styles.categoryText, { color: COFFEE_PRIMARY }]}>
                            {card.category}
                          </Text>
                        </View>
                        
                        <View style={styles.arrowCircle}>
                          <Ionicons name="arrow-back" size={18} color={COFFEE_PRIMARY} />
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                </AnimatedTouchable>
              </Link>
            </Animated.View>
          ))}
        </ThemedView>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactLogo: {
    height: 178,
    width: 290,
    opacity: 0.3,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingHorizontal: 20,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  sectionContainer: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  
  // Banner Styles
  bannerScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  bannerCard: {
    marginRight: 20,
    borderRadius: 24,
    overflow: 'hidden',
    height: 240,
    position: 'relative',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
    height: '60%',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    overflow: 'hidden',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  bannerContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
    textAlign: 'right',
  },
  cornerDecoration: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // About Card Styles
  aboutCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#6F4E37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  aboutGradient: {
    padding: 24,
  },
  decorativeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
  },
  barDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  barLine: {
    width: 60,
    height: 2,
    borderRadius: 1,
  },
  aboutHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  aboutDescription: {
    textAlign: 'right',
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 26,
  },
  listContainer: {
    gap: 12,
    marginBottom: 24,
  },
  listItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
  },
  listIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 17,
  },

  // Cards Styles
  cardsHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  card: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  cardImageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
  },
  floatingBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 22,
    flex: 1,
    textAlign: 'right',
  },
  cardDescription: {
    textAlign: 'right',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(111, 78, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});