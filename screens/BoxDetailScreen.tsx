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
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

import SeedData from '../constants/seed-data.json';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 320;

type Props = NativeStackScreenProps<RootStackParamList, 'BoxDetail'>;

export default function BoxDetailScreen({ route, navigation }: Props) {
  const { boxId } = route.params;
  const colorScheme = useColorScheme();

  // Find the box data
  const box = SeedData.cards.find((card) => card.id === boxId);

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

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleViewAllPosts = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate('PostsList', { boxId: box.id });
  };

  const handleCreatePost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Navigate to create post screen
  };

  if (!box) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={COLORS.textSecondary} />
          <Text style={[styles.errorText, { color: COLORS.text }]}>
            الصندوق غير موجود
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const typeIcons: { [key: string]: any } = {
    image: 'image',
    video: 'videocam',
    text: 'document-text',
    link: 'link',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        {/* Hero Banner */}
        <View style={styles.bannerContainer}>
          <ExpoImage source={{ uri: box.image }} style={styles.bannerImage} contentFit="cover" />

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
            style={styles.bannerGradient}
          />

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              handlePress();
              navigation.goBack();
            }}
          >
            <BlurView intensity={40} tint="dark" style={styles.backButtonBlur}>
              <Ionicons name="arrow-forward" size={24} color="#FFF" />
            </BlurView>
          </TouchableOpacity>

          {/* Banner Content */}
          <View style={styles.bannerContent}>
            <LinearGradient
              colors={['#E8B86D', '#D4A574', '#C9956A']}
              style={styles.bannerIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name={box.icon as any} size={40} color="#FFF" />
            </LinearGradient>

            <Text style={styles.bannerTitle}>{box.title}</Text>
            <Text style={styles.bannerSubtitle}>{box.shortDescription}</Text>

            <View style={[styles.categoryBadge, { backgroundColor: COLORS.accent }]}>
              <Ionicons name="pricetag" size={14} color="#FFF" />
              <Text style={styles.categoryBadgeText}>{box.category}</Text>
            </View>
          </View>
        </View>

        {/* View All Posts Button */}
        <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.section}>
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
              <Ionicons name="grid" size={22} color="#FFF" />
              <Text style={styles.viewAllText}>عرض جميع المنشورات</Text>
              <Ionicons name="arrow-back" size={20} color="#FFF" />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Long Description Card */}
        <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.section}>
          <View style={[styles.card, { backgroundColor: COLORS.cardBg }]}>
            <LinearGradient
              colors={
                colorScheme === 'dark'
                  ? ['rgba(196, 165, 123, 0.1)', 'rgba(184, 149, 106, 0.05)']
                  : ['rgba(212, 196, 176, 0.15)', 'rgba(255, 255, 255, 0.95)']
              }
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconBg, { backgroundColor: COLORS.primary }]}>
                  <Ionicons name="information-circle" size={24} color="#FFF" />
                </View>
                <Text style={[styles.cardTitle, { color: COLORS.text }]}>عن الصندوق</Text>
              </View>

              <Text style={[styles.longDescription, { color: COLORS.textSecondary }]}>
                {box.longDescription}
              </Text>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Participation Rules Card */}
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.section}>
          <View style={[styles.card, { backgroundColor: COLORS.cardBg }]}>
            <LinearGradient
              colors={
                colorScheme === 'dark'
                  ? ['rgba(196, 165, 123, 0.1)', 'rgba(184, 149, 106, 0.05)']
                  : ['rgba(212, 196, 176, 0.15)', 'rgba(255, 255, 255, 0.95)']
              }
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconBg, { backgroundColor: COLORS.primary }]}>
                  <Ionicons name="shield-checkmark" size={24} color="#FFF" />
                </View>
                <Text style={[styles.cardTitle, { color: COLORS.text }]}>قواعد المشاركة</Text>
              </View>

              {/* Allowed Types */}
              <Text style={[styles.sectionSubtitle, { color: COLORS.text }]}>
                أنواع المحتوى المسموحة:
              </Text>
              <View style={styles.typesContainer}>
                {box.allowedTypes.map((type, index) => (
                  <View
                    key={index}
                    style={[
                      styles.typeChip,
                      {
                        backgroundColor:
                          colorScheme === 'dark'
                            ? 'rgba(196, 165, 123, 0.15)'
                            : 'rgba(184, 149, 106, 0.12)',
                      },
                    ]}
                  >
                    <Ionicons name={typeIcons[type]} size={18} color={COLORS.primary} />
                    <Text style={[styles.typeText, { color: COLORS.primary }]}>
                      {type === 'image' && 'صورة'}
                      {type === 'video' && 'فيديو'}
                      {type === 'text' && 'نص'}
                      {type === 'link' && 'رابط'}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Rules List */}
              <Text style={[styles.sectionSubtitle, { color: COLORS.text, marginTop: 20 }]}>
                القواعد الأساسية:
              </Text>
              <View style={styles.rulesList}>
                {box.rules.map((rule, index) => (
                  <View key={index} style={styles.ruleItem}>
                    <View style={[styles.ruleDot, { backgroundColor: COLORS.accent }]} />
                    <Text style={[styles.ruleText, { color: COLORS.textSecondary }]}>
                      {rule}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Content Suggestions Card */}
        <Animated.View entering={FadeInDown.delay(500).springify()} style={styles.section}>
          <View style={[styles.card, { backgroundColor: COLORS.cardBg }]}>
            <LinearGradient
              colors={
                colorScheme === 'dark'
                  ? ['rgba(196, 165, 123, 0.1)', 'rgba(184, 149, 106, 0.05)']
                  : ['rgba(212, 196, 176, 0.15)', 'rgba(255, 255, 255, 0.95)']
              }
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardIconBg, { backgroundColor: COLORS.accent }]}>
                  <Ionicons name="bulb" size={24} color="#FFF" />
                </View>
                <Text style={[styles.cardTitle, { color: COLORS.text }]}>
                  مقترحات المحتوى
                </Text>
              </View>

              <View
                style={[
                  styles.suggestionBox,
                  {
                    backgroundColor:
                      colorScheme === 'dark'
                        ? 'rgba(232, 184, 109, 0.1)'
                        : 'rgba(232, 184, 109, 0.15)',
                  },
                ]}
              >
                <Ionicons name="chatbox-ellipses" size={28} color={COLORS.accent} />
                <Text style={[styles.suggestionText, { color: COLORS.textSecondary }]}>
                  {box.contentSuggestions}
                </Text>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Bottom Spacing for Sticky Button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Create Post Button */}
      <View style={[styles.stickyButtonContainer, { backgroundColor: COLORS.background }]}>
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
            <Ionicons name="add-circle" size={24} color="#FFF" />
            <Text style={styles.createPostText}>إنشاء منشور</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
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
    height: '70%',
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
    alignItems: 'center',
  },
  bannerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Cairo_700Bold',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Tajawal_400Regular',
  },
  categoryBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryBadgeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
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
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },

  // Card
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#B8956A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
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
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Cairo_700Bold',
  },
  longDescription: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },

  // Rules
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'right',
    fontFamily: 'Cairo_700Bold',
  },
  typesContainer: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeChip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Tajawal_700Bold',
  },
  rulesList: {
    gap: 12,
  },
  ruleItem: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 12,
  },
  ruleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 8,
  },
  ruleText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },

  // Suggestions
  suggestionBox: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    gap: 16,
    padding: 20,
    borderRadius: 20,
  },
  suggestionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },

  // Sticky Button
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(184, 149, 106, 0.2)',
  },
  createPostButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#E8B86D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  createPostGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  createPostText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
});
