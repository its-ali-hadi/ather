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
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export default function MyPostsScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const COLORS = {
    primary: colorScheme === 'dark' ? '#C4A57B' : '#B8956A',
    accent: '#E8B86D',
    background: colorScheme === 'dark' ? '#1A1612' : '#FAF8F5',
    cardBg: colorScheme === 'dark' ? '#2A2420' : '#FFFFFF',
    text: colorScheme === 'dark' ? '#F5E6D3' : '#4A3F35',
    textSecondary: colorScheme === 'dark' ? '#D4C4B0' : '#7A6F65',
  };

  const fetchPosts = useCallback(async () => {
    try {
      const response = await api.getMyPosts();
      if (response.success && response.data) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Error fetching my posts:', error);
      Alert.alert('خطأ', 'فشل تحميل المنشورات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handleDeletePost = (postId: string, postTitle: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      'حذف المنشور',
      `هل أنت متأكد من حذف "${postTitle}"؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await api.deletePost(postId);
              if (response.success) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setPosts((prev) => prev.filter((p) => p.id !== postId));
              } else {
                Alert.alert('خطأ', 'فشل حذف المنشور');
              }
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('خطأ', 'حدث خطأ أثناء الحذف');
            }
          },
        },
      ]
    );
  };

  const handleEditPost = (postId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('تعديل المنشور', 'سيتم إضافة هذه الميزة قريباً');
    // Implementation for edit navigation could go here
  };

  const renderPostCard = (post: any, index: number) => {
    return (
      <Animated.View
        key={post.id}
        entering={FadeInDown.delay(100 + index * 50).springify()}
        style={styles.postCard}
      >
        <View style={[styles.postCardInner, { backgroundColor: COLORS.cardBg }]}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate('PostDetail', { postId: post.id.toString() });
            }}
          >
            {/* Post Header */}
            <View style={styles.postHeader}>
              <View style={[styles.categoryBadge, { backgroundColor: COLORS.accent + '20' }]}>
                <Text style={[styles.categoryText, { color: COLORS.accent }]}>
                  {post.category}
                </Text>
              </View>
              <View style={styles.postActions}>
                <TouchableOpacity
                  onPress={() => handleEditPost(post.id)}
                  style={styles.actionButton}
                >
                  <Ionicons name="create-outline" size={22} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeletePost(post.id, post.title)}
                  style={styles.actionButton}
                >
                  <Ionicons name="trash-outline" size={22} color="#E94B3C" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Post Content */}
            <View style={styles.postContent}>
              <Text style={[styles.postTitle, { color: COLORS.text }]}>
                {post.title}
              </Text>
              {post.content && (
                <Text
                  style={[styles.postDescription, { color: COLORS.textSecondary }]}
                  numberOfLines={3}
                >
                  {post.content}
                </Text>
              )}
            </View>

            {/* Post Image */}
            {post.media_url && <ExpoImage
              source={{ uri: api.getFileUrl(post.media_url) ?? undefined }}
              style={styles.postImage}
              contentFit="cover"
            />
            }
          </TouchableOpacity>

          {/* Post Stats */}
          <View style={styles.postStats}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={18} color="#E94B3C" />
              <Text style={[styles.statText, { color: COLORS.textSecondary }]}>
                {post.likes_count || 0}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble" size={18} color={COLORS.textSecondary} />
              <Text style={[styles.statText, { color: COLORS.textSecondary }]}>
                {post.comments_count || 0}
              </Text>
            </View>
            <View style={{ flex: 1 }} />
            <Text style={[styles.postDate, { color: COLORS.textSecondary }]}>
              {new Date(post.created_at).toLocaleDateString('ar-SA')}
            </Text>
          </View>
        </View>
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
          <LinearGradient
            colors={['#4A90E2', '#357ABD']}
            style={styles.headerIcon}
          >
            <Ionicons name="document-text" size={28} color="#FFF" />
          </LinearGradient>
          <Text style={[styles.headerTitle, { color: COLORS.text }]}>منشوراتي</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <>
          {/* Stats Summary */}
          <Animated.View
            entering={FadeInDown.delay(50).springify()}
            style={styles.statsContainer}
          >
            <View style={[styles.statsCard, { backgroundColor: COLORS.cardBg }]}>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: COLORS.text }]}>
                  {posts.length}
                </Text>
                <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
                  منشور
                </Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: COLORS.text }]}>
                  {posts.reduce((sum, post) => sum + (post.likes_count || 0), 0)}
                </Text>
                <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
                  إعجاب
                </Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: COLORS.text }]}>
                  {posts.reduce((sum, post) => sum + (post.comments_count || 0), 0)}
                </Text>
                <Text style={[styles.statLabel, { color: COLORS.textSecondary }]}>
                  تعليق
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Posts List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
            }
          >
            <View style={styles.postsContainer}>
              {posts.length > 0 ? (
                posts.map((post, index) => renderPostCard(post, index))
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="document-text-outline" size={64} color={COLORS.textSecondary} />
                  <Text style={[styles.emptyText, { color: COLORS.text }]}>
                    لم تنشر أي منشورات بعد
                  </Text>
                  <Text style={[styles.emptySubtext, { color: COLORS.textSecondary }]}>
                    ابدأ بمشاركة أفكارك مع المجتمع
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
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
  statsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statsCard: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 20,
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
  statBox: {
    alignItems: 'center',
    gap: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Tajawal_400Regular',
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
  postActions: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  actionButton: {
    padding: 8,
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
    height: 200,
    marginBottom: 16,
  },
  postStats: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  postDate: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
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
    textAlign: 'center',
  },
});