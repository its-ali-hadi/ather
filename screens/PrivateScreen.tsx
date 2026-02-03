import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Platform,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import api from '../utils/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Post {
  id: number;
  type: 'text' | 'image' | 'video' | 'link';
  title: string;
  content: string;
  media_url?: string;
  link_url?: string;
  category: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_image?: string;
  likes_count: number;
  comments_count: number;
}

export default function PrivateScreen() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation<NavigationProp>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    loadPrivatePosts();
  }, []);

  const loadPrivatePosts = async () => {
    try {
      setIsLoading(true);
      const response = await api.getPrivatePosts();
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error loading private posts:', error);
      Alert.alert('خطأ', 'فشل تحميل المنشورات الخاصة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPrivatePosts();
    setIsRefreshing(false);
  };

  const handleEditPost = (postId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('PostDetail', { postId: postId.toString() });
  };

  const handleDeletePost = (postId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'حذف المنشور',
      'هل أنت متأكد من حذف هذا المنشور؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deletePost(postId.toString());
              setPosts(posts.filter((p) => p.id !== postId));
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('تم الحذف', 'تم حذف المنشور بنجاح');
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('خطأ', 'فشل حذف المنشور');
            }
          },
        },
      ]
    );
  };

  const handlePublishPost = (postId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'نشر المنشور',
      'هل تريد نشر هذا المنشور؟ سيصبح عاماً ويمكن للجميع رؤيته.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'نشر',
          onPress: async () => {
            try {
              const response = await api.publishPost(postId.toString());
              setPosts(posts.filter((p) => p.id !== postId));
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('تم النشر! 🎉', response.message || 'تم نشر المنشور بنجاح');
            } catch (error: any) {
              console.error('Error publishing post:', error);
              Alert.alert('خطأ', error.message || 'فشل نشر المنشور');
            }
          },
        },
      ]
    );
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'ios' ? 100 : 80 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
          <LinearGradient
            colors={['#9B59B6', '#8E44AD']}
            style={styles.headerIcon}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="lock-closed" size={40} color="#FFF" />
          </LinearGradient>
          <Text style={[styles.title, { color: COLORS.text }]}>المنشورات الخاصة</Text>
          <Text style={[styles.subtitle, { color: COLORS.textSecondary }]}>
            منشوراتك الخاصة ({posts.length})
          </Text>
        </Animated.View>

        {/* Posts List */}
        {posts.length > 0 ? (
          <View style={styles.postsContainer}>
            {posts.map((post, index) => (
              <Animated.View
                key={post.id}
                entering={FadeInUp.delay(200 + index * 80).springify()}
              >
                <View style={[styles.postCard, { backgroundColor: COLORS.cardBg }]}>
                  {/* Post Header */}
                  <View style={styles.postHeader}>
                    <View style={styles.postTypeContainer}>
                      <View style={[styles.typeIcon, { backgroundColor: COLORS.accent + '20' }]}>
                        <Ionicons name={getTypeIcon(post.type) as any} size={20} color={COLORS.accent} />
                      </View>
                      <View style={styles.postInfo}>
                        <Text style={[styles.postTitle, { color: COLORS.text }]} numberOfLines={1}>
                          {post.title}
                        </Text>
                        <Text style={[styles.postDate, { color: COLORS.textSecondary }]}>
                          {formatDate(post.updated_at)}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.privateBadge, { backgroundColor: '#9B59B6' + '20' }]}>
                      <Ionicons name="lock-closed" size={14} color="#9B59B6" />
                      <Text style={[styles.privateBadgeText, { color: '#9B59B6' }]}>خاص</Text>
                    </View>
                  </View>

                  {/* Post Content */}
                  <Text style={[styles.postContent, { color: COLORS.textSecondary }]} numberOfLines={2}>
                    {post.content}
                  </Text>

                  {/* Post Image */}
                  {post.media_url && post.type === 'image' && (
                    <ExpoImage
                      source={{ uri: post.media_url }}
                      style={styles.postImage}
                      contentFit="cover"
                    />
                  )}

                  {/* Post Stats */}
                  <View style={styles.postStats}>
                    <View style={styles.statItem}>
                      <Ionicons name="heart-outline" size={18} color={COLORS.textSecondary} />
                      <Text style={[styles.statText, { color: COLORS.textSecondary }]}>
                        {post.likes_count}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Ionicons name="chatbubble-outline" size={18} color={COLORS.textSecondary} />
                      <Text style={[styles.statText, { color: COLORS.textSecondary }]}>
                        {post.comments_count}
                      </Text>
                    </View>
                  </View>

                  {/* Post Actions */}
                  <View style={[styles.postActions, { borderTopColor: COLORS.border }]}>
                    <TouchableOpacity
                      onPress={() => handleEditPost(post.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="eye-outline" size={20} color={COLORS.accent} />
                      <Text style={[styles.actionText, { color: COLORS.accent }]}>عرض</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handlePublishPost(post.id)}
                      style={[styles.actionButton, styles.publishButton]}
                    >
                      <LinearGradient
                        colors={['#4CAF50', '#45A049']}
                        style={styles.publishGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="globe-outline" size={20} color="#FFF" />
                        <Text style={[styles.actionText, { color: '#FFF' }]}>نشر</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeletePost(post.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="trash-outline" size={20} color="#E94B3C" />
                      <Text style={[styles.actionText, { color: '#E94B3C' }]}>حذف</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        ) : (
          <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.emptyContainer}>
            <View style={[styles.emptyCard, { backgroundColor: COLORS.cardBg }]}>
              <LinearGradient
                colors={[COLORS.primary + '20', COLORS.accent + '10']}
                style={styles.emptyIconBg}
              >
                <Ionicons name="lock-closed-outline" size={64} color={COLORS.textSecondary} />
              </LinearGradient>
              <Text style={[styles.emptyTitle, { color: COLORS.text }]}>
                لا توجد منشورات خاصة
              </Text>
              <Text style={[styles.emptyText, { color: COLORS.textSecondary }]}>
                المنشورات التي تنشئها كمنشورات خاصة ستظهر هنا
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Info Card */}
        <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.infoContainer}>
          <View style={[styles.infoCard, { backgroundColor: COLORS.cardBg }]}>
            <View style={styles.infoHeader}>
              <Ionicons name="information-circle" size={24} color={COLORS.accent} />
              <Text style={[styles.infoTitle, { color: COLORS.text }]}>
                عن المنشورات الخاصة
              </Text>
            </View>
            <Text style={[styles.infoText, { color: COLORS.textSecondary }]}>
              المنشورات الخاصة هي منشورات لا يمكن لأحد رؤيتها سواك. يمكنك استخدامها
              لحفظ أفكارك ومنشوراتك قبل نشرها للعامة. عندما تكون جاهزاً، اضغط على زر
              "نشر" لتحويل المنشور إلى عام.
            </Text>
          </View>
        </Animated.View>

        <View style={{ height: 20 }} />
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: 'center',
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#9B59B6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'center',
  },
  postsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  postCard: {
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
    padding: 16,
    paddingBottom: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postTypeContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postInfo: {
    flex: 1,
    gap: 4,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right',
  },
  postDate: {
    fontSize: 13,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
  },
  privateBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  privateBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  postContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    fontSize: 15,
    fontFamily: 'Tajawal_400Regular',
    textAlign: 'right',
    lineHeight: 24,
  },
  postImage: {
    width: '100%',
    height: 180,
    marginBottom: 12,
  },
  postStats: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 16,
    paddingBottom: 12,
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
  postActions: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  publishButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  publishGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  emptyContainer: {
    paddingHorizontal: 24,
  },
  emptyCard: {
    padding: 48,
    borderRadius: 24,
    alignItems: 'center',
    gap: 16,
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
  infoContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  infoCard: {
    padding: 24,
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
  infoHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Cairo_700Bold',
  },
  infoText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'right',
    fontFamily: 'Tajawal_400Regular',
  },
});