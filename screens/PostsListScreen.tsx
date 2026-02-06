import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import api from '../utils/api';

type Props = NativeStackScreenProps<RootStackParamList, 'PostsList'>;

interface Post {
  id: number;
  type: 'text' | 'image' | 'video' | 'link';
  title: string;
  content: string;
  media_url?: string;
  category: string;
  user_name: string;
  user_image?: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  is_favorited: boolean;
  created_at: string;
}

export default function PostsListScreen({ route, navigation }: Props) {
  const { boxId, category } = route.params;
  const colorScheme = useColorScheme();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
    border: colorScheme === 'dark' ? '#3A3430' : '#E8E8E8',
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const params: any = {
        page: pageNum,
        limit: 10,
      };

      if (boxId) {
        params.boxId = boxId;
      }

      if (category) {
        params.category = category;
      }

      const response = await api.getPosts(params);

      if (refresh || pageNum === 1) {
        setPosts(response.data.map((p: any) => ({ ...p, is_liked: !!p.is_liked, is_favorited: !!p.is_favorited })));
      } else {
        setPosts(prev => {
          const newPosts = response.data.map((p: any) => ({ ...p, is_liked: !!p.is_liked, is_favorited: !!p.is_favorited }));
          const existingIds = new Set(prev.map(p => p.id));
          return [...prev, ...newPosts.filter(p => !existingIds.has(p.id))];
        });
      }

      setHasMore(response.pagination.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = useCallback(() => {
    loadPosts(1, true);
  }, [boxId, category]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      loadPosts(page + 1);
    }
  }, [isLoadingMore, hasMore, page]);

  const handlePostPress = (postId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('PostDetail', { postId: postId.toString() });
  };

  const handleLikePress = async (postId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Save previous state to revert on error
    const previousPosts = [...posts];

    // Optimistic update
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
            ...post,
            is_liked: !post.is_liked,
            likes_count: post.is_liked ? Math.max(0, post.likes_count - 1) : post.likes_count + 1,
          }
          : post
      )
    );

    try {
      await api.toggleLike(postId.toString());
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert if error
      setPosts(previousPosts);
    }
  };

  const handleFavoritePress = async (postId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Save previous state to revert on error
    const previousPosts = [...posts];

    // Optimistic update
    setPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, is_favorited: !post.is_favorited } : post
      )
    );

    try {
      await api.toggleFavorite(postId.toString());
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert if error
      setPosts(previousPosts);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'منذ قليل';
    } else if (diffInHours < 24) {
      return `منذ ${diffInHours} ساعة`;
    } else if (diffInDays < 7) {
      return `منذ ${diffInDays} يوم`;
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return 'document-text';
      case 'image':
        return 'image';
      case 'video':
        return 'videocam';
      case 'link':
        return 'link';
      default:
        return 'document';
    }
  };

  const renderPost = ({ item, index }: { item: Post; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handlePostPress(item.id)}
        style={[styles.postCard, { backgroundColor: COLORS.cardBg }]}
      >
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.postUserInfo}>
            {item.user_image ? (
              <ExpoImage source={{ uri: item.user_image }} style={styles.postAvatar} />
            ) : (
              <View style={[styles.postAvatarPlaceholder, { backgroundColor: COLORS.accent }]}>
                <Ionicons name="person" size={20} color="#FFF" />
              </View>
            )}
            <View style={styles.postUserDetails}>
              <Text style={[styles.postUserName, { color: COLORS.text }]}>
                {item.user_name}
              </Text>
              <Text style={[styles.postTime, { color: COLORS.textSecondary }]}>
                {formatDate(item.created_at)}
              </Text>
            </View>
          </View>
          <View style={styles.postHeaderRight}>
            <View style={[styles.typeIcon, { backgroundColor: COLORS.accent + '20' }]}>
              <Ionicons name={getTypeIcon(item.type) as any} size={16} color={COLORS.accent} />
            </View>
            <View style={[styles.categoryBadge, { backgroundColor: COLORS.primary + '20' }]}>
              <Text style={[styles.categoryBadgeText, { color: COLORS.primary }]}>
                {item.category}
              </Text>
            </View>
          </View>
        </View>

        {/* Post Content */}
        <View style={styles.postContent}>
          {item.title && (
            <Text style={[styles.postTitle, { color: COLORS.text }]} numberOfLines={2}>
              {item.title}
            </Text>
          )}
          <Text style={[styles.postText, { color: COLORS.textSecondary }]} numberOfLines={3}>
            {item.content}
          </Text>
        </View>

        {/* Post Image */}
        {item.media_url && item.type === 'image' && (
          <ExpoImage source={{ uri: item.media_url }} style={styles.postImage} contentFit="cover" />
        )}

        {/* Post Footer */}
        <View style={[styles.postFooter, { borderTopColor: COLORS.border }]}>
          <View style={styles.postStats}>
            <TouchableOpacity
              onPress={() => handleLikePress(item.id)}
              style={styles.postStat}
            >
              <Text style={[styles.postStatText, { color: COLORS.textSecondary }]}>
                {item.likes_count}
              </Text>
              <Ionicons
                name={item.is_liked ? 'heart' : 'heart-outline'}
                size={20}
                color={!!item.is_liked ? '#E94B3C' : COLORS.textSecondary}
              />
            </TouchableOpacity>
            <View style={styles.postStat}>
              <Text style={[styles.postStatText, { color: COLORS.textSecondary }]}>
                {item.comments_count}
              </Text>
              <Ionicons name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
            </View>
          </View>
          <TouchableOpacity onPress={() => handleFavoritePress(item.id)}>
            <Ionicons
              name={item.is_favorited ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={item.is_favorited ? COLORS.accent : COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={[styles.footerLoaderText, { color: COLORS.textSecondary }]}>
          جاري التحميل...
        </Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={[styles.emptyContainer, { backgroundColor: COLORS.cardBg }]}>
      <LinearGradient
        colors={[COLORS.primary + '20', COLORS.accent + '10']}
        style={styles.emptyIconBg}
      >
        <Ionicons name="folder-open-outline" size={64} color={COLORS.textSecondary} />
      </LinearGradient>
      <Text style={[styles.emptyTitle, { color: COLORS.text }]}>لا توجد منشورات</Text>
      <Text style={[styles.emptyText, { color: COLORS.textSecondary }]}>
        لم يتم العثور على منشورات في هذا القسم
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={[styles.loadingText, { color: COLORS.textSecondary }]}>
            جاري التحميل...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: COLORS.border }]}>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-forward" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: COLORS.text }]}>المنشورات</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  postCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  postUserInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postUserDetails: {
    flex: 1,
    alignItems: 'flex-end',
  },
  postUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  postTime: {
    fontSize: 12,
    fontFamily: 'Tajawal_400Regular',
    marginTop: 2,
  },
  postHeaderRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Cairo_600SemiBold',
  },
  postContent: {
    gap: 8,
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
  },
  postText: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
    lineHeight: 22,
    textAlign: 'right',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  postStats: {
    flexDirection: 'row-reverse',
    gap: 20,
  },
  postStat: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  postStatText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 20,
  },
  footerLoaderText: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
  },
  emptyContainer: {
    padding: 48,
    borderRadius: 24,
    alignItems: 'center',
    gap: 16,
    marginTop: 40,
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
  emptyIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
});