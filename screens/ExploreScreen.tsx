import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import api from '../utils/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');
const CARD_PADDING = 24;
const CARD_GAP = 12;
const CARD_WIDTH = (width - CARD_PADDING * 2 - CARD_GAP * 2) / 3;

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

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();

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
  };

  const categories = [
    { id: '1', name: 'تقنية', icon: 'code-slash', color: '#4A90E2' },
    { id: '2', name: 'فن', icon: 'color-palette', color: '#E94B3C' },
    { id: '3', name: 'أدب', icon: 'book', color: '#50C878' },
    { id: '4', name: 'رياضة', icon: 'fitness', color: '#F39C12' },
    { id: '5', name: 'سفر', icon: 'airplane', color: '#9B59B6' },
    { id: '6', name: 'أعمال', icon: 'briefcase', color: '#34495E' },
  ];

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

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

      if (selectedCategory) {
        params.category = selectedCategory;
      }

      const response = await api.getPosts(params);

      if (refresh || pageNum === 1) {
        setPosts(response.data);
      } else {
        setPosts((prev) => [...prev, ...response.data]);
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
  }, [selectedCategory]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      loadPosts(page + 1);
    }
  }, [isLoadingMore, hasMore, page]);

  const handleSearchFocus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('AdvancedSearch');
  };

  const handleCategoryPress = (categoryName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  const handlePostPress = (postId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('PostDetail', { postId: postId.toString() });
  };

  const handleUserPress = (userId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('UserProfile', { userId });
  };

  const handleLikePress = async (postId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await api.toggleLike(postId.toString());
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                is_liked: !post.is_liked,
                likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFavoritePress = async (postId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await api.toggleFavorite(postId.toString());
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, is_favorited: !post.is_favorited } : post
        )
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
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

  const renderHeader = () => (
    <>
      {/* Header */}
      <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
        <Text style={[styles.title, { color: COLORS.text }]}>استكشف</Text>
        <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
          اكتشف محتوى جديد ومثير
        </Text>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: COLORS.cardBg }]}>
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: COLORS.text }]}
            placeholder="ابحث عن صناديق أو منشورات..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={handleSearchFocus}
          />
        </View>
      </Animated.View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: COLORS.text }]}>التصنيفات</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => {
            const isSelected = selectedCategory === category.name;
            return (
              <Animated.View
                key={category.id}
                entering={FadeInUp.delay(300 + index * 80).springify()}
                style={{ width: CARD_WIDTH }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleCategoryPress(category.name)}
                  style={[
                    styles.categoryCard,
                    { backgroundColor: COLORS.cardBg },
                    isSelected && {
                      borderWidth: 3,
                      borderColor: category.color,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={[category.color, category.color + 'CC']}
                    style={[
                      styles.categoryIcon,
                      isSelected && { transform: [{ scale: 1.1 }] },
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name={category.icon as any} size={28} color="#FFF" />
                  </LinearGradient>
                  <Text style={[styles.categoryName, { color: COLORS.text }]} numberOfLines={1}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>
            {selectedCategory ? `منشورات ${selectedCategory}` : 'جميع المنشورات'}
          </Text>
          {selectedCategory && (
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={[styles.clearFilterButton, { backgroundColor: COLORS.accent + '20' }]}
            >
              <Text style={[styles.clearFilterText, { color: COLORS.accent }]}>إلغاء الفلتر</Text>
              <Ionicons name="close-circle" size={16} color={COLORS.accent} />
            </TouchableOpacity>
          )}
        </View>
        <Ionicons name="grid" size={24} color={COLORS.accent} />
      </View>
    </>
  );

  const renderPost = ({ item, index }: { item: Post; index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 50).springify()}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handlePostPress(item.id)}
        style={[styles.postCard, { backgroundColor: COLORS.cardBg }]}
      >
        {/* Post Header */}
        <View style={styles.postHeader}>
          <TouchableOpacity
            style={styles.postUserInfo}
            onPress={() => handleUserPress(item.id.toString())}
            activeOpacity={0.7}
          >
            <View style={styles.postUserDetails}>
              <Text style={[styles.postUserName, { color: COLORS.text }]}>{item.user_name}</Text>
              <Text style={[styles.postTime, { color: COLORS.textSecondary }]}>
                {formatDate(item.created_at)}
              </Text>
            </View>
            {item.user_image ? (
              <ExpoImage source={{ uri: item.user_image }} style={styles.postAvatar} />
            ) : (
              <View style={[styles.postAvatarPlaceholder, { backgroundColor: COLORS.accent }]}>
                <Ionicons name="person" size={20} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>
          <View style={[styles.categoryBadge, { backgroundColor: COLORS.accent + '20' }]}>
            <Text style={[styles.categoryBadgeText, { color: COLORS.accent }]}>
              {item.category}
            </Text>
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
        <View style={styles.postFooter}>
          <View style={styles.postStats}>
            <TouchableOpacity onPress={() => handleLikePress(item.id)} style={styles.postStat}>
              <Text style={[styles.postStatText, { color: COLORS.textSecondary }]}>
                {item.likes_count}
              </Text>
              <Ionicons
                name={item.is_liked ? 'heart' : 'heart-outline'}
                size={18}
                color={item.is_liked ? '#E94B3C' : COLORS.textSecondary}
              />
            </TouchableOpacity>
            <View style={styles.postStat}>
              <Text style={[styles.postStatText, { color: COLORS.textSecondary }]}>
                {item.comments_count}
              </Text>
              <Ionicons name="chatbubble-outline" size={18} color={COLORS.textSecondary} />
            </View>
          </View>
          <TouchableOpacity onPress={() => handleFavoritePress(item.id)}>
            <Ionicons
              name={item.is_favorited ? 'bookmark' : 'bookmark-outline'}
              size={20}
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

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={[styles.emptyState, { backgroundColor: COLORS.cardBg }]}>
        <Ionicons name="folder-open-outline" size={64} color={COLORS.textSecondary} />
        <Text style={[styles.emptyStateText, { color: COLORS.textSecondary }]}>
          لا توجد منشورات في هذا التصنيف
        </Text>
      </View>
    );
  };

  if (isLoading && page === 1) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: COLORS.background }]}
        edges={['top']}
      >
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: COLORS.background }]}
      edges={['top']}
    >
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
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
  listContent: {
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  sectionTitleContainer: {
    flex: 1,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 16,
  },
  clearFilterButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  clearFilterText: {
    fontSize: 12,
    fontFamily: 'Cairo_600SemiBold',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
  },
  categoryCard: {
    width: '100%',
    aspectRatio: 1,
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'center',
  },
  postCard: {
    borderRadius: 20,
    padding: 16,
    gap: 12,
    marginHorizontal: 24,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
    marginTop: 4,
  },
  postFooter: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
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
  emptyState: {
    padding: 48,
    borderRadius: 20,
    alignItems: 'center',
    gap: 16,
    marginHorizontal: 24,
    marginTop: 20,
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
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'center',
  },
});