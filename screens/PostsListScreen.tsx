import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

import SeedData from '../constants/seed-data.json';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'PostsList'>;

export default function PostsListScreen({ route }: Props) {
  const { boxId } = route.params;
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
  };

  // Get box info
  const box = SeedData.cards.find((card) => card.id === boxId);
  
  // Filter posts by boxId
  const posts = SeedData.posts.filter((post) => post.boxId === boxId);

  const handleLike = (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement like functionality
  };

  const handleFavorite = (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement favorite functionality
  };

  const handleShare = (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Implement share functionality
  };

  const renderPostCard = (post: any, index: number) => {
    return (
      <Animated.View
        key={post.id}
        entering={FadeInDown.delay(100 + index * 50).springify()}
        style={styles.postCard}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          style={[styles.postCardInner, { backgroundColor: COLORS.cardBg }]}
        >
          {/* Post Header */}
          <View style={styles.postHeader}>
            <View style={styles.userInfo}>
              {post.userAvatar ? (
                <ExpoImage
                  source={{ uri: post.userAvatar }}
                  style={styles.userAvatar}
                  contentFit="cover"
                />
              ) : (
                <LinearGradient
                  colors={['#E8B86D', '#D4A574']}
                  style={styles.userAvatar}
                >
                  <Ionicons name="person" size={20} color="#FFF" />
                </LinearGradient>
              )}
              <View style={styles.userDetails}>
                <Text style={[styles.userName, { color: COLORS.text }]}>
                  {post.userName}
                </Text>
                <Text style={[styles.postTime, { color: COLORS.textSecondary }]}>
                  {new Date(post.createdAt).toLocaleDateString('ar-SA')}
                </Text>
              </View>
            </View>
            <View style={[styles.categoryBadge, { backgroundColor: COLORS.accent + '20' }]}>
              <Text style={[styles.categoryText, { color: COLORS.accent }]}>
                {post.category}
              </Text>
            </View>
          </View>

          {/* Post Content */}
          <View style={styles.postContent}>
            <Text style={[styles.postTitle, { color: COLORS.text }]}>
              {post.title}
            </Text>
            <Text
              style={[styles.postDescription, { color: COLORS.textSecondary }]}
              numberOfLines={3}
            >
              {post.content}
            </Text>
          </View>

          {/* Post Image */}
          {post.image && (
            <ExpoImage
              source={{ uri: post.image }}
              style={styles.postImage}
              contentFit="cover"
            />
          )}

          {/* Post Link */}
          {post.link && (
            <View style={[styles.linkContainer, { backgroundColor: COLORS.background }]}>
              <Ionicons name="link" size={20} color={COLORS.accent} />
              <Text
                style={[styles.linkText, { color: COLORS.accent }]}
                numberOfLines={1}
              >
                {post.link}
              </Text>
            </View>
          )}

          {/* Post Actions */}
          <View style={styles.postActions}>
            <TouchableOpacity
              onPress={() => handleLike(post.id)}
              style={styles.actionButton}
            >
              <Ionicons
                name={post.isLiked ? 'heart' : 'heart-outline'}
                size={22}
                color={post.isLiked ? '#E94B3C' : COLORS.textSecondary}
              />
              <Text style={[styles.actionText, { color: COLORS.textSecondary }]}>
                {post.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {}}
              style={styles.actionButton}
            >
              <Ionicons name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
              <Text style={[styles.actionText, { color: COLORS.textSecondary }]}>
                {post.comments}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleShare(post.id)}
              style={styles.actionButton}
            >
              <Ionicons name="share-outline" size={20} color={COLORS.textSecondary} />
              <Text style={[styles.actionText, { color: COLORS.textSecondary }]}>
                {post.shares}
              </Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              onPress={() => handleFavorite(post.id)}
              style={styles.actionButton}
            >
              <Ionicons
                name={post.isFavorite ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={post.isFavorite ? COLORS.accent : COLORS.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={[styles.headerIcon, { backgroundColor: COLORS.accent }]}>
            <Ionicons name={box?.icon as any || 'grid'} size={24} color="#FFF" />
          </View>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>
            {box?.title || 'المنشورات'}
          </Text>
        </View>
      </View>

      {/* Posts List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
      >
        <View style={styles.postsContainer}>
          {posts.length > 0 ? (
            posts.map((post, index) => renderPostCard(post, index))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={64} color={COLORS.textSecondary} />
              <Text style={[styles.emptyText, { color: COLORS.text }]}>
                لا توجد منشورات بعد
              </Text>
              <Text style={[styles.emptySubtext, { color: COLORS.textSecondary }]}>
                كن أول من ينشر في هذا الصندوق
              </Text>
            </View>
          )}
        </View>
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
  postsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  postCard: {
    marginBottom: 16,
  },
  postCardInner: {
    borderRadius: 20,
    overflow: 'hidden',
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
  postHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    gap: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
  },
  postTime: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
    lineHeight: 28,
  },
  postDescription: {
    fontSize: 15,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    lineHeight: 24,
  },
  postImage: {
    width: '100%',
    height: 240,
    marginBottom: 16,
  },
  linkContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  postActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  emptySubtext: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
  },
});